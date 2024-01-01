<script>
import { mapActions, mapState } from 'pinia';
import RatingScore from '@/components/front/RatingScore.vue';
import FavoriteBtn from '@/components/front/FavoriteBtn.vue';
import productsStore from '@/stores/productsStore';
import cartStore from '@/stores/cartStore';

export default {
  data() {
    return {
      qty: 1,
      scroll: {},
    };
  },
  watch: {
    id: 'getSingleProduct',
  },
  components: {
    RatingScore,
    FavoriteBtn,
  },
  props: ['id'],
  methods: {
    ...mapActions(productsStore, ['getSingleProduct']),
    ...mapActions(cartStore, ['addCart', 'buyNow']),
    scrollBar() {
      const scrollTop = window.scrollY;
      const wrapHeight = this.$refs.main.getBoundingClientRect().height;
      const contentHeight = this.$refs.mainContent.getBoundingClientRect().height;
      const viewportHeight = window.innerHeight;
      const toTop = 107;
      const wholeDistance = wrapHeight + toTop - viewportHeight;
      const contentTotop = contentHeight + toTop;
      const movePoint = contentHeight + toTop - viewportHeight;

      if (scrollTop <= 0) {
        this.$refs.mainContent.style.top = `${toTop}px`;
      }

      if (contentTotop > viewportHeight) {
        if (scrollTop >= movePoint && scrollTop <= wholeDistance) {
          this.$refs.mainContent.style.top = `${scrollTop - movePoint - 32}px`;
        } else if (scrollTop > wholeDistance) {
          this.$refs.mainContent.style.top = `${wrapHeight - contentHeight}px`;
        } else {
          this.$refs.mainContent.style.top = '0';
        }
      } else if (scrollTop >= toTop && scrollTop < wholeDistance) {
        this.$refs.mainContent.style.top = `${scrollTop}px`;
      } else if (scrollTop > wholeDistance) {
        this.$refs.mainContent.style.top = `${wrapHeight - contentHeight}px`;
      } else if (scrollTop < toTop) {
        this.$refs.mainContent.style.top = '0';
      }
    },
  },
  computed: {
    ...mapState(productsStore, ['singleProduct', 'availableNum', 'isLoading']),
    ...mapState(cartStore, ['isLoading']),
  },
  created() {
    this.getSingleProduct(this.id);
  },
  mounted() {
    if (window.innerWidth > 910) {
      window.addEventListener('scroll', this.scrollBar);
    }
  },
  unmounted() {
    window.removeEventListener('scroll', this.scrollBar);
  },
};
</script>

