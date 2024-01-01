<script>
import Navbar from '@/components/front/NavBar.vue';
import FooterComponent from '@/components/front/FooterComponent.vue';
import ToastMessages from '@/components/ToastMessages.vue';

export default {
  components: {
    Navbar,
    FooterComponent,
    ToastMessages,
  },
};
</script>

<template>
  <Navbar />
  <RouterView class="frontView" />
  <FooterComponent />
  <ToastMessages />
</template>
