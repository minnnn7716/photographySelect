<script>
import { mapState, mapActions } from 'pinia';
import cartStore from '@/stores/cartStore';
import productsStore from '@/stores/productsStore';
import RatingScore from './RatingScore.vue';
import FavoriteBtn from './FavoriteBtn.vue';

export default {
  components: {
    RatingScore,
    FavoriteBtn,
  },
  props: ['product'],
  methods: {
    ...mapActions(cartStore, ['addCart']),
    ...mapActions(productsStore, ['routerPush']),
  },
  computed: {
    ...mapState(cartStore, ['isLoading']),
    availableNum() {
      return this.product.totalNum - this.product.soldNum || 0;
    },
  },
};
</script>

<template>
  <a href="#"
  @click.prevent="routerPush(product.id)"
  class="productList-item flex-grow-1 d-flex flex-column link-dark">
    <div
      class="productList-item-image position-relative flex-grow-1
      d-flex flex-column justify-content-center overflow-hidden"
    >
      <div class="flex-grow-1">
        <img class="img-full img-hover-scale" :src="product.imagesUrl[0]" :alt="product.title" />
      </div>
      <span
        class="d-inline-block position-absolute end-0 bottom-0
        font-sans-tw fw-light px-2 py-1 bg-white link-black fs-normal-1 fs-xxl-6"
        >{{ product.author }}
      </span>
    </div>
    <div class="px-lg-1 px-xxl-3 pt-2 pt-xxl-4 pb-2">
      <h3
        class="productList-item-tittle font-sans-tw
        fs-5 fs-lg-6 fs-xxl-5 fs-md-4 mb-1 mb-xxl-3 lh-base"
      >
        {{ product.title }}
        <span class="d-none d-md-inline">{{ `｜${product.category}攝影` }}</span>
      </h3>
      <RatingScore
        class="mb-2 mb-md-0"
        :rate="product.rate"
        :rateNum="product.rateNum"
      />
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-center">
        <p class="fs-6 fs-md-4">
          NT$ <span class="fs-4 fs-md-3">{{ $filters.currency(product.price) }}</span>
        </p>
        <div class="d-flex align-items-center">
          <FavoriteBtn :id="product.id" />
          <a href="#"
            v-if="availableNum"
            @click.stop.prevent="addCart(product.id, 1)"
            class="icon-cart d-inline-block rounded-circle p-2"
          >
            <img src="@/assets/images/icon-cart-default.svg" alt="加入購物車" />
          </a>
          <p v-else>售完</p>
        </div>
      </div>
    </div>
    <LoadingOverlay :active="isLoading" />
  </a>
</template>

<style lang="scss">
@import '@/assets/scss/vendors/bootstrap';

.productList-item {
  transition: all ease 0.5s;

  @include media-breakpoint-up(lg) {
    &:hover {
      background-color: white;
    }
  }

  &-image {
    height: 200px;
    @include media-breakpoint-up(md) {
      height: 350px;
    }

    @include media-breakpoint-up(xxl) {
      height: 396px;
    }
  }

  &-tittle {
    min-height: 54px;

    @include media-breakpoint-up(lg) {
      min-height: 60px;
    }
  }

  .vld-overlay .vld-background {
    opacity: 0.2;
  }
}
</style>
