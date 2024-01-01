<script>
import { mapState, mapActions } from 'pinia';
import cartStore from '@/stores/cartStore';
import productsStore from '@/stores/productsStore';
import ProductListItem from '@/components/front/ProductListItem.vue';
import Pagination from '@/components/PaginationComponent.vue';

export default {
  components: {
    ProductListItem,
    Pagination,
  },
  watch: {
    '$route.params': {
      handler() {
        if (this.$route.query.page) this.getProducts(this.$route.query.page);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    ...mapActions(productsStore, ['getProducts']),
    ...mapActions(cartStore, ['addCart']),
    getEmitPage(page) {
      this.getProducts(page);
    },
  },
  computed: {
    ...mapState(productsStore, ['products', 'pagination', 'isLoading']),
  },
  created() {
    this.getProducts(this.$route.query.page);
  },
};
</script>

<template>
  <div class="container pt-2 pt-lg-8">
    <div class="d-flex align-items-end mb-6 mb-lg-14">
      <h2 class="fs-display-7 fs-md-display-5 fs-lg-display-3 fs-xl-display-1 font-serif-en">
        Products
      </h2>
      <div class="d-flex ms-3 mb-3 mb-md-4 mb-lg-6">
        <img class="me-2" src="@/assets/images/icon-star.svg" alt="間隔裝飾圖" />
        <p class="fs-normal-1 fs-md-6 fs-xl-4 font-sans-tw fw-light">({{ products.length }})</p>
      </div>
    </div>

    <ul
      class="row row-cols-2 row-cols-lg-4 gx-6 gx-lg-12 gy-6 gy-lg-16 list-unstyled mb-6 mb-lg-12"
    >
      <li class="d-flex flex-column" v-for="item in products" :key="item.id">
        <ProductListItem :product="item" @add-cart="addCart" />
      </li>
    </ul>
    <Pagination :page-info="pagination" @emit-page="getEmitPage" />
    <LoadingOverlay :active="isLoading" />
  </div>
</template>