<template>
  <div class="container pt-4 pt-lg-8">
    <div class="productview-img d-lg-none mb-4">
      <img class="img-full" :src="singleProduct.imageUrl" :alt="singleProduct.title" />
    </div>
    <div class="row flex-column-reverse flex-lg-row gx-lg-10 gy-4">
      <div class="col-12 col-lg-5 productview-img" ref="side">
        <img
          v-for="(img, index) in singleProduct.imagesUrl"
          :key="`圖片 ${index}`"
          :src="img"
          class="img-full"
          :class="{
            'mb-4 mb-lg-8': index !== singleProduct.imagesUrl.length - 1,
            'd-none d-lg-block': index === 0
          }"
          :alt="`${singleProduct.title} 內頁預覽`"
        />
      </div>
      <div class="col-12 col-lg-7 font-sans-tw productview-main" ref="main">
        <div class="px-0 px-lg-5 transition-5 productview-main-content" ref="mainContent">
          <div class="d-flex justify-content-between mb-6 mb-lg-10">
            <div class="d-flex flex-fit flex-column flex-lg-row justify-content-between">
              <div>
                <h2 class="productview-title lh-base fs-4 fs-lg-2 mb-2 mb-lg-4">
                  {{ `${singleProduct.title}｜${singleProduct.category}攝影` }}
                </h2>
                <h3 class="fw-light fs-6 fs-lg-5 mb-2">
                  <a href="#" class="link-black">{{ singleProduct.author }}</a>
                </h3>
                <p class="fw-light fs-6 fs-lg-5 mb-2">{{ singleProduct.format }}</p>
              </div>
              <div class="text-end">
                <RatingScore
                  class="mb-2"
                  :rate="singleProduct.rate"
                  :rateNum="singleProduct.rateNum"
                />
                <FavoriteBtn class="d-none d-lg-inline-block me-minus-2" :id="singleProduct.id" />
              </div>
            </div>
            <FavoriteBtn class="d-lg-none mt-minus-2 me-minus-2" :id="singleProduct.id" />
          </div>
          <p class="fs-5 fw-light mb-10" v-html="singleProduct.content"></p>

          <div class="text-end mb-6">
            <div class="font-serif-tw mb-6">
              <p class="text-decoration-line-through">
                NT$ <span>{{ $filters.currency(singleProduct.origin_price) }}</span>
              </p>
              <p class="fs-3">
                NT$ <span class="fs-2">{{ $filters.currency(singleProduct.price) }}</span>
              </p>
            </div>
            <div class="d-flex justify-content-end" v-if="availableNum">
              <div class="me-3">
                <label class="d-none" for="productNum">數量</label>
                <select
                  class="form-select rounded-0 border-gray-800 h-100 ps-6 pe-10 ps-lg-10 pe-lg-14"
                  name="productNum"
                  id="productNum"
                  v-model="qty"
                >
                  <option
                    :value="num"
                    v-for="num in availableNum"
                    :key="`數量 ${num}`"
                    :selected="num == qty"
                  >
                    {{ num }}
                  </option>
                </select>
              </div>
              <button
                type="button"
                class="btn-custom-light me-3"
                @click="addCart(singleProduct.id, qty)"
              >
                加入購物車
              </button>
              <button type="button" class="btn-custom-dark" @click="buyNow(singleProduct.id, qty)">
                立即購買
              </button>
            </div>
            <button v-else type="button" class="btn-custom-disabled px-30" disabled>
              售完補貨中
            </button>
          </div>

          <div>
            <h4 class="fw-noraml mb-2 fs-5">常見問題</h4>
            <div class="accordion accordion-flush" id="accordionQA">
              <div class="accordion-item border-bottom border-gray-900">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseOne"
                  >
                    提供哪些領取商品的方式？
                  </button>
                </h2>
                <div
                  id="flush-collapseOne"
                  class="accordion-collapse collapse"
                  data-bs-parent="#accordionQA"
                  >
                  <div class="accordion-body">
                    <p>可以「來店自取」、「超商取貨」與「宅配」。</p>
                    <p>自取可備註環保無包裝，或是輕量僅包裝防塵塑膠套。若是配送則會使用防撞包材妥善的將商品包裝至特規製作的厚紙箱，讓您安心收到喜愛的商品。</p>
                  </div>
                </div>
              </div>
              <div class="accordion-item border-bottom border-gray-900">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseTwo"
                  >
                    商品有退貨機制嗎？
                  </button>
                </h2>
                <div
                  id="flush-collapseTwo"
                  class="accordion-collapse collapse"
                  data-bs-parent="#accordionQA">
                  <div class="accordion-body">
                    <p class="mb-4">有的，我們也符合網路購物有七天的鑑賞期，但必須保持商品包裝的完整性，當收到商品若不符合期待或是任何原因請與我們聯繫。</p>
                    <p>若是商品使用收縮膜包裹，拆除收縮膜後則無法辦理退貨，此類商品歡迎到店面觀賞後再決定是否購買。</p>
                  </div>
                </div>
              </div>
              <div class="accordion-item border-bottom border-gray-900">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseThree"
                    >
                    「月閱企劃」是什麼？
                  </button>
                </h2>
                <div
                  id="flush-collapseThree"
                  class="accordion-collapse collapse"
                  data-bs-parent="#accordionQA"
                  >
                  <div class="accordion-body">
                    <p class="mb-4">是我們今年度開始執行的「精選攝影集租借訂閱計畫」，月付 300 元，每個月一號將會收到一本攝影集，
                    在下個月份收到新的攝影集時將前一本攝影集歸還即可。我們希望可以用更平易近人且環保的方式推廣這些美好的片刻。</p>
                    <p>若當月閱讀收到的作品後想要直接買下來，便可以使用 6 折的價格購買，如有興趣歡迎與我們聯繫！</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <LoadingOverlay :active="isLoading" />
  </div>
</template>

<style lang="scss">
@import '@/assets/scss/vendors/bootstrap';

.productview {
  &-title {
    font-weight: normal;

    @include media-breakpoint-up(lg) {
      font-weight: 300;
    }
  }

  &-img img {
    height: 350px;
    @include media-breakpoint-up(md) {
      height: 550px;
    }
    @include media-breakpoint-up(xxl) {
      height: 600px;
    }
  }

  &-main {
    @include media-breakpoint-up(lg) {
      position: relative;
    }

    &-content {
      @include media-breakpoint-up(lg) {
        position: absolute;
        left: 0;
        right: 0;
      }
    }
  }
}
</style>
