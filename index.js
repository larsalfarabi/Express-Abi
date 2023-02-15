const express = require("express");
const app = express();
const port = 8080;
const { sequelize } = require("./src/models");
const routers = require("./src/routes/index");
const notFound = require("./src/middleware/404");
const errorHandling = require("./src/middleware/errorhandling");
const hostname = "localhost";
const pagination = require("./src/middleware/paginationMidlleWare");
// parse JSON
app.use(express.json());
app.use(pagination);
app.use(routers);
app.use(errorHandling);
app.use(notFound);

app.listen(port, hostname, async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
  console.log(`Server berjalan di http://${hostname}:${port}`);
});
