export const dbConfig = {
  url: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/praxis",
  options: {
    autoIndex: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  },
};
