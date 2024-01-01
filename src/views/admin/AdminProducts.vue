<script>
import { mapState, mapActions } from 'pinia';
import adminProductStore from '@/stores/adminProductStore';
import ProductModal from '@/components/admin/ProductModal.vue';
import DeleteModal from '@/components/admin/DeleteModal.vue';

export default {
  data() {
    return {
      isNew: false,
      tempProduct: {},
      tempDelProduct: {},
      source: 'Product',
    };
  },
  components: {
    ProductModal,
    DeleteModal,
  },
  methods: {
    ...mapActions(adminProductStore, [
      'getProducts',
      'deleteProduct',
      'updateProduct',
      'switchEnable',
    ]),
    openModal(modal, isNew, item) {
      if (modal === 'deleteModal') {
        this.tempDelProduct = {
          id: item.id,
          title: item.title,
          source: this.source,
        };
      } else {
        if (isNew) {
          this.tempProduct = {
            totalNum: 1,
            soldNum: 0,
            rate: '0.0',
            rateNum: 0,
          };
        } else {
          this.tempProduct = { ...item };
        }
        this.isNew = isNew;
      }

      this.$refs[modal].showModal();
    },
  },
  computed: {
    ...mapState(adminProductStore, ['products', 'productsTotal', 'isLoading']),
  },
  created() {
    this.getProducts();
  },
};
</script>

<template>
  <div>
    <div class="container-fluid">
      <div class="row justify-content-center pt-6 pt-lg-10">
        <div class="col-12 col-lg-11">
          <header class="d-flex justify-content-between align-items-center mb-4 mb-lg-10">
            <h3 class="fs-3 fw-normal">
              商品列表 <span class="fs-6">({{ productsTotal }})</span>
            </h3>
            <button
              type="button"
              class="btn btn-gray-800"
              @click="openModal('productModal', true)">
              新增商品
            </button>
          </header>
          <section>
            <div class="table-responsive">
              <table class="admin-table table table-hover align-middle font-sans-tw mb-12">
                <thead>
                  <tr class="fs-normal-1">
                    <th scope="col" class="d-lg-none p-0" style="width: 50px">
                      <span class="d-none">操作按鈕</span>
                    </th>
                    <th scope="col" class="fw-normal text-gray">商品</th>
                    <th scope="col" class="fw-normal text-center text-gray">分類</th>
                    <th scope="col" class="fw-normal text-center text-gray d-none d-lg-table-cell">
                      作者
                    </th>
                    <th scope="col" class="fw-normal text-center text-gray d-none d-lg-table-cell">
                      定價
                    </th>
                    <th scope="col" class="fw-normal text-center text-gray">售價</th>
                    <th scope="col" class="fw-normal text-center text-gray d-none d-lg-table-cell">
                      上架
                    </th>
                    <th scope="col" class="fw-normal text-center text-gray">剩餘 / 總數</th>
                    <th scope="col" class="d-none d-lg-table-cell fw-normal w-15">
                      <span class="d-none">操作按鈕</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in products"
                    :key="item.id"
                    :class="{
                      'bg-danger-200': item.soldNum === item.totalNum,
                      'bg-gray-400': !item.is_enabled
                    }"
                  >
                    <td class="d-lg-none p-0">
                      <button
                        type="button"
                        class="btn border-0 px-1"
                        @click="openModal('productModal', false, item)"
                      >
                        <img src="@/assets/images/icon-edit.svg" alt="編輯" />
                      </button>
                      <button
                        type="button"
                        class="btn border-0 px-1"
                        @click="openModal('deleteModal', false, item)"
                      >
                        <img src="@/assets/images/icon-trashcan.svg" alt="刪除" />
                      </button>
                    </td>
                    <td scope="row">
                      <div class="d-flex align-items-center justify-content-start">
                        <div class="me-4 admin-img">
                          <img class="img-full" :src="item.imagesUrl[0]" :alt="item.title" />
                        </div>
                        <p>{{ item.title }}</p>
                      </div>
                    </td>
                    <td class="text-center">{{ item.category }}</td>
                    <td class="text-center d-none d-lg-table-cell">{{ item.author }}</td>
                    <td class="text-center d-none d-lg-table-cell">
                      NT {{ $filters.currency(item.origin_price) }}
                    </td>
                    <td class="text-center">NT {{ $filters.currency(item.price) }}</td>
                    <td class="d-none d-lg-table-cell">
                      <div class="form-check form-switch d-flex justify-content-center">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="launchedSwitch"
                          :checked="item.is_enabled"
                          @click="switchEnable(item)"
                        />
                        <label class="form-check-label d-none" for="launchedSwitch">上架狀態</label>
                      </div>
                    </td>
                    <td
                      class="text-center"
                      :class="{ 'text-danger fw-bold': item.soldNum === item.totalNum }"
                    >
                      {{ item.totalNum - item.soldNum }} / {{ item.totalNum }}
                    </td>
                    <td class="text-end d-none d-lg-table-cell">
                      <button
                        type="button"
                        class="btn border-0 btn-custom-hover-scale"
                        @click="openModal('productModal', false, item)"
                      >
                        <img src="@/assets/images/icon-edit.svg" alt="編輯" />
                      </button>
                      <button
                        type="button"
                        class="btn border-0 btn-custom-hover-scale"
                        @click="openModal('deleteModal', false, item)"
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
    <ProductModal ref="productModal" :product="tempProduct" />
    <DeleteModal ref="deleteModal" :deleteData="tempDelProduct" />
  </div>
</template>
