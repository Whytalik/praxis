import ExperimentCard from "@components/experiment/ExperimentCard.vue";

export default {
  title: "Experiment/ExperimentCard",
  component: ExperimentCard,
  tags: ["autodocs"],
  argTypes: {
    experiment: {
      control: "object",
      description: "Experiment data object",
    },
    onStatusChange: { action: "statusChanged" },
    onDelete: { action: "deleted" },
  },
};

const Template = (args) => ({
  components: { ExperimentCard },
  setup() {
    return { args };
  },
  template: '<ExperimentCard v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
  experiment: {
    _id: "1",
    title: "Temperature Study",
    description: "Study of temperature effects on growth",
    status: "in progress",
    metrics: [
      {
        name: "temperature",
        typeId: "1",
      },
    ],
    createdAt: "2024-03-15T10:00:00.000Z",
    updatedAt: "2024-03-15T10:00:00.000Z",
  },
};

export const Completed = Template.bind({});
Completed.args = {
  experiment: {
    _id: "2",
    title: "pH Analysis",
    description: "Analysis of pH levels in different solutions",
    status: "completed",
    metrics: [
      {
        name: "pH",
        typeId: "2",
      },
    ],
    createdAt: "2024-03-14T10:00:00.000Z",
    updatedAt: "2024-03-15T15:00:00.000Z",
  },
};
