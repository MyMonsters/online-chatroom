// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['@/assets/styles/global.css'],
  plugins: [],
  modules: [
    '@nuxthq/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
  ],
  devServer: {
    port: 3002,
  },
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:3000/api',
    },
  },
  piniaPersistedstate: {
    storage: 'localStorage',
  },
});
