export const env = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL ?? "",
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN ?? "",
  telegramSupportUrl: process.env.TELEGRAM_SUPPORT_URL ?? "https://t.me/support",
  paymentProvider: process.env.PAYMENT_PROVIDER ?? "ru-card-demo"
};
