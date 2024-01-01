<script>
import { mapState, mapActions } from 'pinia';
import newsStore from '@/stores/newsStore';

export default {
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  watch: {
    id: 'getSingleNewsAll',
  },
  methods: {
    ...mapActions(newsStore, ['getSingleNewsAll', 'routerPush']),
  },
  computed: {
    ...mapState(newsStore, ['singleNews', 'otherNewsId', 'isLoading']),
  },
  created() {
    this.getSingleNewsAll(this.id);
  },
};
</script>

<template>
  <div class="container pt-4 pt-lg-8">
    <div v-if="singleNews.id !== undefined">
      <div class="row gx-lg-20 mb-14">
        <div class="col-12 col-lg-6 mb-4 mb-lg-0 d-flex flex-column">
          <div class="overflow-hidden newsView-img flex-grow-1">
            <img class="img-full" :src="singleNews.image" :alt="singleNews.title" />
          </div>
        </div>
        <div class="col-12 col-lg-6">
          <div class="mb-8">
            <h3 class="fs-4 fs-lg-3 lh-base fw-medium mb-2">
              {{ singleNews.tag[0] }}｜{{ singleNews.title }}
            </h3>
            <p class="fs-normal-1 text-gray-800">{{ $filters.date(singleNews.create_at) }}</p>
          </div>
          <p class="font-sans-tw fw-light" v-html="singleNews.description"></p>
        </div>
      </div>
      <ul class="list-unstyled d-flex justify-content-between align-items-center">
        <li>
          <a
            href="#"
            @click.prevent="routerPush(otherNewsId.prev)"
            class="newsView-link-prev d-flex align-items-center link-gray-800 cursor-pointer"
            :class="{ 'pe-none opacity-50': !otherNewsId.prev }"
          >
            <img src="@/assets/images/icon-arrow-long-left.svg" alt="prev" />
            <span class="d-none d-md-inline font-serif-tw fs-5 ms-3">prev</span>
          </a>
        </li>
        <li>
          <RouterLink
            to="/news"
            class="newsView-link-back font-sans-tw link-gray-800 pb-1 border-gray-800 border-bottom"
          >
            返回列表
          </RouterLink>
        </li>
        <li>
          <a
            href="#"
            @click.prevent="routerPush(otherNewsId.next)"
            class="newsView-link-next d-flex align-items-center
            flex-row-reverse link-gray-800 cursor-pointer"
            :class="{ 'pe-none opacity-50': !otherNewsId.next }"
          >
            <img src="@/assets/images/icon-arrow-long-right.svg" alt="next" />
            <span class="d-none d-md-inline font-serif-tw fs-5 me-3">next</span>
          </a>
        </li>
      </ul>
    </div>
    <LoadingOverlay :active="isLoading" />
  </div>
</template>

<style lang="scss">
@import '@/assets/scss/vendors/bootstrap';

.newsView {
  &-img {
    height: 300px;

    @include media-breakpoint-up(lg) {
      height: 550px;
    }
  }

  &-link {
    &-prev:hover {
      margin-left: -12px;
      margin-right: 12px;
    }

    &-next:hover {
      margin-right: -12px;
      margin-left: 12px;
    }
  }
}
</style>
