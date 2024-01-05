<script>
import { mapActions } from 'pinia';
import adminProductStore from '@/stores/adminProductStore';
import toastStore from '@/stores/toastStore';
import modalMixin from '@/mixins/modalMixin';
import RatingScore from '../front/RatingScore.vue';

export default {
  data() {
    return {
      modal: '',
      tempProduct: {},
      tempUrlImage: '',
      tempLocalImage: '',
      hasImageFile: false,
      hasImagesUrl: null,
      overImage: false,
    };
  },
  components: {
    RatingScore,
  },
  props: {
    product: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  mixins: [modalMixin],
  watch: {
    product() {
      if (this.product.id) {
        this.tempProduct = JSON.parse(JSON.stringify(this.product));
      } else {
        this.tempProduct = { ...this.product };
        this.$refs.updateProductForm.resetForm();
      }
    },
    tempUrlImage: 'canAddImage',
    tempLocalImage: 'canAddImage',
  },
  methods: {
    ...mapActions(adminProductStore, ['updateProduct']),
    ...mapActions(toastStore, ['pushMsg']),
    canAddImage() {
      if (this.tempUrlImage === '' && (this.tempLocalImage === '' || !this.tempLocalImage)) {
        this.hasImageFile = false;
      } else {
        this.hasImageFile = true;
      }
    },
    addImage() {
      if (!this.tempProduct.imagesUrl) {
        this.tempProduct.imagesUrl = [];
      }

      if (this.tempProduct.imagesUrl.length >= 5) {
        this.overImage = true;

        setTimeout(() => { this.overImage = false; }, 2000);
        return;
      }

      if (this.tempUrlImage !== '') {
        this.tempProduct.imagesUrl.push(this.tempUrlImage);
      } else {
        this.uploadLocalImage();
      }

      this.hasImagesUrl = true;
      this.tempUrlImage = '';
      this.tempLocalImage = '';
      this.$refs.localImageInput.value = '';
    },
    getLocalImage() {
      const localImageInput = this.$refs.localImageInput.files[0];
      this.tempLocalImage = localImageInput;
    },
    uploadLocalImage() {
      const formData = new FormData();
      formData.append('file-to-upload', this.tempLocalImage);
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/admin/upload`;
      this.$http
        .post(api, formData)
        .then((res) => {
          if (res.data.success) {
            this.tempProduct.imagesUrl.push(res.data.imageUrl);
            this.$refs.localImageInput.value = '';
          }
        })
        .catch((err) => {
          if (err.request.status === 404) {
            this.pushMsg({
              style: 'danger',
              title: '圖片上傳失敗',
              content: '出現系統問題',
            });
          }
        });
    },
    deleteImg(index) {
      this.tempProduct.imagesUrl.splice(index, 1);
      if (!this.tempProduct.imagesUrl.length) this.hasImagesUrl = false;
    },
    confirmProduct() {
      if (!this.tempProduct.imagesUrl || !this.tempProduct.imagesUrl.length) {
        this.hasImagesUrl = false;
        return;
      }

      this.hasImagesUrl = true;

      const imageUrl = this.tempProduct.imagesUrl[0];
      this.tempProduct.imageUrl = imageUrl;
      this.updateProduct(this.tempProduct);
      this.modal.hide();
    },
    closeModal() {
      this.hasImagesUrl = null;
      this.modal.hide();
    },
    submitForm() {
      if (this.$refs.updateProductForm.validate()) {
        this.confirmProduct();
      }
    },
  },
};
</script>

<template>
  <div class="modal fade" id="productModal" tabindex="-1" ref="modal">
    <div class="modal-dialog modal-dialog-scrollable modal-xl modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-primary-400">
          <h2 class="modal-title fs-5" id="productModal">新增商品</h2>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="container">
            <VForm ref="updateProductForm" v-slot="{ errors }">
              <div class="row border-bottom border-gray-400 mb-6">
                <div
                  class="col-12 col-lg-4 d-flex align-items-center mb-6 mb-lg-8 modalInput"
                  :class="{ error: errors['分類'] }"
                >
                  <label for="type" class="form-label me-4 mb-0">分類</label>
                  <div class="flex-fit">
                    <VField
                      as="select"
                      id="type"
                      name="分類"
                      rules="required"
                      v-model="tempProduct.category"
                      class="form-select py-2 rounded-3 bg-gray-300"
                    >
                      <option selected disabled>商品分類</option>
                      <option value="人物">人物</option>
                      <option value="食物">食物</option>
                      <option value="植物">植物</option>
                      <option value="動物">動物</option>
                      <option value="景致">景致</option>
                      <option value="複合">複合</option>
                    </VField>
                    <ErrorMessage
                      name="分類"
                      class="error-text position-absolute fs-normal-1 fs-lg-6 text-danger"
                    ></ErrorMessage>
                  </div>
                </div>
                <div
                  class="col-12 col-lg-4 d-flex align-items-center mb-6 mb-lg-8 modalInput"
                  :class="{ error: errors['標題'] }"
                >
                  <label for="title" class="form-label me-4 mb-0">標題</label>
                  <div class="flex-fit">
                    <VField
                      type="text"
                      name="標題"
                      id="title"
                      rules="required"
                      v-model="tempProduct.title"
                      class="form-control py-2 rounded-3 bg-gray-300 text-black"
                    ></VField>
                    <ErrorMessage
                      name="標題"
                      class="error-text position-absolute fs-normal-1 fs-lg-6 text-danger mb-1"
                    ></ErrorMessage>
                  </div>
                </div>
                <div
                  class="col-12 col-lg-4 d-flex align-items-center mb-6 mb-lg-8 modalInput"
                  :class="{ error: errors['作者'] }"
                >
                  <label for="author" class="form-label me-4 mb-0">作者</label>
                  <div class="flex-fit">
                    <VField
                      type="text"
                      name="作者"
                      id="author"
                      rules="required"
                      v-model="tempProduct.author"
                      class="form-control py-2 rounded-3 bg-gray-300"
                    ></VField>
                    <ErrorMessage
                      name="作者"
                      class="error-text position-absolute fs-normal-1 fs-lg-6 text-danger mb-1"
                    ></ErrorMessage>
                  </div>
                </div>
                <div
                  class="col-12 col-lg-4 d-flex align-items-center mb-6 mb-lg-8 modalInput"
                  :class="{ error: errors['定價'] }"
                >
                  <label for="originPrice" class="form-label me-4 mb-0">定價</label>
                  <div class="flex-fit">
                    <VField
                      type="number"
                      min="0"
                      id="originPrice"
                      name="定價"
                      rules="required"
                      v-model="tempProduct.origin_price"
                      class="form-control py-2 rounded-3 bg-gray-300"
                    ></VField>
                    <ErrorMessage
                      name="定價"
                      class="error-text position-absolute fs-normal-1 fs-lg-6 text-danger mb-1"
                    ></ErrorMessage>
                  </div>
                </div>
                <div
                  class="col-12 col-lg-4 d-flex align-items-center mb-6 mb-lg-8 modalInput"
                  :class="{ error: errors['售價'] }"
                >
                  <label for="salePrice" class="form-label me-4 mb-0">售價</label>
                  <div class="flex-fit">
                    <VField
                      type="number"
                      min="0"
                      id="salePrice"
                      name="售價"
                      rules="required"
                      v-model="tempProduct.price"
                      class="form-control py-2 rounded-3 bg-gray-300"
                    ></VField>
                    <ErrorMessage
                      name="售價"
                      class="error-text position-absolute fs-normal-1 fs-lg-6 text-danger mb-1"
                    ></ErrorMessage>
                  </div>
                </div>
                <div
                  class="col-12 col-lg-4 d-flex align-items-center mb-6 mb-lg-8 modalInput"
                  :class="{ error: errors['單位'] }"
                >
                  <label for="unit" class="form-label me-4 mb-0">單位</label>
                  <div class="flex-fit">
                    <VField
                      type="text"
                      id="unit"
                      name="單位"
                      rules="required"
                      v-model="tempProduct.unit"
                      class="form-control flex-fit py-2 rounded-3 bg-gray-300"
                    ></VField>
                    <ErrorMessage
                      name="單位"
                      class="error-text position-absolute fs-normal-1 fs-lg-6 text-danger mb-1"
                    ></ErrorMessage>
                  </div>
                </div>
                <div
                  class="col-12 col-lg-4 d-flex align-items-center mb-6 mb-lg-8 modalInput"
                  :class="{ error: errors['總數'] }"
                >
                  <label for="totalNum" class="form-label me-4 mb-0">總數</label>
                  <div class="flex-fit">
                    <VField
                      type="number"
                      min="1"
                      id="totalNum"
                      name="總數"
                      rules="required"
                      v-model="tempProduct.totalNum"
                      class="form-control flex-fit py-2 rounded-3 bg-gray-300"
                    ></VField>
                    <ErrorMessage
                      name="總數"
                      class="error-text position-absolute fs-normal-1 fs-lg-6 text-danger mb-1"
                    ></ErrorMessage>
                  </div>
                </div>
                <div class="col-6 col-lg-2 d-flex align-items-center mb-6 mb-lg-8">
                  <p class="me-4">銷量</p>
                  <p>{{ tempProduct.soldNum }}</p>
                </div>
                <div class="col-6 col-lg-2 d-flex align-items-center mb-6 mb-lg-8">
                  <p class="me-4">剩餘</p>
                  <p>{{ tempProduct.totalNum - tempProduct.soldNum }}</p>
                </div>
                <div class="col-12 col-lg-4 d-flex align-items-center mb-6 mb-lg-8">
                  <p class="me-4">評價</p>
                  <RatingScore
                    :rate="tempProduct.rate"
                    :rateNum="tempProduct.rateNum"
                  />
                  <p class="ms-1">/ {{ tempProduct.rateNum }} 則</p>
                </div>
                <div
                  class="col-12 d-flex align-items-center mb-6 mb-lg-8 modalInput"
                  :class="{ error: errors['規格'] }"
                >
                  <label for="format" class="form-label me-4 mb-0">規格</label>
                  <div class="flex-fit">
                    <VField
                      type="text"
                      name="規格"
                      id="format"
                      class="form-control flex-fit py-2 rounded-3 bg-gray-300"
                      v-model="tempProduct.format"
                      rules="required"
                    ></VField>
                    <ErrorMessage
                      name="規格"
                      class="error-text position-absolute fs-normal-1 fs-lg-6 text-danger mb-1"
                    ></ErrorMessage>
                  </div>
                </div>
                <div
                  class="col-12 d-flex align-items-center mb-6 mb-lg-8 modalInput"
                  :class="{ error: errors['內文'] }"
                >
                  <label for="content" class="form-label me-4 mb-0">內文</label>
                  <div class="flex-fit">
                    <VField
                      as="textarea"
                      type="text"
                      name="內文"
                      id="content"
                      class="form-control flex-fit py-2 rounded-3 bg-gray-300"
                      rows="5"
                      v-model="tempProduct.content"
                      rules="required"
                    ></VField>
                    <ErrorMessage
                      name="內文"
                      class="error-text position-absolute fs-normal-1 fs-lg-6 text-danger mb-1"
                    ></ErrorMessage>
                  </div>
                </div>
              </div>
              <div class="mb-4">
                <div
                  class="d-flex flex-column flex-lg-row
                  align-items-start align-items-lg-center mb-3"
                >
                  <label for="image" class="form-label mb-0 me-3 mb-1 mb-lg-0">新增圖片</label>
                  <span class="fs-normal-1 bg-primary-300 rounded-pill px-3 py-1 me-3 mb-1 mb-lg-0"
                    >單一檔案必須小於 1MB</span
                  >
                  <span class="fs-normal-1 bg-primary-300 rounded-pill px-3 py-1 mb-1 mb-lg-0"
                    >最多 5 張圖</span
                  >
                </div>
                <div
                  class="mb-8 modalInput"
                  :class="{ error: hasImagesUrl === false || overImage }">
                  <div
                    class="d-flex flex-column flex-lg-row
                    align-items-stretch align-items-lg-center mb-1"
                  >
                    <div class="d-flex align-items-center flex-fit mb-3 mb-lg-0">
                      <input
                        type="text"
                        class="form-control flex-fit py-2 rounded-3 bg-gray-300 me-3"
                        id="image"
                        placeholder="貼上圖片網址"
                        v-model="tempUrlImage"
                      />
                      <p class="me-3">或</p>
                    </div>
                    <div class="input-group flex-fit me-3 mb-3 mb-lg-0">
                      <input
                        type="file"
                        class="form-control bg-gray-300 py-2"
                        accept="image/png, image/jpeg"
                        placeholder="上傳電腦中圖片"
                        @change="getLocalImage"
                        ref="localImageInput"
                      />
                    </div>
                    <button
                      type="button"
                      class="btn btn-gray-800 py-2 px-4"
                      @click="addImage"
                      :disabled="!hasImageFile"
                    >
                      確定新增
                    </button>
                  </div>
                  <p class="error-text position-absolute fs-normal-1 fs-lg-6 text-danger mb-1">
                    <span v-if="hasImagesUrl === false">圖片 為必填</span>
                    <span v-else>最多五張圖片</span>
                  </p>
                </div>
                <ul class="list-unstyled d-flex">
                  <li></li>
                  <li
                    v-for="(img, index) in tempProduct.imagesUrl"
                    :key="`圖片 ${index}`"
                    :class="{ 'me-3': index !== tempProduct.imagesUrl.length - 1 }"
                  >
                    <img
                      class="img-full mb-1"
                      style="height: 140px; width: 100px"
                      :src="img"
                      :alt="`${tempProduct.title} 圖片`"
                    />
                    <button
                      type="button"
                      class="d-block btn btn-danger-700 fs-normal-1 w-100"
                      @click="deleteImg(index)"
                    >
                      刪除
                    </button>
                  </li>
                </ul>
              </div>
            </VForm>
          </div>
        </div>
        <div class="modal-footer bg-gray-200 justify-content-between">
          <div class="form-check form-switch">
            <label class="form-check-label" for="productModalLaunchedSwitch"
              >上架<span class="d-none d-lg-inline">狀態</span></label
            >
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              id="productModalLaunchedSwitch"
              v-model="tempProduct.is_enabled"
            />
          </div>
          <div>
            <button
              type="button"
              class="btn btn-outline-gray-800 px-8 px-lg-10 me-2 me-lg-4"
              @click="closeModal"
            >
              取消
            </button>
            <button
              @click.prevent="submitForm"
              type="submit"
              class="btn btn-gray-800 px-8 px-lg-10"
            >
              確定
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
