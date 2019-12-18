var express = require("express");
var router = express.Router();
var mongojs = require("mongojs");

var db = mongojs("mongodb+srv://muhdakmalothman0@gmail.com:Akmal2209@cluster0-ffhvu.mongodb.net/vbts?retryWrites=true&w=majority");

router.get("/bookings", function(req, res, next){
    res.send(db.name)
});

module.exports = router;