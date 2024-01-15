import { defineStore } from 'pinia';
import axios from 'axios';
import toastStore from './toastStore';

const toast = toastStore();

export default defineStore('adminProductStore', {
  state: () => ({
    products: {},
    isLoading: false,
  }),
  actions: {
    getProducts() {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/admin/products/all`;
      this.isLoading = true;

      axios.get(api)
        .then((res) => {
          this.products = res.data.products;
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;

          toast.pushMsg({
            style: 'danger',
            title: '商品取得失敗',
            content: '出現系統問題',
          });
        });
    },
    deleteProduct(id) {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/admin/product/${id}`;
      this.isLoading = true;

      axios.delete(api)
        .then((res) => {
          this.isLoading = false;

          if (res.data.success) {
            this.getProducts();
            toast.pushMsg({
              style: 'primary',
              title: '成功刪除商品',
            });
          } else {
            toast.pushMsg({
              style: 'danger',
              title: '刪除商品失敗',
              content: res.data.message,
            });
          }
        })
        .catch(() => {
          this.isLoading = false;

          toast.pushMsg({
            style: 'danger',
            title: '商品刪除失敗',
            content: '出現系統問題',
          });
        });
    },
    updateProduct(item) {
      let api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/admin/product`;
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
            this.getProducts();
            toast.pushMsg({
              style: 'success',
              title: `成功${msg}商品`,
            });
          } else {
            toast.pushMsg({
              style: 'danger',
              title: `${msg}商品失敗`,
              content: res.data.message,
            });
          }
        })
        .catch(() => {
          this.isLoading = false;

          toast.pushMsg({
            style: 'danger',
            title: '商品更新失敗',
            content: '出現系統問題',
          });
        });
    },
    switchEnable(item) {
      const temp = { ...item };
      temp.is_enabled = !temp.is_enabled;
      this.updateProduct(temp);
    },
  },
  getters: {
    productsTotal() {
      return Object.keys(this.products).length;
    },
  },
});
