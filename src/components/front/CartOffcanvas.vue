<script>
import { mapState, mapActions } from 'pinia';
import cartStore from '@/stores/cartStore';
import offcanvasMixin from '@/mixins/offcanvasMixin';
import DeleteModal from './DeleteModal.vue';

export default {
  data() {
    return {
      offcanvas: '',
    };
  },
  components: {
    DeleteModal,
  },
  mixins: [offcanvasMixin],
  methods: {
    ...mapActions(cartStore, [
      'getCart',
      'updatedCart',
      'deleteCart',
      'deleteAllCart']),
    availableNum(item) {
      const { totalNum, soldNum } = item.product;
      return totalNum - soldNum;
    },
  },
  computed: {
    ...mapState(cartStore, ['cartsData']),
  },
  created() {
    this.getCart();
  },
};
</script>

<template>
  <a href="#"
  class="btn px-2 px-lg-3 py-2 me-2 border-0 position-relative"
  @click.prevent="showOffcanvas">
    <div class="icon-switch">
      <img
        class="icon-switch-default"
        src="@/assets/images/icon-cart-default.svg"
        alt="購物車"
      />
      <img class="icon-switch-active" src="@/assets/images/icon-cart-active.svg" alt="購物車" />
    </div>
    <div v-if="cartsData.itemsNum" class="icon-cart-num position-absolute">
      <span class="font-sans-tw">{{ cartsData.itemsNum }}</span>
    </div>
  </a>

  <div class="offcanvas-custom offcanvas offcanvas-end border-0" tabindex="-1" ref="offcanvas">
    <div class="offcanvas-header justify-content-end">
      <button
        type="button"
        class="btn icon-close border-0"
        @click="hideOffcanvas"
      ></button>
    </div>
    <div
      class="d-flex justify-content-between align-items-center px-4 pb-4 border-bottom border-black"
    >
      <h5 class="font-serif-en fs-2" id="favoriteOffcanvasLabel">
        Cart <span class="font-sans-tw fs-6 fw-light">({{ cartsData.itemsNum }})</span>
      </h5>
      <button
        type="button"
        class="btn-custom-light px-5 flex-inherit"
        :class="{
          'pe-none opacity-50': Object.prototype.hasOwnProperty.call(cartsData, 'carts')
            ? !cartsData.carts.length
            : false
        }"
        @click="$refs.deleteModal.showModal"
      >
        刪除全部
      </button>
    </div>
    <div
      v-if="!cartsData.itemsNum"
      class="flex-grow-1 d-flex flex-column align-items-center justify-content-center font-sans-tw">
      <p class="mb-3 fs-5">購物車內尚無商品</p>
      <a href="#"
        class="btn btn-primary rounded-pill"
        @click.prevent="routerPush('/products')">
        來去逛逛吧！
      </a>
    </div>
    <ul v-else class="list-unstyled font-sans-tw fw-light px-4 overflow-auto flex-grow-1">
      <li
        v-for="item in cartsData.carts"
        :key="`cart ${item.product.title}`"
        class="d-flex align-items-center justify-content-between py-4 border-bottom border-gray-400"
      >
        <div class="d-flex">
          <a href="#" @click.prevent="routerPushProduct(item.product_id)">
            <img
              class="img-full me-4"
              style="width: 90px; height: 120px"
              :src="item.product.imagesUrl[0]"
              :alt="item.product.title"
            />
          </a>
          <div class="d-flex flex-column justify-content-between">
            <div>
              <h3 class="fs-5 mb-2">
                <a
                  href="#"
                  @click.prevent="routerPushProduct(item.product_id)"
                  class="text-gray-800"
                  >{{ item.product.title }}</a
                >
              </h3>
              <RouterLink to="/products" class="text-gray-800">
              {{ item.product.author }}</RouterLink>
            </div>
            <div class="d-flex align-items-center">
              <p>NT {{ $filters.currency(item.product.price) }}</p>
              <span class="mx-1">×</span>
              <select
                name="productNum"
                style="width: 80px;"
                class="form-select rounded-0 border-gray-800 text-center py-1"
                :id="`${item.product.id}productNum`"
                v-model="item.qty"
                @change="updatedCart(item.id, item.product_id, item.qty)"
              >
                <option
                  :value="num"
                  v-for="num in availableNum(item)"
                  :key="`數量 ${num}`"
                  :selected="num == item.qty"
                >
                  {{ num }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <a href="#" @click.prevent="deleteCart(item.id)" class="btn icon-close border-0"></a>
      </li>
    </ul>
    <div
      class="offcanvas-footer d-flex justify-content-between
      align-items-center p-3 border-top border-black"
    >
      <p class="font-sans-tw d-flex align-items-center">
        總金額 <span class="fs-3 fw-medium ms-2">{{ $filters.currency(cartsData.total) }}</span>
      </p>
      <a
        href="#"
        @click.prevent="routerPush('/cart')"
        class="btn-custom-dark flex-inherit"
        :class="{
          'pe-none opacity-50': Object.prototype.hasOwnProperty.call(cartsData, 'carts')
            ? !cartsData.carts.length
            : false
        }"
        >前往結帳</a
      >
    </div>
  </div>

  <DeleteModal ref="deleteModal" :deleteData="`Cart`" />
</template>
