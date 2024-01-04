<script>
import { mapState, mapActions } from 'pinia';
import productsStore from '@/stores/productsStore';
import cartStore from '@/stores/cartStore';
import toastStore from '@/stores/toastStore';
import favoriteStore from '@/stores/favoriteStore';
import offcanvasMixin from '@/mixins/offcanvasMixin';
import FavoriteBtn from './FavoriteBtn.vue';
import DeleteModal from './DeleteModal.vue';

export default {
  data() {
    return {
      offcanvas: '',
    };
  },
  components: {
    FavoriteBtn,
    DeleteModal,
  },
  mixins: [offcanvasMixin],
  watch: {
    products: 'getFavoriteList',
    favoriteList() {
      this.filterProducts(this.products);
    },
  },
  methods: {
    ...mapActions(cartStore, ['addCart']),
    ...mapActions(toastStore, ['pushMsg']),
    ...mapActions(favoriteStore, ['getFavoriteList', 'filterProducts', 'deleteAllFavorite']),
    showFavoriteOffcanvas() {
      this.getFavoriteList();
      this.offcanvas.show();
    },
    availableNum(product) {
      return product.totalNum - product.soldNum || 0;
    },
  },
  computed: {
    ...mapState(productsStore, ['products']),
    ...mapState(favoriteStore, ['favoriteList', 'favoriteProducts']),
  },
};
</script>

<template>
  <a class="btn px-2 px-lg-3 py-2 me-2 border-0" @click.prevent="showFavoriteOffcanvas">
    <div class="icon-switch">
      <img
        class="icon-switch-default"
        src="@/assets/images/icon-like-default.svg"
        alt="喜愛清單"
      />
      <img
        class="icon-switch-active"
        src="@/assets/images/icon-like-active.svg"
        alt="喜愛清單"
      />
    </div>
  </a>

  <div class="offcanvas offcanvas-end" tabindex="-1" ref="offcanvas">
    <div class="offcanvas-header justify-content-end">
      <button type="button" class="btn icon-close border-0" @click="hideOffcanvas"></button>
    </div>
    <div
      class="d-flex justify-content-between align-items-center px-4 pb-4 border-bottom border-black"
    >
      <h5 class="font-serif-en fs-2" id="favoriteOffcanvasLabel">
        Favorite <span class="font-sans-tw fs-6 fw-light">({{ favoriteProducts.length }})</span>
      </h5>
      <button
        type="button"
        class="btn-custom-light px-5 flex-inherit"
        :class="{ 'pe-none opacity-50': !favoriteList.length }"
        @click="$refs.deleteModal.showModal"
      >
        刪除全部
      </button>
    </div>
    <div
      v-if="!favoriteProducts.length"
      class="flex-grow-1 d-flex flex-column align-items-center justify-content-center font-sans-tw">
      <p class="mb-3 fs-5">尚無喜愛商品</p>
      <a href="#"
        class="btn btn-primary rounded-pill"
        @click.prevent="routerPush('/products')">
        來去逛逛吧！
      </a>
    </div>
    <ul v-else class="list-unstyled font-sans-tw fw-light px-4 overflow-auto">
      <li
        v-for="item in favoriteProducts"
        :key="`favorite ${item.id}`"
        class="d-flex justify-content-between py-4 border-bottom border-gray-400"
      >
        <div class="d-flex">
          <a href="#" @click.prevent="routerPushProduct">
            <img
              class="img-full me-4"
              style="width: 100px; height: 130px"
              :src="item.imageUrl"
              :alt="item.title"
            />
          </a>
          <div class="d-flex flex-column justify-content-between">
            <div>
              <h3 class="fs-5 fw-light mb-2">
                <RouterLink to="/products" class="text-gray-800">{{ item.title }}</RouterLink>
              </h3>
              <RouterLink to="/products" class="text-gray-800">{{ item.author }}</RouterLink>
            </div>
            <p>單價 NT {{ $filters.currency(item.price) }}</p>
          </div>
        </div>
        <div class="d-flex align-items-center">
          <a href="#"
            class="icon-cart d-inline-block rounded-circle p-2"
            v-if="availableNum(item)"
            @click.prevent="addCart(item.id, 1)"
          >
            <img src="@/assets/images/icon-cart-default.svg" alt="加入購物車" />
          </a>
          <p v-else>售完</p>
          <FavoriteBtn :id="item.id" @click="getFavoriteList" />
        </div>
      </li>
    </ul>
  </div>

  <DeleteModal ref="deleteModal" :deleteData="`Favorite`" @emit-delete-all="deleteAllFavorite"/>
</template>
