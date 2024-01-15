<script>
import { mapState, mapActions } from 'pinia';
import newsStore from '@/stores/newsStore';
import Pagination from '@/components/PaginationComponent.vue';

export default {
  components: {
    Pagination,
  },
  watch: {
    '$route.params': {
      handler() {
        if (this.$route.query.page) {
          this.getNews(this.$route.query.page);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    ...mapActions(newsStore, ['getNews', 'routerPush']),
    substr(str, num) {
      return str.substr(0, num);
    },
    getEmitPage(page) {
      this.getNews(page);
    },
  },
  computed: {
    ...mapState(newsStore, ['news', 'pagination', 'isLoading']),
  },
  created() {
    this.getNews(this.$route.query.page);
  },
};
</script>

<template>
  <div class="container pt-2 pt-lg-8">
    <h2
      class="fs-display-7 fs-md-display-5
      fs-lg-display-3 fs-xl-display-1 font-serif-en mb-6 mb-lg-14"
    >
      News
    </h2>

    <ul class="newsList list-unstyled mb-6 mb-lg-14">
      <li class="newsListItem" v-for="item in news" :key="`news ${item.id}`">
        <div class="row position-relative">
          <div class="col-12 col-md-6 mb-4 mb-md-0">
            <div class="newsListItem-imgContainer overflow-hidden d-flex align-items-center">
              <img class="newsListItem-img img-full" :src="item.image" :alt="item.title" />
            </div>
          </div>
          <div class="col-12 col-md-6 d-flex flex-column justify-content-between">
            <div>
              <div class="mb-2 mb-lg-6 d-flex flex-column flex-md-row justify-content-between">
                <h3 class="newsListItem-title fs-6 fs-lg-5 fw-medium mb-1 mb-md-0">
                  {{ item.tag[0] }}｜{{ item.title }}
                </h3>
                <time class="fs-normal-2">{{ $filters.date(item.create_at) }}</time>
              </div>
              <p
                class="d-none d-lg-block font-sans-tw fw-light"
                v-html="substr(item.description, 120)"
              ></p>
              <p
                class="d-lg-none font-sans-tw fw-light fs-normal-1"
                v-html="substr(item.description, 50)"
              ></p>
            </div>
            <a
              href="#"
              @click.prevent="routerPush(item.id)"
              class="newsListItem-link stretched-link font-serif-en
              fs-6 fs-lg-4 link-gray-800 d-flex align-items-center justify-content-end"
              to="/news/001"
            >
              <span class="me-2">more</span>
              <img src="@/assets/images/icon-arrow-long-right.svg" alt="more" />
            </a>
          </div>
        </div>
      </li>
    </ul>

    <Pagination :page-info="pagination" @emit-page="getEmitPage" />
    <LoadingOverlay :active="isLoading" />
  </div>
</template>

<style lang="scss">
@import '@/assets/scss/vendors/bootstrap';

.newsListItem {
  &:not(:last-child) {
    padding-bottom: 24px;
    margin-bottom: 24px;
    border-bottom: 1px solid $gray-400;

    @include media-breakpoint-up(lg) {
      padding-bottom: 64px;
      margin-bottom: 64px;
      border-bottom: 1px solid $gray-800;
    }
  }

  &-imgContainer {
    height: 100px;

    @include media-breakpoint-up(lg) {
      height: 200px;
    }
  }

  &-title,
  &-img {
    transition: all ease 0.5s;
  }

  &:hover {
    .newsListItem-img {
      transform: scale(1.05);
    }

    .newsListItem-link {
      margin-right: -8px;
    }

    .newsListItem-title {
      color: $primary-800;
    }
  }
}
</style>
