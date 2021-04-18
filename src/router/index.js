/* eslint-disable prettier/prettier */
import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Portfolio from "../components/Portfolio/Portfolio.vue";
import { store } from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    // meta: { requiresAuth: true }
  },
  {
    path: "/stocks",
    name: "Stocks",
    component: () => import("../components/Stocks/Stocks.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/portfolio",
    name: "Portfolio",
    component: Portfolio,
    meta: { requiresAuth: true }
    // component: () => import("../components/Portfolio/Portfolio.vue"),
  },
  {
    path: "/signup",
    name: "Signup",
    component: () => import("../components/auth/Signup.vue"),
  },
  {
    path: "/signin",
    name: "Signin",
    component: () => import("../components/auth/Signin.vue"),
  },
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue"),
  // },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  // Check each route object and return true where the record requires an auth
  if(to.matched.some( record => record.meta.requiresAuth )) {
    
    let auth = store.getters['auth/isAuthenticated']
    console.log("from router level", auth)
    
    if( auth ) {
      next()
    } else {
      next({
        path: '/signin',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    // Pass to the next function
    next() 
  }
})


export default router;
