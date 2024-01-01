<script>
import { mapActions } from 'pinia';
import cartStore from '@/stores/cartStore';
import modalMixin from '@/mixins/modalMixin';

export default {
  data() {
    return {
      modal: '',
    };
  },
  props: ['deleteData'],
  mixins: [modalMixin],
  methods: {
    ...mapActions(cartStore, ['deleteAllCart']),
    deleteAction() {
      const action = `deleteAll${this.deleteData}`;
      this[action]();
      this.modal.hide();
    },
    deleteAllFavorite() {
      this.$emit('emit-delete-all');
    },
  },
  computed: {
    source() {
      let str = '';
      const source = this.deleteData;

      if (source === 'Cart') {
        str = '購物車';
      } else if (source === 'Favorite') {
        str = '喜愛清單';
      }

      return str;
    },
  },
};
</script>

<template>
  <div class="modal fade" id="deleteModal" tabindex="-1" ref="modal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content font-sans-tw">
        <div class="modal-header bg-danger-700 text-white">
          <h2 class="modal-title fs-5" id="deleteModal">刪除全部{{ source }}</h2>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body text-center py-10">
          確定要刪除
          <span class="fw-medium text-danger-800">
            全部{{ source }}
          </span> 嗎？
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
