<script>
import { mapActions } from 'pinia';
import couponStore from '@/stores/couponStore';
import modalMixin from '@/mixins/modalMixin';

export default {
  data() {
    return {
      modal: '',
      tempCoupon: {},
      tempStartDate: '',
      tempDueDate: '',
    };
  },
  props: {
    coupon: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  mixins: [modalMixin],
  watch: {
    coupon() {
      this.tempCoupon = { ...this.coupon };

      if (!this.coupon.id) {
        this.$refs.updateCouponForm.resetForm();
        this.tempStartDate = '';
        this.tempDueDate = '';
      } else {
        this.translateDate(this.tempCoupon.start_date, 'tempStartDate');
        this.translateDate(this.tempCoupon.due_date, 'tempDueDate');
      }
    },
  },
  methods: {
    ...mapActions(couponStore, ['updatedCoupon']),
    confirmCoupon() {
      const translateEnable = this.tempCoupon.is_enabled ? 1 : 0;
      this.tempCoupon.is_enabled = translateEnable;

      this.tempCoupon.start_date = Math.round(new Date(this.tempStartDate) / 1000);
      this.tempCoupon.due_date = Math.round(new Date(this.tempDueDate) / 1000);
      this.updatedCoupon(this.tempCoupon);
      this.modal.hide();
    },
    translateDate(time, item) {
      let date = '';

      if (time === 'now') {
        date = new Date(Date.now()).toISOString().slice(0, 10);
      } else {
        date = new Date(time * 1000).toISOString().slice(0, 10);
      }

      this[item] = date;
    },
    translateDateFormat(time) {
      const ary = time.split('-');
      const newAry = [ary[0], ary[2], ary[1]];
      return newAry.join('-');
    },
    getDate(time, item) {
      if (time.split('').indexOf('-') === -1) {
        return;
      }

      this[item] = new Date(time).toISOString().slice(0, 10);
    },
  },
};
</script>

<template>
  <div class="modal fade" tabindex="-1" ref="modal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-primary-400">
          <h2 class="modal-title fs-5" id="couponModal">新增折價券</h2>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <v-form
            @submit="confirmCoupon"
            id="couponForm"
            v-slot="{ errors }"
            ref="updateCouponForm"
          >
            <div
              class="d-flex align-items-center mb-8 modalInput"
              :class="{ error: errors['活動名稱'] }"
            >
              <label for="title" class="form-label me-4 mb-0 w-20">活動名稱</label>
              <div class="flex-fit">
                <v-field
                  type="text"
                  id="title"
                  name="活動名稱"
                  rules="required"
                  v-model="tempCoupon.title"
                  class="form-control flex-fit py-2 rounded-3 text-black bg-gray-300"
                ></v-field>
                <error-message
                  name="活動名稱"
                  class="error-text position-absolute fs-6 text-danger mb-1"
                ></error-message>
              </div>
            </div>
            <div
              class="d-flex align-items-center mb-8 modalInput"
              :class="{ error: errors['優惠碼'] }"
            >
              <label for="code" class="form-label me-4 mb-0 w-20">優惠碼</label>
              <div class="flex-fit">
                <v-field
                  type="text"
                  id="code"
                  name="優惠碼"
                  rules="required"
                  v-model="tempCoupon.code"
                  class="form-control flex-fit py-2 rounded-3 text-black bg-gray-300"
                ></v-field>
                <error-message
                  name="優惠碼"
                  class="error-text position-absolute fs-6 text-danger mb-1"
                ></error-message>
              </div>
            </div>
            <div
              class="d-flex align-items-center mb-8 modalInput"
              :class="{ error: errors['折扣'] }"
            >
              <label for="discount" class="form-label me-4 mb-0 w-20">折扣</label>
              <div class="flex-fit">
                <div class="d-flex align-items-center flex-fit">
                  <v-field
                    type="number"
                    id="discount"
                    name="折扣"
                    rules="required|min_value:0|max_value:100"
                    v-model.number="tempCoupon.percent"
                    placeholder="請輸入 0 - 100 之間的數字"
                    class="form-control py-2 rounded-3 text-black bg-gray-300"
                  ></v-field>
                  <p class="ms-4">%</p>
                </div>
                <error-message
                  name="折扣"
                  class="error-text position-absolute fs-6 text-danger mb-1"
                ></error-message>
              </div>
            </div>
            <div
              class="d-flex align-items-center mb-8 modalInput"
              :class="{ error: errors['起始日'] }"
            >
              <label for="startDate" class="form-label me-4 mb-0 w-20">起始日</label>
              <div class="flex-fit">
                <v-field
                  type="date"
                  id="startDate"
                  name="起始日"
                  rules="required"
                  v-model="tempStartDate"
                  @change="getDate($event.target.value, 'tempStartDate')"
                  class="form-control flex-fit py-2 rounded-3 text-black bg-gray-300"
                ></v-field>
                <error-message
                  name="起始日"
                  class="error-text position-absolute fs-6 text-danger mb-1"
                ></error-message>
              </div>
            </div>
            <div
              class="d-flex align-items-center mb-8 modalInput"
              :class="{ error: errors['到期日'] }"
            >
              <label for="dueDate" class="form-label me-4 mb-0 w-20">到期日</label>
              <div class="flex-fit">
                <v-field
                  type="date"
                  id="dueDate"
                  name="到期日"
                  rules="required"
                  v-model="tempDueDate"
                  class="form-control flex-fit py-2 rounded-3 text-black bg-gray-300"
                ></v-field>
                <error-message
                  name="到期日"
                  class="error-text position-absolute fs-6 text-danger mb-1"
                ></error-message>
              </div>
            </div>
          </v-form>
        </div>
        <div class="modal-footer bg-gray-200 justify-content-between">
          <div class="form-check form-switch">
            <label class="form-check-label" for="couponModalLaunchedSwitch"
              >啟用<span class="d-none d-lg-inline">狀態</span></label
            >
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              id="couponModalLaunchedSwitch"
              v-model="tempCoupon.is_enabled"
            />
          </div>
          <div>
            <button
              type="button"
              class="btn btn-outline-gray-800 px-8 px-lg-10 me-2 me-lg-4"
              data-bs-dismiss="modal"
            >
              取消
            </button>
            <button form="couponForm" type="submit" class="btn btn-gray-800 px-8 px-lg-10">
              確定
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
