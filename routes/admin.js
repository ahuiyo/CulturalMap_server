const express = require('express')
const Router = express.Router();

const usermanage=require('./admin/usermanage');
const login = require('./admin/login')

Router.get('/',function (req,res) {
    res.redirect('/admin/login')
})


Router.use('/usermanage',usermanage);
Router.use('/login',login);
// Router.use('/user',user);



module.exports = Router;   /*暴露这个 router模块*/
