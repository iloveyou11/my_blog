//加载express模块
const express = require('express');
//加载模板处理模块
const swig = require('swig');
//加载数据库模块
const mongoose = require('mongoose');
//加载body-parser，用来处理post提交过来的数据
const bodyParser = require('body-parser');
//加载cookies模块
const Cookies = require('cookies');
//安全性插件helmet（防护包含点击劫持、xss、嗅探攻击...）
const helmet = require('helmet');
const app = express();
const path = require("path")


let User = require('./models/User');
app.use('/public', express.static(__dirname + '/public'));


app.engine('html', swig.renderFile);
//设置模板文件存放的目录，第一个参数必须是views，第二个参数是目录
app.set('views', './views');
//注册所使用的模板引擎，第一个参数必须是 view engine，第二个参数和app.engine这个方法中定义的模板引擎的名称（第一个参数）是一致的
app.set('view engine', 'html');
//在开发过程中，需要取消模板缓存
swig.setDefaults({ cache: false });

//使用helmet全部功能
app.use(helmet());
//bodyparser设置
app.use(bodyParser.urlencoded({ extended: true }));



//设置cookie
app.use(function(req, res, next) {
    req.cookies = new Cookies(req, res);

    //解析登录用户的cookie信息
    req.userInfo = {};
    if (req.cookies.get('userInfo')) {
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));

            //获取当前登录用户的类型，是否是管理员
            User.findById(req.userInfo._id).then(function(userInfo) {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            })
        } catch (e) {
            next();
        }

    } else {
        next();
    }
});

/*
 * 根据不同的功能划分模块
 * */
app.use('/admin', require('./routes/admin'));
app.use('/api', require('./routes/api'));
app.use('/', require('./routes/main'));

//监听http请求
mongoose.connect('mongodb://localhost:27017/nodeblog', function(err) {
    if (err) {
        console.log('数据库连接失败');
    } else {
        console.log('数据库连接成功');
        app.listen(8888);
    }
});