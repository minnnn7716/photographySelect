import { defineStore } from 'pinia';

export default defineStore('toastStore', {
  state: () => ({
    message: [],
  }),
  actions: {
    pushMsg(message) {
      const { style, title, content } = message;
      this.message.push({ style, title, content });
    },
    resetMsg() {
      this.message = [];
    },
  },
});
