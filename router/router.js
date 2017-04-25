/**
 * Created by Administrator on 2017/4/24.
 */
var db = require("../model/db.js");
var md5 = require("../model/md5.js");
//首页
exports.showIndex = function(req, res, next){
    res.render("index");
}
//注册页
exports.showRegist = function(req, res, next){
    res.render("regist");
}
//注册业务
exports.doRegist = function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;
    console.log(username + " " + password);
    db.find("users", {"username": username}, function(err,result){
        if (err){
            res.send("-3");
            return;
        }
        if (result.length != 0) {
            res.send("-1");
            return;
        }
        password = md5(md5(password) + "考拉");
        db.insertOne("users", {
            "username": username,
            "password": password
        }, function(err, result){
            if (err){
                res.send("-3");
                return;
            }
            res.send("1");
        });
    });
}
//登录页
exports.showLogin = function(req, res, next){
    res.render("login");
}