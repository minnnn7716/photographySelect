<script>
import { useMeta } from 'vue-meta';

export default {
  name: 'App',
  mounted() {
    useMeta({
      title: '集攝｜PhotoGraphy Select',
      htmlAttrs: {
        lang: 'zh-Hant-TW',
      },
      metaInfo: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          name: 'content',
          content: '為你汲取多重面向的攝影集，歡迎揀選屬於你的吉光片羽',
        },
        {
          name: 'keywords',
          content: '攝影集,照片,寫真',
        },
        {
          property: 'og:title',
          content: '集攝｜PhotoGraphy Select',
        },
        {
          property: 'og:description',
          content: '為你汲取多重面向的攝影集，歡迎揀選屬於你的吉光片羽',
        },
      ],
    });
  },
};
</script>

<template>
  <div>
    <metainfo></metainfo>
  </div>
  <RouterView />
</template>
