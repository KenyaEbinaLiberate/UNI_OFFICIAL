// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  vite: {
    assetsInclude: ["**/*.mp3", "**/*.svg", "**/*.jpg", "**/*.png"],
    build: {
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            const type = assetInfo.name.split(".").pop();
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(type)) {
              return `images/[name][extname]`;
            }
            if (/mp3|wav|ogg/i.test(type)) {
              return `audio/[name][extname]`;
            }
            return `assets/[name][extname]`;
          },
        },
      },
    },
  },
  build: {
    assets: "assets",
  },
});
