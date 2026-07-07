# My Money — Push Notification Worker

A free Cloudflare Worker that sends daily bill-reminder push notifications
to your phone even when the app is closed. It stores only your push
subscription, bill names + due days, and timezone offset — no amounts or
balances.

## Deploy (one time, ~5 minutes)

1. Create a free Cloudflare account at https://dash.cloudflare.com
2. In this folder run:
   ```sh
   npx wrangler login
   npx wrangler kv namespace create SUBS
   ```
   Copy the printed `id` into `wrangler.toml` (replace `REPLACE_WITH_YOUR_KV_NAMESPACE_ID`).
3. Deploy:
   ```sh
   npx wrangler deploy
   ```
4. Copy the printed URL (like `https://my-money-push.<you>.workers.dev`) into
   **My Money → Settings → Push Notifications → Worker URL** and tap Enable.

## How it works

- The app subscribes to Web Push and uploads its bill schedule.
- The worker's hourly cron finds subscribers whose local time is 8am with
  bills due within 3 days (or overdue) and sends a payload-free push.
- The app's service worker wakes, fetches the reminder text from
  `/messages`, and shows system notifications.
- Marking a bill paid in the app re-syncs the schedule automatically.

iPhone requires the app to be installed to the Home Screen (iOS 16.4+).
