import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'FrontLayout',
    component: () => import('@/views/FrontLayout.vue'),
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('@/views/front/HomeView.vue'),
        meta: {
          title: '集攝｜Photography Select',
        },
      },
      {
        path: 'news',
        name: 'News',
        component: () => import('@/views/front/NewsList.vue'),
        meta: {
          title: '集攝 - 最新消息',
        },
      },
      {
        path: 'news/:id',
        component: () => import('@/views/front/NewsView.vue'),
        props: (route) => ({ id: route.params.id }),
        meta: {
          title: '集攝 - 最新消息',
        },
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('@/views/front/ProductsList.vue'),
        meta: {
          title: '集攝 - 精選商品',
        },
      },
      {
        path: 'products/:id',
        component: () => import('@/views/front/ProductView.vue'),
        props: (route) => ({ id: route.params.id }),
        meta: {
          title: '集攝 - 精選商品',
        },
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('@/views/front/CartView.vue'),
        meta: {
          title: '集攝 - 購物車',
        },
      },
      {
        path: 'checkout',
        name: 'Checkout',
        component: () => import('@/views/front/CheckOut.vue'),
        meta: {
          title: '集攝 - 購買流程',
        },
      },
      {
        path: 'order',
        name: 'OrderSearch',
        component: () => import('@/views/front/OrderSearch.vue'),
        meta: {
          title: '集攝 - 訂單查詢',
        },
      },
      {
        path: 'order/:id',
        component: () => import('@/views/front/OrdersView.vue'),
        props: (route) => ({ id: route.params.id }),
        meta: {
          title: '集攝 - 訂單',
        },
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/front/LoginView.vue'),
        meta: {
          title: '集攝 - 管理員登入',
        },
      },
      {
        path: 'notfound',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue'),
        meta: {
          title: '集攝 - 找不到頁面',
        },
      },
    ],
  },
  {
    path: '/admin',
    name: 'AdminLayout',
    component: () => import('@/views/AdminLayout.vue'),
    meta: {
      title: '集攝 - 後台',
    },
    children: [
      {
        path: 'products',
        name: 'AdminProducts',
        component: () => import('@/views/admin/AdminProducts.vue'),
        meta: {
          title: '集攝 - 商品後台',
        },
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: () => import('@/views/admin/AdminOrders.vue'),
        meta: {
          title: '集攝 - 訂單後台',
        },
      },
      {
        path: 'coupons',
        name: 'AdminCoupons',
        component: () => import('@/views/admin/AdminCoupons.vue'),
        meta: {
          title: '集攝 - 折價券後台',
        },
      },
      {
        path: 'news',
        name: 'AdminNews',
        component: () => import('@/views/admin/AdminNews.vue'),
        meta: {
          title: '集攝 - 消息後台',
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: {
      name: 'NotFound',
      params: {},
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router;
