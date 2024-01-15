import { defineStore } from 'pinia';
import axios from 'axios';
import router from '@/router';
import toastStore from './toastStore';

const toast = toastStore();

export default defineStore('newsStore', {
  state: () => ({
    news: {},
    top4News: {},
    pagination: {},
    singleNews: { tag: [] },
    otherNewsId: {
      prev: false,
      next: false,
    },
    isLoading: false,
  }),
  actions: {
    getNews(page) {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/articles?page=${page}`;
      this.isLoading = true;

      axios.get(api)
        .then((res) => {
          this.news = res.data.articles;
          this.pagination = res.data.pagination;
          this.isLoading = false;

          if (page) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            router.push(`/news?page=${page}`);
          }
        })
        .catch(() => {
          toast.pushMsg({
            style: 'danger',
            title: '消息取得失敗',
          });

          router.push('/notfound');
        });
    },
    getSingleNews(id) {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/article/${id}`;
      this.isLoading = true;

      axios.get(api)
        .then((res) => {
          if (res.data.success) {
            this.singleNews = res.data.article;
            this.getOtherNewsId(id);
          } else {
            router.push('/notfound');
          }
        })
        .catch(() => {
          toast.pushMsg({
            style: 'danger',
            title: '消息取得失敗',
          });

          router.push('/notfound');
        });
    },
    getOtherNewsId(id) {
      if (!Object.keys(this.news).length) return;

      const currentNewsIndex = this.news.map((item) => item.id).indexOf(id);
      const newsLength = this.news.length;

      if (currentNewsIndex === -1) return;

      if (currentNewsIndex + 1 === newsLength) {
        this.otherNewsId.next = false;
      } else {
        this.otherNewsId.next = this.news[currentNewsIndex + 1].id;
      }

      if (currentNewsIndex === 0) {
        this.otherNewsId.prev = false;
      } else {
        this.otherNewsId.prev = this.news[currentNewsIndex - 1].id;
      }

      this.isLoading = false;
    },
    getSingleNewsAll(id) {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/articles?page=:page`;
      this.isLoading = true;

      axios.get(api)
        .then((res) => {
          this.news = res.data.articles;
          this.getSingleNews(id);
        })
        .catch(() => {
          toast.pushMsg({
            style: 'danger',
            title: '消息取得失敗',
          });

          router.push('/notfound');
        });
    },
    getTop4News() {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/articles?page=:page`;
      this.isLoading = true;

      axios.get(api)
        .then((res) => {
          this.top4News = res.data.articles.splice(0, 4);
          this.pagination = res.data.pagination;
          this.isLoading = false;
        })
        .catch(() => {
          toast.pushMsg({
            style: 'danger',
            title: '最新消息取得失敗',
            content: '抱歉，出現系統問題，請聯絡我們！',
          });
        });
    },
    routerPush(id) {
      router.push(`/news/${id}`);
    },
  },
});
