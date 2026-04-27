export const config = {
  runtime: 'edge',
};

// Daftar server target. Sistem akan mencoba dari atas ke bawah.
const instances = [
  "https://priv.au",
  "https://search.ononoki.org",
  "https://searx.tiekoetter.com",
  "https://searxng.website",
  "https://searxng.site",
  "https://search.bladerunn.in",
  "https://searx.namejeff.xyz",
  "https://searxng.canine.tools",
  "https://searx.oloke.xyz",
  "https://search.einfachzocken.eu"
];

export default async function reqHandler(req) {
  const url = new URL(req.url);
  
  // Menangkap path yang dicari (misal: /search?q=kucing)
  const path = url.pathname + url.search;

  // Coba akses server satu per satu
  for (let instance of instances) {
    try {
      const targetUrl = instance + path;
      
      // Modifikasi header agar server target tidak menolak kita
      const modifiedHeaders = new Headers(req.headers);
      modifiedHeaders.set('Host', new URL(instance).host);
      modifiedHeaders.delete('x-forwarded-host');
      modifiedHeaders.delete('x-forwarded-proto');

      const proxyReq = new Request(targetUrl, {
        method: req.method,
        headers: modifiedHeaders,
        body: req.body, // Mendukung pencarian berbasis POST
        redirect: 'manual'
      });

      const response = await fetch(proxyReq);

      // Jika server target merespon dengan baik (Status 2xx atau 3xx)
      if (response.status >= 200 && response.status < 400) {
        
        // Hapus header keamanan ketat agar web bisa ditampilkan lewat Vercel
        const resHeaders = new Headers(response.headers);
        resHeaders.delete('content-security-policy');
        resHeaders.delete('x-frame-options');

        return new Response(response.body, {
          status: response.status,
          headers: resHeaders
        });
      }
      
      // Jika statusnya 4xx atau 5xx (Error/Cloudflare block), loop akan berlanjut ke server berikutnya
      console.log(`[Pindah Target] ${instance} merespon dengan status ${response.status}`);
      
    } catch (error) {
      // Jika server mati total/timeout, loop berlanjut
      console.log(`[Pindah Target] Gagal mengakses ${instance}:`, error.message);
    }
  }

  // Jika SEMUA server di dalam daftar sedang mati (sangat jarang terjadi)
  return new Response("Maaf, semua server SearXNG cadangan sedang down. Silakan coba beberapa saat lagi.", { 
    status: 502,
    headers: { 'Content-Type': 'text/plain' }
  });
}
