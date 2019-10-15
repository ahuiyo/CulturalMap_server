const express = require('express');

const Router = express.Router();

var bodyParser = require('body-parser');


var DB=require('../../DB/db.js');  /*引入DB数据库*/
// 图片上传模块   也可获取post数据
var multiparty = require('multiparty');

// parse application/x-www-form-urlencoded
Router.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
Router.use(bodyParser.json());

Router.get('/',function (req,res) {
    var pagenum;
    if(req.query.page){
        pagenum=req.query.page;
    }else{
        pagenum=1;
    }
    // DB.findpage('user',5,pagenum,function (error,data,total) {
    //     res.json({
    //         list:data,
    //         pagenum,
    //         total
    //     })
    // })
    DB.find('user',{},function (err,data) {
        res.json({
            data,
        })
    })
})
Router.post('/adduser',function (req,res) {



})


module.exports = Router;   /*暴露这个 router模块*/
