<script>
import { mapState, mapActions } from 'pinia';
import adminOrderStore from '@/stores/adminOrderStore';
import orderStore from '@/stores/orderStore';
import DeleteModal from '@/components/admin/DeleteModal.vue';
import OrderModal from '@/components/admin/OrderModal.vue';

export default {
  data() {
    return {
      tempOrder: {},
      tempDelOrder: {},
      source: 'Order',
    };
  },
  components: {
    DeleteModal,
    OrderModal,
  },
  methods: {
    ...mapActions(adminOrderStore, ['getOrders', 'deleteOrder']),
    ...mapActions(orderStore, ['dueDate', 'isCancel']),
    openModal(modal, item) {
      if (modal === 'deleteModal') {
        this.tempDelOrder = {
          id: item.id,
          source: this.source,
        };
      } else {
        this.tempOrder = { ...item };
      }

      this.$refs[modal].showModal();
    },
  },
  computed: {
    ...mapState(adminOrderStore, ['orders', 'orderTotalPrice', 'orderNum', 'isLoading']),
  },
  created() {
    this.getOrders();
  },
};
</script>

<template>
  <div>
    <div class="container-fluid">
      <div class="row justify-content-center pt-6 pt-lg-10">
        <div class="col-12 col-lg-11">
          <header
            class="d-flex flex-column flex-lg-row
            justify-content-between align-items-lg-center mb-6 mb-lg-10"
          >
            <h3 class="fs-3 fw-normal mb-4 mb-lg-0">顧客訂單</h3>
            <div class="d-flex align-items-center">
              <p>總金額 NT$ {{ $filters.currency(orderTotalPrice) }}</p>
              <span class="mx-2">｜</span>
              <p>總筆數 {{ $filters.currency(orderNum) }} 筆</p>
            </div>
          </header>
          <section>
            <div class="table-responsive">
              <table class="admin-table table table-hover align-middle font-sans-tw mb-12">
                <thead>
                  <tr class="fs-normal-1">
                    <th scope="col" class="d-lg-none p-0" style="width: 50px">
                      <span class="d-none">操作按鈕</span>
                    </th>
                    <th scope="col" class="fw-normal text-gray">訂購日期</th>
                    <th scope="col" class="fw-normal text-center text-gray">訂單編號</th>
                    <th scope="col" class="fw-normal text-center text-gray">訂購人</th>
                    <th scope="col" class="fw-normal text-center text-gray">總金額</th>
                    <th scope="col" class="fw-normal text-center text-gray">付款狀態</th>
                    <th scope="col" class="d-none d-lg-table-cell fw-normal w-15">
                      <span class="d-none">操作按鈕</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in orders" :key="`orders ${item.id}`">
                    <td class="d-lg-none px-0 py-1">
                      <button
                        type="button"
                        class="btn border-0 px-1"
                        @click="openModal('orderModal', item)"
                      >
                        <img src="@/assets/images/icon-search.svg" alt="查看" />
                      </button>
                      <button
                        type="button"
                        class="btn border-0 px-1"
                        @click="openModal('deleteModal', item)"
                      >
                        <img src="@/assets/images/icon-trashcan.svg" alt="刪除" />
                      </button>
                    </td>
                    <td>{{ $filters.date(item.create_at) }}</td>
                    <td class="text-center">{{ item.id }}</td>
                    <td class="text-center">
                      {{ Object.prototype.hasOwnProperty.call(item, 'user') ? item.user.name : '' }}
                    </td>
                    <td class="text-center">NT$ {{ $filters.currency(item.total) }}</td>
                    <td class="text-center fw-medium">
                      <span v-if="item.is_paid">已付款</span>
                      <span v-if="!item.is_paid && isCancel(item.create_at)" class="text-gray-500"
                        >已取消</span
                      >
                      <span v-if="!item.is_paid && !isCancel(item.create_at)" class="text-danger"
                        >未付款</span
                      >
                    </td>
                    <td class="text-end d-none d-lg-table-cell">
                      <button
                        type="button"
                        class="btn border-0 btn-custom-hover-scale"
                        @click="openModal('orderModal', item)"
                      >
                        <img src="@/assets/images/icon-search.svg" alt="查看" />
                      </button>
                      <button
                        type="button"
                        class="btn border-0 btn-custom-hover-scale"
                        @click="openModal('deleteModal', item)"
                      >
                        <img src="@/assets/images/icon-trashcan.svg" alt="刪除" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
    <LoadingOverlay :active="isLoading" />
    <OrderModal ref="orderModal" :order="tempOrder" />
    <DeleteModal ref="deleteModal" :deleteData="tempDelOrder" />
  </div>
</template>
