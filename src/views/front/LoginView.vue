<script>
export default {
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
      showPassword: false,
    };
  },
  methods: {
    login() {
      const api = `${import.meta.env.VITE_API}admin/signin`;
      this.$http
        .post(api, this.user)
        .then((res) => {
          const { token, expired } = res.data;
          document.cookie = `psToken=${token}; psExpired=${new Date(expired)}`;

          if (res.data.success) {
            this.$router.push('/admin/products');
            this.$emitter.emit('push-message', {
              style: 'success',
              title: '登入成功',
            });
          } else {
            this.$emitter.emit('push-message', {
              style: 'danger',
              title: '登入失敗',
            });
          }
        });
    },
  },
  computed: {
    passwordType() {
      return this.showPassword ? 'text' : 'password';
    },
  },
};
</script>

<template>
  <div class="d-flex align-items-center overflow-hidden">
    <div class="container pt-10 pt-lg-12">
      <div class="font-serif-en text-center mb-4 mb-lg-10 position-relative">
        <h2 class="fs-display-5 fs-lg-display-1 mb-6 mb-lg-6">Login</h2>
        <p
          class="fs-normal-1 fs-lg-6 d-inline-block fw-bold
          border border-black rounded-pill py-1 px-8"
        >
          Admin
        </p>
        <img
          class="position-absolute top-50 start-50 translate-middle z-minus-1"
          src="@/assets/images/decoration-halo.svg"
          alt="decoration-halo"
        />
      </div>
      <div class="row justify-content-center font-sans-tw">
        <div class="col-11 col-lg-3">
          <VForm @submit="login" id="login" class="mb-10" v-slot="{ errors }">
            <div class="form-floating position-relative" :class="{ error: errors['email'] }">
              <VField
                type="email"
                name="email"
                id="email"
                class="form-control bg-transparent rounded-0"
                placeholder="name@example.com"
                v-model="user.username"
                rules="email|required"
              ></VField>
              <label for="email">信箱</label>
              <span class="error-bg position-absolute z-minus-1"></span>
              <ErrorMessage
                name="email"
                class="error-text position-absolute fs-6 text-danger ps-3 mb-1"
              ></ErrorMessage>
            </div>
            <div class="form-floating position-relative" :class="{ error: errors['密碼'] }">
              <button
                @click="showPassword = !showPassword"
                type="button"
                class="btn border-0 btn-custom-hover-scale-sm position-absolute bottom-0 end-0 p-1"
              >
                <img
                  v-if="!showPassword"
                  src="@/assets/images/icon-eye-close.svg"
                  alt="隱藏密碼"
                />
                <img v-else src="@/assets/images/icon-eye-open.svg" alt="觀看密碼" />
              </button>
              <VField
                :type="passwordType"
                id="password"
                name="密碼"
                class="form-control bg-transparent rounded-0 pe-10"
                placeholder="password"
                v-model="user.password"
                rules="required|min:6"
              ></VField>
              <label for="password">密碼</label>
              <span class="error-bg position-absolute z-minus-1"></span>
              <ErrorMessage
                name="密碼"
                class="error-text position-absolute fs-6 text-danger ps-3 mb-1"
              ></ErrorMessage>
            </div>
          </VForm>
          <div class="row justify-content-center">
            <div class="col-8">
              <button form="login" type="submit" class="w-100 btn-custom-light me-3">送出</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
