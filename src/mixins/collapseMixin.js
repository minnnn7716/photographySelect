import { Collapse } from 'bootstrap';

export default {
  data() {
    return {
      isShow: false,
    };
  },
  methods: {
    toggleCollapse() {
      this.collapse.toggle();
      this.isShow = !this.isShow;
      this.collapseEmit();
    },
    routerPush(router) {
      this.$router.push(router);
      this.collapse.hide();
      this.isShow = false;
      this.collapseEmit();
    },
    collapseEmit() {
      this.$emitter.emit('collapse-show', this.isShow);
    },
  },
  mounted() {
    this.collapse = new Collapse(this.$refs.collapse, {
      toggle: false,
    });

    this.collapse.hide();
    this.isShow = false;
  },
};
