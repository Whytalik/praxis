import DailyEntry from "@components/experiment/DailyEntry.vue";

export default {
  title: "Experiment/DailyEntry",
  component: DailyEntry,
  tags: ["autodocs"],
  argTypes: {
    entry: {
      control: "object",
      description: "Entry data object",
    },
    experiment: {
      control: "object",
      description: "Experiment data object",
    },
    onSubmit: { action: "submitted" },
    onCancel: { action: "cancelled" },
  },
};

const Template = (args) => ({
  components: { DailyEntry },
  setup() {
    return { args };
  },
  template: '<div class="p-4"><DailyEntry v-bind="args" /></div>',
});

export const NewEntry = Template.bind({});
NewEntry.args = {
  experiment: {
    id: "",
    title: "",
    description: "",
    status: "",
    metrics: [],
    createdAt: "",
    updatedAt: "",
  },
};
