var express = require("express");
var app = express();
var router = require("./router/router.js");
var bodyParser = require("body-parser");
var session = require("express-session");

app.set("view engine", "ejs");

app.use(express.static("./public"));
app.use("/avatar", express.static("./avatar"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.get("/", router.showIndex);
app.get("/regist", router.showRegist);
app.post("/doregist", router.doRegist);
app.get("/login", router.showLogin);
app.post("/dologin", router.doLogin);
app.get("/setavatar", router.showSetavatar);
app.post("/dosetavatar", router.doSetavatar);
app.get("/delcookie", router.delCookie);
app.get("/cut", router.showCut);
app.get("/docut", router.doCut);


app.listen(3000);