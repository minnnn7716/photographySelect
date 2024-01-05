<script>
import { mapState, mapActions } from 'pinia';
import orderStore from '@/stores/orderStore';
import orderMixin from '@/mixins/orderMixin';

export default {
  data() {
    return {
      onClick: false,
      discountPrice: 0,
    };
  },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  mixins: [orderMixin],
  methods: {
    ...mapActions(orderStore, ['getUserOrders', 'payOrder', 'dueDate', 'isCancel']),
    changStatus(index) {
      this.onClick = this.onClick === index ? false : index;
      this.calcDiscountPrice();
    },
    calcDiscountPrice() {
      let result = 0;

      if (this.onClick !== false) {
        if (this.products.length) {
          const total = this.products.map((item) => item.total).reduce((a, b) => a + b);
          result = total - Math.floor(this.userOrders[this.onClick].total);
        }
      }

      this.discountPrice = result;
    },
  },
  computed: {
    ...mapState(orderStore, ['userOrders', 'isLoading']),
    products() {
      const ary = [];

      if (this.onClick === false) {
        return ary;
      }

      const keyAry = Object.keys(this.userOrders[this.onClick].products);

      keyAry.forEach((item) => {
        ary.push(this.userOrders[this.onClick].products[item]);
      });

      return ary;
    },
  },
  created() {
    this.getUserOrders(this.id);
  },
};
</script>

<template>
  <div class="container pt-2 pt-md-8 order">
    <div class="d-flex justify-content-between align-items-center mb-8 mb-md-12">
      <div class="d-flex flex-column flex-md-row align-items-md-center">
        <h2 class="fs-2 fs-md-1 font-serif-en">Check Order</h2>
        <span
          style="width: 40px; height: 1px"
          class="d-none d-md-inline-block bg-gray-800 mx-3"
        ></span>
        <p class="fs-6 fs-md-4 font-sans-tw fw-light">
          {{ userOrders[0].user.name }}｜共 {{ userOrders.length }} 筆訂單
        </p>
      </div>
      <RouterLink to="/order" class="btn-custom-light me-0 me-lg-3 flex-inherit"
        >返回查詢</RouterLink
      >
    </div>
    <div class="table-responsive">
      <table
        class="table table-custom table-custom-hover align-middle
        font-sans-tw fs-6 fs-lg-5 mb-6 mb-lg-12"
      >
        <thead v-if="onClick !== 0">
          <tr>
            <th scope="col" class="fw-normal d-none d-lg-table-cell">訂單編號</th>
            <th scope="col" class="fw-normal text-center text-lg-start">訂購日期</th>
            <th scope="col" class="fw-normal text-center text-lg-start">總金額</th>
            <th scope="col" class="fw-normal text-center text-lg-start">
              付款<span class="d-none d-lg-inline">狀態</span>
            </th>
            <th scope="col" class="fw-normal"><span class="d-none">展開訂單</span></th>
          </tr>
        </thead>
        <tbody
          class="fs-normal-1 fs-lg-5"
          @click="changStatus(index)"
          v-for="(item, index) in userOrders"
          :key="`userOrder ${item.id}`"
        >
          <tr :class="{ 'table-custom-active': index === onClick }">
            <td scope="row" class="active-td d-none d-lg-table-cell">
              <p>#{{ index + 1 }} ｜ {{ item.id }}</p>
            </td>
            <td class="active-td text-center text-lg-start">
              <p>{{ $filters.date(item.create_at) }}</p>
            </td>
            <td class="active-td text-center text-lg-start">
              <p>NT$ {{ $filters.currency(item.total) }}</p>
            </td>
            <td class="active-td text-center text-lg-start">
              <p>
                <span v-if="item.is_paid">已付款</span>
                <span v-if="isCancel(item.create_at)" class="text-gray-700">已取消</span>
                <span
                  v-if="!item.is_paid && !isCancel(item.create_at)"
                  class="text-danger fw-medium"
                  >未付款</span
                >
              </p>
            </td>
            <td class="active-td text-end">
              <button type="button" class="btn p-2 border-0">
                <div class="icon-plus"></div>
              </button>
            </td>
          </tr>
          <tr v-if="index === onClick" class="table-custom-activeList bg-white">
            <td colspan="5">
              <div>
                <div
                  v-if="!item.is_paid"
                  class="d-flex ps-lg-2 align-items-center
                  justify-content-between justify-content-lg-start my-4"
                >
                  <p class="text-danger fw-medium">
                    尚未付款｜<br class="d-lg-none" />期限至
                    {{ `${dueDate(item.create_at).toLocaleDateString()} 23:59` }}
                  </p>
                  <button
                    type="button"
                    class="btn btn-danger fs-normal-1 fs-lg-6 py-1 ms-2"
                    v-if="!item.is_paid"
                    @click="payOrder(item.id, id)"
                  >
                    前往付款
                  </button>
                </div>

                <div class="d-flex d-lg-none justify-content-between align-items-center mt-2 mb-8">
                  <h3 class="fs-5 fw-normal ps-0 ps-lg-2">訂單編號</h3>
                  <p>{{ item.id }}</p>
                </div>
                <h3 class="fs-5 fw-normal ps-0 ps-lg-2">訂單明細</h3>
                <table class="table align-middle table-responsive">
                  <thead>
                    <tr>
                      <th class="fs-normal-1 text-gray-500 fw-light border-bottom-0 pb-0">品名</th>
                      <th class="fs-normal-1 text-gray-500 fw-light text-end border-bottom-0 pb-0">
                        單價
                      </th>
                      <th class="fs-normal-1 text-gray-500 fw-light text-end border-bottom-0 pb-0">
                        數量
                      </th>
                      <th class="fs-normal-1 text-gray-500 fw-light text-end border-bottom-0 pb-0">
                        總額
                      </th>
                    </tr>
                  </thead>
                  <tbody class="fw-light">
                    <tr v-for="innerItem in products" :key="`product ${innerItem}`">
                      <td>{{ innerItem.product.title }}</td>
                      <td class="text-end">NT$ {{ $filters.currency(innerItem.product.price) }}</td>
                      <td class="text-end">{{ innerItem.qty }}</td>
                      <td class="text-end">NT$ {{ $filters.currency(innerItem.total) }}</td>
                    </tr>
                  </tbody>
                  <tfoot class="text-end">
                    <tr>
                      <td colspan="3" class="border-bottom-0">運費</td>
                      <td class="border-bottom-0">NT$ 60</td>
                    </tr>
                    <tr v-if="coupon.title !== ''">
                      <td colspan="3" class="border-bottom-0">
                        折價卷
                        <p class="fs-normal-1 text-gray">{{ coupon.title }}</p>
                      </td>
                      <td class="border-bottom-0">- NT$ {{ $filters.currency(discountPrice) }}</td>
                    </tr>
                    <tr>
                      <td colspan="4" class="fs-5 border-bottom-0">
                        NT$ <span class="fs-3">{{ $filters.currency(item.total) }}</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <h3 class="fs-5 fw-normal ps-0 ps-lg-2">寄送資訊</h3>
              <div class="container">
                <div class="fw-light row">
                  <div class="col-6 py-4 d-flex border-bottom border-gray-400">
                    <p class="me-6 text-gray-500">姓名</p>
                    <p class="flex-grow-1">{{ item.user.name }}</p>
                  </div>
                  <div class="col-6 py-4 d-flex border-bottom border-gray-400">
                    <p class="me-6 text-gray-500">電話</p>
                    <p class="flex-grow-1">{{ item.user.tel }}</p>
                  </div>
                  <div class="col-12 py-4 d-flex border-bottom border-gray-400">
                    <p class="me-6 text-gray-500">信箱</p>
                    <p class="flex-grow-1">{{ item.user.email }}</p>
                  </div>
                  <div class="col-6 py-4 d-flex border-bottom border-gray-400">
                    <p class="me-6 text-gray-500">取貨</p>
                    <p class="flex-grow-1">{{ item.user.takeout }}</p>
                  </div>
                  <div class="col-6 py-4 d-flex border-bottom border-gray-400">
                    <p class="me-6 text-gray-500">付款</p>
                    <p class="flex-grow-1">
                      {{ item.user.pay }}
                    </p>
                  </div>
                  <div class="col-12 py-4 d-flex border-bottom border-gray-400">
                    <p class="me-6 text-gray-500">地址</p>
                    <p class="flex-grow-1">{{ item.user.address }}</p>
                  </div>
                  <div class="col-12 py-4 d-flex border-bottom border-gray-400">
                    <p class="me-6 text-gray-500">發票</p>
                    <p class="flex-grow-1">
                      {{ item.user.bill }}
                      <span v-if="item.user.bill === '電子載具'">{{ item.user.billNum }}</span>
                    </p>
                  </div>
                  <div class="col-12 py-4 d-flex">
                    <p class="me-6 text-gray-500">備註</p>
                    <p class="flex-grow-1">{{ item.message }}</p>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <LoadingOverlay :active="isLoading" />
  </div>
