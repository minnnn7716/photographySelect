<script>
import { mapActions } from 'pinia';
import toastStore from '@/stores/toastStore';
import offcanvasMixin from '@/mixins/offcanvasMixin';

export default {
  data() {
    return {
      offcanvas: '',
    };
  },
  mixins: [offcanvasMixin],
  methods: {
    ...mapActions(toastStore, ['pushMsg']),
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
          this.offcanvas.hide();
        })
        .catch(() => {
          this.pushMsg({
            style: 'danger',
            title: '登入憑證驗證失敗',
            content: '抱歉，出現系統問題，請聯絡我們！',
          });
        });
    },
  },
};
</script>

<template>
  <button
    type="button"
    class="btn px-1 px-lg-3 py-2 border-0"
    @click="showOffcanvas">
    <div class="icon-list"></div>
  </button>

  <div class="offcanvas offcanvas-end" tabindex="-1" ref="offcanvas">
    <div class="offcanvas-header justify-content-end">
      <button
        type="button"
        class="btn icon-close border-0"
        @click="hideOffcanvas"
      ></button>
    </div>
    <ul
      class="offcanvas-body navOffcanvas-offcanvas-body list-unstyled
      font-serif-en fs-2 fs-xl-1 p-0 d-flex flex-column justify-content-center"
    >
      <li>
        <a
          href="#"
          @click.prevent="routerPush('/')"
          class="d-block text-center link-dark py-2 py-xl-4"
          >Home</a
        >
      </li>
      <li>
        <a
          href="#"
          @click.prevent="routerPush('/products')"
          class="d-block text-center link-dark py-2 py-xl-4 navOffcanvas-productsLink"
          >Products</a
        >
      </li>
      <li>
        <a
          href="#"
          @click.prevent="routerPush('/news')"
          class="d-block text-center link-dark py-2 py-xl-4"
          >News</a
        >
      </li>
      <li>
        <a
          href="#"
          @click.prevent="routerPush('/order')"
          class="d-block text-center link-dark py-2 py-xl-4"
          >Check Order</a
        >
      </li>
    </ul>
    <div
      class="navOffcanvas-offcanvas-footer px-6 pb-6 pb-xl-10
      d-flex justify-content-between align-items-end"
    >
      <ul class="list-unstyled font-sans-tw fs-normal-1 fw-light">
        <li class="mb-2">
          <a class="d-inline-block link-gray-800 btn-custom-hover-scale-sm" href="tel:04-22876543"
            >04-22876543</a
          >
        </li>
        <li class="mb-2">
          <a
            class="d-inline-block link-gray-800 btn-custom-hover-scale-sm"
            href="mailto:photoselect@gmail.com"
            >photoselect@gmail.com</a
          >
        </li>
        <li>
          <a
            class="d-inline-block link-gray-800 btn-custom-hover-scale-sm"
            href="google.com"
            target="_blank"
            >台中市南區集攝路 128 巷 66 號之 8</a
          >
        </li>
      </ul>
      <button
        type="button"
        class="navOffcanvas-loginBtn btn border-0 btn-custom-hover-scale-sm"
        @click="loginJudge"
      >
        <img class="transition-3" src="@/assets/images/icon-user.svg" alt="後台管理員" />
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.navOffcanvas {
  &-offcanvas-body {
    a:hover {
      background-color: white;
    }
  }

  &-loginBtn {
    margin-right: -12px;
    margin-bottom: -6px;
  }
}
</style>
