<script>
import { mapActions } from 'pinia';
import toastStore from '@/stores/toastStore';
import modalMixin from '@/mixins/modalMixin';
import adminNewsStore from '@/stores/adminNewsStore';

export default {
  data() {
    return {
      modal: '',
      tempNews: { tag: [] },
      tempTag: '',
      tempUrlImage: '',
      tempLocalImage: '',
      hasImageFile: false,
      hasImageUrl: null,
    };
  },
  props: {
    news: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  mixins: [modalMixin],
  watch: {
    news() {
      this.tempNews = this.news;
      this.tempTag = this.news.tag.join(', ');

      if (!this.news.id) {
        this.$refs.updateNewsForm.resetForm();
      }
    },
    tempUrlImage: 'canAddImage',
    tempLocalImage: 'canAddImage',
  },
  methods: {
    ...mapActions(adminNewsStore, ['updateNews']),
    ...mapActions(toastStore, ['pushMsg']),
    canAddImage() {
      if (this.tempUrlImage === '' && (this.tempLocalImage === '' || !this.tempLocalImage)) {
        this.hasImageFile = false;
      } else {
        this.hasImageFile = true;
      }
    },
    addImage() {
      if (this.tempUrlImage === '' && this.tempLocalImage === '') {
        return;
      }

      if (this.tempUrlImage !== '') {
        this.tempNews.image = this.tempUrlImage;
      } else {
        this.uploadLocalImage();
      }

      this.hasImageUrl = true;
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
            this.tempNews.image = res.data.imageUrl;
            this.$refs.localImageInput.value = '';
          }
        })
        .catch(() => {
          this.pushMsg({
            style: 'danger',
            title: '圖片上傳失敗',
            content: '出現系統問題',
          });
        });
    },
    deleteImg() {
      this.tempNews.image = '';
      this.hasImageUrl = false;
    },
    confirmNews() {
      if (!this.tempNews.image || this.tempNews.image === '') {
        this.hasImageUrl = false;
        return;
      }

      this.hasImageUrl = true;

      this.tempNews.tag = this.tempTag.split(', ');
      this.tempNews.create_at = Date.now() / 1000;
      this.tempNews.content = this.tempNews.title;
      this.updateNews(this.tempNews);
      this.modal.hide();
    },
    closeModal() {
      this.hasImageUrl = null;
      this.modal.hide();
    },
    submitForm() {
      if (this.$refs.updateNewsForm.validate()) {
        this.confirmNews();
      }
    },
  },
};
</script>

<template>
  <div class="modal fade" tabindex="-1" ref="modal">
    <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header bg-primary-400">
          <h2 class="modal-title fs-5" id="newsModal">新增最新消息</h2>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <VForm id="newsForm" ref="updateNewsForm" v-slot="{ errors }">
            <div class="border-bottom border-gray-400 mb-6">
              <div
                class="d-flex align-items-center mb-8 modalInput"
                :class="{ error: errors['標題'] }"
              >
                <label for="newsTitle" class="form-label me-4 mb-0">標題</label>
                <div class="flex-fit">
                  <VField
                    type="text"
                    id="newsTitle"
                    name="標題"
                    rules="required"
                    v-model="tempNews.title"
                    class="form-control flex-fit py-2 rounded-3 text-black bg-gray-300"
                  ></VField>
                  <ErrorMessage
                    name="標題"
                    class="error-text position-absolute fs-6 text-danger"
                  ></ErrorMessage>
                </div>
              </div>
              <div
                class="d-flex align-items-center mb-8 modalInput"
                :class="{ error: errors['標籤'] }"
              >
                <label for="newsTag" class="form-label me-4 mb-0">標籤</label>
                <div class="flex-fit">
                  <VField
                    type="text"
                    id="newsTag"
                    name="標籤"
                    rules="required"
                    v-model="tempTag"
                    placeholder="標籤一, 標籤二, 標籤三"
                    class="form-control flex-fit py-2 rounded-3 text-black bg-gray-300"
                  ></VField>
                  <ErrorMessage
                    name="標籤"
                    class="error-text position-absolute fs-6 text-danger mb-1"
                  ></ErrorMessage>
                </div>
              </div>
              <div
                class="d-flex align-items-center mb-8 modalInput"
                :class="{ error: errors['作者'] }"
              >
                <label for="newsAuthor" class="form-label me-4 mb-0">作者</label>
                <div class="flex-fit">
                  <VField
                    type="text"
                    id="newsAuthor"
                    name="作者"
                    rules="required"
                    v-model="tempNews.author"
                    class="form-control flex-fit py-2 rounded-3 text-black bg-gray-300"
                  ></VField>
                  <ErrorMessage
                    name="作者"
                    class="error-text position-absolute fs-6 text-danger mb-1"
                  ></ErrorMessage>
                </div>
              </div>
              <div
                class="col-12 d-flex align-items-center mb-8 modalInput"
                :class="{ error: errors['內文'] }"
              >
                <label for="newsDescription" class="form-label me-4 mb-0">內文</label>
                <div class="flex-fit">
                  <VField
                    as="textarea"
                    type="text"
                    rows="5"
                    id="newsDescription"
                    name="內文"
                    rules="required"
                    v-model="tempNews.description"
                    class="form-control flex-fit py-2 rounded-3 bg-gray-300"
                  ></VField>
                  <ErrorMessage
                    name="內文"
                    class="error-text position-absolute fs-6 text-danger mb-1"
                  ></ErrorMessage>
                </div>
              </div>
            </div>
            <div class="mb-4">
              <div
                class="d-flex flex-column flex-lg-row align-items-start align-items-lg-center mb-3"
              >
                <label for="newsImage" class="form-label me-3 mb-1 mb-lg-0">新增圖片</label>
                <span class="fs-normal-1 bg-primary-300 rounded-pill px-3 py-1 me-3 mb-1 mb-lg-0"
                  >單一檔案必須小於 1MB</span
                >
                <span class="fs-normal-1 bg-primary-300 rounded-pill px-3 py-1 mb-1 mb-lg-"
                  >僅能上傳 1 張圖片</span
                >
              </div>
              <div class="mb-6 modalInput" :class="{ error: hasImageUrl === false }">
                <div
                  class="d-flex flex-column flex-lg-row
                  align-items-stretch align-items-lg-center mb-1"
                >
                  <div class="d-flex align-items-center flex-fit mb-3 mb-lg-0">
                    <input
                      type="text"
                      class="form-control flex-fit py-2 rounded-3 bg-gray-300 me-3"
                      id="newsImage"
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
                    確定
                  </button>
                </div>
                <p class="error-text position-absolute fs-6 text-danger mb-1">圖片 為必填</p>
              </div>
              <div style="width: 100px" v-if="tempNews.image !== ''">
                <img
                  class="img-full mb-1"
                  style="height: 140px"
                  :src="tempNews.image"
                  :alt="tempNews.title"/>
                <button
                  type="button"
                  class="d-block btn btn-danger-700 fs-normal-1 w-100"
                  @click="deleteImg"
                >
                  刪除
                </button>
              </div>
            </div>
          </VForm>
        </div>
        <div class="modal-footer bg-gray-200 justify-content-between">
          <div class="form-check form-switch">
            <label class="form-check-label" for="newsModalLaunchedSwitch"
              >上架<span class="d-none d-lg-inline">狀態</span></label
            >
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              id="newsModalLaunchedSwitch"
              v-model="tempNews.isPublic"
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
              type="submit"
              class="btn btn-gray-800 px-8 px-lg-10"
              @click="submitForm"
            >
              確定
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
