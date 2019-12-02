//Mongo模块
const MongoClient = require('mongodb').MongoClient;
/*连接数据库*/
const DbUrl = 'mongodb://127.0.0.1:27017';

const UrlPath = 'map';

const ObjectID = require('mongodb').ObjectID;

//封装连接数据库的方法
function connectDb(callback) {
    MongoClient.connect(DbUrl,function (err,client) {
        if(err){
            console.log('数据库连接失败');
            return;
        }

        callback(client.db(UrlPath));

        client.close();/*关闭数据库连接*/
    })
}
// 封装获取数据库总数
        function totalpage(){
            return new Promise(function(resolve,reject){
                let promise = db.collection(collectionname).find().count();
                promise.then(function (response) {
                    // 成功了调用resolve()
                    resolve(response.data)
                }).catch(function (error) {
                    //失败了调用reject()
                    reject(error)
                })
            })
        }
        var total=totalpage();
        // async function aa(){
        //    total = await totalpage();
        // }
        // aa();
        console.log(total+"==========total")
//查找分页数据库
exports.findpage=function (collectionname,amount,page,callback) {
    connectDb(function (db) {
        var totalpage=0;
        db.collection(collectionname).find().count(function (err, result) {
            // 对返回值result做你想做的操作
            totalpage= result;
            var database=db.collection(collectionname).find().sort({"_id":1}).limit(amount).skip(page*amount-amount);
            console.log(database)
            database.toArray(function (error,data) {
                console.log(data + "===========data")
                callback(error,data,totalpage);/*拿到数据执行回调函数*/
            })
        });

    })
}


exports.ObjectID = ObjectID

//查找数据库
exports.find=function (collectionname,json,callback) {


    connectDb(function (db) {
        var result=db.collection(collectionname).find(json);

        result.toArray(function (error,data) {

            callback(error,data);/*拿到数据执行回调函数*/
        })
    })
}



//增加数据
exports.insert=function (collectionname,json,callback) {
    connectDb(function (db) {

        db.collection(collectionname).insert(json,function (error,data) {

            callback(error,data);
        })
    })
}

//修改数据
exports.updateOne=function (collectionname,json1,json2,callback) {
    connectDb(function (db) {

        db.collection(collectionname).update(json1,{$set:json2},function (error,data) {

            callback(error,data);
        })

    })
}

//删除数据
exports.deleteOne=function (collectionname,json,callback) {
    connectDb(function (db) {
        db.collection(collectionname).deleteOne(json,function(error,data){

            callback(error,data);
        })
    })
}
