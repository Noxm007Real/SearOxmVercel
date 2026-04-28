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
// KODE WIDGET TOMBOL MENGAMBANG PRO
// (Menggunakan SVG Resmi Telegram & Discord)
// ==========================================
const floatingWidgetHTML = `
<style>
  .fab-container { position: fixed; bottom: 30px; right: 30px; z-index: 999999; display: flex; flex-direction: column; align-items: flex-end; font-family: sans-serif; }
  .fab-options { display: flex; flex-direction: column; gap: 12px; margin-bottom: 15px; opacity: 0; visibility: hidden; transform: translateY(20px); transition: all 0.3s ease; }
  .fab-options.show { opacity: 1; visibility: visible; transform: translateY(0); }
  
  .fab-btn { width: 50px; height: 50px; border-radius: 50%; display: flex; justify-content: center; align-items: center; text-decoration: none; color: white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); transition: transform 0.2s; padding: 0; border: none; }
  .fab-btn:hover { transform: scale(1.1); color: white; text-decoration: none; }
  
  /* Ukuran ikon di dalam tombol */
  .fab-btn svg { width: 28px; height: 28px; fill: white; }
  
  .fab-main { background-color: #2b2b2b; cursor: pointer; width: 60px; height: 60px; font-size: 28px; }
  .fab-tg { background-color: #2CA5E0; } /* Warna Telegram */
  .fab-dc { background-color: #5865F2; } /* Warna Discord */
</style>

<div class="fab-container">
  <div class="fab-options" id="fabOptions">
    <a href="https://t.me/noxm007" target="_blank" class="fab-btn fab-tg" title="Chat via Telegram">
      <svg viewBox="0 0 24 24">
        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3.224 17.025l-2.025 2.025c-.27.27-.72.27-.99 0l-2.025-2.025c-.27-.27-.27-.72 0-.99l2.025-2.025c.27-.27.72-.27.99 0l2.025 2.025c.27.27.27.72 0 .99zm2.496-6.195l-7.2 7.2c-.27.27-.72.27-.99 0l-3.6-3.6c-.27-.27-.27-.72 0-.99l7.2-7.2c.27-.27.72-.27.99 0l3.6 3.6c.27.27.27.72 0 .99z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.26.26-.53.26l.182-2.812 5.12-4.625c.223-.19.048-.297-.247-.1l-6.328 3.987-2.722-.85c-.593-.185-.605-.593.125-.877l10.625-4.1c.49-.18.94.128.715.82z" fill="white"/>
      </svg>
    </a>
    
    <a href="https://discord.gg/yW68XX3JC" target="_blank" class="fab-btn fab-dc" title="Chat via Discord">
      <svg viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.006 14.006 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.372.292a.077.077 0 0 1-.006.128 12.51 12.51 0 0 1-1.873.892.076.076 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.955 2.419-2.156 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.946 2.419-2.156 2.419z"/>
      </svg>
    </a>
  </div>
  
  <div class="fab-btn fab-main" onclick="document.getElementById('fabOptions').classList.toggle('show')">
    💬
  </div>
</div>
`;

// ==========================================
// LOGIKA PROXY & INJEKSI (TETAP SAMA)
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

        const contentType = resHeaders.get('content-type') || '';
        
        if (contentType.includes('text/html')) {
          let htmlBody = await response.text();
          
          if (htmlBody.includes('</body>')) {
            htmlBody = htmlBody.replace('</body>', floatingWidgetHTML + '\n</body>');
          } else {
            htmlBody += floatingWidgetHTML;
          }

          return new Response(htmlBody, {
            status: response.status,
            headers: resHeaders
          });
        }

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
