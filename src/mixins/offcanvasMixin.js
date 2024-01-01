import { Offcanvas } from 'bootstrap';

export default {
  methods: {
    showOffcanvas() {
      this.offcanvas.show();
    },
    hideOffcanvas() {
      this.offcanvas.hide();
    },
    routerPush(router) {
      this.$router.push(router);
      this.offcanvas.hide();
    },
    routerPushProduct(id) {
      this.$router.push(`/products/${id}`);
      this.offcanvas.hide();
    },
  },
  mounted() {
    this.offcanvas = new Offcanvas(this.$refs.offcanvas);
    this.offcanvas.hide();
  },
};
