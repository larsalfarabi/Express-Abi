const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 1212;
const hostname = process.env.HOST_NAME || "127.0.0.1";
const routers = require("./src/routes/index");
const authMiddleware = require("./src/middleware/authMiddleware");
const notFound = require("./src/middleware/404");
const errorHandling = require("./src/middleware/errorhandling");

// parse JSON
app.use(express.json());
app.use(express.static("src/storage/uploads"));
// app.use(authMiddleware);
app.use(routers);
app.use(errorHandling);
app.use(notFound);

app.listen(port, hostname, () =>
  console.log(`Server berjalan di http://${hostname}:${port}`)
);
