

const express=require('express');
const { newborrow, getSingleborrowing, myborrow,  getborrowed, Returnborrow, getborrowreq, updateStatus, rejectborrow, newReturn } = require('../Controllers/borrowcontroller');
const router=express.Router();
const {isauthenticateduser,authorizerole}=require("../middleware/auth.js")
router.route('/borrow/new').post(isauthenticateduser,newborrow);
router.route('/borrow/newreturn').post(isauthenticateduser,newReturn);
router.route('/borrow/my').post(isauthenticateduser,myborrow);
router.route('/borrow/admin/allreq').post(isauthenticateduser,authorizerole("admin"),getborrowreq);
router.route('/borrow/admin/allborrowed').get(isauthenticateduser,authorizerole("admin"),getborrowed);
router.route('/borrow/admin/id/:id').get(isauthenticateduser,authorizerole("admin"),getSingleborrowing);
router.route('/borrow/admin/update').post(isauthenticateduser,authorizerole("admin"),updateStatus );
router.route('/borrow/admin/update/reject').post(isauthenticateduser,authorizerole("admin"),rejectborrow );
router.route('/borrow/admin/return').post(isauthenticateduser,authorizerole("admin"),Returnborrow);
module.exports=router;