import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/experiments",
    name: "Experiments",
    component: () => import("@/views/Experiments.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
