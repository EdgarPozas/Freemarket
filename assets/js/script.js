$(document).on("ready",function(){
	$("#comprar").click(function(e){
		$("#contenido").html("");
		if(parseInt($(this).attr("data-me"))>parseInt($(this).attr("data-cost"))){
			$("#titulo").text("¿Confirmar?");
			$("#contenido").html("<div class='c w9'>¿Esta seguro de que desea comprar <label style='padding:0;font-weight:bold' class='cpri'>"+$(this).attr("data-name")+"</label>?<div><form method='post' action="+$(this).attr("data-action")+" class='w4'><input type='submit' id='si' value='Si' /></form><input type='submit' class='w4 m7' value='No' id='no' /></div></div>")
		}
		else{
			$("#titulo").text("Saldo Insuficiente");
			$("#contenido").html("<div class='c w9'>¿Desea Recargar?<div><input type='submit' value='Si' id='s' /><input type='submit' value='No' id='n' /></div></div>")
			$("#s").on("click",function(){
				$("#titulo").fadeOut("fast",function(){
					$(this).fadeIn("fast").text("Recargar")
				});
				$("#contenido").fadeOut("fast",function(){
					$(this).fadeIn("fast").html("<form action='/recargar' method='post'><input type='text' name='recarga' required /><input type='submit' value='Recargar' /></form>")
				});
			});
			$("#n").on("click",function(){
				$("#tooltip").slideToggle("fast");
			});
		}
		$("#tooltip").slideToggle("fast");
	});
	$(".chimage").on("click",function(){
		$("#imgpri").attr("src",$(this).attr("src"))
	});
	$("#name").on("click",function(){
		$("#lsme").slideToggle("fast");
	});
	$(".tool").on("click",function(){
		var tp=$(this).attr("data-rel");
		var title="Mis Productos";
		$("#contenido").html("");
		if(tp=="misp"){
			$.post("/info/misp",{x:ME.x},function(data){
				if (data.length==0){
					$("#contenido").html("<h1 class='c'>No hay Productos</h1>")
				}
				$.each(data,function(index,val){
					$("#contenido").append('<a href="http://localhost/p/'+val.Clase+'"><div class="hov"><div class="w1"><img src="http://localhost/images/'+val.Imagenes[0]+'" class="w10" /></div><div class="w7"><label class="lato cpri">$ '+val.Precio+'</label><p>'+val.Descripcion+'</p></div></div></a>')
				});
			});
		}
		else if(tp=="misv"){
			title="Mis Ventas"
			$.post("/info/misv",{x:ME.x},function(data){
				if (data.length==0){
					$("#contenido").html("<h1 class='c'>No hay Productos</h1>")
				}
				$.each(data,function(index,val){
					$("#contenido").append('<a href="http://localhost/p/'+val.Clase+'"><div class="hov"><div class="w1"><img src="http://localhost/images/'+val.Imagenes[0]+'" class="w10" /></div><div class="w7"><label class="lato cpri">$ '+val.Precio+'</label><p>'+val.Descripcion+'</p></div></div></a>')
				});
			});
		}
		else if(tp=="misc"){
			title="Mis Compras"
			$.post("/info/misc",{x:ME.x},function(data){
				if (data.length==0){
					$("#contenido").html("<h1 class='c'>No hay Productos</h1>")
				}
				$.each(data,function(index,val){
					$("#contenido").append('<a href="http://localhost/p/'+val.Clase+'"><div class="hov"><div class="w1"><img src="http://localhost/images/'+val.Imagenes[0]+'" class="w10" /></div><div class="w7"><label class="lato cpri">$ '+val.Precio+'</label><p>'+val.Descripcion+'</p></div></div></a>')
				});
			});
		}
		else if(tp=="futu"){
			title="Mis Compras Futuras"
			$.post("/info/futu",{x:ME.x},function(data){
				if (data.length==0){
					$("#contenido").html("<h1 class='c'>No hay Productos</h1>")
				}
				$.each(data,function(index,val){
					$("#contenido").append('<a href="http://localhost/p/'+val.Clase+'"><div class="hov"><div class="w1"><img src="http://localhost/images/'+val.Imagenes[0]+'" class="w10" /></div><div class="w7"><label class="lato cpri">$ '+val.Precio+'</label><p>'+val.Descripcion+'</p></div></div></a>')
				});
			});
		}
		else if (tp=="ven"){
			title="Vender"
			$("#contenido").html('<div class="c"><form action="/vender" method="post" enctype="multipart/form-data"><input type="text" name="nombre" placeholder="Nombre del Producto" required /><textarea name="descripcion" placeholder="¿Como es tu producto?" required></textarea><input type="number" step="0.01" required name="precio" placeholder="Precio" /><input type="text" placeholder="En donde se encuetra" required name="ubicacion" /><select required name="categoria"><option value="autos">Autos</option><option value="computadoras">Computadoras</option><option value="electrodomesticos">Electrodomesticos</option><option value="cel">Celulares y Accesorios</option><option value="casas">Casas</option><option value="animales">Animales</option><option value="ropa">Ropa</option><option value="bisuteria">Bisuteria</option><option value="videojuegos">Videojuegos</option><option value="camaras">Camaras</option></select><div><input type="file" class="btnfile" name="img1" /><input type="file" class="btnfile" name="img2" /><input type="file" class="btnfile" name="img3" /><input type="file" class="btnfile" name="img4" /><div id="images"></div></div><input type="submit" value="Vender!" /></form></div>');
			$(".btnfile").change(function(e){archivo(e)});
		}
		else if (tp=="contacto"){
			title="Contactanos";
			$("#contenido").html('<form action="/contactanos" method="post" class="c"><input type="email required" name="email" placeholder="Email para contactarnos" /><select name="cat"><option value="como">¿Como crear cuenta?</option><option value="comprar">No puedo comprar</option><option value="nollega">Mi compra no ha llegado</option></select><textarea name="comentario" required placeholder="Describenos tu problema"></textarea><input type="submit" value="Gracias" /></form>');
		}
		$("#titulo").text(title);
		$("#tooltip").slideToggle("fast");
	});

	$("._x_").on("click",function(){$("#tooltip").slideToggle("fast");});
	$("#tooltip").draggable();
	function archivo(evt) {
		var files = evt.target.files;
		for (var i = 0, f; f = files[i]; i++) {         	
			if (!f.type.match('image.*')){continue;}
			var reader = new FileReader();
			reader.onload = (function(theFile){return function(e) {
					$("#images").append('<img class="w1 del" src="'+ e.target.result+'" title="'+ escape(theFile.name)+'"/>');
					$(".del").on("click",function(){$(this).remove()});
				};
			})(f);

			reader.readAsDataURL(f);
		}
	}
	$.ajaxSetup({timeout:200})
	$("#se").on("keyup",function(e){
		$("#list").html("")
		if ($(this).val().length>3){
			$("#lista").css("display","block")
			$.post("/search/"+$(this).val(),function(data){
				$.each(data,function(index,val){
					$("#list").append('<a href="http://localhost/p/'+val.Clase+'"><li><img src="http://localhost/images/'+val.Imagenes[0]+'" class="w1" /><p class="w7 m0">'+val.Descripcion	+'</p></li></a>')
				});
			});
		}
		if(e.keyCode==13){
			window.location="http://localhost/s/"+$(this).val()
		}
	});
});
