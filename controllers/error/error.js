var global=require("../global.js");
var express=require("express"),
	app=module.exports=express();

app.get("/adv/:id",function(req,res){
	var error=[];
	if(req.params.id==0){
		error=["Registrar","Usuario ya registrado"]
	}
	else if(req.params.id==1){
		error=["Registrar","Error al registrar"]
	}
	else if(req.params.id==2){
		error=["Ingresar","Usuario ya registrado"]
	}
	else if(req.params.id==3){
		error=["Ingresar","Verifique sus datos"]
	}
	else if(req.params.id==4){
		error=["Recargar","Clave ya utilizada"]
	}
	else if(req.params.id==5){
		error=["Productos","Error al crear el producto"]
	}
	else if(req.params.id==6){
		error=["Comprar","No cuentas con dinero suficiente, por favor pasa a recargar"]
	}
	else if(req.params.id==7){
		error=["Contacto","Gracias, pronto te daremos solución"]
	}
	db.Productos.find().sort({_id:-1}).exec(function(err,productos){
		if(req.session.session){
			db.Usuarios.findOne({Clase:req.session.session.Clase}).exec(function(err,us){
				if(us){
					res.render(__dirname+"/../init/views/inicial.jade",{me:us,productos:productos,error:error,re:req.url});
				}
			});
		}
		else{
			res.render(__dirname+"/../init/views/inicial.jade",{productos:productos,error:error,re:req.url	});
		}
	});
});