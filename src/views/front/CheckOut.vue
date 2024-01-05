<script>
import { mapState, mapActions } from 'pinia';
import cartStore from '@/stores/cartStore';
import productsStore from '@/stores/productsStore';

export default {
  data() {
    return {
      orderData: {
        user: {
          name: '',
          tel: '',
          email: '',
          takeout: '',
          address: '',
          pay: '',
          bill: '',
        },
        fare: 0,
        message: '',
      },
      tempCouponCode: '',
      tempAddress: '',
    };
  },
  watch: {
    'orderData.user.takeout': 'judgeTakeout',
    cartsData: 'nothingInCart',
  },
  methods: {
    ...mapActions(cartStore, [
      'nothingInCart',
      'getCart',
      'updatedCart',
      'deleteCart',
      'nextStep',
      'prevStep',
      'changeStep',
      'payOrder',
      'laterPay',
      'orderCart',
      'useCoupon',
    ]),
    ...mapActions(productsStore, ['routerPush']),
    availableNum(item) {
      const { totalNum, soldNum } = item.product;
      return totalNum - soldNum;
    },
    sendCoupon() {
      this.useCoupon(this.tempCouponCode);
      this.tempCouponCode = '';
    },
    judgeTakeout() {
      const { takeout } = this.orderData.user;
      if (takeout !== '宅配') {
        this.tempAddress = takeout;
      }
    },
    sendOrderData() {
      if (this.orderData.user.address === '') {
        this.orderData.user.address = this.tempAddress;
      }

      this.nextStep();
    },
    completeCart() {
      let step = '';
      if (this.orderData.user.pay === '信用卡') {
        step = 'pay';
      } else {
        step = 'final';
      }

      this.orderCart(this.orderData, step);
    },
  },
  computed: {
    ...mapState(cartStore, [
      'cartsData',
      'orderId',
      'discountPrice',
      'step',
      'isPaid',
      'couponData',
      'couponCode',
      'isLoading',
    ]),
  },
  created() {
    this.getCart();
  },
};
</script>

