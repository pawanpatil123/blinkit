const express = require("express");
const {Payment} = require("../models/payment");
const {orderModel, validateOrder} = require("../models/order");
const {cartModel,validateCart} = require("../models/cart");


const router = express.Router();

router.get("/:userid/:orderid/:paymentid/:signature", async function (req,res){
    let paymentDetails = await Payment.findOne({
        orderId: req.params.orderid,
    });
    if(!paymentDetails) return res.send("Sorry, this order doesnot exist");
    if(
        req.params.signature === paymentDetails.signature && req.params.paymentid===paymentDetails.paymentId
    ){
        let cart = cartModel.findOne({user: req.params.userid})
      await  orderModel.create({
            orderId: req.params.orderId,
             user: req.params.userid,
             products: cart.products,
             totalPrice: cart.totalprice,
             status:"processing",
             payment: paymentDetails._id,

        })
        res.redirect(`/map/${req.params.orderid}`)
    }
    else{
        res.send("invalid payment")

    }
})
router.get("/address/:orderid", async function(req,res){
    let order = await orderModel.findOne({orderId:req.params.orderid});
    if(!order) return res.send("sory this order doesnot exist")
    if(!req.body.address) return res.send("you must provide an address")

    order.address = req.body.address;
    order.save();
    res.redirect("/")
})

module.exports= router;