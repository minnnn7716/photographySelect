import axios from 'axios';
import { defineStore } from 'pinia';
import router from '@/router';
import emitter from '@/methods/emitter';

export default defineStore('orderStore', {
  state: () => ({
    orders: [],
    pagination: {},
    userOrders: [
      {
        user: {},
      },
    ],
    isLoading: false,
  }),
  actions: {
    getOrders() {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/orders?page=:page`;
      this.isLoading = true;

      axios
        .get(api)
        .then((res) => {
          this.orders = res.data.orders;
          this.pagination = res.data.pagination;
          this.isLoading = false;
        })
        .catch((err) => {
          if (err.request.status === 404) {
            this.isLoading = false;

            emitter.emit('push-message', {
              style: 'danger',
              title: '取得訂單失敗',
              content: '抱歉，出現系統問題，請聯絡我們！',
            });
          }
        });
    },
    getUserOrders(id) {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/orders?page=:page`;
      this.isLoading = true;

      axios
        .get(api)
        .then((res) => {
          this.orders = res.data.orders;
          this.filterOrder(id);
          this.isLoading = false;
        })
        .catch((err) => {
          if (err.request.status === 404) {
            this.isLoading = false;

            emitter.emit('push-message', {
              style: 'danger',
              title: '取得訂單失敗',
              content: '抱歉，出現系統問題，請聯絡我們！',
            });
          }
        });
    },
    searchOrder(email) {
      const ary = this.orders.filter((item) => item.user.email === email);

      if (ary.length) {
        router.push(`/order/${email}`);
      } else {
        emitter.emit('push-message', {
          style: 'danger',
          title: '查無訂單',
        });
      }
    },
    filterOrder(id) {
      this.userOrders = this.orders.filter((item) => item.user.email === id);
    },
    payOrder(orderId, userId) {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/pay/${orderId}`;
      this.isLoading = true;

      axios.post(api)
        .then((res) => {
          this.isLoading = false;
          this.getUserOrders(userId);

          if (res.data.success) {
            emitter.emit('push-message', {
              style: 'success',
              title: '付款成功',
            });
          } else {
            emitter.emit('push-message', {
              style: 'danger',
              title: '付款失敗',
              content: res.data.message,
            });
          }
        })
        .catch((err) => {
          if (err.request.status === 404) {
            this.isLoading = false;

            emitter.emit('push-message', {
              style: 'danger',
              title: '付款失敗',
              content: '抱歉，出現系統問題，請聯絡我們！',
            });
          }
        });
    },
    dueDate(time) {
      const createDate = new Date(time * 1000);
      const month = createDate.getMonth();
      const date = createDate.getDate();
      const OddMonth = [1, 3, 5, 7, 8, 10, 12];
      let dueMonth = month + 1;
      let dueDate = date;
      let currentMonthDays = 0;

      if (OddMonth.indexOf(dueMonth) === -1) {
        currentMonthDays = 30;
      } else {
        currentMonthDays = 31;
      }

      if (date === currentMonthDays) {
        dueMonth += 1;
        dueDate += 2;
      } else {
        dueDate += 1;
      }

      const dueTime = new Date();
      dueTime.setMonth(dueMonth - 1);
      dueTime.setDate(dueDate);
      dueTime.setHours(31);
      dueTime.setMinutes(59);
      dueTime.setSeconds(59);

      return dueTime;
    },
    isCancel(time) {
      const now = new Date().getTime();
      return this.dueDate(time).getTime() < now;
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
