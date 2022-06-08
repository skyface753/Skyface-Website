const env = process.env;

const config = {
  mongodb: {
    host: env.MONGO_HOST || "mongo",
  },
  frontend_url: env.FRONTEND_URL || "https://skyface.de",
};

module.exports = config;
