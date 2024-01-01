<script>
import { mapState, mapActions } from 'pinia';
import orderStore from '@/stores/orderStore';

export default {
  data() {
    return {
      email: '',
    };
  },
  methods: {
    ...mapActions(orderStore, ['getOrders', 'searchOrder']),
    onSubmit(values, { resetForm }) {
      this.searchOrder(this.email);
      resetForm();
    },
  },
  computed: {
    ...mapState(orderStore, ['orders', 'isLoading']),
  },
  created() {
    this.getOrders();
  },
};
</script>

<template>
  <div class="d-flex align-items-center overflow-hidden">
    <div class="container pt-10 pt-lg-12">
      <div class="font-serif-en text-center mb-4 mb-lg-10 position-relative">
        <h2 class="fs-display-7 fs-md-display-5 fs-lg-display-3 fs-xl-display-1">Check Order</h2>
        <img
          class="position-absolute top-50 start-50 translate-middle z-minus-1"
          src="@/assets/images/decoration-halo.svg"
          alt="decoration-halo"
        />
      </div>
      <div class="row justify-content-center font-sans-tw">
        <div class="col-11 col-lg-6">
          <v-form @submit="onSubmit" v-slot="{ errors }">
            <div class="form-floating position-relative mb-12" :class="{ error: errors['信箱'] }">
              <v-field
                v-model="email"
                type="email"
                name="信箱"
                id="email"
                class="form-control bg-transparent rounded-0 pe-10"
                placeholder="email"
                rules="email|required"
              ></v-field>
              <label for="email">電子信箱</label>
              <span class="error-bg position-absolute z-minus-1"></span>
              <button
                type="submit"
                class="btn border-0 position-absolute bottom-0 end-0 p-1 btn-custom-hover-scale-sm"
              >
                <img src="@/assets/images/icon-send.svg" alt="送出" />
              </button>
              <error-message
                name="信箱"
                class="error-text position-absolute fs-6 text-danger ps-3 mb-1"
              ></error-message>
            </div>
          </v-form>
          <ul class="fs-normal-1 fw-300">
            <li>尚未付款的訂單請於訂購完成後三天內付款。</li>
            <li>如購買過程及收到商品有任何問題，歡迎聯繫我們， 我們會盡快回覆您。</li>
            <li>
              在商品庫存充足下，我們允諾付款完成三天內會出貨，如您所訂購的商品庫存不足，我們將盡快以電子郵件通知您。
            </li>
            <li>目前無提供海外服務</li>
          </ul>
        </div>
      </div>
    </div>
    <LoadingOverlay :active="isLoading" />
  </div>
</template>
