const env = process.env;

const config = {
  mongodb: {
    host: env.MONGO_HOST || "mongo",
  },
  frontend_url: env.FRONTEND_URL || "https://skyface.de",
  jwt: {
    secret: env.JWT_SECRET || "secret",
    rounds: env.JWT_ROUNDS || 10,
  },
};

module.exports = config;
