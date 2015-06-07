$(document).on("ready",function(){
	var imagenes=$("#imagenes img");contar=-1;contenido=["1","2","3","4","5"];
	setInterval(function() {
		contar++;
		if (contar<=4){
			$("#inicial").fadeOut("fast").fadeIn("fast",function(){
				$(this).attr("src",imagenes[contar].attributes.src.value);
			});
		}
		else{contar=-1;}
	}, 4000);
	$(".chimage").on("click",function(){
		$("#imgpri").attr("src",$(this).attr("src"))
	});
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
	$("#se").focusout(function(){$("#list").slideToggle()});
	$(".tool").on("click",function(){
		var title="Login",contenido='<form action="/login" method="post"><input type="email" required placeholder="Ingresa Email" name="email" /><input type="password" required placeholder="Ingresa Contraseña" name="password" /><div class="p5"><input type="submit" value="Ingresar" /></div></form>'
		if($(this).attr("data-rel")=="register"){
			title="Registrar";
			contenido='<form action="/register" method="post"><input type="text" required placeholder="Ingresa tu Nombre (Numeros y letras)" name="name" pattern="[A-Za-z-0-9]+"/><input type="email" required placeholder="Ingresa Email" name="email" /><input type="password" required placeholder="Ingresa Contraseña" name="password1" /><label style="font-size:13px;padding:5;color:red" id="seg"></label><input type="password" required placeholder="Confirmar Contraseña" name="password2" /><span id="iguales"></span><div class="p5"><input type="submit" id="btnreg" value="Registrar" /></div></form>'
		}
		else if ($(this).attr("data-rel")=="contacto"){
			title="Contactanos";
			contenido='<form action="/contactanos" method="post" class="c"><input type="email required" name="email" placeholder="Email para contactarnos" /><select name="cat"><option value="como">¿Como crear cuenta?</option><option value="comprar">No puedo comprar</option><option value="nollega">Mi compra no ha llegado</option></select><textarea name="comentario" required placeholder="Describenos tu problema"></textarea><input type="submit" value="Gracias" /></form>'
		}
		$("#titulo").text(title);
		$("#contenido").html(contenido);
		$("#tooltip").slideToggle("fast");
		$('[name="password1"]').keyup(function(e){
			var tamaño=$(this).val().length;
			if (tamaño>=1 && tamaño <=4){
				$("#seg").text("Poca")
				$("#seg").css("color","red")
			}
			if (tamaño>=5 && tamaño <=7){
				$("#seg").text("Media")
				$("#seg").css("color","blue")
			}
			if (tamaño>=8 ){
				$("#seg").text("Alta")
				$("#seg").css("color","green")
			}
		});
		$('[name="password2"]').keyup(function(e){
			if ($(this).val()==$("[name='password1']").val()){
				$("#iguales").html("")
			}
			else{
				$("#iguales").html("<label>Revise las contraseñas</label>")
			}
		});
	});
	$("._x_").on("click",function(){$("#tooltip").slideToggle("fast");});
	$("#tooltip").draggable();
});