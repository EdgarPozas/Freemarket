var global=require("../global.js");
var express=require("express"),
	app=module.exports=express();

app.set("views",__dirname+"/views");

app.get("/",global.logget);
app.get("/p/:class",global.logget);
app.get("/c/:cat",global.logget);
app.get("/s/:cat",global.logget);
