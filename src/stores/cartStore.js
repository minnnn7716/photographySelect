import { defineStore } from 'pinia';
import axios from 'axios';
import router from '@/router';
import emitter from '@/methods/emitter';

export default defineStore('cartStore', {
  state: () => ({
    cartsData: {},
    orderId: '',
    couponData: {},
    couponCode: '',
    step: 1,
    isPaid: false,
    isLoading: false,
  }),
  actions: {
    nothingInCart() {
      if (this.step === 'pay' || this.step === 'final') {
        return;
      }

      if (this.cartsData.carts.length) {
        return;
      }

      emitter.emit('push-message', {
        style: 'danger',
        title: '購物車內無商品',
        content: '將於 2 秒後自動為您跳轉至商品頁',
      });

      setTimeout(() => {
        router.push('/products');
      }, '2000');
    },
    getCart() {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/cart`;
      this.isLoading = true;

      axios.get(api)
        .then((res) => {
          this.cartsData = res.data.data;
          this.getTotalNum();
          this.getCoupon();
          this.isLoading = false;
        })
        .catch((err) => {
          if (err.request.status === 404) {
            emitter.emit('push-message', {
              style: 'danger',
              title: '購物車取得失敗',
            });

            router.push('/notfound');
          }
        });
    },
    getTotalNum() {
      let num = 0;
      this.cartsData.carts.forEach((item) => {
        num += item.qty;
      });
      this.cartsData.totalNum = num;
      this.cartsData.itemsNum = this.cartsData.carts.length;
    },
    addCart(id, qty) {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/cart`;
      const item = {
        product_id: id,
        qty,
      };
      this.isLoading = true;

      axios.post(api, { data: item })
        .then((res) => {
          this.isLoading = false;

          if (res.data.success) {
            this.getCart();
            emitter.emit('push-message', {
              style: 'success',
              title: '成功加入購物車',
            });
          } else {
            emitter.emit('push-message', {
              style: 'danger',
              title: '加入購物車失敗',
              content: res.data.message,
            });
          }
        })
        .catch((err) => {
          if (err.request.status === 404) {
            emitter.emit('push-message', {
              style: 'danger',
              title: '加入購物車失敗',
              content: '抱歉，出現系統問題，請聯絡我們！',
            });
          }
        });
    },
    buyNow(id, qty) {
      this.addCart(id, qty);
      router.push('/cart');
    },
    updatedCart(cartId, productId, qty) {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/cart/${cartId}`;
      const item = {
        product_id: productId,
        qty,
      };
      this.isLoading = true;

      axios.put(api, { data: item })
        .then((res) => {
          this.isLoading = false;

          if (res.data.success) {
            this.getCart();
            emitter.emit('push-message', {
              style: 'success',
              title: '成功更新購物車',
            });
          } else {
            emitter.emit('push-message', {
              style: 'danger',
              title: '更新購物車失敗',
              content: res.data.message,
            });
          }
        })
        .catch((err) => {
          if (err.request.status === 404) {
            emitter.emit('push-message', {
              style: 'danger',
              title: '更新購物車失敗',
              content: '抱歉，出現系統問題，請聯絡我們！',
            });
          }
        });
    },
    deleteCart(id) {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/cart/${id}`;

      axios.delete(api)
        .then((res) => {
          this.isLoading = false;

          if (res.data.success) {
            this.getCart();
            emitter.emit('push-message', {
              style: 'primary',
              title: '成功刪除商品',
            });
          } else {
            emitter.emit('push-message', {
              style: 'danger',
              title: '刪除商品失敗',
              content: res.data.message,
            });
          }
        })
        .catch((err) => {
          if (err.request.status === 404) {
            emitter.emit('push-message', {
              style: 'danger',
              title: '刪除商品失敗',
              content: '抱歉，出現系統問題，請聯絡我們！',
            });
          }
        });
    },
    deleteAllCart() {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/carts`;
      this.isLoading = true;

      axios.delete(api)
        .then((res) => {
          this.isLoading = false;

          if (res.data.success) {
            this.getCart();
            emitter.emit('push-message', {
              style: 'primary',
              title: '成功刪除全部購物車',
            });
          } else {
            emitter.emit('push-message', {
              style: 'danger',
              title: '刪除全部購物車失敗',
              content: res.data.message,
            });
          }
        })
        .catch((err) => {
          if (err.request.status === 404) {
            emitter.emit('push-message', {
              style: 'danger',
              title: '刪除全部購物車失敗',
              content: '抱歉，出現系統問題，請聯絡我們！',
            });
          }
        });
    },
    nextStep(page) {
      if (page === 'cart') {
        this.step = 1;
        router.push('/checkout');
      } else if (this.step === 1) {
        this.step = 2;
      } else if (this.step === 2) {
        this.step = 'final';
      }
    },
    prevStep() {
      if (this.step === 2) {
        this.step = 1;
      } else if (this.step === 1) {
        router.push('/cart');
        this.step = 1;
      }
    },
    changeStep(step) {
      if (this.step === 'pay' || this.step === 'final') {
        return;
      }

      this.step = step;

      if (step === 'cart') {
        this.step = 1;
        router.push('/cart');
      }
    },
    laterPay() {
      this.step = 'final';
    },
    payOrder() {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/pay/${this.orderId}`;
      this.isLoading = true;

      axios.post(api)
        .then((res) => {
          this.step = 'final';
          this.isPaid = true;
          this.isLoading = false;

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
            emitter.emit('push-message', {
              style: 'danger',
              title: '付款失敗',
              content: '抱歉，出現系統問題，請聯絡我們！',
            });
          }
        });
    },
    orderCart(order, step) {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/order`;
      this.isLoading = true;

      axios.post(api, { data: order })
        .then((res) => {
          this.orderId = res.data.orderId;
          this.isLoading = false;
          this.step = step;

          if (res.data.success) {
            this.getCart();
            emitter.emit('push-message', {
              style: 'success',
              title: '成功訂購商品',
            });
          } else {
            emitter.emit('push-message', {
              style: 'danger',
              title: '商品訂購失敗',
              content: res.data.message,
            });
          }
        })
        .catch((err) => {
          if (err.request.status === 404) {
            emitter.emit('push-message', {
              style: 'danger',
              title: '商品訂購失敗',
              content: '抱歉，出現系統問題，請聯絡我們！',
            });
          }
        });
    },
    // coupon
    useCoupon(item) {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/coupon`;
      this.isLoading = true;

      axios.post(api, { data: { code: item } })
        .then((res) => {
          this.isLoading = false;

          if (res.data.success) {
            this.getCart();
            emitter.emit('push-message', {
              style: 'success',
              title: '成功使用折價券',
            });
          } else {
            emitter.emit('push-message', {
              style: 'danger',
              title: '使用折價券失敗',
              content: res.data.message,
            });
          }
        })
        .catch((err) => {
          if (err.request.status === 404) {
            emitter.emit('push-message', {
              style: 'danger',
              title: '使用折價券失敗',
              content: '抱歉，出現系統問題，請聯絡我們！',
            });
          }
        });
    },
    getCoupon() {
      const ary = this.cartsData.carts;
      let coupon = {};
      let code = '';

      if (ary.length) {
        const obj = ary[0];

        if (Object.prototype.hasOwnProperty.call(obj, 'coupon')) {
          coupon = { ...obj.coupon };
          code = coupon.code;
        }
      }

      this.couponData = coupon;
      this.couponCode = code;
    },
  },
  getters: {
    discountPrice() {
      return this.cartsData.total - Math.floor(this.cartsData.final_total);
    },
  },
});
