import { defineStore } from 'pinia';
import axios from 'axios';
import toastStore from './toastStore';

const toast = toastStore();

export default defineStore('couponStore', {
  state: () => ({
    coupons: [],
    pagination: {},
    isLoading: false,
  }),
  actions: {
    getCoupons() {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/admin/coupons?page=:page`;
      this.isLoading = true;

      axios.get(api)
        .then((res) => {
          this.coupons = this.convertEnabled(res.data.coupons);
          this.pagination = res.data.pagination;
          this.isLoading = false;
        })
        .catch((err) => {
          if (err.request.status === 404) {
            toast.pushMsg({
              style: 'danger',
              title: '折價券取得失敗',
              content: '出現系統問題',
            });
          }
        });
    },
    updatedCoupon(item) {
      let api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/admin/coupon`;
      let httpMethod = 'post';
      let msg = '新增';
      this.isLoading = true;

      if (item.id !== undefined) {
        api += `/${item.id}`;
        httpMethod = 'put';
        msg = '更新';
      }

      axios[httpMethod](api, { data: item })
        .then((res) => {
          this.isLoading = false;

          if (res.data.success) {
            this.getCoupons();
            toast.pushMsg({
              style: 'success',
              title: `成功${msg}折價券`,
            });
          } else {
            toast.pushMsg({
              style: 'danger',
              title: `${msg}折價券失敗`,
              content: res.data.message,
            });
          }
        })
        .catch((err) => {
          if (err.request.status === 404) {
            toast.pushMsg({
              style: 'danger',
              title: '折價券更新失敗',
              content: '抱歉，出現系統問題，請聯絡我們！',
            });
          }
        });
    },
    deleteCoupon(id) {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/admin/coupon/${id}`;
      this.isLoading = true;

      axios.delete(api)
        .then((res) => {
          this.isLoading = false;

          if (res.data.success) {
            this.getCoupons();
            toast.pushMsg({
              style: 'primary',
              title: '成功刪除折價券',
            });
          } else {
            toast.pushMsg({
              style: 'danger',
              title: '刪除折價券失敗',
              content: res.data.message,
            });
          }
        })
        .catch((err) => {
          if (err.request.status === 404) {
            toast.pushMsg({
              style: 'danger',
              title: '折價券更新失敗',
              content: '出現系統問題',
            });
          }
        });
    },
    convertEnabled(ary) {
      const convertCoupons = [...ary];
      convertCoupons.forEach((i) => {
        const item = i;
        item.is_enabled = Boolean(i.is_enabled);
      });

      return convertCoupons;
    },
  },
});
