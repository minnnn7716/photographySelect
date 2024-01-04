<script>
import { mapState } from 'pinia';
import toastStore from '@/stores/toastStore';
import ToastItem from './ToastItem.vue';

export default {
  components: {
    ToastItem,
  },
  computed: {
    ...mapState(toastStore, ['message']),
  },
};
</script>

<template>
  <div class="toast-container position-fixed start-50 translate-middle-x p-3">
    <ToastItem v-for="(msg, index) in message" :key="index" :msg="msg" />
  </div>
</template>

<style lang="scss">
@import '../assets/scss/vendors/bootstrap';

.toast-container {
  top: 60px;

  @include media-breakpoint-up(lg) {
    top: 0;
  }
}
</style>
