var global=require("../global.js");
var express=require("express"),
	app=module.exports=express();

app.set("views",__dirname+"/views");

app.get("/admin",global.loggetadmin,function(req,res){
	res.render("admin",{me:req.session.session});
});

app.post("/admin",global.logpost,function(req,res){
	if(req.body.email &&req.body.ps){
		db.Usuarios.findOne({Email:req.body.email,Contraseña:req.body.ps,Admin:true}).exec(function(er,us){
			if(us){
				db.Productos.find().sort({_id:-1}).exec(function(er,pro){
					res.render("admin",{me:us,productos:pro});
				});
			}
			else{
				console.log("no es admin");
				res.redirect("/");
			}
		});
	}
	else{
		res.redirect("/");
	}
});
app.post("/admin/cl",global.logpost,global.logadmin,function(req,res){
	db.Claves.find().sort({_id:-1}).exec(function(err,claves){
		res.render("nota",{data:claves,me:req.session.session,ru:"cl"});
	});
});
app.post("/admin/cl/gen",global.logpost,global.logadmin,function(req,res){
	for (var i = 0; i <= req.body.num; i++){
		var valor= Math.floor((Math.random() * 300) + 1);
		db.Claves({Clave:global.aleatorio(),Valor:valor}).save();
	};
	db.Claves.find().sort({_id:-1}).exec(function(err,claves){
		res.render("nota",{data:claves,me:req.session.session,ru:"cl"});
	});
});
app.post("/admin/us",global.logpost,global.logadmin,function(req,res){
	db.Usuarios.find().sort({_id:-1}).exec(function(err,usuarios){
		db.Compras.find().exec(function(err,compras){
			db.Ventas.find().exec(function(err,ventas){
				res.render("nota",{usuarios:usuarios,compras:compras,ventas:ventas,me:req.session.session,ru:"us"});
				
			});
		});
	});
});
app.post("/admin/us/v",global.logpost,global.logadmin,function(req,res){
	db.Usuarios.findOne({Class:req.body.class}).exec(function(err,usuarios){
		if(usuarios){
			db.Compras.find({Class:req.body.class}).exec(function(err,compras){
				db.Ventas.find({Class:req.body.class}).exec(function(err,ventas){
					res.render("nota",{usuarios:usuarios,compras:compras,ventas:ventas,me:req.session.session,ru:"us"});
				});
			});
		}
		else{res.redirect("/admin")}
	});
});
app.post("/admin/us/del",global.logpost,global.logadmin,function(req,res){
	db.Usuarios.findOne({Class:req.body.class}).exec(function(err,usuarios){
		if(usuarios){
			db.Usuarios.remove({Class:req.body.class}).exec()
		}
		else{res.redirect("/admin")}
	});
});
app.post("/admin/msj",global.logpost,global.logadmin,function(req,res){
	db.Contactanos.find().exec(function(err,contact){
		if(contact){
			res.render("nota",{me:req.session.session,contacto:contact,ru:"msj"});
		}
		else{res.redirect("/admin")}
	});
});

