export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
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

  // Format sesuai keinginan Anda: [DD/MM/YYYY-HH.MM.SS]
  const timestamp = `[${tanggal}-${waktu}]`;

  // ==========================================
  // KONFIGURASI PESAN & GAMBAR
  // ==========================================
  const imageUrl = "https://raw.githubusercontent.com/Noxm007Real/SearOxmVercel/master/Music/logo.jpg";
  
  // Menggunakan pesan yang sudah Anda edit sebelumnya
  const pesanTelegram = `🌐*Status Operasional SearOxm*\n\nSistem penelusuran privat Anda saat ini beroperasi dengan rute yang optimal dan stabil. Kami mengundang Anda untuk menikmati pengalaman berselancar tanpa jejak, diiringi oleh harmoni musik yang telah disiapkan secara khusus.\n\nAkses layanan secara penuh melalui tautan berikut:\n[🔗SearOxm](https://searoxm.vercel.app)\n\n\`\`\`🕒${timestamp}\`\`\``;
  
  const pesanDiscord = `# 🌐Status Operasional SearOxm\n\`\`\`md\nSistem penelusuran privat Anda saat ini beroperasi dengan rute yang optimal dan stabil. Kami mengundang Anda untuk menikmati pengalaman berselancar tanpa jejak, diiringi oleh harmoni musik yang telah disiapkan secara khusus.\nAkses layanan secara penuh melalui tautan berikut:\`\`\`[🔗SearOxm](https://searoxm.vercel.app)\n\n\`\`\`md\n🕒${timestamp}\`\`\``;

  let laporanTelegram = "Dilewati (Token/ID tidak ada)";
  let laporanDiscord = "Dilewati (Webhook tidak ada)";

  try {
    // ==========================================
    // 1. KIRIM KE TELEGRAM (Teks di Atas + Tombol Inline)
    // ==========================================
    if (TG_TOKEN && TG_CHAT_ID) {
      const tgUrl = `https://api.telegram.org/bot${TG_TOKEN}/sendPhoto`;
      
      const payloadTelegram = {
        chat_id: TG_CHAT_ID,
        photo: imageUrl,
        caption: pesanTelegram,
        parse_mode: 'Markdown',
        show_caption_above_media: true,
        reply_markup: {
          inline_keyboard: [
            // Baris 1: Instagram, TikTok, Instagram
            [
              { text: "ɪɴsᴛᴀɢʀᴀᴍ", url: "http://instagram.com/nelson.oxm007", icon_custom_emoji_id: "5215685959298853284" },
              { text: "ᴛɪᴋᴛᴏᴋ", url: "http://tiktok.com/im_not_npc", icon_custom_emoji_id: "5212961902061169442" },
              { text: "ɪɴsᴛᴀɢʀᴀᴍ", url: "http://instagram.com/noxm007real", icon_custom_emoji_id: "5215685959298853284" }
            ],
            // Baris 2: WhatsApp, Discord
            [
              { text: "ᴡʜᴀᴛsᴀᴘᴘ", url: "https://whatsapp.com/channel/0029VbCUCiP3gvWRDl8edm1i", icon_custom_emoji_id: "6001289379576813897" },
              { text: "ᴅɪsᴄᴏʀᴅ", url: "https://discord.gg/yW68XX3JC", icon_custom_emoji_id: "5212920584475782268" }
            ],
            // Baris 3: Curhat, SearOxm, NGL Pro
            [
              { text: "ᴄᴜʀʜᴀᴛ", url: "http://curhat-online.vercel.app/", icon_custom_emoji_id: "5974475701179387553" },
              { text: "sᴇᴀʀᴏxᴍ", url: "http://searoxm.vercel.app/", icon_custom_emoji_id: "5339112148175959615" },
              { text: "ɴɢʟ ᴘʀᴏ", url: "http://ngl-pro.vercel.app/", icon_custom_emoji_id: "5197288647275071607" }
            ],
            // Baris 4: Downloader Bot, Owner
            [
              { text: "ᴅᴏᴡɴʟᴏᴀᴅᴇʀ ʙᴏᴛ", url: "https://t.me/gojo_md_bot", icon_custom_emoji_id: "5972282179776940830" },
              { text: "ᴏᴡɴᴇʀ", url: "https://t.me/noxm007real", icon_custom_emoji_id: "5764810301325184411" }
            ]
          ]
        }
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
        laporanTelegram = "✅ Gambar, Pesan & Tombol Berhasil terkirim";
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
