var global=require("../global.js");
var express=require("express"),
	app=module.exports=express();



app.post("/register",function(req,res){
	if(req.body && req.body.password1==req.body.password2){
		db.Usuarios.findOne({$or:[{Email:req.body.email},{Nombre:req.body.name}]}).exec(function(err,us){
			if(us){
				console.log("Ya hay usuario registrado");
				res.redirect("/adv/0");
			}
			else{
				db.Usuarios({
					Nombre:req.body.name,
					Email:req.body.email,
					Contraseña:global.encriptar(req.body.password1),
					Clase:global.aleatorio(),
				}).save(function(err,us){
					if(!err){
						req.session.session=us;
						res.redirect("/");
					}
				});
			}
		});
	}
	else{
		console.log("Algun error");
		res.redirect("/adv/1");
	}
});

app.post("/login",function(req,res){
	if(req.body){
		db.Usuarios.findOne({Email:req.body.email,Contraseña:global.encriptar(req.body.password)}).exec(function(err,us){
			if(us){
				req.session.session=us;
				console.log("si hay session");
				res.redirect("/");
			}
			else{
				console.log("no hay session");			
				res.redirect("/adv/3");
			}
		});
	}
});

app.post("/logout",function(req,res){
	if(req.session.session){
		req.session.destroy();
	}
	res.redirect("/");
});

app.post("/contactanos",function(req,res){
	if(req.body){
		db.Contactanos({
			Problema:req.body.comentario,
			Categoria:req.body.cat,
			Email:req.body.email,
		}).save(function(err,a){res.redirect("/adv/7")})
	}
});