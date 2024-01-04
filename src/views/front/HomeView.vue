<script>
import { mapState, mapActions } from 'pinia';
import productsStore from '@/stores/productsStore';
import newsStore from '@/stores/newsStore';
import toastStore from '@/stores/toastStore';
import ProductListItem from '@/components/front/ProductListItem.vue';

export default {
  data() {
    return {
      pick: {
        translateX: 0,
        prev: false,
        next: true,
        ratio: 1,
      },
      timerDate: '',
      hour: 0,
      min: 0,
      sec: 0,
    };
  },
  components: {
    ProductListItem,
  },
  methods: {
    ...mapActions(productsStore, ['getProducts']),
    ...mapActions(newsStore, ['getTop4News', 'routerPush']),
    ...mapActions(toastStore, ['pushMsg']),
    changeNewsImg(src) {
      this.$refs.newsImg.style.backgroundImage = `url(${src})`;
      this.$refs.newsImg.style.opacity = '1';
    },
    removeNewsImg() {
      this.$refs.newsImg.style.opacity = '0';
    },
    pickMove(action) {
      const containerWidth = this.$refs.pickList.offsetWidth;
      const totalItemNum = this.$refs.pickItem.length;
      const itemWidth = this.$refs.pickItem[0].offsetWidth;
      const totalWidth = totalItemNum * itemWidth;
      const moveMin = 0;
      const moveMax = -(totalWidth - containerWidth - 1);
      let moveUnit = itemWidth;

      if (window.innerWidth <= 910) {
        moveUnit *= 2;
      }

      if (action === 'next' && this.pick.translateX > moveMax) {
        if (this.pick.translateX - moveMax > moveUnit && this.pick.translateX - moveMax > 1) {
          this.pick.translateX -= moveUnit;
        } else {
          this.pick.translateX = moveMax;
          this.pick.next = false;
        }
      }

      if (action === 'prev' && this.pick.translateX < moveMin) {
        if (this.pick.translateX - moveMax < moveUnit) {
          this.pick.translateX += moveUnit;
        } else {
          this.pick.translateX = 0;
          this.pick.prev = false;
        }
      }

      this.pick.prev = this.pick.translateX < moveMin;
      this.pick.next = this.pick.translateX > moveMax;

      this.$refs.pickList.style.transform = `translateX(${this.pick.translateX}px)`;
    },
    calcTime() {
      const now = new Date();
      const nowHours = now.getHours();
      const nowMinutes = now.getMinutes();

      if (nowHours <= 15) {
        if (nowHours === 15 && nowMinutes > 43) {
          this.timerDate = 'tomorrow';
        } else {
          this.timerDate = 'today';
        }
      } else {
        this.timerDate = 'tomorrow';
      }
    },
    setTimer() {
      const nowTime = new Date();
      const limitTime = new Date();
      limitTime.setMonth(nowTime.getMonth());
      limitTime.setHours(15);
      limitTime.setMinutes(43);
      limitTime.setSeconds(0);

      if (this.timerDate === 'today') {
        limitTime.setDate(nowTime.getDate());
      } else {
        limitTime.setDate(nowTime.getDate() + 1);
      }

      if (limitTime - nowTime < 0) {
        this.calcTime();
      }

      const offsetTime = (limitTime - nowTime) / 1000;
      let time = [];
      time[0] = parseInt(offsetTime / 60 / 60, 10);
      time[1] = parseInt((offsetTime / 60) % 60, 10);
      time[2] = parseInt(offsetTime % 60, 10);

      time = time.map((item) => (item < 10 ? `0${item}` : `${item}`));

      const [hour, min, sec] = time;
      this.hour = hour;
      this.min = min;
      this.sec = sec;
    },
    copyText() {
      const copyText = this.$refs.discount;
      navigator.clipboard.writeText(copyText.textContent);
      this.pushMsg({
        style: 'success',
        title: '已複製優惠碼',
      });
    },
  },
  computed: {
    ...mapState(productsStore, ['products']),
    ...mapState(newsStore, ['top4News']),
    getPickProduct() {
      const ary = [...this.products];
      const sortAry = ary.sort((a, b) => parseInt(b.rate, 10) - parseInt(a.rate, 10));
      return sortAry.splice(0, 6);
    },
  },
  created() {
    this.getProducts();
    this.getTop4News();
  },
  mounted() {
    this.calcTime();
    setInterval(this.setTimer, 1000);
  },
};
</script>

