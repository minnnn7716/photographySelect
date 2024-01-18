<script>
import { mapActions } from 'pinia';
import Navbar from '@/components/front/NavBar.vue';
import FooterComponent from '@/components/front/FooterComponent.vue';
import ToastMessages from '@/components/ToastMessages.vue';
import toastStore from '@/stores/toastStore';

export default {
  components: {
    Navbar,
    FooterComponent,
    ToastMessages,
  },
  methods: {
    ...mapActions(toastStore, ['resetMsg']),
  },
  created() {
    this.resetMsg();
  },
};
</script>

<template>
  <Navbar />
  <RouterView class="frontView" />
  <FooterComponent />
  <ToastMessages />
</template>
