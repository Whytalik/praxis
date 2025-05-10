import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Experiment Management API",
      version: "1.0.0",
      description: "API documentation for Experiment Management System",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        Experiment: {
          type: "object",
          required: ["title", "description", "status"],
          properties: {
            _id: {
              type: "string",
              description: "The auto-generated id of the experiment",
            },
            title: {
              type: "string",
              description: "The title of the experiment",
            },
            description: {
              type: "string",
              description: "The description of the experiment",
            },
            status: {
              type: "string",
              enum: ["planned", "in_progress", "completed", "cancelled"],
              description: "The current status of the experiment",
            },
            metrics: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  typeId: { type: "string" },
                  type: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      unit: { type: "string" },
                      validation: {
                        type: "object",
                        properties: {
                          type: { type: "string" },
                          min: { type: "number" },
                          max: { type: "number" },
                        },
                      },
                    },
                  },
                },
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "The date the experiment was created",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "The date the experiment was last updated",
            },
          },
        },
        Entry: {
          type: "object",
          required: ["experimentId", "values"],
          properties: {
            _id: {
              type: "string",
              description: "The auto-generated id of the entry",
            },
            experimentId: {
              type: "string",
              description: "The id of the experiment this entry belongs to",
            },
            values: {
              type: "object",
              description: "The metric values for this entry",
              additionalProperties: {
                type: "number",
              },
            },
            conclusion: {
              type: "string",
              description: "The conclusion or notes for this entry",
            },
            date: {
              type: "string",
              format: "date-time",
              description: "The date of the entry",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
