<script>
import { mapState, mapActions } from 'pinia';
import favoriteStore from '@/stores/favoriteStore';
import toastStore from '@/stores/toastStore';

export default {
  data() {
    return {
      isLoading: false,
      isFavorite: false,
    };
  },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  watch: {
    id: 'judgeStatus',
    favoriteList: 'judgeStatus',
  },
  methods: {
    ...mapActions(favoriteStore, ['getFavoriteList']),
    ...mapActions(toastStore, ['pushMsg']),
    judgeStatus() {
      if (this.favoriteList.indexOf(this.id) === -1) {
        this.isFavorite = false;
      } else {
        this.isFavorite = true;
      }
    },
    changeFavorite() {
      this.getFavoriteList();

      if (!this.isFavorite) {
        this.favoriteList.push(this.id);

        this.pushMsg({
          style: 'success',
          title: '加入喜愛清單',
        });
      } else {
        const index = this.favoriteList.indexOf(this.id);
        this.favoriteList.splice(index, 1);

        this.pushMsg({
          style: 'primary',
          title: '移除喜愛清單',
        });
      }

      localStorage.setItem('favoriteList', JSON.stringify(this.favoriteList));
      this.judgeStatus();
    },
  },
  computed: {
    ...mapState(favoriteStore, ['favoriteList']),
  },
  created() {
    if (this.id) {
      this.judgeStatus();
    }
  },
};
</script>

<template>
  <a href="#"
    class="icon-favorite d-inline-block rounded-circle"
    :class="{ active: isFavorite }"
    @click.stop.prevent="changeFavorite"
  >
    <img class="none" src="@/assets/images/icon-like-default.svg" alt="加入喜愛清單" />
    <img class="add" src="@/assets/images/icon-like-active.svg" alt="已加入喜愛清單" />
  </a>
</template>
