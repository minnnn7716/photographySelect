<script>
import { mapState, mapActions } from 'pinia';
import adminNewsStore from '@/stores/adminNewsStore';
import NewsModal from '@/components/admin/NewsModal.vue';
import DeleteModal from '@/components/admin/DeleteModal.vue';

export default {
  data() {
    return {
      tempNews: {},
      isNew: false,
      tempDelNews: {},
      source: 'News',
    };
  },
  components: {
    NewsModal,
    DeleteModal,
  },
  methods: {
    ...mapActions(adminNewsStore, ['getNews', 'deleteNews', 'switchPublic']),
    openModal(modal, isNew, item) {
      if (modal === 'deleteModal') {
        this.tempDelNews = {
          id: item.id,
          title: item.title,
          source: this.source,
        };
      } else {
        if (isNew) {
          this.tempNews = { tag: [], image: '', isPublic: false };
        } else {
          this.tempNews = { ...item };
        }

        this.isNew = isNew;
      }

      this.$refs[modal].showModal();
    },
  },
  computed: {
    ...mapState(adminNewsStore, ['news', 'newsNum', 'isLoading']),
  },
  created() {
    this.getNews();
  },
};
</script>

<template>
  <div>
    <div class="container-fluid">
      <div class="row justify-content-center pt-6 pt-lg-10">
        <div class="col-12 col-lg-11">
          <header class="d-flex justify-content-between align-items-center mb-4 mb-lg-10">
            <h3 class="fs-3 fw-normal">
              最新消息 <span class="fs-6">({{ newsNum }})</span>
            </h3>
            <button
              type="button"
              class="btn btn-gray-800"
              @click="openModal('newsModal', true)">
              新增消息
            </button>
          </header>
          <section>
            <div class="table-responsive">
              <table class="admin-table table table-hover align-middle font-sans-tw mb-12">
                <thead>
                  <tr class="fs-normal-1">
                    <th scope="col" class="d-lg-none p-0" style="width: 50px">
                      <span class="d-none">操作按鈕</span>
                    </th>
                    <th scope="col" class="fw-normal text-gray">圖片</th>
                    <th scope="col" class="fw-normal text-gray">標題</th>
                    <th scope="col" class="fw-normal text-center text-gray w-25">標籤</th>
                    <th scope="col" class="fw-normal text-center text-gray d-none d-lg-table-cell">
                      建立日期
                    </th>
                    <th scope="col" class="fw-normal text-center text-gray d-none d-lg-table-cell">
                      上架
                    </th>
                    <th scope="col" class="d-none d-lg-table-cell fw-normal w-15">
                      <span class="d-none">操作按鈕</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in news" :key="`news ${item.id}`">
                    <td class="d-lg-none p-0">
                      <button
                        type="button"
                        class="btn border-0 px-1"
                        @click="openModal('newsModal', false, item)"
                      >
                        <img src="@/assets/images/icon-edit.svg" alt="編輯" />
                      </button>
                      <button
                        type="button"
                        class="btn border-0 px-1"
                        @click="openModal('deleteModal', false, item)"
                      >
                        <img src="@/assets/images/icon-trashcan.svg" alt="刪除" />
                      </button>
                    </td>
                    <td scope="row" class="d-flex align-items-center justify-content-start">
                      <div class="admin-img me-4">
                        <img class="img-full" :src="item.image" :alt="item.title" />
                      </div>
                    </td>
                    <td>
                      {{ item.title }}
                    </td>
                    <td>
                      <div class="d-flex justify-content-center align-items-center flex-wrap">
                        <span
                          v-for="tag in item.tag"
                          :key="`${item.id}${tag}`"
                          class="badge rounded-pill bg-gray-800 fs-6 fw-normal me-2 mb-2"
                          >{{ tag }}</span
                        >
                      </div>
                    </td>
                    <td class="text-center d-none d-lg-table-cell">
                      {{ $filters.date(item.create_at) }}
                    </td>
                    <td class="d-none d-lg-table-cell">
                      <div class="form-check form-switch d-flex justify-content-center">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="newsLaunchedSwitch"
                          :checked="item.isPublic"
                          @click.prevent="switchPublic(item)"
                        />
                        <label class="form-check-label d-none" for="newsLaunchedSwitch"
                          >上架狀態</label
                        >
                      </div>
                    </td>
                    <td class="text-end d-none d-lg-table-cell">
                      <button
                        type="button"
                        class="btn border-0 btn-custom-hover-scale"
                        @click="openModal('newsModal', false, item)"
                      >
                        <img src="@/assets/images/icon-edit.svg" alt="編輯" />
                      </button>
                      <button
                        type="button"
                        class="btn border-0 btn-custom-hover-scale"
                        @click="openModal('deleteModal', false, item)"
                      >
                        <img src="@/assets/images/icon-trashcan.svg" alt="刪除" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
    <LoadingOverlay :active="isLoading" />
    <NewsModal ref="newsModal" :news="tempNews" />
    <DeleteModal ref="deleteModal" :deleteData="tempDelNews" />
  </div>
</template>
