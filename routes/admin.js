const express = require('express')
const Router = express.Router();

const usermanage=require('./admin/usermanage')

Router.get('/',function (req,res) {
    res.redirect('/admin/usermanage')
})


Router.use('/usermanage',usermanage);
// Router.use('/user',user);



module.exports = Router;   /*暴露这个 router模块*/
