<script>
export default {
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
      showPassword: false,
    };
  },
  methods: {
    login() {
      const api = `${import.meta.env.VITE_API}admin/signin`;
      this.$http
        .post(api, this.user)
        .then((res) => {
          const { token, expired } = res.data;
          document.cookie = `psToken=${token}; psExpired=${new Date(expired)}`;

          if (res.data.success) {
            this.$router.push('/admin/products');
            this.$emitter.emit('push-message', {
              style: 'success',
              title: '登入成功',
            });
          } else {
            this.$emitter.emit('push-message', {
              style: 'danger',
              title: '登入失敗',
            });
          }
        });
    },
  },
  computed: {
    passwordType() {
      return this.showPassword ? 'text' : 'password';
    },
  },
};
</script>

<template>
  <div class="d-flex align-items-center overflow-hidden">
    <div class="container d-flex flex-column align-items-center justify-content-center">
      <div class="text-center position-relative mb-10">
        <p class="font-serif-tw notFount-decoFont blend-overlay fw-light">404</p>
        <h2 class="fs-2 fs-lg-1 mb-4 text-gray-700">PAGE NOT FOUND</h2>
        <p class="font-sans-tw fw-light text-gray-700 fs-6 fs-lg-5">
          很抱歉，您查詢的網頁<br class="d-lg-none" />可能已經移除或變更網址
        </p>

        <img
          class="position-absolute top-50 start-50 translate-middle z-minus-1"
          src="../assets/images/decoration-halo.svg"
          alt="decoration-halo"
        />
      </div>
      <RouterLink to="/" class="btn-custom-light fw-normal">返回首頁</RouterLink>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/assets/scss/vendors/bootstrap';

.notFount-decoFont {
  font-size: 96px;
  letter-spacing: 0.5rem;
  line-height: 1;
  margin-bottom: -16px;

  @include media-breakpoint-up(lg) {
    font-size: 128px;
    margin-bottom: -24px;
  }
}
</style>
