import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

//ElementUI 按需导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    base: '/',
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    build: {  
      rollupOptions: {
        output: {
          entryFileNames: 'js/[name]-[hash].js',
          chunkFileNames: 'js/[name]-[hash].js',
          assetFileNames(assetInfo){
            if(assetInfo.name.endsWith('.css')){
              return 'css/[name]-[hash].css'
            }
            if(['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp'].some(ext => assetInfo.name.endsWith(ext))){
              return 'img/[name]-[hash].[ext]'
            }
            return 'assets/[name]-[hash].[ext]'
          }
        },
        manualChunks(id){
          if (id.includes('src/assets/captcha/tac')) {
            return 'captcha-tac';
          }
          if(id.includes('node_modules')){
            return 'vendor'
          }
        }
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        '/cloudsync': {
          target: env.VITE_CLOUDSYNC_SERVER_PATH,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/cloudsync/, '')
        }
      }
    }
  }
})
