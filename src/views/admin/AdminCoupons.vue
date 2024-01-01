<script>
import { mapState, mapActions } from 'pinia';
import couponStore from '@/stores/couponStore';
import DeleteModal from '@/components/admin/DeleteModal.vue';
import CouponModal from '@/components/admin/CouponModal.vue';

export default {
  data() {
    return {
      tempCoupon: {},
      isNew: false,
      tempDelCoupon: {},
      source: 'Coupon',
    };
  },
  components: {
    DeleteModal,
    CouponModal,
  },
  methods: {
    ...mapActions(couponStore, ['getCoupons', 'updatedCoupon', 'deleteCoupon']),
    openModal(modal, isNew, item) {
      if (modal === 'deleteModal') {
        this.tempDelCoupon = {
          id: item.id,
          title: item.title,
          source: this.source,
        };
      } else {
        if (isNew) {
          this.tempCoupon = {};
        } else {
          this.tempCoupon = { ...item };
        }

        this.isNew = isNew;
      }

      this.$refs[modal].showModal();
    },
    switchEnable(item) {
      this.tempCoupon = { ...item };
      this.tempCoupon.is_enabled = !this.tempCoupon.is_enabled;
      this.tempCoupon.is_enabled = this.tempCoupon.is_enabled ? 1 : 0;
      this.updatedCoupon(this.tempCoupon);
    },
  },
  computed: {
    ...mapState(couponStore, ['coupons', 'isLoading']),
  },
  created() {
    this.getCoupons();
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
              折價券 <span class="fs-6">({{ coupons.length }})</span>
            </h3>
            <button
              type="button"
              class="btn btn-gray-800"
              @click="openModal('couponModal', true)">
              新增折價券
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
                    <th scope="col" class="fw-normal text-gray">活動</th>
                    <th scope="col" class="fw-normal text-center text-gray">折價碼</th>
                    <th scope="col" class="fw-normal text-center text-gray">折扣</th>
                    <th scope="col" class="fw-normal text-center text-gray d-none d-lg-table-cell">
                      上架狀態
                    </th>
                    <th scope="col" class="fw-normal text-center text-gray d-none d-lg-table-cell">
                      起始日
                    </th>
                    <th scope="col" class="fw-normal text-center text-gray">到期日</th>
                    <th scope="col" class="d-none d-lg-table-cell fw-normal w-15">
                      <span class="d-none">操作按鈕</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in coupons" :key="`coupon ${item.id}`">
                    <td class="d-lg-none px-0 py-1">
                      <button
                        type="button"
                        class="btn border-0 px-1"
                        @click="openModal('couponModal', false, item)"
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
                    <td>{{ item.title }}</td>
                    <td class="text-center">{{ item.code }}</td>
                    <td class="text-center">{{ item.percent / 10 }} 折</td>
                    <td class="d-none d-lg-table-cell">
                      <div class="form-check form-switch d-flex justify-content-center">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="`couponLaunchedSwitch`"
                          :checked="item.is_enabled"
                          @click="switchEnable(item)"
                        />
                        <label class="form-check-label d-none" for="`couponLaunchedSwitch`"
                          >上架狀態</label
                        >
                      </div>
                    </td>
                    <td class="text-center d-none d-lg-table-cell">
                      {{ $filters.date(item.start_date) }}
                    </td>
                    <td class="text-center">{{ $filters.date(item.due_date) }}</td>
                    <td class="text-end d-none d-lg-table-cell">
                      <button
                        type="button"
                        class="btn border-0 btn-custom-hover-scale"
                        @click="openModal('couponModal', false, item)"
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
    <CouponModal ref="couponModal" :coupon="tempCoupon" />
    <DeleteModal ref="deleteModal" :deleteData="tempDelCoupon" />
  </div>
</template>
