const express = require('express');

const Router = express.Router();

const bodyParser = require('body-parser');


const DB = require('../../DB/db.js');  /*引入DB数据库*/
// 图片上传模块   也可获取post数据
const multiparty = require('multiparty');
const ObjectID = require('mongodb').ObjectID;

//引入fs模块
const fs = require("fs");
// parse application/x-www-form-urlencoded
Router.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
Router.use(bodyParser.json());

Router.get('/',function (req,res) {


        res.json({
            code:0,
        })
});
module.exports = Router;   /*暴露这个 router模块*/
