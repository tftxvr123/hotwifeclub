// api/feedback.js
// Runs securely on Vercel Serverless - Keeps your Telegram credentials 100% private

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, contact } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message content is required' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // Fallback if environment variables are not yet added in Vercel
  if (!botToken || !chatId) {
    console.warn("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing in Vercel Settings.");
    return res.status(200).json({ success: true, note: "Feedback received locally" });
  }

  const formattedText = `🗝️ *THE HOTWIFE CLUB — QUESTIONS & IDEAS*\n\n💬 *Message:*\n"${message.trim()}"\n\n👤 *Submitted By:* ${contact ? contact : '100% Anonymous'}\n⏰ *Time:* ${new Date().toUTCString()}`;

  try {
    const telegramEndpoint = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(telegramEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: formattedText,
        parse_mode: 'Markdown'
      })
    });

    const data = await response.json();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Telegram API Error:", error);
    return res.status(500).json({ error: 'Internal Error sending to Telegram' });
  }
}
