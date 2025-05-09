import { Experiment } from "../models/experiment.model.js";

export const experimentController = {
  // Get all experiments
  async getAll(req, res) {
    try {
      const experiments = await Experiment.find().sort({ createdAt: -1 });
      res.json(experiments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get single experiment by ID
  async getById(req, res) {
    try {
      const experiment = await Experiment.findById(req.params.id);
      if (!experiment) {
        return res.status(404).json({ message: "Experiment not found" });
      }
      res.json(experiment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create new experiment
  async create(req, res) {
    try {
      const experiment = new Experiment(req.body);
      const savedExperiment = await experiment.save();
      res.status(201).json(savedExperiment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update experiment
  async update(req, res) {
    try {
      const experiment = await Experiment.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!experiment) {
        return res.status(404).json({ message: "Experiment not found" });
      }
      res.json(experiment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete experiment
  async delete(req, res) {
    try {
      const experiment = await Experiment.findByIdAndDelete(req.params.id);
      if (!experiment) {
        return res.status(404).json({ message: "Experiment not found" });
      }
      res.json({ message: "Experiment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
