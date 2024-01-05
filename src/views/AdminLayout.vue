<script>
import { mapActions } from 'pinia';
import toastStore from '@/stores/toastStore';
import AdminNavBar from '@/components/admin/AdminNavBar.vue';
import AdminSideBar from '@/components/admin/AdminSideBar.vue';
import ToastMessages from '@/components/ToastMessages.vue';

export default {
  components: {
    AdminNavBar,
    AdminSideBar,
    ToastMessages,
  },
  methods: {
    ...mapActions(toastStore, ['pushMsg']),
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
      })
      .catch((err) => {
        if (err.request.status === 404) {
          this.pushMsg({
            style: 'danger',
            title: '後台載入失敗',
            content: '抱歉，出現系統問題，請聯絡我們！',
          });
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
  &-table.table {
    width: max-content;

    @include media-breakpoint-up(md) {
      width: 100%;
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
