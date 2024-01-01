<script type="module">
import FavoriteOffcanvas from './FavoriteOffcanvas.vue';
import CartOffcanvas from './CartOffcanvas.vue';
import NavOffcanvas from './NavOffcanvas.vue';

export default {
  components: {
    FavoriteOffcanvas,
    CartOffcanvas,
    NavOffcanvas,
  },
};
</script>

<template>
  <nav class="navbar front-navbar fixed-top py-2 py-lg-3 px-lg-8">
    <div class="container-fluid">
      <RouterLink to="/" class="d-inline-block img-hover-scale-sm">
        <h1 class="navbar-brand front-navbar-brand">集攝 Photography Select</h1>
      </RouterLink>

      <ul class="list-unstyled mb-0 d-flex align-items-center">
        <li>
          <FavoriteOffcanvas />
        </li>
        <li>
          <CartOffcanvas />
        </li>
        <li>
          <NavOffcanvas />
        </li>
      </ul>
    </div>
  </nav>
</template>

<style lang="scss">
@import '@/assets/scss/vendors/bootstrap';

.front-navbar {
  background: linear-gradient(rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.3) 100%);
  // backdrop-filter: blur(2px);

  @include media-breakpoint-up(lg) {
    background: linear-gradient(rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.15) 100%);
  }
}

.front-navbar-brand {
  width: 130px;
  height: 40px;
  background-size: contain;
  text-indent: 101%;
  white-space: nowrap;
  overflow: hidden;
  background: url('@/assets/images/icon-logo.svg') no-repeat center;
  background-size: cover;

  @include media-breakpoint-up(lg) {
    width: 147px;
    height: 46px;
  }
}
</style>
