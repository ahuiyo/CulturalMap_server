const express = require('express');

const Router = express.Router();

var bodyParser = require('body-parser');


var DB=require('../../DB/db.js');  /*引入DB数据库*/
// 图片上传模块   也可获取post数据
var multiparty = require('multiparty');
var ObjectID = require('mongodb').ObjectID;

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
        var id = fields.id[0];
        var username=fields.username[0];
        var gender=fields.gender[0];
        var phone=fields.phone[0];
        var city=fields.city[0];
        var remarks=fields.remarks[0];
        var avatarstate = fields.avatarstate[0]
        var setdata={};
        //修改了图片
        if(avatarstate == 1) {

            var avatar=files.avatar[0].path;
            // var originalFilename=files.avatar[0].originalFilename;
            DB.find('user',{'_id':DB.ObjectID(id)},function (err,data) {
                if(data[0].avatar !== ''){
                    fs.unlink('./'+data[0].avatar,(err) => {
                    if (err) throw err;
                    console.log('无用图片已删除');
                    setdata={
                        username,
                        gender,
                        phone,
                        city,
                        remarks,
                        avatar,
                    }
                })
                }else{
                    setdata={
                        username,
                        gender,
                        phone,
                        city,
                        remarks,
                        avatar,
                    }
                }
                DB.updateOne("user",{'_id':DB.ObjectID(id)},setdata,function (err,data) {
                    if(!err){
                        res.json({
                            code:0,
                            data:"修改成功！"
                        });
                    }else{
                        console.log(err)
                        res.json({
                            code:1,
                            data:"修改失败！"
                        });
                    }
                })
            })

        }else{
            setdata={
                username,
                gender,
                phone,
                city,
                remarks,
            }
            DB.updateOne("user",{'_id':DB.ObjectID(id)},setdata,function (err,data) {
                if(!err){
                    res.json({
                        code:0,
                        data:"修改成功！"
                    });
                }else{
                    console.log(err)
                    res.json({
                        code:1,
                        data:"修改失败！"
                    });
                }
            })
        }


    });
})

//删除用户
Router.get('/deluser',function (req,res) {
    var id =req.query.id;
    DB.find('user',{'_id':DB.ObjectID(id)},function (err,data) {
        if(!err){
            console.log('./'+data[0].avatar);
            fs.unlink('./'+data[0].avatar,function (err) {
                if(!err){
                    // let fileimg =
                    DB.deleteOne('user',{'_id':DB.ObjectID(id)},function (err,data) {
                        if(!err){
                            res.json({
                                  code:0,
                                data:"删除成功！"
                            });
                        }else{
                            res.json({
                                code:1,
                                data:"删除失败！"
                            });
                        }
                    })
                }else{
                    res.json({
                        code:1,
                        data:"删除失败！"
                    });
                }
            })

        }else{
            res.json({
                code:1,
                data:"删除失败,查无此人！"
            });
        }
    })

})

//批量删除用户
Router.post('/delusers',function (req,res) {
    var userlist=req.body.list.split(",");
    console.log(userlist)
    for(let i =0;i<userlist.length;i++){
        console.log(userlist[i])
        var id=JSON.stringify(userlist[i]);
        console.log("id" + id + "---type" + typeof id)
        DB.find('user',{'_id':ObjectID(id)},function (err,data) {

                console.log('./'+data[0].avatar);
                fs.unlink('./'+data[0].avatar,function (err) {
                    DB.deleteOne('user', {'_id': new ObjectID(id)}, function (err, data) {
                    })
                })
        })
    }

    res.json({
        code:0,
        data:"删除成功！"
    });
})

//搜索用户
Router.get('/search',function (req,res) {
    let name =req.query.name;
    console.log(name)
    DB.find('user',{'username':{$regex:name}},function (err,data) {
        console.log(data)
        if(!err){
            if(data.length > 0){
                res.json({
                    code:0,
                    msg:'搜索成功',
                    data,
                })
            }else{
                res.json({
                    code:-1,
                    msg:'查无此人',
                })
            }
        }else{
            res.json({
                code:1,
                msg:'查询失败',
            })
        }


    })
})

module.exports = Router;   /*暴露这个 router模块*/
