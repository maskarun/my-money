# My Money

A personal finance management web app built with pure HTML, CSS, and JavaScript — no frameworks, no backend, no dependencies.

## Features

- **Transaction Tracking** — Log income and expenses across 13 categories with configurable currencies (USD, INR, GBP)
- **Savings Portfolio** — Track bank accounts, fixed deposits, and cash with interest rates
- **Loan Management** — EMI-based loans with full amortization schedules and outstanding balance tracking
- **Gold Loans** — Daily interest accrual calculations
- **Currency Settings** — Enable or disable USD, INR, GBP, and add custom three-letter currency codes; enabled currencies appear in Dashboard and Portfolio summaries and Activity filters; disabling a currency hides its records from the app without deleting them, and settings are included in backups
- **Data Import/Export** — Backup and restore your data as JSON
- **Offline-first** — All data stored in browser localStorage, works without internet

## Usage

Open `portfolio.html` directly in any modern browser. No installation or server required.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | HTML5, CSS3, Vanilla JavaScript |
| Storage | Browser localStorage |
| Architecture | Single-page application (SPA) |
| Dependencies | None |

## Data

All data is stored locally in your browser's `localStorage`. Use the Export button to back up your data and Import to restore it.

## Project Structure

```
my-money/
└── portfolio.html  # Complete self-contained application
```
