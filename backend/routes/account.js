const express = require("express");
const { authMiddleware } = require("./middleware");
const { default: mongoose } = require("mongoose");
const {Account} = require("../db")

const router = express.Router();

router.get("/balance", authMiddleware, async(req, res)=> {
    const account = await Account.findOne({
        userId: req.userId
    });
    res.status(200).json({
        balance: account.balance
    })
});

router.post("/transfer", authMiddleware, async(req, res) =>{
    const session = await mongoose.startSession();

    session.startTransaction();
    const {amount , to} = req.body;
    const account = await Account.findOne({userId: req.userId}).session(session);
    if(!account || account.balance < amount ){
        await session.abortTransaction();
        return res.status(400).json({
            msg: "insufficient balance"
        })
    }
    const toAccount = await Account.findOne({userId: to}).session(session);
    if(!toAccount){
        await session.abortTransaction();
        return res.status(404).json({
            msg: 'Invalid account'
        })
    }
    await Account.updateOne ({userId: req.userId},{$inc:{balance: -amount}}).session(session);
    await Account.updateOne({userId: to}, {$inc:{balance: account}}).session(session);
    await session.commitTransaction();
    res.json({
        msg:"Transfer successfull"
    })
})

module.exports = router;