# Architecture Notes

## Core Modules

- `services` - user-created marketplace listings with mandatory moderation.
- `ads` - paid social feed posts and homepage banner inventory.
- `payments` - provider abstraction with `pay`, `refund`, and `verify`.
- `telegram` - support redirect, order notifications, and future order confirmation hooks.
- `admin` - moderation and operational controls.

## Payment Direction

The MVP provider is `ru-card-demo`, shaped for Russian bank card payment flows. Future providers should implement the same `PaymentProvider` contract:

```js
pay(payload)
refund(payload)
verify(payload)
```

Escrow is intentionally not implemented. The schema and order statuses leave room for a future escrow ledger, hold/release events, buyer dispute flow, and seller payout schedule.

## Extension Roadmap

- Replace in-memory store with PostgreSQL repositories.
- Add authentication and role-based access control.
- Add real Telegram Bot API calls and webhook validation.
- Add subscriptions, advanced search, messaging, and escrow.
- Add admin audit log before exposing admin routes publicly.
