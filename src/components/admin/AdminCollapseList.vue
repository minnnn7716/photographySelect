<script>
import { mapState, mapActions } from 'pinia';
import adminCollapseStore from '@/stores/adminCollapseStore';
import ProductModal from './ProductModal.vue';

export default {
  data() {
    return {
      isNew: true,
      tempProduct: {},
      currentUrl: '',
    };
  },
  components: {
    ProductModal,
  },
  methods: {
    ...mapActions(adminCollapseStore, ['collapseInit', 'toggleCollapse', 'closeCollapse']),
    openModal() {
      this.collapse.hide();
      this.closeCollapse();

      this.tempProduct = {
        totalNum: 1,
        soldNum: 0,
        rate: '0',
        rateNum: 0,
      };

      this.$refs.productModal.showModal();
    },
    clickNavLink(path) {
      this.currentUrl = path;
      this.routerPush(`/admin/${path}`);
    },
  },
  computed: {
    ...mapState(adminCollapseStore, ['collapse', 'isShow']),
  },
  mounted() {
    const url = this.$route.path.split('/')[2];
    this.currentUrl = url;

    this.collapseInit(this.$refs.collapse);
  },
};
</script>

<template>
  <button
    type="button"
    class="d-lg-none btn px-1 px-lg-3 py-2 border-0"
    @click="toggleCollapse"
  >
    <div class="icon-list icon-list-light"></div>
  </button>

  <div class="collapse navbar-collapse" ref="collapse">
    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
      <li class="nav-item border-bottom border-gray-400">
        <button
          type="button"
          class="nav-link pt-6 pb-4 text-white fw-light"
          @click="openModal"
        >
          新增商品
        </button>
      </li>
      <li class="nav-item border-bottom border-gray-400">
        <a
          href="#"
          class="nav-link py-4 fw-light"
          :class="{
            'text-primary': currentUrl === 'products',
            'text-white': currentUrl !== 'products'
          }"
          @click.prevent="clickNavLink('products')"
          >商品列表</a
        >
      </li>
      <li class="nav-item border-bottom border-gray-400">
        <a
          href="#"
          class="nav-link py-4 fw-light"
          :class="{
            'text-primary': currentUrl === 'orders',
            'text-white': currentUrl !== 'orders'
          }"
          @click.prevent="clickNavLink('orders')"
          >顧客訂單</a
        >
      </li>
      <li class="nav-item border-bottom border-gray-400">
        <a
          href="#"
          class="nav-link py-4 fw-light"
          :class="{
            'text-primary': currentUrl === 'coupons',
            'text-white': currentUrl !== 'coupons'
          }"
          @click.prevent="clickNavLink('coupons')"
          >折價券</a
        >
      </li>
      <li class="nav-item">
        <a
          href="#"
          class="nav-link pt-4 fw-light"
          :class="{
            'text-primary': currentUrl === 'news',
            'text-white': currentUrl !== 'news'
          }"
          @click.prevent="clickNavLink('news')"
          >最新消息</a
        >
      </li>
    </ul>
  </div>

  <ProductModal ref="productModal" :product="tempProduct" :isNew="isNew" />
</template>
