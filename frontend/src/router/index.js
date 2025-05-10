import { createRouter, createWebHistory } from "vue-router";
import Home from "@views/Home.vue";
import ExperimentsList from "@/views/experiment/ExperimentsList.vue";
import ExperimentDetail from "@views/experiment/ExperimentDetail.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/experiments",
    name: "Experiments",
    component: ExperimentsList,
  },
  {
    path: "/experiments/:id",
    name: "ExperimentDetail",
    component: ExperimentDetail,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
