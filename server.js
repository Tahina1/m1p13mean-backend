const app = require("./src/app");
const { connectDB } = require("./src/config/db");
const { PORT } = require("./src/config/env");

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION — Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

const start = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED REJECTION — Shutting down...");
    console.error(err.name, err.message);
    server.close(() => process.exit(1));
  });
};

start();
