require("./models");
var express=require("express"),
	app=express(),
	multipart=require("connect-multiparty"),
	bodyParser=require("body-parser"),
	Sessions=require("express-session"),
	admin=require("./controllers/admin/admin.js"),
	init=require("./controllers/init/init.js"),
	error=require("./controllers/error/error.js"),
	products=require("./controllers/products/products.js"),
	users=require("./controllers/users/users.js"),
	port=process.env.PORT || 80;

app.set("view engine","jade");
app.use(multipart());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(Sessions({secret:"Secret", saveUninitialized: true,resave: true}));
app.use(express.static(__dirname+"/assets"));

app.use(admin);
app.use(init);
app.use(error);
app.use(products);
app.use(users);

app.listen(port,function(){console.log("Servidor Creado")});