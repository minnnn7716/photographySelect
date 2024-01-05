import { defineStore } from 'pinia';
import { Collapse } from 'bootstrap';

export default defineStore('adminCollapseStore', {
  state: () => ({
    isShow: false,
    collapse: '',
  }),
  actions: {
    collapseInit(DOM) {
      this.collapse = new Collapse(DOM, {
        toggle: false,
      });

      this.collapse.hide();
      this.isShow = false;
    },
    toggleCollapse() {
      this.collapse.toggle();
      this.isShow = !this.isShow;
    },
    closeCollapse() {
      this.collapse.hide();
      this.isShow = false;
    },
    routerPush(router) {
      this.$router.push(router);
      this.closeCollapse();
    },
  },
});
