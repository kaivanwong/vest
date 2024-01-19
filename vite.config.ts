import { cwd } from 'node:process'
import { resolve } from 'node:path'
import { type ConfigEnv, defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import Layouts from 'vite-plugin-vue-layouts'
import Pages from 'vite-plugin-pages'

// Vite config.
// https://vitejs.dev/config/
export default (options: ConfigEnv) => {
  const { mode } = options

  const env = loadEnv(mode, cwd(), ['VITE_', 'APP_', 'AXIOS_'])

  return defineConfig({
    base: env.VITE_BASE,
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    plugins: [
      // Vue & Jsx plugin.
      // https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue
      // https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx
      vue(),
      vueJsx(),

      // Vue layouts & pages plugin.
      Layouts(),
      Pages(),

      // UnoCSS plugin, you can see uno.config.ts.
      UnoCSS(),

      // Vue dev tools.
      // https://github.com/webfansplz/vite-plugin-vue-devtools
      VueDevTools(),

      // Auto import api.
      // https://github.com/unplugin/unplugin-auto-import
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'vue-i18n',
          '@vueuse/core',
        ],
        dts: 'types/auto-imports.d.ts',
        dirs: [
          'src/composables',
          'src/stores',
        ],
        vueTemplate: true,
      }),

      // Auto registry components.
      // https://github.com/antfu/unplugin-vue-components
      Components({
        extensions: ['vue'],
        include: [/\.vue$/, /\.vue\?vue/],
        dts: 'types/components.d.ts',
      }),

      // Auto import i18n locales.
      // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
      VueI18n({
        runtimeOnly: true,
        compositionOnly: true,
        fullInstall: true,
        include: [resolve(__dirname, 'locales/**')],
      }),
    ],

    // Vitest config.
    // https://github.com/vitest-dev/vitest
    test: {
      include: ['tests/unit/**/*.test.ts'],
      environment: 'jsdom',
    },
  })
}
