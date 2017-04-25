var express = require("express");
var app = express();
var router = require("./router/router.js");
var bodyParser = require('body-parser')

app.set("view engine", "ejs");

app.use(express.static("./public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", router.showIndex);
app.get("/regist", router.showRegist);
app.post("/doregist", router.doRegist);
app.get("/login", router.showLogin);


app.listen(3000);