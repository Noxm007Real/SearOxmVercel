export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // Ambil data dari Environment Variables Vercel
  const TG_TOKEN = process.env.TG_TOKEN;
  const TG_CHAT_ID = process.env.TG_CHAT_ID;
  const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

  // ==========================================
  // GENERATE TIMESTAMP (ZONA WAKTU WIB)
  // ==========================================
  const now = new Date();
  
  const tanggal = now.toLocaleString('id-ID', { 
    timeZone: 'Asia/Jakarta', 
    day: 'numeric', 
    month: 'numeric', 
    year: 'numeric' 
  });
  
  const waktu = now.toLocaleString('id-ID', { 
    timeZone: 'Asia/Jakarta', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    hour12: false 
  }).replace(/:/g, '.');

  const timestamp = `[${tanggal}-${waktu}]`;

  // ==========================================
  // KONFIGURASI PESAN & GAMBAR
  // ==========================================
  
  // Pastikan Anda sudah mengganti tautan ini dengan tautan gambar logo yang baru
  const imageUrl = "https://raw.githubusercontent.com/Noxm007Real/SearOxmVercel/master/Music/logo.jpg";
  
  // Pesan khusus untuk Telegram (Formal & Elegan)
  // Perhatikan penggunaan garis miring terbalik (\) untuk mengamankan backtick Markdown
  const pesanTelegram = `🌐 *Status Operasional SearOxm*\n\nSistem penelusuran privat Anda saat ini beroperasi dengan rute yang optimal dan stabil. Kami mengundang Anda untuk menikmati pengalaman berselancar tanpa jejak, diiringi oleh harmoni musik yang telah disiapkan secara khusus.\n\nAkses layanan secara penuh melalui tautan berikut:\n[🔗SearOxm](https://searoxm.vercel.app)\n\n\`\`\`🕒${timestamp}\`\`\``;
  
  // Pesan khusus untuk Discord (Formal & Elegan)
  const pesanDiscord = `#🌐 Status Operasional SearOxm\n\n\`\`\`md\nSistem penelusuran privat Anda saat ini beroperasi dengan rute yang optimal dan stabil. Kami mengundang Anda untuk menikmati pengalaman berselancar tanpa jejak, diiringi oleh harmoni musik yang telah disiapkan secara khusus.\n\nAkses layanan secara penuh melalui tautan berikut:\`\`\`\n[🔗SearOxm](https://searoxm.vercel.app)\n\n~#🕒${timestamp}`;
  
  let laporanTelegram = "Dilewati (Token/ID tidak ada)";
  let laporanDiscord = "Dilewati (Webhook tidak ada)";

  try {
    // ==========================================
    // 1. KIRIM KE TELEGRAM (sendPhoto)
    // ==========================================
    if (TG_TOKEN && TG_CHAT_ID) {
      const tgUrl = `https://api.telegram.org/bot${TG_TOKEN}/sendPhoto`;
      
      const payloadTelegram = {
        chat_id: TG_CHAT_ID,
        photo: imageUrl,
        caption: pesanTelegram,
        parse_mode: 'Markdown'
      };

      const tgResponse = await fetch(tgUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadTelegram)
      });
      
      const tgResult = await tgResponse.json();
      
      if (!tgResult.ok) {
        laporanTelegram = `❌ Gagal: ${tgResult.description}`;
      } else {
        laporanTelegram = "✅ Gambar & Pesan Berhasil terkirim";
      }
    }

    // ==========================================
    // 2. KIRIM KE DISCORD (Embeds)
    // ==========================================
    if (DISCORD_WEBHOOK) {
      const payloadDiscord = {
        content: pesanDiscord,
        embeds: [
          {
            image: {
              url: imageUrl
            }
          }
        ]
      };

      const dcResponse = await fetch(DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadDiscord)
      });
      
      if (!dcResponse.ok) {
        laporanDiscord = `❌ Gagal: Kode Status ${dcResponse.status}`;
      } else {
        laporanDiscord = "✅ Gambar & Pesan Berhasil terkirim";
      }
    }

    const hasilAkhir = `Laporan Pinger SearOxm:\n------------------------\nTelegram : ${laporanTelegram}\nDiscord  : ${laporanDiscord}\nWaktu Server: ${timestamp}`;
    
    return new Response(hasilAkhir, { 
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });

  } catch (error) {
    return new Response("Sistem pinger mengalami kerusakan fatal: " + error.message, { status: 500 });
  }
}
