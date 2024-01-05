<script>
import { mapState, mapActions } from 'pinia';
import adminCollapseStore from '@/stores/adminCollapseStore';
import toastStore from '@/stores/toastStore';
import AdminCollapseList from './AdminCollapseList.vue';

export default {
  components: {
    AdminCollapseList,
  },
  methods: {
    ...mapActions(adminCollapseStore, ['closeCollapse']),
    ...mapActions(toastStore, ['pushMsg']),
    logout() {
      const api = `${import.meta.env.VITE_API}logout`;

      this.$http
        .post(api)
        .then((res) => {
          if (res.data.success) {
            this.$router.push('/');
            document.cookie = `psToken=;psExpired= ${new Date(0).toGMTString()}`;

            this.pushMsg({
              style: 'success',
              title: '登出成功',
            });
          }
        })
        .catch((err) => {
          if (err.request.status === 404) {
            this.pushMsg({
              style: 'danger',
              title: '登出失敗',
              content: '出現系統問題',
            });
          }
        });
    },
  },
  computed: {
    ...mapState(adminCollapseStore, ['isShow']),
  },
};
</script>

<template>
  <nav class="navbar navbar-dark bg-gray-800 fixed-top py-3 px-lg-8 px-lg-8">
    <div class="container-fluid">
      <RouterLink to="/" class="d-inline-block img-hover-scale-sm">
        <h2 class="navbar-brand admin-navbar-brand">集攝 Photography Select</h2>
      </RouterLink>

      <button
        type="button"
        class="d-none d-lg-inline-block btn font-sans-tw text-white"
        @click="logout"
      >
        登出
      </button>
      <AdminCollapseList />
      <div
        class="collapse-backdrop"
        :class="{ fade: !isShow, show: isShow }"
        @click="closeCollapse"
      ></div>
    </div>
  </nav>
</template>

<style lang="scss">
@import '@/assets/scss/vendors/bootstrap';

.admin-navbar-brand {
  width: 130px;
  height: 40px;
  background-size: contain;
  text-indent: 101%;
  white-space: nowrap;
  overflow: hidden;
  background: url('@/assets/images/icon-logo-white.svg') no-repeat center;
  background-size: cover;

  @include media-breakpoint-up(lg) {
    width: 147px;
    height: 46px;
  }
}

.collapse-backdrop {
  z-index: -1;
  background-color: #000;
  opacity: 0.5;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  transition: all ease 0.3s;
  pointer-events: none;

  &.fade {
    opacity: 0;
  }

  &.show {
    opacity: 0.5;
    pointer-events: initial;
  }
}
</style>
