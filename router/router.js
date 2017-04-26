/**
 * Created by Administrator on 2017/4/24.
 */
var db = require("../model/db.js");
var md5 = require("../model/md5.js");
var formidable = require("formidable");
var path = require("path");
var fs = require("fs");
var gm = require("gm");
//首页
exports.showIndex = function(req, res, next){
    //查找头像
    if (req.session.login == "1"){
        db.find("users", {"username": req.session.username}, function(err, result){
            var avatar = result[0].avatar || "moren.jpg";
            res.render("index", {
                "login": req.session.login == "1" ? true : false,
                "username": req.session.login == "1" ? req.session.username : "",
                "active": "首页",
                "avatar": avatar
            });
        });
    }else {
        res.render("index", {
            "login": req.session.login == "1" ? true : false,
            "username": req.session.login == "1" ? req.session.username : "",
            "active": "首页",
            "avatar": "moren.jpg"
        });
    }
}
//注册页
exports.showRegist = function(req, res, next){
    res.render("regist", {
        "login": req.session.login == "1" ? true : false,
        "username": req.session.login == "1" ? req.session.username : "",
        "active": "注册"
    });
}
//注册业务
exports.doRegist = function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;
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
            "password": password,
            "avatar": "moren.jpg"
        }, function(err, result){
            if (err){
                res.send("-3");
                return;
            }
            req.session.login = "1";
            req.session.username = username;
            res.send("1");
            return;
        });
    });
}
//登录页
exports.showLogin = function(req, res, next){
    res.render("login", {
        "login": req.session.login == "1" ? true : false,
        "username": req.session.login == "1" ? req.session.username : "",
        "active": "登录"
    });
}
//登录业务
exports.doLogin = function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;
    db.find("users", {"username": username}, function(err,result){
        password = md5(md5(password) + "考拉");
        if (err){
            res.send("-3");
            return;
        }
        if (result.length == 0) {
            res.send("-1");
            return;
        }
        if (result[0].password == password){
            req.session.login = "1";
            req.session.username = username;
            res.send("1");
            return;
        }else {
            res.send("-5");
            return;
        }
    });
}
//上传头像页
exports.showSetavatar = function(req, res, next){
    if(req.session.login != "1"){
        res.redirect("/login");
    }else {
        res.render("setavatar", {
            "login": true,
            "username": req.session.username,
            "active": "个人",
            "alert": 0
        });
    }

}
//上传头像业务
exports.doSetavatar = function(req, res, next){
    var form = new formidable.IncomingForm();
    form.uploadDir = path.normalize(__dirname + "/../avatar");
    form.parse(req, function(err, fields, files){
        var oldpath = files.touxiang.path;
        var newpath = path.normalize(__dirname + "/../avatar") + "/" + req.session.username + ".jpg";

        fs.rename(oldpath, newpath, function(err){
            console.log("上传成功");
            if (err){
                res.render("setavatar", {
                    "login": true,
                    "username": req.session.username,
                    "active": "个人",
                    "alert": -1
                });
            }else {
                req.session.avatar = req.session.username + ".jpg";
                res.render("setavatar", {
                    "login": true,
                    "username": req.session.username,
                    "active": "个人",
                    "alert": 1
                });
            }
        });
    });
}

//删除cookie
exports.delCookie = function(req, res, next){
    req.session.login = "";
    req.session.username = "";
    res.redirect("/");
}
//剪切页
exports.showCut = function(req, res, next){
    if(req.session.login != "1"){
        res.render("login", {
            "login": false,
            "username": "",
            "active": "首页",
            "avatar": "moren.jpg"
        });
    }else {
        res.render("cut", {
            "login": req.session.login == "1" ? true : false,
            "username": req.session.login == "1" ? req.session.username : "",
            "active": "个人",
            "avatar": req.session.avatar
        });
    }

}
//图片剪切
exports.doCut = function(req, res, next){
    //这个页面接收几个GET请求参数
    //文件名、w、h、x、y
    var filename = req.session.avatar;
    var w = req.query.w;
    var h = req.query.h;
    var x = req.query.x;
    var y = req.query.y;

    gm("./avatar/" + filename)
        .crop(w,h,x,y)
        .resize(100,100,"!")
        .write("./avatar/" + filename,function(err){
            if(err){
                console.log(err);
                res.send("-1");
                return;
            }
            db.updateMany("users", {"username": req.session.username},{
               $set : {"avatar": filename}}, function(err, result) {
                if (err){
                    res.send("图片写入数据库出错！");
                    return;
                }
                res.send("1");
            });

        });
}