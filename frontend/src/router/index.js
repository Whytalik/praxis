import { createRouter, createWebHistory } from "vue-router";
import ExperimentsList from "@/components/ExperimentsList.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/experiments",
    name: "Experiments",
    component: ExperimentsList,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
