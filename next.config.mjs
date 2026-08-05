/** @type {import('next').NextConfig} */
const nextConfig = {
  // Situs ini sepenuhnya client-side (localStorage, tanpa API route),
  // jadi diekspor sebagai HTML/CSS/JS statis ke folder out/.
  // Cocok untuk Cloudflare Workers/Pages maupun hosting biasa.
  output: "export",
  // Static export tidak menjalankan server optimasi gambar Next.
  images: { unoptimized: true },
  // Setiap halaman jadi folder sendiri (out/index.html), aman untuk
  // hosting statis yang tidak melakukan rewrite.
  trailingSlash: true,
};
export default nextConfig;
