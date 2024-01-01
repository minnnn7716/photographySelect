<script>
import emitter from '@/methods/emitter';

export default {
  data() {
    return {
      favoriteList: [],
      isFavorite: false,
      OuterFavoriteList: [],
      isLoading: false,
    };
  },
  props: ['id'],
  watch: {
    id: 'judgeStatus',
    OuterFavoriteList: 'judgeStatus',
  },
  methods: {
    getFavoriteList() {
      const list = localStorage.getItem('favoriteList');
      this.favoriteList = list === null ? [] : JSON.parse(list);
    },
    judgeStatus() {
      this.getFavoriteList();

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

        emitter.emit('push-message', {
          style: 'success',
          title: '加入喜愛清單',
        });
      } else {
        const index = this.favoriteList.indexOf(this.id);
        this.favoriteList.splice(index, 1);

        emitter.emit('push-message', {
          style: 'primary',
          title: '移除喜愛清單',
        });
      }

      localStorage.setItem('favoriteList', JSON.stringify(this.favoriteList));
      this.judgeStatus();
    },
  },
  created() {
    if (this.id) this.judgeStatus(this.id);
  },
  mounted() {
    this.$emitter.on('push-favorite', (obj) => {
      this.OuterFavoriteList = obj;
    });
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
