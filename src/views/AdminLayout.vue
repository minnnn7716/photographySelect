<script>
import AdminNavBar from '@/components/admin/AdminNavBar.vue';
import AdminSideBar from '@/components/admin/AdminSideBar.vue';
import ToastMessages from '@/components/ToastMessages.vue';

export default {
  components: {
    AdminNavBar,
    AdminSideBar,
    ToastMessages,
  },
  created() {
    const api = `${import.meta.env.VITE_API}api/user/check`;
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)psToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    this.$http.defaults.headers.common.Authorization = `${token}`;

    this.$http
      .post(api)
      .then((res) => {
        if (!res.data.success) {
          this.$router.push('/login');
        }
      });
  },
};
</script>

<template>
  <div class="font-sans-tw">
    <AdminNavBar />
    <AdminSideBar />
    <ToastMessages />
    <RouterView class="adminView ms-auto" />
  </div>
</template>

<style lang="scss">
@import '@/assets/scss/vendors/bootstrap';

.admin {
  &-table {
    width: max-content !important;

    @include media-breakpoint-up(md) {
      width: 100% !important;
    }
  }

  &-img {
    height: 120px;
    width: 90px;

    @include media-breakpoint-up(lg) {
      height: 140px;
      width: 100px;
    }
  }
}
</style>
