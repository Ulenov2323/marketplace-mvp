# REST API MVP

Base URL: `http://localhost:4000`

## Health

- `GET /health`

## Services

- `GET /api/services?status=approved&category=TikTok promotion`
- `POST /api/services`
- `GET /api/services/:id`

New services always start as `pending` and require admin moderation.

## Admin

- `GET /api/admin/queue`
- `PATCH /api/admin/services/:id/approve`
- `PATCH /api/admin/services/:id/reject`
- `DELETE /api/admin/ad-posts/:id`
- `PATCH /api/admin/banner-ads/:id/toggle`

## Ads

- `GET /api/ad-posts`
- `POST /api/ad-posts`
- `GET /api/ad-posts/banners/active`

## Orders

- `GET /api/orders`
- `POST /api/orders`

Only approved services can be ordered.

## Payments

- `POST /api/payments/placement`
- `POST /api/payments/:paymentId/verify`
- `POST /api/payments/:paymentId/refund`

Supported placement kinds: `service`, `adPost`, `banner48h`.

## Telegram

- `GET /api/telegram/support`
- `POST /api/telegram/webhook`
