require("dotenv").config();
require("./config/db");
const express = require("express");
const app = express();
const port = process.env.PORT || 8001;
const routes = require("./routes/index");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");

// Use Morgan for logging
app.use(morgan("tiny"));
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));

app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());
app.use(express.urlencoded({ limit: "50mb" }));


app.use("/api", routes);

app.listen(port, () => {
    console.log(`server is running on http://127.0.0.1:${port}`);
});