<template>
  <div class="index overflow-hidden">
    <header class="pt-lg-20vh pb-10vh pb-lg-15vh">
      <div
        class="index-header-content d-flex flex-column flex-lg-row
        justify-content-end justify-content-lg-center"
      >
        <img
          class="me-6 me-xxl-8 object-fit-cover d-none d-lg-block"
          src="@/assets/images/index/index-banner-01.webp"
          alt="海洋的多重樣貌攝影集內頁"
        />
        <img
          class="me-6 me-xxl-8 object-fit-cover d-none d-lg-block"
          src="@/assets/images/index/index-banner-02.webp"
          alt="生．息攝影集內頁"
        />
        <img
          class="img-full object-fit-cover"
          src="@/assets/images/index/index-banner-03.webp"
          alt="生．息攝影集內頁"
        />
        <div
          class="d-flex flex-column justify-content-between
          mx-4 mx-lg-8 mx-xxl-12 mx-3xl-16 py-6 py-lg-0"
        >
          <h2
            class="font-serif-en fs-display-6 fs-lg-display-4 fs-xxl-display-3 fs-3xl-display-1
            mb-6 mb-lg-0"
          >
            PhotoGraphy <br />
            Select
          </h2>
          <div class="text-end">
            <p class="fs-6 fs-lg-5 fs-xxl-4 fs-3xl-3 letter-spacing-18 mb-5">揀選屬於你的吉光片羽</p>
            <RouterLink
              to="/products"
              class="fs-6 fs-3xl-5 btn btn-dark rounded-pill font-sans-tw fw-light px-8">
              立即前往挑選
            </RouterLink>
          </div>
        </div>
        <img
          class="me-6 me-xxl-8 object-fit-cover d-none d-lg-block"
          src="@/assets/images/index/index-banner-04.webp"
          alt="轉瞬攝影集內頁"
        />
        <img
          class="object-fit-cover d-none d-lg-block"
          src="@/assets/images/index/index-banner-05.webp"
          alt="生．息攝影集內頁"
        />
      </div>
    </header>
    <div class="container-fluid">
      <section class="py-10vh py-lg-15vh">
        <div class="row flex-column-reverse flex-lg-row">
          <RouterLink
            to="/products"
            class="col-12 col-lg-9 ps-0 pe-0 pe-lg-3
            overflow-hidden h-50vh d-flex align-items-center"
          >
            <img
              class="img-full"
              src="@/assets/images/index/index-products.webp"
              alt="所有商品列表"
            />
          </RouterLink>
          <div
            class="col-12 col-lg-3 d-flex flex-column flex-lg-row align-items-end position-relative"
          >
            <h3
              class="index-products-title font-serif-en
              fs-display-7 fs-lg-display-4 fs-xxl-display-1 text-black mb-4 mb-lg-0"
            >
              All Products
            </h3>
            <div class="d-flex flex-column flex-lg-row align-items-end mb-minus-22 mb-lg-minus-14">
              <div
                class="d-flex flex-column flex-lg-row align-items-end
                letter-spacing-8 me-0 me-lg-10 mb-3 mb-lg-0 fs-lg-normal-1 fs-3xl-5"
              >
                <p class="index-products-content ms-0 me-0 me-lg-6 mb-2 mb-lg-4 mb-xxl-3em">
                  敞洋在數不盡的凝結時光
                </p>
                <p class="index-products-content m-0">感受僅屬於你的片刻</p>
              </div>
              <RouterLink
                class="stretched-link btn-custom-word font-serif-en fs-4
                link-gray-800 d-flex align-items-center justify-content-end"
                to="/products"
              >
                <span class="me-2">see all</span>
                <img src="@/assets/images/icon-arrow-long-right.svg" alt="see all products" />
              </RouterLink>
            </div>
          </div>
        </div>
      </section>
      <section class="py-10vh py-lg-15vh">
        <div class="row justify-content-end gx-12">
          <div
            class="col-12 col-lg-2 d-flex flex-lg-column
            justify-content-between align-items-end position-relative"
          >
            <h3 class="font-serif-en fs-display-7 fs-lg-display-4 fs-xxl-display-1">News</h3>
            <RouterLink
              class="btn-custom-word stretched-link font-serif-en
              fs-4 link-gray-800 d-flex align-items-center justify-content-end"
              to="/news"
            >
              <span class="me-2">see all</span>
              <img src="@/assets/images/icon-arrow-long-right.svg" alt="see all news" />
            </RouterLink>
          </div>
          <ul class="col-12 col-lg-5 list-unstyled pt-6 pt-xxl-10 mb-0">
            <li
              v-for="(item, index) in top4News"
              :key="`news ${item.id}`"
              class="index-newsItem d-flex align-items-center
              justify-content-between py-1 position-relative"
              :class="{ 'mb-2 mb-lg-5': index !== top4News.length - 1 }"
              @mouseenter="changeNewsImg(item.image)"
              @mouseleave="removeNewsImg"
            >
              <div class="d-flex align-items-lg-center flex-column flex-lg-row">
                <p class="fs-normal-2 fs-lg-normal-1 fs-xxl-6 me-6 mb-3 mb-lg-0">
                  {{ $filters.date(item.create_at) }}
                </p>
                <h4 class="fs-normal-1 fs-xxl-6">
                  {{ Object.prototype.hasOwnProperty.call(item, 'tag') ? item.tag[0] : '' }}｜{{
                    item.title
                  }}
                </h4>
              </div>
              <div
                class="index-newsItem-lineCon flex-grow-1 mx-3 d-none d-lg-flex align-items-center"
              >
                <span class="index-newsItem-line d-inline-block bg-black"></span>
              </div>
              <a
                href="#"
                @click.prevent="routerPush(item.id)"
                class="index-newsItem-link stretched-link d-flex align-items-center"
              >
                <span class="index-newsItem-link-content"></span>
              </a>
            </li>
          </ul>
          <div class="col-4 overflow-hidden pe-0 d-none d-lg-block">
            <div class="index-news-image h-100" ref="newsImg"></div>
          </div>
        </div>
      </section>
      <section class="py-5vh py-lg-15vh">
        <div class="row">
          <div class="col-12 col-lg-4 d-flex flex-column justify-content-between ps-0">
            <div class="d-flex align-items-start justify-content-between justify-content-lg-start">
              <img
                class="index-concept-image-start-1 me-0 me-lg-6 mt-20 mt-lg-30"
                src="@/assets/images/index/index-concept-02.webp"
                alt="海洋的多重樣貌攝影集內頁"
              />
              <img
                class="index-concept-image-start-2 me-4 me-lg-0"
                src="@/assets/images/index/index-concept-01.webp"
                alt="生．息攝影集內頁"
              />
            </div>
            <div class="text-end">
              <img
                class="index-concept-image-start-3 d-none d-lg-block"
                src="@/assets/images/index/index-concept-03.webp"
                alt="生．息攝影集內頁"
              />
            </div>
          </div>
          <div class="col-10 col-lg-4 pt-10vh py-lg-10vh mx-auto">
            <div class="font-serif-en text-center mb-6 mb-lg-8 mb-xxl-12 position-relative">
              <h3 class="index-concept-title fs-display-7 fs-lg-display-4 fs-xxl-display-1">
                Concept
              </h3>
              <img
                class="position-absolute top-50 start-50 translate-middle z-minus-1"
                src="@/assets/images/decoration-halo.svg"
                alt="decoration-halo"
              />
            </div>
            <div class="text-center lh-lg fs-lg-normal-1 fs-xxl-6">
              <p class="mb-8">
                經歷無數個為影像所感動、驚喜、波動的時刻，<br class="d-none d-lg-block" />
                一紙影像不如手感上如此輕薄，<br class="d-none d-lg-block" />
                他所帶來的觸動遠比海洋寬闊，與森林一般深層，<br class="d-none d-lg-block" />
                令人無法抗拒，<br class="d-none d-lg-block" />
                躍然於眼前，直達心弦的悸動。
              </p>
              <p class="mb-8">
                我們希望能為你汲取這些道不盡的浮光掠影，<br class="d-none d-lg-block" />
                將之一一揀選，提供不同形式樣態的作品，<br class="d-none d-lg-block" />
                期望你能在集攝找到屬於你的時光。<br />
              </p>
              <p class="d-none d-lg-block">
                我們也很歡迎你到店面，除去螢幕的隔閡，<br />
                親自感受這些攝影集想和你訴說的話語。
              </p>
            </div>
          </div>
          <div
            class="col-lg-4 pe-0 mb-minus-14 d-none d-lg-flex
            flex-column align-items-end justify-content-end"
          >
            <img
              class="index-concept-image-end-1 me-16 mb-8"
              src="@/assets/images/index/index-concept-04.webp"
              alt="轉瞬攝影集內頁"
            />
            <img
              class="index-concept-image-end-2 me-6"
              src="@/assets/images/index/index-concept-05.webp"
              alt="生．息攝影集內頁"
            />
          </div>
        </div>
      </section>
      <section class="pt-10vh pt-lg-15vh">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 col-xxl-9">
            <div
              class="d-flex justify-content-between
              align-items-center align-items-lg-end mb-4 mb-xxl-8"
            >
              <h3 class="font-serif-en fs-display-7 fs-lg-display-4 fs-xxl-display-1 lh-1">
                Picks
              </h3>
              <div
                class="flex-grow-1 d-flex align-items-center justify-content-end
                mb-0 mb-lg-2 mb-xxl-4"
              >
                <div
                  class="d-none d-lg-block position-relative flex-grow-1
                  mx-4 mx-xxl-8 bg-gray-400 rounded-pill"
                  style="height: 4px"
                >
                  <div
                    class="bg-gray rounded-pill position-absolute top-0 left-0 transition-5"
                    :class="{
                      'w-25': pick.ratio === 1,
                      'w-50': pick.ratio === 2,
                      'w-75': pick.ratio === 3,
                      'w-100': pick.ratio === 4
                    }"
                    style="height: 4px"
                  ></div>
                </div>
                <ul class="list-unstyled d-flex mb-0">
                  <li class="me-10 me-lg-15 me-xxl-20">
                    <a
                      class="link-dark btn-custom-hover-moveStart
                      d-flex align-items-center cursor-pointer"
                      :class="{ 'pe-none opacity-50': !pick.prev }"
                      @click.prevent="pickMove('prev')"
                    >
                      <img
                        class="me-1 me-lg-4"
                        src="@/assets/images/icon-arrow-left.svg"
                        alt="prev"
                      />
                      <span class="font-serif-en fs-4 fs-xxl-3">prev</span>
                    </a>
                  </li>
                  <li>
                    <a
                      class="link-dark btn-custom-hover-moveEnd
                      d-flex flex-row-reverse align-items-center cursor-pointer"
                      :class="{ 'pe-none opacity-50': !pick.next }"
                      @click.prevent="pickMove('next')"
                    >
                      <img
                        class="ms-1 ms-lg-4"
                        src="@/assets/images/icon-arrow-right.svg"
                        alt="next"
                      />
                      <span class="font-serif-en fs-4 fs-xxl-3">next</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <ul class="list-unstyled row flex-nowrap gx-4 gx-xxl-8 transition-5" ref="pickList">
              <li
                class="d-flex flex-column col-6 col-lg-3"
                v-for="item in getPickProduct"
                :key="item.id"
                ref="pickItem"
              >
                <ProductListItem :product="item" />
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section class="py-10vh py-lg-15vh position-relative">
        <div class="row justify-content-center">
          <div
            class="col-12 col-lg-10 col-xxl-9 d-flex flex-column flex-lg-row
            justify-content-between align-items-center"
          >
            <h3
              class="font-serif-en fs-display-6 fs-lg-display-5
              fs-xxl-display-3 fs-3xl-display-1 lh-1 mb-10 mb-lg-0"
            >
              Special
            </h3>
            <div class="fs-5 fs-lg-normal-1 fs-xxl-5 font-sans-tw
            text-center text-lg-start mb-4 mb-lg-0">
              <p class="mb-3">限時活動至明天下午 15:43</p>
              <div class="d-flex flex-column flex-md-row align-items-center">
                <div class="d-flex align-items-center mb-2 mb-md-0">
                  <p>結帳時輸入</p>
                  <div
                    class="d-flex rounded-pill overflow-hidden
                    border border-2 border-gray-900 mx-2">
                    <span
                      class="d-flex align-items-center bg-dark
                    text-white fs-normal-1 ps-3 pe-2 py-1 py-3xl-2"
                      ref="discount"
                    >
                      photo_2023
                    </span>
                    <button
                      type="button"
                      class="d-flex align-items-center ps-2 pe-3 py-1 py-3xl-2 border-0"
                      @click="copyText"
                    >
                      <img src="@/assets/images/icon-copy.svg" alt="複製">
                    </button>
                  </div>
                </div>
                <p>全館享有 8 折優惠</p>
              </div>
            </div>
            <time
              class="index-special-timer font-sans-en
              fs-1 fs-lg-display-6 fs-xxl-display-3 fs-3xl-display-1"
            >
              {{ hour }} : {{ min }} : {{ sec }}</time
            >
            <img
              class="index-special-decoImg"
              src="@/assets/images/decoration-halo.svg"
              alt="decoration-halo"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/assets/scss/vendors/bootstrap';
