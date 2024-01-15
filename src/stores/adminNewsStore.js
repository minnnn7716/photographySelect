import { defineStore } from 'pinia';
import axios from 'axios';
import toastStore from './toastStore';

const toast = toastStore();

export default defineStore('adminNewsStore', {
  state: () => ({
    news: {},
    pagination: {},
    isLoading: false,
  }),
  actions: {
    getNews() {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/admin/articles?page=:page`;
      this.isLoading = true;

      axios.get(api)
        .then((res) => {
          this.news = res.data.articles;
          this.pagination = res.data.pagination;
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;

          toast.pushMsg({
            style: 'danger',
            title: '消息取得失敗',
            content: '出現系統問題',
          });
        });
    },
    updateNews(item) {
      let api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/admin/article`;
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
            this.getNews();
            toast.pushMsg({
              style: 'success',
              title: `成功${msg}消息`,
            });
          } else {
            toast.pushMsg({
              style: 'danger',
              title: `${msg}消息失敗`,
              content: res.data.message,
            });
          }
        })
        .catch(() => {
          this.isLoading = false;

          toast.pushMsg({
            style: 'danger',
            title: '消息更新失敗',
            content: '出現系統問題',
          });
        });
    },
    deleteNews(id) {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/admin/article/${id}`;
      this.isLoading = true;

      axios.delete(api)
        .then((res) => {
          this.isLoading = false;

          if (res.data.success) {
            this.getNews();
            toast.pushMsg({
              style: 'primary',
              title: '成功刪除消息',
            });
          } else {
            toast.pushMsg({
              style: 'danger',
              title: '刪除消息失敗',
              content: res.data.message,
            });
          }
        })
        .catch(() => {
          this.isLoading = false;

          toast.pushMsg({
            style: 'danger',
            title: '消息刪除失敗',
            content: '出現系統問題',
          });
        });
    },
    switchPublic(item) {
      const temp = { ...item };
      temp.content = temp.title;
      temp.isPublic = !temp.isPublic;
      this.updateNews(temp);
    },
  },
  getters: {
    newsNum() {
      let num = 0;
      if (Object.keys(this.news).length) {
        num = this.news.length;
      }

      return num;
    },
  },
});
