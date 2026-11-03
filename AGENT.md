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
- Multi-currency support (USD, INR, GBP)
- Features: transactions, savings, loans (EMI + amortization), gold loans, import/export

### Notes

- No functional code was modified in this session
- Changes are documentation-only

## Session: 2026-10-23 (GBP Currency and Amount Formatting)

### Changes Made

- Added GBP to the supported currencies and UK locale formatting in `index.html` and `portfolio.html`.
- Set displayed monetary amounts to whole currency units (`maximumFractionDigits: 0`).
- Updated the README feature list to include GBP.
- Updated the project state above to list all three supported currencies.

## Session: 2026-10-23 (Transaction Link Consistency)

### Changes Made

- Deleting a savings activity transaction now removes its linked payment and reverses its balance change.
- Linked activity transactions can no longer be edited independently of their portfolio or recurring records; delete and re-record them from the source section when a correction is needed.
- Added transaction ID links to new savings payment records and retained a cautious unique-match fallback for older records.
- Source edits now sync linked activity names, categories, and currencies for savings, loan payments, recurring items, and card bills.
- Updated Spending Breakdown to count linked recurring and credit-card payments only once.

## Session: 2026-10-23 (Insights Cleanup)

### Changes Made

- Removed the What-If Simulator section and its unused calculation UI and handlers from both app files.

## Session: 2026-10-23 (Activity Tab)

### Changes Made

- Moved All Activity out of the Dashboard and into its own Activity tab.
- Kept month navigation, currency/category filters, transaction actions, and the add-entry button available from the Activity tab.

## Session: 2026-10-24 (Currency Fraction Display)

### Changes Made

- Restored two decimal places for displayed currency amounts, hid trailing `.00`, and styled nonzero decimal separators and fractional digits smaller than the whole amount.
- Kept plain-text currency formatting for AI prompts and text-only previews.

## Session: 2026-10-24 (Net Worth by Currency)

### Changes Made

- Reworked Net Worth into one card with a separate visible assets, debt, and net-worth row for each tracked currency.
- Included investment-only currencies and both sides of transfers in the currency list.
- Always list all supported currencies, including GBP, even when that currency has no current balance records.

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


## Session: 2026-10-24 (Configurable Currencies)

### Changes Made

- Added currency toggles in Settings for USD, INR, and GBP, with at least one currency required.
- Applied the enabled currencies to new-entry selectors, budgets, market views, and the dashboard currency summary.
- Preserved historical records when a currency is disabled; those records are hidden in app views while disabled and return when the currency is re-enabled.
- Persisted the currency selection in local storage and included it in backups and sync data.
- Updated README feature notes.


## Session: 2026-10-25 (Custom Currencies)

### Changes Made

- Added a Settings field to add custom three-letter currency codes, alongside toggles to enable or disable currencies.
- Made custom currencies available in app currency selectors, summaries, and markets.
- Persisted custom currency definitions locally and included them in backup and sync data.
- Updated README usage notes.


## Session: 2026-10-25 (Currency Visibility Across Tabs)

### Changes Made

- Included every enabled currency in the Dashboard currency cards and Portfolio summary, including currencies with no records yet.
- Added enabled currencies to the Activity currency filter even when there are no entries for them in the selected month.
- Hid disabled currencies and their records from Dashboard, Activity, Portfolio, Recurring, Insights, and related currency summaries while preserving the underlying data.