@import '@/assets/scss/utils/variables';

.index {
  &-header-content {
    height: 100vh;

    @include media-breakpoint-up(lg) {
      height: 65vh;
      transform: rotate(-5deg) translate(-15%);
    }

    @include media-breakpoint-up(xxl) {
      height: 65vh;
      transform: rotate(-5deg) translate(-5%);
    }

    @include media-breakpoint-up(3xl) {
      height: 65vh;
      transform: rotate(-6deg);
    }
  }

  &-products {
    &-title {
      @include media-breakpoint-up(lg) {
        position: absolute;
        mix-blend-mode: overlay;
        top: 0;
        left: -196px;
      }
    }

    &-content {
      @include media-breakpoint-up(lg) {
        writing-mode: vertical-lr;
      }
    }
  }

  &-news {
    &-image {
      opacity: 0;
      background-image: #ffffff;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      transition: all ease 0.5s;
    }
  }

  &-newsItem,
  &-newsItem-line,
  &-newsItem-link-content,
  &-newsItem-link-content::before,
  &-newsItem-link-content::after {
    transition: all ease 0.5s;
  }

  &-newsItem {
    opacity: 0.7;

    &-line {
      height: 1px;
      width: 0;
    }

    &-link-content {
      width: 3em;
      height: 1em;
      position: relative;
      overflow: hidden;

      &::before,
      &::after {
        position: absolute;
        top: 50%;
        right: 0;
      }

      &::before {
        content: '';
        width: 8px;
        height: 8px;
        background-color: black;
        border-radius: 50%;
        transform: translateY(-50%);
        opacity: 0.7;
      }

      &::after {
        content: 'more';
        transform: translate(150%, -50%);
        color: black;

        @include media-breakpoint-up(lg) {
          font-size: 14px;
        }

        @include media-breakpoint-up(xxl) {
          font-size: 16px;
        }
      }
    }

    &:hover {
      opacity: 1;

      .index-newsItem-line {
        width: 100%;
      }

      .index-newsItem-link-content {
        &::before {
          width: 0;
          height: 0;
        }

        &::after {
          transform: translate(0, -50%);
        }
      }
    }
  }

  &-concept {
    color: $gray-700;
    @include media-breakpoint-up(lg) {
      color: black;
    }

    &-title {
      @include media-breakpoint-up(lg) {
        mix-blend-mode: overlay;
      }
    }

    &-image {
      &-start {
        &-1 {
          width: 50%;
          @include media-breakpoint-up(lg) {
            width: 15vw;
          }
        }
        &-2 {
          width: 30%;
          @include media-breakpoint-up(lg) {
            width: 8vw;
          }
        }
        &-3 {
          @include media-breakpoint-up(lg) {
            width: 20vw;
          }
        }
      }
      &-end {
        &-1 {
          @include media-breakpoint-up(lg) {
            width: 22vw;
          }
        }
        &-2 {
          @include media-breakpoint-up(lg) {
            width: 10vw;
          }
        }
      }
    }
  }

  &-special {
    &-timer {
      color: $gray-500;

      @include media-breakpoint-up(lg) {
        color: black;
        mix-blend-mode: overlay;
      }
    }

    &-decoImg {
      position: absolute;
      z-index: -1;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      @include media-breakpoint-up(lg) {
        right: 0;
        transform: translateY(-50%);
      }
    }
  }
}
</style>
