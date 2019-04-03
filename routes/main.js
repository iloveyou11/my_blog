const express = require('express');
const router = express.Router();
const multer = require('multer')
const path = require('path');
const Category = require('../models/Category');
const Content = require('../models/Content');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // 接收到文件后输出的保存路径（若不存在则需要创建）
        let filepath = path.resolve(__dirname, `../public/images/blog/`);
        cb(null, filepath);
    },
    filename: (req, file, cb) => {
        // 将保存文件名设置为 type，比如 1.pdf
        cb(null, file.originalname);
    }

});

const upload = multer({
    storage: storage,
});

// ckeditor
router.post('/getImg', upload.single('upload'), (req, res, next) => {
    let callback = req.query.CKEditorFuncNum;
    let file = req.file;
    res.send({
        "uploaded": 1,
        "fileName": file.filename,
        "url": `/public/images/blog/${file.filename}`
    });
});
// neditor
// router.post('/uploadimage', upload.single('file'), (req, res, next) => {
//     let file = req.file;
//     res.send({
//         "url": `/images/blog/${file.filename}`
//     });
// })

let data;

/*
 * 处理通用的数据
 * */
router.use(function(req, res, next) {
    data = {
        userInfo: req.userInfo,
        categories: []
    }

    Category.find().then(function(categories) {
        data.categories = categories;
        next();
    });
});

/*
 * 首页
 * */
router.get('/', function(req, res, next) {
    data.category = req.query.category || '';
    data.count = 0;
    data.page = Number(req.query.page || 1);
    data.limit = 10;
    data.pages = 0;

    let where = {};
    if (data.category) {
        where.category = data.category
    }

    Content.where(where).count().then(function(count) {

        data.count = count;
        //计算总页数
        data.pages = Math.ceil(data.count / data.limit);
        //取值不能超过pages
        data.page = Math.min(data.page, data.pages);
        //取值不能小于1
        data.page = Math.max(data.page, 1);

        let skip = (data.page - 1) * data.limit;

        return Content.where(where).find().limit(data.limit).skip(skip).populate(['category', 'user']).sort({
            addTime: -1
        });

    }).then(function(contents) {
        data.contents = contents;
        res.render('main/index', data);
    })
});

router.get('/lifeblog', function(req, res) {
    res.render('main/life');
})
router.get('/resume', function(req, res) {
    res.render('main/resume');
})
router.get('/photo', function(req, res) {
    res.render('main/photo');
})
router.get('/view', function(req, res) {

    let contentId = req.query.contentid || '';

    Content.findOne({
        _id: contentId
    }).then(function(content) {
        data.content = content;

        content.views++;
        content.save();

        res.render('main/view', data);
    });

});

module.exports = router;