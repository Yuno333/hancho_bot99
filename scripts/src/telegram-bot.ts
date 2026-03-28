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
const WELCOME_TEXT = `💰Welcome to Bighoncho AI. 👋

Hundreds of traders are already profiting from our daily signals — you're one step away.

Set up your trading account now (takes 1 minute):
https://affiliate.iqoption.net/redir/?aff=817038&aff_model=revenue&afftrack=

🤖 85% Accurate AI-powered trading signal system
✅ Complete setup guide with my personal 24/7 support
🎥 Exclusive live trading sessions.

Complete your setup in the next 15 minutes to catch today's signals.

Less than 10 slots left, hit the button below 👇🏼`;

const START_KEYBOARD: TelegramBot.InlineKeyboardMarkup = {
  inline_keyboard: [
    [
      { text: "📢 Join Channel", url: "https://t.me/HonchoAI" },
      { text: "💬 Support", url: "https://t.me/" },
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