</template>

<style lang="scss">
@import '@/assets/scss/vendors/bootstrap';

.table-custom-hover > tbody > tr:not(.table-custom-active):not(.table-custom-activeList):hover > * {
  --bs-table-bg-state: var(--bs-table-hover-bg);
}

.table-custom-active {
  .active-td {
    position: relative;
    vertical-align: bottom;
    padding-top: 28px;
    padding-left: 0;
    padding-bottom: 0;
    border-bottom: 0;

    @include media-breakpoint-up(lg) {
      padding-top: 32px;
    }

    &:not(:last-child) {
      color: #c89000;
    }

    &:not(:last-child)::after {
      position: absolute;
      top: 12px;
      left: 4px;
      font-size: 14px;
      color: #7d7d7d;
      transition: all ease 0.3s;

      @include media-breakpoint-up(lg) {
        left: 8px;
      }
    }

    &:first-child {
      &::after {
        content: '訂單編號';
      }
    }

    &:nth-child(2) {
      width: 100px;
      @include media-breakpoint-up(md) {
        width: auto;
      }
      &::after {
        content: '訂購日期';
      }
    }

    &:nth-child(3) {
      &::after {
        content: '總金額';
      }
    }

    &:nth-child(4) {
      width: 70px;
      &::after {
        content: '付款';
      }

      @include media-breakpoint-up(md) {
        width: auto;
        &::after {
          content: '付款狀態';
        }
      }
    }

    &:nth-child(5) {
      width: 50px;
      @include media-breakpoint-up(md) {
        width: auto;
      }
    }
  }

  p {
    background: white;
    border-radius: 16px 16px 0 0;
    padding: 6px 0 6px 0;
    transition: all ease 0.3s;
    text-align: center;

    @include media-breakpoint-up(lg) {
      padding: 8px 0 8px 12px;
      text-align: left;
    }
  }
}
</style>
