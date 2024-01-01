<script>
export default {
  props: ['rate', 'rateNum'],
  computed: {
    calcRate() {
      const ary = [];
      let translateAry = [];

      if (this.rate !== undefined) {
        const decimal = +this.rate.split('.')[1];
        const hasHalf = decimal !== 0;

        for (let i = 1; i <= 5; i += 1) {
          if (i <= +this.rate) {
            ary.push(true);
          } else {
            ary.push(false);
          }
        }

        if (hasHalf) ary[ary.indexOf(false)] = 'half';
        translateAry = ary.map((item) => {
          if (!item) {
            return '';
          }

          if (item === 'half') {
            return 'half';
          }

          return 'whole';
        });
      }

      return translateAry;
    },
    hasRate() {
      let { rate } = this;
      if (!this.rateNum) rate = '尚無';
      return rate;
    },
  },
};
</script>

<template>
  <ul class="ratingScore list-unstyled d-flex align-items-center mb-0">
    <li class="d-flex align-items-center me-3">
      <span class="me-1" :class="calcRate[0]"></span>
      <span class="me-1" :class="calcRate[1]"></span>
      <span class="me-1" :class="calcRate[2]"></span>
      <span class="me-1" :class="calcRate[3]"></span>
      <span :class="calcRate[4]"></span>
    </li>
    <li class="fs-6 fs-lg-4 font-serif-tw" :class="{ 'fs-6': !rateNum }">
      {{ hasRate }}
    </li>
  </ul>
</template>

<style lang="scss">
@import '@/assets/scss/vendors/bootstrap';
@import '@/assets/scss/utils/variables';

.ratingScore {
  span {
    position: relative;
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid $gray-800;
    background-color: $gray-400;

    @include media-breakpoint-up(md) {
      width: 18px;
      height: 18px;
    }
  }

  .whole {
    background-color: $primary-400;
  }

  .half::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    background-color: $primary-400;
    border-radius: 9px 0 0 9px;
  }
}
</style>
