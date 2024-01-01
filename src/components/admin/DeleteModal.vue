<script>
import { mapActions } from 'pinia';
import adminProductStore from '@/stores/adminProductStore';
import adminOrderStore from '@/stores/adminOrderStore';
import couponStore from '@/stores/couponStore';
import adminNewsStore from '@/stores/adminNewsStore';
import modalMixin from '@/mixins/modalMixin';

export default {
  data() {
    return {
      modal: '',
    };
  },
  props: {
    deleteData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  mixins: [modalMixin],
  methods: {
    ...mapActions(adminProductStore, ['deleteProduct']),
    ...mapActions(adminOrderStore, ['deleteOrder']),
    ...mapActions(couponStore, ['deleteCoupon']),
    ...mapActions(adminNewsStore, ['deleteNews']),
    deleteAction() {
      const action = `delete${this.deleteData.source}`;
      this[action](this.deleteData.id);
      this.modal.hide();
    },
  },
  computed: {
    source() {
      let str = '';
      const { source } = this.deleteData;

      if (source === 'Product') {
        str = '商品';
      } else if (source === 'Order') {
        str = '訂單';
      } else if (source === 'Coupon') {
        str = '折價券';
      } else if (source === 'News') {
        str = '消息';
      } else {
        str = '';
      }

      return str;
    },
  },
};
</script>

<template>
  <div class="modal fade" id="deleteModal" tabindex="-1" ref="modal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-danger-700 text-white">
          <h2 class="modal-title fs-5" id="deleteModal">刪除{{ source }}</h2>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body text-center py-10">
          確定要刪除{{ source }}
          <span class="fw-medium text-danger-800">
            「{{ deleteData.title !== undefined ? deleteData.title : deleteData.id }}」</span
          >嗎？
        </div>
        <div class="modal-footer bg-gray-200">
          <button
            type="button"
            class="btn btn-outline-danger-900 px-10 me-4"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button
            type="button"
            class="btn btn-danger-900 px-10"
            @click="deleteAction"
          >
            確定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
