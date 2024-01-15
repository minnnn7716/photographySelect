import { defineStore } from 'pinia';
import axios from 'axios';
import toastStore from './toastStore';

const toast = toastStore();

export default defineStore('adminOrderStore', {
  state: () => ({
    orders: {},
    pagination: {},
    isLoading: false,
  }),
  actions: {
    getOrders() {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/admin/orders?page=:page`;
      this.isLoading = true;

      axios.get(api)
        .then((res) => {
          this.orders = res.data.orders;
          this.pagination = res.data.pagination;
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;

          toast.pushMsg({
            style: 'danger',
            title: '訂單取得失敗',
            content: '出現系統問題',
          });
        });
    },
    deleteOrder(id) {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/admin/order/${id}`;
      this.isLoading = true;

      axios.delete(api)
        .then((res) => {
          this.isLoading = false;

          if (res.data.success) {
            this.getOrders();
            toast.pushMsg({
              style: 'primary',
              title: '成功刪除訂單',
            });
          } else {
            toast.pushMsg({
              style: 'danger',
              title: '刪除訂單失敗',
              content: res.data.message,
            });
          }
        })
        .catch(() => {
          this.isLoading = false;

          toast.pushMsg({
            style: 'danger',
            title: '訂單刪除失敗',
            content: '出現系統問題',
          });
        });
    },
  },
  getters: {
    orderTotalPrice() {
      let total = 0;
      if (Object.keys(this.orders).length) {
        total = this.orders.map((item) => item.total).reduce((prev, next) => prev + next, 0);
      }

      return total;
    },
    orderNum() {
      let num = 0;
      if (Object.keys(this.orders).length) {
        num = this.orders.length;
      }

      return num;
    },
  },
});
