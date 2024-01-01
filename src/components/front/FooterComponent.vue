<script>
export default {
  methods: {
    loginJudge() {
      const api = `${import.meta.env.VITE_API}api/user/check`;
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)psToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      this.$http.defaults.headers.common.Authorization = `${token}`;

      this.$http
        .post(api)
        .then((res) => {
          if (res.data.success) {
            this.$router.push('/admin/products');
          } else {
            this.$router.push('/login');
          }
        });
    },
  },
};
</script>

<template>
  <footer class="bg-gray-800 py-8 mt-15 mt-xxl-24 mt-3xl-40">
    <div
      class="container font-sans-tw fs-normal-1 position-relative
      d-flex flex-column-reverse flex-lg-row justify-content-between align-items-lg-end"
    >
      <p class="d-lg-none text-white fw-light text-center mt-8">
        © 2023｜m_m ｜ 此網站為個人作品展示，<br class="d-md-none" />非商業使用，圖片源於 Unsplash
      </p>
      <ul class="list-unstyled fw-light mb-0">
        <li class="mb-2"><a class="link-white" href="tel:04-22876543">04-22876543</a></li>
        <li class="mb-2">
          <a class="link-white" href="mailto:photoselect@gmail.com">photoselect@gmail.com</a>
        </li>
        <li>
          <a class="link-white" href="google.com" target="_blank"
            >台中市南區集攝路 128 巷 66 號之 8</a
          >
        </li>
      </ul>
      <div class="text-end">
        <button
          type="button"
          @click="loginJudge"
          class="btn btn-gray-700 rounded-pill fs-normal-1 fw-light mb-3 px-5"
        >
          管理員登入
        </button>
        <p class="d-none d-lg-block text-white fw-light text-start">
          © 2023｜m_m ｜ 此網站為個人作品展示，非商業使用，圖片源於 Unsplash
        </p>
      </div>
      <div class="footer-decoText position-absolute end-0 text-gray-800">
        <span class="font-serif-tw writing-vertical d-none d-lg-inline-block">集 攝</span>
        <span class="font-serif-en fs-2 fs-md-1 fs-lg-display-6">PhotoGraphy Select</span>
      </div>
    </div>
  </footer>
</template>

<style lang="scss">
@import '@/assets/scss/vendors/bootstrap';

.footer-decoText {
  top: -4.7em;

  @include media-breakpoint-up(md) {
    top: -5.3em;
  }

  @include media-breakpoint-up(lg) {
    top: -6.5em;
  }
}
</style>
