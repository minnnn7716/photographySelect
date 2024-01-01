export default {
  computed: {
    coupon() {
      let obj = { title: '' };
      if (this.products.length) {
        if (Object.prototype.hasOwnProperty.call(this.products[0], 'coupon')) {
          obj = this.products[0].coupon;
        }
      }
      return obj;
    },
  },
};
