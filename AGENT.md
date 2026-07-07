# Agent Change Log

This file tracks changes made by AI agents (Claude Code) to this repository.

## Session: 2026-06-03

### Branch: `claude/focused-ride-BqBVs`

### Changes Made

#### 1. Added `README.md`
- Created project README documenting what the app does, its tech stack, usage instructions, and project structure
- Covers features: transaction tracking, savings portfolio, loan management, gold loans, data import/export

#### 2. Added `AGENT.md` (this file)
- Created agent change log to track AI-assisted modifications to the codebase

### Project State at Time of Changes

- Single-file SPA: `portfolio.html`
- Pure HTML/CSS/Vanilla JS, no external dependencies
- localStorage for data persistence
- Multi-currency support (USD, INR)
- Features: transactions, savings, loans (EMI + amortization), gold loans, import/export

### Notes

- No functional code was modified in this session
- Changes are documentation-only

---

## Session: 2026-06-03 (UI Fix)

### Branch: `claude/focused-ride-BqBVs`

### Changes Made

#### 3. Reduced button sizes in `cashflow.html`

**Problem:** Buttons were too large across the app, especially on desktop.

**CSS changes in `cashflow.html`:**

| Selector | Property | Before | After |
|----------|----------|--------|-------|
| `.btn` | `min-height` | 44px | 36px |
| `.btn` | `font-size` | 15px | 13px |
| `.btn` | `padding` | 0 16px | 0 14px |
| `.btn-sm` | `min-height` | 34px | 28px |
| `.btn-sm` | `font-size` | 13px | 12px |
| `.btn-sm` | `padding` | 0 12px | 0 10px |
| `.toggle-pill button` | `height` | 36px | 30px |
| `.toggle-pill button` | `font-size` | 14px | 13px |
| `.add-row-btn` | `min-height` | 40px | 34px |

**Buttons affected:**
- Submit / Cancel buttons in all add/edit forms (savings, loans, gold loans, transactions)
- Edit / Delete buttons on portfolio items (`.btn-sm`)
- Expense / Income toggle pill
- "Add Saving", "Add Loan", "Add Gold Loan" dashed row buttons
