import { defineStore } from 'pinia';
import toastStore from './toastStore';

const toast = toastStore();

export default defineStore('favoriteStore', {
  state: () => ({
    favoriteList: [],
    favoriteProducts: [],
  }),
  actions: {
    getFavoriteList() {
      const list = localStorage.getItem('favoriteList');
      this.favoriteList = list === null ? [] : JSON.parse(list);
    },
    filterProducts(products) {
      const ary = [];

      if (this.favoriteList.length) {
        for (let i = 0; i < products?.length; i += 1) {
          for (let e = 0; e < this.favoriteList.length; e += 1) {
            if (products[i].id === this.favoriteList[e]) ary.push(products[i]);
          }
        }
      }

      this.favoriteProducts = ary;
    },
    deleteAllFavorite() {
      this.favoriteList = [];
      this.favoriteProducts = [];
      localStorage.setItem('favoriteList', JSON.stringify(this.favoriteList));
      toast.pushMsg({
        style: 'success',
        title: '成功移除所有喜愛清單',
      });
    },
  },
});
