var leters=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','1','2','3','4','5','6','7','8','9','0'];
/*rutas get*/
var logget=function(req,res,next){
	var query=db.Productos.find({Estado:true}).sort({_id:-1});ruta=__dirname+"/init/views/inicial.jade"
	if(req.url[1]=="p"){
		ruta=__dirname+"/init/views/productos.jade";
		query=db.Productos.findOne({Clase:req.params.class});
	}
	else if(req.url[1]=="c"){
		query=db.Productos.find({Categoria:req.params.cat});
	}
	else if(req.url[1]=="s"){
		query=db.Productos.find({Nombre:{$regex:req.params.cat}});	
	}
	db.Productos.find({Estado:true}).sort({_id:-1}).exec(function(err,sugerencias){
		query.exec(function(err,productos){
			if(req.session.session){
				db.Usuarios.findOne({Clase:req.session.session.Clase}).exec(function(err,us){
					if(us){
						res.render(ruta,{me:us,productos:productos,sugerencias:sugerencias,re:req.url});
					}
				});
			}
			else{
				res.render(ruta,{productos:productos,sugerencias:sugerencias,re:req.url});
			}
		});
	});
}
var loggetadmin=function(req,res,next){
	if(req.session.session &&req.session.session.Admin){
		next()
	}
	else{console.log("hola");res.redirect("/")}
}
/*rutas post*/
var logpost=function (req,res,next){
	if(req.session.session){
		db.Usuarios.findOne({Clase:req.session.session.Clase}).exec(function(err,us){
			if(us){
				req.session.session=us;
				next()
			}
		});
	}
	else{res.redirect("/")}
}
var logadmin=function(req,res,next){
	if(req.session.session.Admin){next()}
	else{res.redirect("/")}
}
var encriptar=function(data){
	var crypto = require('crypto');
	var cr1='',hmac='';
	cr1=crypto.createHmac('sha1',data).digest('hex');
	cr1=crypto.createHmac('md5',cr1).digest('hex');
	hmac=crypto.createHmac('sha1',cr1).digest('hex');
	return hmac;
}
var aleatorio=function(){
	var cadena=0;
	for (var i = 0; i <= 30; i++){
   		var indexleter= Math.floor((Math.random() * 58) + 1);
		var leter=leters[indexleter];
		cadena=cadena+leter;
		indexleter=0;
	}
	return cadena;
}
var date=function(){
	var d = new Date();
	var n = d.toISOString();
	return n;
}
module.exports.date=date;
module.exports.aleatorio=aleatorio;
module.exports.encriptar=encriptar;
module.exports.logget=logget;
module.exports.logpost=logpost;
module.exports.logadmin=logadmin;
module.exports.loggetadmin=loggetadmin;