<template>
  <div class="overflow-hidden">
    <div class="container pt-2 pt-lg-8">
      <div class="d-flex align-items-center justify-content-between mb-2 mb-md-6 mb-lg-10">
        <ul
          class="list-unstyled cartNav d-flex align-items-center font-sans-tw"
          :class="{
            step1: step === 1,
            step2: step === 2,
            pay: step === 'pay',
            final: step === 'final'
          }"
        >
          <li class="cartNav-item d-none d-lg-block">
            <a
              @click.prevent="changeStep('cart')"
              class="link-black d-flex align-items-end"
              :class="{ 'cursor-pointer': step <= 2 || step > 0 }"
            >
              <h2 class="font-serif-en">Cart</h2>
            </a>
          </li>
          <li class="cartNav-item cartNav-sm-item">
            <a
              class="link-black d-flex align-items-end"
              :class="{ 'cursor-pointer': step <= 2 || step > 0 }"
              @click.prevent="changeStep(1)"
            >
              <h3>填寫資料</h3>
              <p>1</p>
            </a>
          </li>
          <li class="cartNav-item">
            <h3>確認訂單</h3>
          </li>
          <li class="cartNav-item" v-if="this.orderData.user.pay === '信用卡'">
            <h3>結帳</h3>
          </li>
          <li class="cartNav-item">
            <h3>完成訂單</h3>
          </li>
        </ul>
        <div class="d-none d-lg-block">
          <a v-if="step <= 2" @click.prevent="prevStep" class="d btn-custom-light cursor-pointer"
            >上一步</a
          >
        </div>
      </div>
      <div class="row font-sans-tw gx-md-4 gx-lg-10">
        <!-- 填寫資料 -->
        <div class="col-12 col-md-8 mb-6 mb-md-0" v-if="step === 1">
          <VForm
            @submit="sendOrderData"
            id="cartForm"
            class="row gx-lg-10 gy-6 gy-lg-10"
            v-slot="{ errors }"
          >
            <div class="col-12 col-lg-6 d-flex align-items-center">
              <label for="name" class="form-label me-4 mb-0 fs-6 fs-lg-5">
                姓名<span class="font-sans-tw fs-3 text-danger">*</span>
                </label>
              <div class="flex-fit normalInput" :class="{ error: errors['姓名'] }">
                <VField
                  type="text"
                  id="name"
                  name="姓名"
                  rules="required"
                  class="form-control py-2 py-lg-3 rounded-3 shadow-xs"
                  v-model="orderData.user.name"
                ></VField>
                <ErrorMessage
                  name="姓名"
                  class="error-text position-absolute fs-normal-1 fs-lg-6 text-danger mt-lg-1"
                ></ErrorMessage>
              </div>
            </div>
            <div class="col-12 col-lg-6 d-flex align-items-center">
              <label for="tel" class="form-label me-4 mb-0 fs-6 fs-md-5">
                電話<span class="font-sans-tw fs-3 text-danger">*</span>
              </label>
              <div class="flex-fit normalInput" :class="{ error: errors['電話'] }">
                <VField
                  type="tel"
                  id="tel"
                  name="電話"
                  rules="required|length:10"
                  class="form-control flex-fit py-2 py-lg-3 rounded-3 shadow-xs"
                  v-model="orderData.user.tel"
                  placeholder="不含 - 符號的手機或室話"
                ></VField>
                <ErrorMessage
                  name="電話"
                  class="error-text position-absolute fs-normal-1 fs-lg-6 text-danger mt-lg-1"
                ></ErrorMessage>
              </div>
            </div>
            <div class="col-12 d-flex align-items-center">
              <label for="email" class="form-label me-4 mb-0 fs-6 fs-md-5">
                信箱<span class="font-sans-tw fs-3 text-danger">*</span>
              </label>
              <div class="flex-fit normalInput" :class="{ error: errors['信箱'] }">
                <VField
                  type="email"
                  id="email"
                  name="信箱"
                  rules="email|required"
                  class="form-control flex-fit py-2 py-lg-3 rounded-3 shadow-xs"
                  v-model="orderData.user.email"
                ></VField>
                <ErrorMessage
                  name="信箱"
                  class="error-text position-absolute fs-normal-1 fs-lg-6 text-danger mt-lg-1"
                ></ErrorMessage>
              </div>
            </div>
            <fieldset class="col-12 d-flex align-items-center">
              <legend class="form-label me-4 mb-0 fs-6 fs-md-5 w-auto">
                取貨<span class="font-sans-tw fs-3 text-danger">*</span>
              </legend>
              <div class="normalInput" :class="{ error: errors['取貨方式'] }">
                <div class="d-flex">
                  <div class="form-check form-radio p-0 me-2 me-md-3 me-lg-4">
                    <VField
                      class="form-check-input d-none"
                      type="radio"
                      name="取貨方式"
                      rules="required"
                      id="本店自取"
                      value="本店自取"
                      v-model="orderData.user.takeout"
                    ></VField>
                    <label
                      class="form-check-label py-2 py-lg-3
                      px-3 px-md-4 px-lg-6 rounded-pill shadow-xs"
                      for="本店自取"
                    >
                      本店自取
                    </label>
                  </div>
                  <div class="form-check form-radio p-0 me-2 me-md-3 me-lg-4">
                    <VField
                      class="form-check-input d-none"
                      type="radio"
                      name="取貨方式"
                      rules="required"
                      id="宅配"
                      value="宅配"
                      v-model="orderData.user.takeout"
                    ></VField>
                    <label
                      class="form-check-label py-2 py-lg-3
                      px-3 px-md-4 px-lg-6 rounded-pill shadow-xs"
                      for="宅配"
                    >
                      宅配
                    </label>
                  </div>
                  <div class="form-check form-radio p-0">
                    <VField
                      class="form-check-input d-none"
                      type="radio"
                      name="取貨方式"
                      rules="required"
                      id="超商取貨"
                      value="超商取貨"
                      v-model="orderData.user.takeout"
                    ></VField>
                    <label
                      class="form-check-label py-2 py-lg-3
                      px-3 px-md-4 px-lg-6 rounded-pill shadow-xs"
                      for="超商取貨"
                    >
                      超商取貨
                    </label>
                  </div>
                </div>
                <ErrorMessage
                  name="取貨方式"
                  class="error-text position-absolute fs-normal-1 fs-lg-6 text-danger mt-lg-1"
                ></ErrorMessage>
              </div>
            </fieldset>
            <div class="col-12 d-flex align-items-center" v-if="orderData.user.takeout === '宅配'">
              <label for="address" class="form-label me-4 mb-0 fs-6 fs-md-5">地址</label>
              <div class="flex-fit normalInput" :class="{ error: errors['地址'] }">
                <VField
                  type="text"
                  id="address"
                  name="地址"
                  class="form-control flex-fit py-2 py-lg-3 rounded-3 shadow-xs"
                  rules="required"
                  v-model="orderData.user.address"
                ></VField>
                <ErrorMessage
                  name="地址"
                  class="error-text position-absolute fs-normal-1 fs-lg-6 text-danger mt-lg-1"
                ></ErrorMessage>
              </div>
            </div>
            <fieldset class="col-12 d-flex align-items-center">
              <legend class="form-label me-4 mb-0 fs-6 fs-md-5 w-auto">
                付款<span class="font-sans-tw fs-3 text-danger">*</span>
              </legend>
              <div class="normalInput" :class="{ error: errors['付款方式'] }">
                <div class="d-flex">
                  <div class="form-check form-radio p-0 me-2 me-md-3 me-lg-4">
                    <VField
                      class="form-check-input d-none"
                      type="radio"
                      name="付款方式"
                      rules="required"
                      id="ATM 匯款"
                      value="ATM 匯款"
                      v-model="orderData.user.pay"
                    ></VField>
                    <label
                      class="form-check-label py-2 py-lg-3
                      px-2 px-md-4 px-lg-6 rounded-pill shadow-xs"
                      for="ATM 匯款"
                    >
                      ATM 匯款
                    </label>
                  </div>
                  <div class="form-check form-radio p-0 me-2 me-md-3 me-lg-4">
                    <VField
                      class="form-check-input d-none"
                      type="radio"
                      name="付款方式"
                      rules="required"
                      id="信用卡"
                      value="信用卡"
                      v-model="orderData.user.pay"
                    ></VField>
                    <label
                      class="form-check-label py-2 py-lg-3
                      px-3 px-md-4 px-lg-6 rounded-pill shadow-xs"
                      for="信用卡"
                    >
                      信用卡
                    </label>
                  </div>
                  <div class="form-check form-radio p-0">
                    <VField
                      class="form-check-input d-none"
                      type="radio"
                      name="付款方式"
                      rules="required"
                      id="貨到付款"
                      value="貨到付款"
                      v-model="orderData.user.pay"
                    ></VField>
                    <label
                      class="form-check-label py-2 py-lg-3
                      px-2 px-md-4 px-lg-6 rounded-pill shadow-xs"
                      for="貨到付款"
                    >
                      貨到付款
                    </label>
                  </div>
                </div>
                <ErrorMessage
                  name="付款方式"
                  class="error-text position-absolute fs-normal-1 fs-lg-6 text-danger mt-lg-1"
                ></ErrorMessage>
              </div>
            </fieldset>
            <fieldset class="col-12 d-flex align-items-center mb-2">
              <legend class="form-label me-4 mb-0 fs-6 fs-md-5 w-auto">
                發票<span class="font-sans-tw fs-3 text-danger">*</span>
              </legend>
              <div class="normalInput flex-fit" :class="{ error: errors['發票類型'] }">
                <div class="d-flex flex-fit">
                  <div class="form-check form-radio p-0 me-2 me-md-3 me-lg-4">
                    <VField
                      class="form-check-input d-none"
                      type="radio"
                      name="發票類型"
                      id="紙本發票"
                      value="紙本發票"
                      rules="required"
                      v-model="orderData.user.bill"
                    ></VField>
                    <label
                      class="form-check-label py-2 py-lg-3
                      px-3 px-md-4 px-lg-6 rounded-pill shadow-xs"
                      for="紙本發票"
                    >
                      紙本發票
                    </label>
                  </div>
                  <div class="form-check form-radio p-0 me-2 me-md-3 me-lg-4">
                    <VField
                      class="form-check-input d-none"
                      type="radio"
                      name="發票類型"
                      id="電子載具"
                      value="電子載具"
                      rules="required"
                      v-model="orderData.user.bill"
                    ></VField>
                    <label
                      class="form-check-label py-2 py-lg-3
                      px-3 px-md-4 px-lg-6 rounded-pill shadow-xs"
                      for="電子載具"
                    >
                      電子載具
                    </label>
                  </div>
                  <div
                  class="flex-fit normalInput d-none d-lg-block"
                  :class="{ error: errors['電子載具'] }">
                    <div v-if="orderData.user.bill === '電子載具'">
                      <VField
                        type="text"
                        name="電子載具"
                        class="form-control w-100 py-2 py-lg-3 rounded-3 shadow-xs"
                        placeholder="請輸入  '/'  開頭的載具號碼"
                        rules="required"
                        v-model="orderData.user.billNum"
                      ></VField>
                    </div>
                    <ErrorMessage
                      name="電子載具"
                      class="error-text position-absolute fs-normal-1 fs-lg-6 text-danger mt-lg-1"
                    ></ErrorMessage>
                  </div>
                </div>
                <div class="normalInput d-lg-none" :class="{ error: errors['電子載具'] }">
                    <div class="mt-2" v-if="orderData.user.bill === '電子載具'">
                      <VField
                        type="text"
                        name="電子載具"
                        class="form-control w-100 py-2 py-lg-3 rounded-3 shadow-xs"
                        placeholder="請輸入  '/'  開頭的載具號碼"
                        rules="required"
                        v-model="orderData.user.billNum"
                      ></VField>
                    </div>
                    <ErrorMessage
                      name="電子載具"
                      class="error-text position-absolute fs-normal-1 fs-lg-6 text-danger mt-lg-1"
                    ></ErrorMessage>
                  </div>
                <ErrorMessage
                  name="發票類型"
                  class="error-text position-absolute fs-normal-1 fs-lg-6 text-danger mt-lg-1"
                ></ErrorMessage>
              </div>
            </fieldset>
            <div class="d-flex">
              <label for="memo" class="form-label me-4 mb-0 fs-6 fs-md-5">備註</label>
              <textarea
                class="form-control flex-fit py-2 py-lg-3 rounded-3 shadow-xs"
                id="memo"
                rows="3"
                v-model="orderData.message"
              ></textarea>
            </div>
          </VForm>
        </div>

        <!-- 確認訂單 -->
        <div class="col-12 col-md-8 mb-6 mb-md-0" v-if="step === 2">
          <div class="mb-6">
            <h3
              class="fs-5 fw-normal text-primary-700 bg-white
              d-inline-block py-2 px-4 rounded-top-3"
            >
              購物明細
            </h3>
            <div class="bg-white px-3 pt-3 pb-1">
              <div class="table-responsive">
                <table class="checkout-table table align-middle">
                  <thead>
                    <tr>
                      <th class="fs-normal-1 text-gray-500 fw-light border-bottom-0 pb-0">品名</th>
                      <th
                        class="fs-normal-1 text-gray-500 fw-light
                        text-center text-md-end border-bottom-0 pb-0"
                      >
                        單價
                      </th>
                      <th
                        class="fs-normal-1 text-gray-500 fw-light
                        text-center text-md-end border-bottom-0 pb-0"
                      >
                        數量
                      </th>
                      <th
                        class="fs-normal-1 text-gray-500 fw-light
                        text-center text-md-end border-bottom-0 pb-0"
                      >
                        總額
                      </th>
                    </tr>
                  </thead>
                  <tbody class="fw-light">
                    <tr v-for="item in cartsData.carts" :key="`確認訂單${item.product.title}`">
                      <td>{{ item.product.title }}</td>
                      <td class="text-end">NT$ {{ $filters.currency(item.product.price) }}</td>
                      <td class="text-center text-md-end">{{ item.qty }}</td>
                      <td class="text-end">NT$ {{ $filters.currency(item.total) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div>
            <h3
              class="fs-5 fw-normal text-primary-700 bg-white
              d-inline-block py-2 px-4 rounded-top-3"
            >
              寄送資訊
            </h3>
            <div class="container">
              <div class="fw-light row bg-white py-3 px-3">
                <div class="col-12 col-md-6 py-4 d-flex border-bottom border-gray-400">
                  <p class="me-6 text-gray-500">姓名</p>
                  <p class="flex-grow-1">{{ orderData.user.name }}</p>
                </div>
                <div class="col-12 col-md-6 py-4 d-flex border-bottom border-gray-400">
                  <p class="me-6 text-gray-500">電話</p>
                  <p class="flex-grow-1">{{ orderData.user.tel }}</p>
                </div>
                <div class="col-12 py-4 d-flex border-bottom border-gray-400">
                  <p class="me-6 text-gray-500">信箱</p>
                  <p class="flex-grow-1">{{ orderData.user.email }}</p>
                </div>
                <div class="col-12 col-md-6 py-4 d-flex border-bottom border-gray-400">
                  <p class="me-6 text-gray-500">取貨</p>
                  <p class="flex-grow-1">{{ orderData.user.takeout }}</p>
                </div>
                <div class="col-12 col-md-6 py-4 d-flex border-bottom border-gray-400">
                  <p class="me-6 text-gray-500">付款</p>
                  <p class="flex-grow-1">{{ orderData.user.pay }}</p>
                </div>
                <div
                  class="col-12 py-4 d-flex border-bottom border-gray-400"
                  v-if="orderData.user.takeout === '宅配'"
                >
                  <p class="me-6 text-gray-500">地址</p>
                  <p class="flex-grow-1">{{ orderData.user.address }}</p>
                </div>
                <div class="col-12 py-4 d-flex border-bottom border-gray-400">
                  <p class="me-6 text-gray-500">發票</p>
                  <p class="flex-grow-1">
                    {{ orderData.user.bill }}
                    <span v-if="orderData.user.bill === '電子載具'">{{
                      orderData.user.billNum
                    }}</span>
                  </p>
                </div>
                <div class="col-12 py-4 d-flex">
                  <p class="me-6 text-gray-500">備註</p>
                  <p class="flex-grow-1">{{ orderData.message }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- side -->
        <div class="col-12 col-md-4" v-if="step <= 2">
          <div class="card border-gray-800">
            <div class="card-header bg-gray-800">
              <h4 class="text-center text-white fs-5 fs-lg-4 fw-normal">總計</h4>
            </div>
            <div class="card-body fw-light">
              <ul class="list-unstyled fs-6 fs-lg-5 border-bottom border-gray-400 mb-0">
                <li class="d-flex align-items-center justify-content-between mb-4">
                  <h5 class="fs-6 fs-lg-5 fw-light">商品總數</h5>
                  <p>{{ cartsData.totalNum }} 項</p>
                </li>
                <li class="d-flex align-items-center justify-content-between mb-4">
                  <h5 class="fs-6 fs-lg-5 fw-light">小計</h5>
                  <p>NT$ {{ $filters.currency(cartsData.total) }}</p>
                </li>
                <li
                  v-if="couponCode !== ''"
                  class="d-flex align-items-center justify-content-between
                  mb-4 text-primary-700 fw-normal"
                >
                  <h5 class="fs-6 fs-lg-5">折價券</h5>
                  <p>-NT$ {{ $filters.currency(discountPrice) }}</p>
                </li>
              </ul>
              <h4 class="fs-3 fs-lg-2 fw-light text-center pt-4 pb-2 pt-lg-5 pb-lg-3">
                NT$ {{ $filters.currency(Math.floor(Math.floor(cartsData.final_total))) }}
              </h4>
            </div>
            <button
              type="button"
              v-if="step === 2"
              @click="completeCart"
              class="fs-5 fs-lg-4 btn btn-primary-400 fw-light rounded-0 rounded-bottom py-3"
            >
              {{ this.orderData.user.pay === '信用卡' ? '前往付款' : '完成訂單' }}
            </button>
            <button
              type="submit"
              form="cartForm"
              v-else
              class="fs-5 fs-lg-4 btn btn-primary-400 fw-light rounded-0 rounded-bottom py-3"
            >
              下一步
            </button>
          </div>
        </div>

        <!-- 前往結帳 -->
        <div class="d-flex flex-column" v-if="step === 'pay'">
          <div class="text-center">
            <a @click.prevent="payOrder" class="btn-custom-light me-3 cursor-pointer">結帳</a>
            <a @click.prevent="laterPay" class="btn-custom-dark me-3 cursor-pointer">稍後付款</a>
          </div>
        </div>

        <!-- 感謝購買 -->
        <div class="d-flex flex-column mt-6 mt-md-0 text-center" v-if="step === 'final'">
          <div class="font-serif-en mb-6 mb-md-10 position-relative">
            <h2 class="checkout-final-title fs-display-7 fs-lg-display-1">Thank you</h2>
            <img
              class="position-absolute top-50 start-50 translate-middle z-minus-1"
              src="@/assets/images/decoration-halo.svg"
              alt="decoration-halo"
            />
          </div>
          <div class="font-sans-tw fw-light fs-6 fs-md-4 mb-12">
            <p>感謝您的購買，<br class="d-md-none" />您可以透過 Email 查詢訂單。</p>
            <p class="mt-4" v-if="orderData.user.pay === '信用卡' && !isPaid">
              尚未結帳的訂單，請於隔日 23:59 前付款完成，超過時限將取消訂單。
            </p>
            <p class="mt-4 lh-base" v-if="orderData.user.pay === 'ATM 匯款'">
              請匯款至 (013) 0000-0000-0000-0000，匯款完成請來信告知時間與後五碼，<br
                class="d-none d-md-block"
              />
              尚未結帳的訂單，請於隔日 23:59 前付款完成，超過時限將取消訂單。
            </p>
          </div>
          <div class="text-center">
            <RouterLink to="/order" class="btn-custom-light me-3">查詢訂單</RouterLink>
            <RouterLink to="/products" class="btn-custom-dark me-3">再來逛逛</RouterLink>
          </div>
        </div>
      </div>

      <LoadingOverlay :active="isLoading" />
    </div>
  </div>
</template>

<style lang="scss">
@import '@/assets/scss/vendors/bootstrap';

.cartNav {
  h2 {
    font-size: 24px;
    @include media-breakpoint-up(md) {
      font-size: 32px;
    }
  }

  h3 {
    margin-left: 28px;
    position: relative;
    font-size: 16px;
    font-weight: 300;
    color: #929292;

    @include media-breakpoint-up(md) {
      font-size: 20px;
      margin-left: 72px;
    }

    &::before {
      content: '';
      position: absolute;
      width: 16px;
      height: 1px;
      left: -24px;
      background-color: #929292;
      top: 50%;

      @include media-breakpoint-up(md) {
        width: 48px;
        left: -60px;
      }
    }
  }

  p {
    display: none;
  }

  &.step1 {
    .cartNav-item:nth-child(2) h3 {
      color: black;
      font-weight: normal;

      &::before {
        background-color: black;
      }
    }
  }

  &.step2 {
    .cartNav-item:nth-child(2) h3,
    .cartNav-item:nth-child(3) h3 {
      color: black;
      font-weight: normal;

      &::before {
        background-color: black;
      }
    }
  }

  &.pay {
    .cartNav-item:nth-child(2) h3,
    .cartNav-item:nth-child(3) h3,
    .cartNav-item:nth-child(4) h3 {
      color: black;
      font-weight: normal;

      &::before {
        background-color: black;
      }
    }
  }

  &.final {
    .cartNav-item h3 {
      color: black;
      font-weight: normal;

      &::before {
        background-color: black;
      }
    }
  }
}

.cartNav-sm-item {
  h3 {
    margin-left: 0;

    &::before {
      width: 0;
    }

    @include media-breakpoint-up(md) {
      margin-left: 72px;

      &::before {
        width: 48px;
      }
    }
  }
}

.form-radio {
  label {
    background-color: white;
    border: 2px solid transparent;
    cursor: pointer;
  }

  input[type='radio']:checked + label {
    background-color: #ffe175;
    border: 2px solid white;
  }
}

.checkout {
  &-table.table {
    width: max-content;

    @include media-breakpoint-up(lg) {
      width: 100%;
    }
  }

  &-final-title {
    color: $gray-700;
    @include media-breakpoint-up(lg) {
      color: black;
      mix-blend-mode: overlay;
    }
  }
}
</style>
