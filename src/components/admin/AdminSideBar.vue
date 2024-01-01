<script>
import ProductModal from './ProductModal.vue';

export default {
  data() {
    return {
      isNew: true,
      tempProduct: {},
      currentUrl: '',
    };
  },
  components: {
    ProductModal,
  },
  methods: {
    openModal() {
      this.tempProduct = {
        totalNum: 1,
        soldNum: 0,
        rate: '0',
        rateNum: 0,
      };

      this.$refs.productModal.showModal();
    },
    clickNavLink(path) {
      this.currentUrl = path;
      this.$router.push(`/admin/${path}`);
    },
  },
  mounted() {
    // eslint-disable-next-line no-underscore-dangle
    const url = this.$router.currentRoute._value.path.split('/')[2];
    this.currentUrl = url;
  },
};
</script>

<template>
  <nav
    class="d-none d-lg-block navbar adminSidebar navbar-expand-lg
    bg-light w-15 h-100vh position-fixed align-items-start pt-0"
  >
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#adminSidebar"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="adminSidebar">
      <ul class="navbar-nav flex-column flex-grow-1 text-center fs-5">
        <li class="nav-item border-bottom border-gray-400">
          <button type="button" class="nav-link py-3 w-100" @click="openModal">
            新增商品
          </button>
        </li>
        <li
          class="nav-item border-bottom border-gray-400 cursor-pointer"
          :class="{ 'text-black bg-primary-400': currentUrl === 'products' }"
        >
          <a class="nav-link py-3" @click.prevent="clickNavLink('products')">商品列表</a>
        </li>
        <li
          class="nav-item border-bottom border-gray-400 cursor-pointer"
          :class="{ 'text-black bg-primary-400': currentUrl === 'orders' }"
        >
          <a class="nav-link py-3" @click.prevent="clickNavLink('orders')">顧客訂單</a>
        </li>
        <li
          class="nav-item border-bottom border-gray-400 cursor-pointer"
          :class="{ 'text-black bg-primary-400': currentUrl === 'coupons' }"
        >
          <a class="nav-link py-3" @click.prevent="clickNavLink('coupons')">折價券</a>
        </li>
        <li
          class="nav-item border-bottom border-gray-400 cursor-pointer"
          :class="{ 'text-black bg-primary-400': currentUrl === 'news' }"
        >
          <a class="nav-link py-3" @click.prevent="clickNavLink('news')">最新消息</a>
        </li>
      </ul>
    </div>
  </nav>

  <ProductModal ref="productModal" :product="tempProduct" :isNew="isNew" />
</template>

<style lang="scss">
.adminSidebar {
  .nav-item {
    transition: all ease 0.5s;

    &:hover {
      background-color: #ebebeb;
      color: black;
    }

    &.active {
      background-color: #ffe175;
      font-weight: 500;
    }
  }

  .nav-item-collapse {
    &.active {
      li {
        background-color: #fff6d8;

        &.active {
          a {
            color: #c89000;
            font-weight: 500;
          }
        }

        &:hover {
          a {
            color: #7c5a00;
          }
        }
      }

      a {
        font-weight: 400;
        color: black;
      }
    }
  }
}

.addProductModal {
  .btn-outline-gray-800:hover {
    background-color: #929292;
    border-color: #929292;
  }

  .btn-gray-800:hover {
    background-color: #f5c413;
    border-color: #f5c413;
    color: black;
  }
}
</style>
