<script>
import { mapState, mapActions } from 'pinia';
import cartStore from '@/stores/cartStore';
import productsStore from '@/stores/productsStore';
import toastStore from '@/stores/toastStore';

export default {
  data() {
    return {
      tempCouponCode: '',
    };
  },
  watch: {
    cartsData: 'nothingInCart',
  },
  methods: {
    ...mapActions(cartStore, [
      'nothingInCart',
      'updatedCart',
      'deleteCart',
      'useCoupon',
      'nextStep',
    ]),
    ...mapActions(productsStore, ['routerPush']),
    ...mapActions(toastStore, ['pushMsg']),
    availableNum(item) {
      const { totalNum, soldNum } = item.product;
      return totalNum - soldNum;
    },
    sendCoupon() {
      this.useCoupon(this.tempCouponCode);
      this.tempCouponCode = '';
    },
    copyText() {
      const copyText = this.$refs.discount;
      navigator.clipboard.writeText(copyText.textContent);
      this.pushMsg({
        style: 'success',
        title: '已複製優惠碼',
      });
    },
  },
  computed: {
    ...mapState(cartStore, [
      'step',
      'cartsData',
      'discountPrice',
      'couponData',
      'couponCode',
      'isLoading',
    ]),
  },
};
</script>

<template>
  <div class="container pt-2 pt-lg-8">
    <div class="d-flex align-items-center justify-content-between mb-2 mb-md-6 mb-lg-10">
      <div class="d-flex align-items-end">
        <h2 class="font-serif-en fs-display-7 fs-md-display-6">Cart</h2>
        <p class="fw-light fs-5 fs-md-4 pb-3 ps-2">({{ cartsData.itemsNum }})</p>
      </div>
      <RouterLink to="/products" class="btn-custom-light d-none d-lg-inline-block"
        >返回購物</RouterLink
      >
    </div>
    <div class="row font-sans-tw gx-10">
      <!-- Cart -->
      <div class="col-12 col-lg-8 mb-6 mb-lg-0">
        <div class="row fs-6 fs-md-5 text-gray-800 fw-light d-none d-md-flex">
          <div class="col">商品</div>
          <div class="col-2 text-center">數量</div>
          <div class="col-2 text-center">總價</div>
          <div class="col-1"><span class="visually-hidden">刪除</span></div>
        </div>
        <div
          v-for="item in cartsData.carts"
          :key="`購物車 ${item.title}`"
          class="row align-items-md-center fs-6 fs-md-5
          text-gray-800 fw-light py-5 border-bottom border-black"
        >
          <div class="col-9 col-md d-flex">
            <a href="#" @click.prevent="routerPush(item.product_id)" class="cart-img me-4">
              <img class="img-full" :src="item.product.imagesUrl[0]" :alt="item.product.title" />
            </a>
            <div class="d-flex flex-column justify-content-between">
              <div>
                <h3 class="fs-6 fs-md-5 fw-light mb-2">
                  <a href="#" @click.prevent="routerPush(item.product_id)" class="text-gray-800">{{
                    item.product.title
                  }}</a>
                </h3>
                <RouterLink to="/products" class="text-gray-800">{{
                  item.product.author
                }}</RouterLink>
              </div>
              <div class="fs-normal-1 fs-md-6">
                <p>單價 NT {{ $filters.currency(item.product.price) }}</p>
                <p class="d-md-none">總價 NT {{ $filters.currency(item.total) }}</p>
              </div>
            </div>
          </div>
          <div
            class="col-3 col-md-2 d-flex flex-column
            align-items-end align-items-md-center justify-content-between justify-content-md-center"
          >
            <button
              type="button"
              class="d-md-none btn p-0 border-0"
              @click="deleteCart(item.id)"
            >
              <div class="icon-close"></div>
            </button>
            <label class="d-none" :for="`${item.product.id}productNum`">數量</label>
            <select
              class="cart-numSelect form-select rounded-0 border-gray-800 text-center"
              name="productNum"
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
          <div class="d-none d-md-flex col-2 d-flex align-items-center justify-content-center">
            NT$ {{ $filters.currency(item.total) }}
          </div>
          <div class="d-none d-md-flex col-1 d-flex align-items-center justify-content-center">
            <button type="button" class="btn p-2 border-0" @click="deleteCart(item.id)">
              <div class="icon-close"></div>
            </button>
          </div>
        </div>
      </div>

      <!-- side -->
      <div class="col-12 col-lg-4">
        <div class="card border-gray-800">
          <div class="card-header bg-gray-800">
            <h4 class="text-center text-white fs-5 fs-md-4 fw-normal">總計</h4>
          </div>
          <div class="card-body fw-light">
            <ul class="list-unstyled fs-6 fs-md-5 border-bottom border-gray-400 mb-0">
              <li class="d-flex align-items-center justify-content-between mb-4">
                <h5 class="fs-6 fs-md-5 fw-light">商品總數</h5>
                <p>{{ cartsData.totalNum }} 項</p>
              </li>
              <li class="d-flex align-items-center justify-content-between mb-4">
                <h5 class="fs-6 fs-md-5 fw-light">小計</h5>
                <p>NT$ {{ $filters.currency(cartsData.total) }}</p>
              </li>
              <li
                v-if="couponCode !== ''"
                class="d-flex align-items-center justify-content-between
                mb-4 text-primary-700 fw-normal"
              >
                <h5 class="fs-6 fs-md-5">折價券</h5>
                <p>-NT$ {{ $filters.currency(discountPrice) }}</p>
              </li>
            </ul>
            <div class="py-6 border-bottom border-gray-400">
              <div class="d-flex align-items-center mb-4">
                <p class="fw-normal">限時全品項 8 折</p>
                <div
                  class="d-flex rounded-pill overflow-hidden
                  border border-2 border-gray-900 mx-2">
                  <span
                    class="d-flex align-items-center bg-dark
                  text-white fs-normal-1 ps-3 pe-2 py-1"
                    ref="discount"
                  >
                    photo_2023
                  </span>
                  <button
                    type="button"
                    class="d-flex align-items-center ps-2 pe-3 py-1 border-0"
                    @click="copyText"
                  >
                    <img src="@/assets/images/icon-copy.svg" alt="複製">
                  </button>
                </div>
              </div>
              <div class="d-flex align-items-center mb-3">
                <label for="coupon" class="me-3 w-20">折價券</label>
                <div class="input-group flex-fit">
                  <input
                    id="coupon"
                    type="text"
                    class="form-control bg-gray-300 py-3"
                    placeholder="請輸入優惠碼"
                    v-model.trim="tempCouponCode"
                  />
                  <button
                    class="btn btn-gray-800 fw-light"
                    type="button"
                    @click.prevent="sendCoupon"
                    :disabled="tempCouponCode === ''"
                  >
                    送出
                  </button>
                </div>
              </div>
              <p v-if="couponCode !== ''" class="fw-medium text-primary-700">
                已使用折價券 {{ couponCode }}
              </p>
            </div>
            <h4 class="fs-3 fs-md-2 fw-light text-center pt-4 pb-2 pt-md-5 pb-md-3">
              NT$ {{ $filters.currency(Math.floor(Math.floor(cartsData.final_total))) }}
            </h4>
          </div>
          <a
            @click.prevent="nextStep('cart')"
            class="fs-5 fs-md-4 btn btn-primary-400 fw-light rounded-0 rounded-bottom py-3"
            :class="{
              'pe-none opacity-50': Object.prototype.hasOwnProperty.call(cartsData, 'carts')
                ? !cartsData.carts.length
                : false
            }"
          >
            下一步
          </a>
        </div>
      </div>
    </div>

    <LoadingOverlay :active="isLoading" />
  </div>
</template>

<style lang="scss">
@import '@/assets/scss/vendors/bootstrap';

.cart {
  &-img {
    width: 100px;
    height: 130px;

    @include media-breakpoint-up(md) {
      width: 120px;
      height: 150px;
    }
  }

  &-numSelect {
    width: 100%;

    @include media-breakpoint-up(md) {
      width: 75%;
      height: 100%;
    }
  }
}
</style>
