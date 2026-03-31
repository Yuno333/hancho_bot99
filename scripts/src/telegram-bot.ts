import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ── Environment ──────────────────────────────────────────────────────────────
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) throw new Error("TELEGRAM_BOT_TOKEN is required in .env");

// ── Bot ──────────────────────────────────────────────────────────────────────
const bot = new TelegramBot(token, { polling: true });

// ── Paths ────────────────────────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VIDEO_PATH = path.resolve(__dirname, "../assets/welcome.mp4");

// ── Content ──────────────────────────────────────────────────────────────────
const WELCOME_TEXT = `💰 Welcome to Hancho AI Signals 💰

Traders inside are already profiting daily.
 Now it’s your turn.

🔸 85% AI-powered signals
🔸 15-min quick setup
🔸 24/7 support + live sessions

⏳ Next signal drops soon… don’t miss it.

⚠️ Less than 10 spots left — tap below to join now.`;

const START_KEYBOARD: TelegramBot.InlineKeyboardMarkup = {
  inline_keyboard: [
    [
      { text: "Join Channel", url: "https://t.me/HonchoAI" },
      { text: "Support", url: "https://t.me/thebighoncho" },
    ],
  ],
};

// ── Handlers ─────────────────────────────────────────────────────────────────
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    if (fs.existsSync(VIDEO_PATH)) {
      await bot.sendVideo(chatId, fs.createReadStream(VIDEO_PATH), {
        caption: WELCOME_TEXT,
        reply_markup: START_KEYBOARD,
      });
    } else {
      throw new Error("Video file not found");
    }
  } catch (err) {
    console.error("Error sending video, falling back to text:", err);
    await bot.sendMessage(chatId, WELCOME_TEXT, {
      reply_markup: START_KEYBOARD,
      disable_web_page_preview: true,
    });
  }
});

bot.on("polling_error", (error) => {
  console.error("Polling error:", error.message);
});

// ── Graceful shutdown ────────────────────────────────────────────────────────
process.once("SIGINT", () => { bot.stopPolling(); process.exit(0); });
process.once("SIGTERM", () => { bot.stopPolling(); process.exit(0); });

console.log("🤖 Telegram bot is running...");
