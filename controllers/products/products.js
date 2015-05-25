var global=require("../global.js");
var express=require("express"),
	app=module.exports=express();

app.post("/recargar",global.logpost,function(req,res){
	db.Claves.findOne({Clave:req.body.recarga,Usada:false}).exec(function(err,clave){
		if(clave){
			console.log("clave usada");
			db.Claves.remove({Clave:req.body.recarga}).exec();
		}
		else{
			console.log("clave ya usada o no encontrada");
			res.redirect("/adv/4")
		}
	});
});

app.post("/info/:tp",global.logpost,function(req,res){
	if(req.params.tp=="misp"){
		db.Productos.find({Clase_Usuario:req.body.x}).sort({_id:-1}).sort({_id:-1}).exec(function(err,misproductos){
			if(!err){
				res.send(misproductos);
			}
		});
	}
	else if(req.params.tp=="misc"){
		db.Compras.find({Comprador_Clase:req.body.x}).sort({_id:-1}).exec(function(err,miscompras){
			if(!err){
				res.send(miscompras);
			}
		});	
	}
	else if(req.params.tp=="misv"){
		db.Ventas.find({Vendedor_Clase:req.body.x}).sort({_id:-1}).sort({_id:-1}).exec(function(err,misventas){
			if(!err){
				res.send(misventas);
			}
		});
	}
	else if(req.params.tp=="futu"){
		db.Usuarios.findOne({Clase:req.body.x}).sort({_id:-1}).sort({_id:-1}).exec(function(err,futuras){
			if(!err){
				res.send(futuras.Favoritos);
			}
		});
	}
});
app.post("/search/:datos",function(req,res){
	db.Productos.find({$or:[{Nombre:{$regex:(req.params.datos).toUpperCase()}},{Nombre:{$regex:req.params.datos}}]}).sort({_id:-1}).exec(function(err,busqueda){
		if(!err){res.send(busqueda)};
	});
});
app.post("/vender",global.logpost,function(req,res){
	var fs = require('fs')
	var rutas=[req.files.img1,req.files.img2,req.files.img3,req.files.img4]
	var nombres=[]
	for (var i = 0; i <= rutas.length-1; i++) { 
		var path = rutas[i].path
		if (rutas[i].name){
			var nombrearchivo=global.aleatorio()+rutas[i].name
			var ruta = "assets/images/"+nombrearchivo
			fs.rename(path,ruta,function(err){
				fs.unlink(path,function(err){console.log("subido")});
			});
			nombres[i]=nombrearchivo
		}
	}
	db.Productos({
		Nombre:req.body.nombre,
		Descripcion:req.body.descripcion,
		Categoria:req.body.categoria,
		Precio:req.body.precio,
		Clase:global.aleatorio(),
		Imagenes:nombres,
		Fecha:global.date(),
		Nombre_Usuario:req.session.session.Nombre,
		Clase_Usuario:req.session.session.Clase,
		Fecha:global.date(),
		Ubicacion:req.body.ubicacion
	}).save(function(err,pro){
		if(!err){
			console.log("producto creado exitosamente");
			res.redirect("/");
		}
		else{
			req.redirect("/adv/5")
		}
	});
});
app.post("/fav/:class",global.logpost,function(req,res){
	db.Productos.findOne({Clase:req.params.class}).exec(function(err,ve){
		if(ve){
			db.Usuarios.update({Clase:req.session.session.Clase},{$push:{Favoritos:ve}}).exec(function(err,upd){
				console.log("datos guardados correctamente");
				res.redirect("/");
			});
		}
	});
});
app.post("/buy/:class",global.logpost,function(req,res){
	db.Productos.findOne({Clase:req.params.class}).exec(function(err,producto){
		if(producto){
			db.Usuarios.findOne({Clase:req.session.session.Clase}).exec(function(err,comprador){
				if ((parseFloat(comprador.Capital)-parseFloat(producto.Precio))>=0){
						//hay dinero suficiente
						console.log("si hay");
						db.Compras({
							Nombre:producto.Nombre,
							Categoria:producto.Categoria,
							Precio:producto.Precio,
							Descripcion:producto.Descripcion,
							Clase:producto.Clase,
							Imagenes:producto.Imagenes,
							Vendedor_Clase:producto.Clase_Usuario,
							Comprador_Clase:comprador.Clase,
							Fecha:global.date()
						}).save();
						db.Ventas({
							Nombre:producto.Nombre,
							Categoria:producto.Categoria,
							Precio:producto.Precio,
							Imagenes:producto.Imagenes,
							Descripcion:producto.Descripcion,
							Clase:producto.Clase,
							Vendedor_Clase:producto.Clase_Usuario,
							Fecha:global.date()
						}).save();
						db.Usuarios.update({Clase:comprador.Clase},{$set:{Capital:parseFloat(comprador.Capital)-parseFloat(producto.Precio)}}).exec();
						db.Usuarios.findOne({Clase:producto.Clase_Usuario}).exec(function(err,us){
							db.Usuarios.update({Clase:producto.Clase_Usuario},{$set:{Capital:parseFloat(us.Capital)+parseFloat(producto.Precio)}}).exec();
						});
						db.Productos.update({Clase:req.params.class},{$set:{Estado:false,Clase_Comprador:comprador.Clase}}).exec();
				}
				else{
					//No hay dinero suficiente
					res.redirect("/adv/6")
				}
				res.redirect("/p/"+req.params.class);
			});
		}
		else{console.log("no hay compra");res.redirect("/");}
	});
});

app.post("/nota",global.logpost,function(req,res){
	db.Compras.findOne({Comprador_Clase:req.session.session.Clase}).exec(function(er,compra){
		if(compra){
			res.render(__dirname+"/../init/views/nota.jade",{compra:compra,me:req.session.session});
		}
		else{
			res.redirect("/");
		}
	});
});