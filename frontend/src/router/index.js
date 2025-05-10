import { createRouter, createWebHistory } from "vue-router";
import Home from "@views/Home.vue";
import Experiments from "@views/experiment/Experiments.vue";
import ExperimentDetail from "@views/experiment/ExperimentDetail.vue";
import ExperimentCreate from "@views/experiment/ExperimentCreate.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/experiments",
    name: "Experiments",
    component: Experiments,
  },
  {
    path: "/experiments/new",
    name: "ExperimentCreate",
    component: ExperimentCreate,
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
