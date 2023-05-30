const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoSBSession = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const store = new mongoSBSession({
  uri: "mongodb+srv://TranKhuongHuy:123456789%40@cluster0.wtxqxow.mongodb.net/shop?retryWrites=true",
  collection: "Session",
  databaseName: "shop",
});

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://TranKhuongHuy:123456789%40@cluster0.wtxqxow.mongodb.net/shop?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then((result) => {
    app.listen(3000);
    console.log("connected!");
  })
  .catch((err) => {
    console.log(err);
  });
