const express = require('express');

const Router = express.Router();

var bodyParser = require('body-parser');


var DB=require('../../DB/db.js');  /*引入DB数据库*/
// 图片上传模块   也可获取post数据
var multiparty = require('multiparty');


//引入fs模块
var fs=require("fs");
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
            code:0,
            data,
        })
    })
});
// 增加商品请求
Router.post('/adduser',function (req,res) {

    var form = new multiparty.Form({
        encoding:"utf-8",
        // uploadDir:path.join(__dirname, 'upload'),  //文件上传地址
        uploadDir:'./upload',  //文件上传地址
        keepExtensions:true  //保留后缀
    });

    form.parse(req, function(err, fields, files) {
        //获取提交的数据以及图片上传成功返回的图片信息
        // console.log(err)
        // console.log(fields);  /*获取表单的数据*/
        // console.log(files);  /*图片上传成功返回的信息*/

        var username=fields.username[0];
        var gender=fields.gender[0];
        var phone=fields.phone[0];
        var city=fields.city[0];
        var remarks=fields.remarks[0];
        var avatar=files.avatar[0].path;
        console.log(avatar);

        DB.insert('user',{
            username,
            avatar,
            gender,
            phone,
            city,
            remarks,

        },function(err,data){
            if(!err){
                res.json({
                    code:0,
                    data:"上传成功！"
                });
            }else{
                res.json({
                    code:1,
                    data:"上传失败！"
                });
            }

        })




    });
})

//修改用户请求接口
Router.post('/edituser',function (req,res) {
    var form = new multiparty.Form({
        encoding:"utf-8",
        // uploadDir:path.join(__dirname, 'upload'),  //文件上传地址
        uploadDir:'./upload',  //文件上传地址
        keepExtensions:true  //保留后缀
    });
    form.parse(req, function(err, fields, files) {
        console.log(fields)
        console.log(files)
        var id = fields.id[0];
        var username=fields.username[0];
        var gender=fields.gender[0];
        var phone=fields.phone[0];
        var city=fields.city[0];
        var remarks=fields.remarks[0];
        var avatar=files.avatar[0].path;
        var originalFilename=files.avatar[0].originalFilename;
        var setdata={};
        console.log(originalFilename+"----------------")
        if(originalFilename){
            setdata={
                username,
                gender,
                phone,
                city,
                remarks,
                avatar,
            }

        }else{
            setdata={
                username,
                gender,
                phone,
                city,
                remarks,
            }
            fs.unlink(avatar, (err) => {
                if (err) throw err;
                console.log('无用图片已删除');
            });
        }
        DB.update("user",{'_id':DB.ObjectID(id)},setdata,function (err,data) {
            if(!err){
                res.json({
                    code:0,
                    data:"修改成功！"
                });
            }else{
                res.json({
                    code:1,
                    data:"修改失败！"
                });
            }
        })
    });
})


module.exports = Router;   /*暴露这个 router模块*/
