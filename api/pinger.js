export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // Ambil data dari Environment Variables Vercel (Demi Keamanan)
  const TG_TOKEN = process.env.TG_TOKEN;
  const TG_CHAT_ID = process.env.TG_CHAT_ID;
  const TG_THREAD_ID = process.env.TG_THREAD_ID; // ID Topik/Thread (Optional)
  const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

  const pesan = "🤖 **SearOxm Heartbeat:** Sistem berjalan optimal dan siap menemani penelusuran Anda!✅\nHappy Browsing & Safe Browsing!!\nsearoxm.vercel.app";

  try {
    // 1. Kirim ke Telegram
    const tgUrl = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage`;
    await fetch(tgUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID,
        message_thread_id: TG_THREAD_ID, // Masukkan ID Topik jika grup Anda forum
        text: pesan,
        parse_mode: 'Markdown'
      })
    });

    // 2. Kirim ke Discord
    if (DISCORD_WEBHOOK) {
      await fetch(DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: pesan })
      });
    }

    return new Response("Ping Berhasil Terkirim!", { status: 200 });
  } catch (error) {
    return new Response("Gagal kirim ping: " + error.message, { status: 500 });
  }
}
