import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración para static export (GitHub Pages)
  output: 'export',

  // Desactivar optimización de imágenes (no soportada en static export)
  images: {
    unoptimized: true,
  },

  // Base path para GitHub Pages (cambiar por nombre del repo)
  // Ejemplo: si el repo es usuario/creditscope, usar '/creditscope'
  // Descomenta la siguiente línea y ajusta según tu repo:
  // basePath: '/creditscope',

  // Trailing slash para compatibilidad con static hosting
  trailingSlash: true,
};

export default nextConfig;
