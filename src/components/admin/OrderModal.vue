<script>
import { mapActions } from 'pinia';
import orderStore from '@/stores/orderStore';
import modalMixin from '@/mixins/modalMixin';
import orderMixin from '@/mixins/orderMixin';

export default {
  data() {
    return {
      modal: '',
      tempOrder: {
        user: {},
      },
    };
  },
  props: {
    order: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  mixins: [modalMixin, orderMixin],
  watch: {
    order() {
      this.tempOrder = this.order;
    },
  },
  methods: {
    ...mapActions(orderStore, ['dueDate', 'isCancel']),
  },
  computed: {
    products() {
      if (this.tempOrder.products === undefined) {
        return {};
      }

      const keyAry = Object.keys(this.tempOrder.products);
      const productAry = [];

      keyAry.forEach((item) => {
        productAry.push(this.tempOrder.products[item]);
      });

      return productAry;
    },
    discountPrice() {
      let result = 0;

      if (this.products.length) {
        const total = this.products.map((item) => item.total).reduce((a, b) => a + b);
        result = total - Math.floor(this.tempOrder.total);
      }

      return result;
    },
  },
};
</script>

<template>
  <div class="modal fade" id="orderModal" tabindex="-1" ref="modal">
    <div class="modal-dialog modal-dialog-scrollable modal-xl modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-primary-400">
          <h2 class="modal-title fs-5" id="orderModal">訂單資訊</h2>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="container">
            <div class="mb-6 mb-lg-12">
              <div class="row">
                <div class="col-12 col-lg-6 py-4 d-flex border-bottom border-gray-400">
                  <p class="me-6 text-gray-500">編號</p>
                  <p class="flex-grow-1">{{ tempOrder.id }}</p>
                </div>
                <div class="col-12 col-lg-6 py-4 d-flex border-bottom border-gray-400">
                  <p class="me-6 text-gray-500">日期</p>
                  <p class="flex-grow-1">{{ $filters.date(tempOrder.create_at) }}</p>
                </div>
                <div class="col-12 col-lg-6 py-4 d-flex border-gray-400">
                  <p class="me-6 text-gray-500">總額</p>
                  <p class="flex-grow-1">NT$ {{ $filters.currency(tempOrder.total) }}</p>
                </div>
                <div class="col-12 col-lg-6 py-4 d-flex border-gray-400">
                  <p class="me-6 text-gray-500">狀態</p>
                  <div class="flex-grow-1">
                    <p v-if="tempOrder.is_paid">已付款</p>
                    <p
                      v-if="!tempOrder.is_paid && isCancel(tempOrder.create_at)"
                      class="text-gray-700"
                    >
                      已取消
                    </p>
                    <p
                      v-if="!tempOrder.is_paid && !isCancel(tempOrder.create_at)"
                      class="text-danger fw-medium"
                    >
                      未付款
                    </p>
                    <p v-if="!tempOrder.is_paid" class="text-danger fw-medium mt-1">
                      期限至 {{ `${dueDate(tempOrder.create_at).toLocaleDateString()} 23:59` }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="mb-6 mb-lg-12">
              <h3 class="fs-5 fw-medium">寄送資訊</h3>
              <div class="row">
                <div class="col-12 col-lg-6 py-4 d-flex border-bottom border-gray-400">
                  <p class="me-6 text-gray-500">姓名</p>
                  <p class="flex-grow-1">{{ tempOrder.user.name }}</p>
                </div>
                <div class="col-12 col-lg-6 py-4 d-flex border-bottom border-gray-400">
                  <p class="me-6 text-gray-500">電話</p>
                  <p class="flex-grow-1">{{ tempOrder.user.tel }}</p>
                </div>
                <div class="col-12 py-4 d-flex border-bottom border-gray-400">
                  <p class="me-6 text-gray-500">信箱</p>
                  <p class="flex-grow-1">{{ tempOrder.user.email }}</p>
                </div>
                <div class="col-12 col-lg-6 py-4 d-flex border-bottom border-gray-400">
                  <p class="me-6 text-gray-500">取貨</p>
                  <p class="flex-grow-1">{{ tempOrder.user.takeout }}</p>
                </div>
                <div class="col-12 col-lg-6 py-4 d-flex border-bottom border-gray-400">
                  <p class="me-6 text-gray-500">付款</p>
                  <p class="flex-grow-1">{{ tempOrder.user.pay }}</p>
                </div>
                <div class="col-12 py-4 d-flex border-bottom border-gray-400">
                  <p class="me-6 text-gray-500">地址</p>
                  <p class="flex-grow-1">{{ tempOrder.user.address }}</p>
                </div>
                <div class="col-12 py-4 d-flex border-bottom border-gray-400">
                  <p class="me-6 text-gray-500">發票</p>
                  <p class="flex-grow-1">
                    {{ tempOrder.user.bill }}
                    <span v-if="tempOrder.user.bill === '電子載具'">{{
                      tempOrder.user.billNum
                    }}</span>
                  </p>
                </div>
                <div class="col-12 py-4 d-flex">
                  <p class="me-6 text-gray-500">備註</p>
                  <p class="flex-grow-1">{{ tempOrder.message }}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 class="fs-5 fw-medium">訂單明細</h3>
              <div class="table-responsive">
                <table class="admin-table table align-middle">
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
                  <tbody>
                    <tr v-for="item in products" :key="`orderModal ${item.id}`">
                      <td>{{ item.product.title }}</td>
                      <td class="text-end">NT$ {{ $filters.currency(item.product.price) }}</td>
                      <td class="text-end">{{ item.qty }}</td>
                      <td class="text-end">NT$ {{ $filters.currency(item.total) }}</td>
                    </tr>
                  </tbody>
                  <tfoot class="text-end">
                    <tr v-if="coupon.title !== ''">
                      <td colspan="3" class="border-bottom-0">
                        折價卷
                        <p class="fs-normal-1 text-gray">{{ coupon.title }}</p>
                      </td>
                      <td class="border-bottom-0">- NT$ ${{ $filters.currency(discountPrice) }}</td>
                    </tr>
                    <tr>
                      <td colspan="4" class="fs-5 border-bottom-0">
                        NT$ <span class="fs-3">{{ $filters.currency(tempOrder.total) }}</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
