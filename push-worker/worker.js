// My Money push worker — free Cloudflare Worker that sends daily bill-reminder
// Web Pushes. Stores per-device: push subscription + bill schedule (names +
// due days only) + timezone offset. Pushes are payload-free; the app's
// service worker fetches /messages to get the text.

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};
const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...CORS } });

const b64url = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const b64urlDecode = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));

async function endpointHash(endpoint) {
  return b64url(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(endpoint)));
}

// ---- VAPID (ES256 JWT, no payload encryption needed for empty pushes) ----
async function getVapidKeys(env) {
  let stored = await env.SUBS.get('vapid', 'json');
  if (stored) return stored;
  const pair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
  const pubRaw = await crypto.subtle.exportKey('raw', pair.publicKey);
  const privJwk = await crypto.subtle.exportKey('jwk', pair.privateKey);
  stored = { publicKey: b64url(pubRaw), privateJwk: privJwk };
  await env.SUBS.put('vapid', JSON.stringify(stored));
  return stored;
}

async function vapidHeaders(env, endpoint) {
  const keys = await getVapidKeys(env);
  const aud = new URL(endpoint).origin;
  const header = b64url(new TextEncoder().encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const payload = b64url(new TextEncoder().encode(JSON.stringify({
    aud, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: 'mailto:admin@example.com'
  })));
  const key = await crypto.subtle.importKey('jwk', keys.privateJwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, new TextEncoder().encode(`${header}.${payload}`));
  return { Authorization: `vapid t=${header}.${payload}.${b64url(sig)}, k=${keys.publicKey}`, TTL: '86400' };
}

// ---- due computation (mirrors the app: overdue or due within 3 days) ----
function localToday(tzOffsetMinutes) {
  const d = new Date(Date.now() - (tzOffsetMinutes || 0) * 60000);
  return { date: d.toISOString().slice(0, 10), day: d.getUTCDate(), hour: d.getUTCHours() };
}
function dueMessages(schedule, tzOffsetMinutes) {
  const { day: today } = localToday(tzOffsetMinutes);
  const out = [];
  for (const b of schedule || []) {
    if (!b || !b.day || !b.name) continue;
    if (b.day < today) out.push(`⏰ ${b.name} is overdue (was due on ${b.day})`);
    else if (b.day <= today + 3) out.push(`📅 ${b.name} due on ${b.day}`);
  }
  return out;
}

export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
    const url = new URL(req.url);

    if (url.pathname === '/vapid') {
      const keys = await getVapidKeys(env);
      return json({ publicKey: keys.publicKey });
    }
    if (url.pathname === '/subscribe' && req.method === 'POST') {
      const body = await req.json();
      if (!body.subscription?.endpoint) return json({ error: 'missing subscription' }, 400);
      const key = 'sub:' + await endpointHash(body.subscription.endpoint);
      await env.SUBS.put(key, JSON.stringify({
        subscription: body.subscription,
        schedule: body.schedule || [],
        tzOffsetMinutes: body.tzOffsetMinutes || 0,
        lastSent: ''
      }));
      return json({ ok: true, key: key.slice(4) });
    }
    if (url.pathname === '/schedule' && req.method === 'POST') {
      const body = await req.json();
      if (!body.endpoint) return json({ error: 'missing endpoint' }, 400);
      const key = 'sub:' + await endpointHash(body.endpoint);
      const rec = await env.SUBS.get(key, 'json');
      if (!rec) return json({ error: 'not subscribed' }, 404);
      rec.schedule = body.schedule || [];
      if (body.tzOffsetMinutes !== undefined) rec.tzOffsetMinutes = body.tzOffsetMinutes;
      await env.SUBS.put(key, JSON.stringify(rec));
      return json({ ok: true });
    }
    if (url.pathname === '/unsubscribe' && req.method === 'POST') {
      const body = await req.json();
      if (body.endpoint) await env.SUBS.delete('sub:' + await endpointHash(body.endpoint));
      return json({ ok: true });
    }
    if (url.pathname === '/messages') {
      const e = url.searchParams.get('e');
      if (!e) return json({ messages: [] });
      const rec = await env.SUBS.get('sub:' + e, 'json');
      if (!rec) return json({ messages: [] });
      return json({ messages: dueMessages(rec.schedule, rec.tzOffsetMinutes) });
    }
    return json({ error: 'not found' }, 404);
  },

  async scheduled(_event, env, ctx) {
    ctx.waitUntil((async () => {
      let cursor;
      do {
        const list = await env.SUBS.list({ prefix: 'sub:', cursor });
        cursor = list.list_complete ? undefined : list.cursor;
        for (const { name } of list.keys) {
          const rec = await env.SUBS.get(name, 'json');
          if (!rec?.subscription?.endpoint) continue;
          const { date, hour } = localToday(rec.tzOffsetMinutes);
          if (hour !== 8) continue;              // 8am subscriber-local
          if (rec.lastSent === date) continue;   // once per day
          if (!dueMessages(rec.schedule, rec.tzOffsetMinutes).length) continue;
          try {
            const headers = await vapidHeaders(env, rec.subscription.endpoint);
            const resp = await fetch(rec.subscription.endpoint, { method: 'POST', headers });
            if (resp.status === 404 || resp.status === 410) { await env.SUBS.delete(name); continue; }
            rec.lastSent = date;
            await env.SUBS.put(name, JSON.stringify(rec));
          } catch (e) { /* transient; retry next hour */ }
        }
      } while (cursor);
    })());
  }
};
