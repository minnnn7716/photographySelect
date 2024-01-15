import { defineStore } from 'pinia';
import axios from 'axios';
import router from '@/router';
import toastStore from './toastStore';

const toast = toastStore();

export default defineStore('productStore', {
  state: () => ({
    products: [],
    singleProduct: {},
    pagination: {},
    isLoading: false,
  }),
  actions: {
    getProducts(page) {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/products?page=${page}`;
      this.isLoading = true;

      axios.get(api)
        .then((res) => {
          this.products = res.data.products;
          this.pagination = res.data.pagination;
          this.isLoading = false;

          if (page) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            router.push(`/products?page=${page}`);
          }
        })
        .catch(() => {
          this.isLoading = false;

          toast.pushMsg({
            style: 'danger',
            title: '取得商品失敗',
            content: '抱歉，出現系統問題，請聯絡我們！',
          });
        });
    },
    getSingleProduct(id) {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/product/${id}`;
      this.isLoading = true;

      axios.get(api)
        .then((res) => {
          this.isLoading = false;

          if (res.data.success) {
            this.singleProduct = res.data.product;
          } else {
            router.push('/notfound');
          }
        })
        .catch((err) => {
          if (err.request.status === 404) {
            this.isLoading = false;

            toast.pushMsg({
              style: 'danger',
              title: '取得商品失敗',
              content: '抱歉，出現系統問題，請聯絡我們！',
            });
          }
        });
    },
    routerPush(id) {
      router.push(`/products/${id}`);
    },
  },
  getters: {
    availableNum() {
      return this.singleProduct.totalNum - this.singleProduct.soldNum || 0;
    },
  },
});
