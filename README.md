# My Money

A personal finance management web app built with pure HTML, CSS, and JavaScript — no frameworks, no backend, no dependencies.

## Features

- **Transaction Tracking** — Log income and expenses across 13 categories with multi-currency support (USD, INR)
- **Savings Portfolio** — Track bank accounts, fixed deposits, and cash with interest rates
- **Loan Management** — EMI-based loans with full amortization schedules and outstanding balance tracking
- **Gold Loans** — Daily interest accrual calculations
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
