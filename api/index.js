export const config = {
  runtime: 'edge',
};

// Daftar server target fallback
const instances = [
  "https://searxng.site",
  "https://search.ononoki.org",
  "https://searx.tiekoetter.com",
  "https://searxng.website",
  "https://search.bladerunn.in",
  "https://searx.namejeff.xyz",
  "https://searxng.canine.tools",
  "https://searx.oloke.xyz",
  "https://search.einfachzocken.eu"
];

// ==========================================
// KODE WIDGET TOMBOL MENGAMBANG
// ==========================================
const floatingWidgetHTML = `
<style>
  .fab-container { position: fixed; bottom: 30px; right: 30px; z-index: 999999; display: flex; flex-direction: column; align-items: flex-end; font-family: sans-serif; }
  .fab-options { display: flex; flex-direction: column; gap: 12px; margin-bottom: 15px; opacity: 0; visibility: hidden; transform: translateY(20px); transition: all 0.3s ease; }
  .fab-options.show { opacity: 1; visibility: visible; transform: translateY(0); }
  .fab-btn { width: 50px; height: 50px; border-radius: 50%; display: flex; justify-content: center; align-items: center; text-decoration: none; color: white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); transition: transform 0.2s; font-size: 20px; font-weight: bold; }
  .fab-btn:hover { transform: scale(1.1); color: white; text-decoration: none; }
  .fab-main { background-color: #2b2b2b; cursor: pointer; width: 60px; height: 60px; font-size: 28px; }
  .fab-tg { background-color: #2CA5E0; } /* Warna Telegram */
  .fab-dc { background-color: #5865F2; } /* Warna Discord */
</style>

<div class="fab-container">
  <div class="fab-options" id="fabOptions">
    <a href="https://t.me/noxm007" target="_blank" class="fab-btn fab-tg" title="Chat via Telegram">TG</a>
    
    <a href="https://discord.com/users/MASUKKAN_ID_DISCORD_ANDA" target="_blank" class="fab-btn fab-dc" title="Chat via Discord">DC</a>
  </div>
  
  <div class="fab-btn fab-main" onclick="document.getElementById('fabOptions').classList.toggle('show')">
    💬
  </div>
</div>
`;

// ==========================================
// LOGIKA PROXY & INJEKSI
// ==========================================
export default async function reqHandler(req) {
  const url = new URL(req.url);
  const path = url.pathname + url.search;

  for (let instance of instances) {
    try {
      const targetUrl = instance + path;
      const modifiedHeaders = new Headers(req.headers);
      modifiedHeaders.set('Host', new URL(instance).host);
      modifiedHeaders.delete('x-forwarded-host');
      modifiedHeaders.delete('x-forwarded-proto');

      const proxyReq = new Request(targetUrl, {
        method: req.method,
        headers: modifiedHeaders,
        body: req.body,
        redirect: 'manual'
      });

      const response = await fetch(proxyReq);

      if (response.status >= 200 && response.status < 400) {
        const resHeaders = new Headers(response.headers);
        resHeaders.delete('content-security-policy');
        resHeaders.delete('x-frame-options');

        // CEK APAKAH INI HALAMAN HTML
        const contentType = resHeaders.get('content-type') || '';
        
        if (contentType.includes('text/html')) {
          // Buka paket HTML-nya
          let htmlBody = await response.text();
          
          // Suntikkan widget tepat sebelum tag </body> penutup
          if (htmlBody.includes('</body>')) {
            htmlBody = htmlBody.replace('</body>', floatingWidgetHTML + '\n</body>');
          } else {
            // Fallback jika tag body tidak rapi
            htmlBody += floatingWidgetHTML;
          }

          return new Response(htmlBody, {
            status: response.status,
            headers: resHeaders
          });
        }

        // Jika bukan HTML (gambar, CSS, JSON), kembalikan apa adanya tanpa disuntik
        return new Response(response.body, {
          status: response.status,
          headers: resHeaders
        });
      }
    } catch (error) {
      console.log(`[Target Error] ${instance}:`, error.message);
    }
  }

  return new Response("Maaf, semua server cadangan sedang down.", { 
    status: 502,
    headers: { 'Content-Type': 'text/plain' }
  });
}
