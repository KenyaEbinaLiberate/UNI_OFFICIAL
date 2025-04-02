// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  integrations: [react()],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    domains: ['uni-liberate.group'],
  },
  vite: {
    assetsInclude: ['**/*.mp3', '**/*.svg', '**/*.jpg', '**/*.png'],
    optimizeDeps: {
      include: [
        'three',
        'three/examples/jsm/postprocessing/EffectComposer.js',
        'three/examples/jsm/postprocessing/RenderPass.js',
        'three/examples/jsm/postprocessing/ShaderPass.js',
        'three/examples/jsm/postprocessing/GlitchPass.js',
      ],
    },
    build: {
      assetsInlineLimit: 0,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
        },
        format: {
          comments: false,
        },
      },
      cssCodeSplit: true,
      sourcemap: false,
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
          assetFileNames: assetInfo => {
            if (!assetInfo.name) return 'assets/[name][extname]';
            const type = assetInfo.name.split('.').pop();
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(type ?? '')) {
              return `images/[name][extname]`;
            }
            if (/mp3|wav|ogg/i.test(type ?? '')) {
              return `audio/[name][extname]`;
            }
            return `assets/[name][extname]`;
          },
          chunkFileNames: 'js/[name].[hash].js',
          entryFileNames: 'js/[name].[hash].js',
        },
      },
    },
  },
  build: {
    assets: 'assets',
    inlineStylesheets: 'auto',
  },
});
