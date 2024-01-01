<script>
export default {
  props: {
    pageInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    clickPagination(action) {
      const currentPage = this.pageInfo.current_page;
      let page = currentPage;

      if (action === 'prev') {
        page -= 1;
      } else if (action === 'next') {
        page += 1;
      } else {
        page = action;
      }

      this.$emit('emit-page', page);
    },
  },
};
</script>

<template>
  <nav class="d-flex justify-content-center font-sans-tw fw-light" v-if="pageInfo.total_pages > 1">
    <ul class="pagination">
      <li class="page-item" :class="{ disabled: !pageInfo.has_pre }">
        <a class="page-link fs-6 fs-md-4 rounded-pill" @click.prevent="clickPagination('prev')"
          >Prev</a
        >
      </li>
      <li class="page-item" v-for="item in pageInfo.total_pages" :key="`pagination ${item}`">
        <a
          class="page-link fs-6 fs-md-4 rounded-pill"
          :class="{ active: item === pageInfo.current_page }"
          @click.prevent="clickPagination(item)"
          >{{ item }}</a
        >
      </li>
      <li class="page-item" :class="{ disabled: !pageInfo.has_next }">
        <a class="page-link fs-6 fs-md-4 rounded-pill" @click.prevent="clickPagination('next')"
          >Next</a
        >
      </li>
    </ul>
  </nav>
</template>

<style lang="scss">
@import '@/assets/scss/vendors/bootstrap';

.page-link {
  cursor: pointer;
}

.page-link.active,
.active > .page-link {
  font-weight: 400;
  cursor: default;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 50%;
    height: 1px;
    background-color: $primary-700;
  }
}
</style>
