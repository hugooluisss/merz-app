function callHome(){
	console.info("Llamando a home");
	$("[modulo]").html(plantillas["home"]);
	$("#panelBuscar").removeClass("panelBtnBuscar");
	setPanel();
	
	/*Últimas noticias*/
	$.post(server + "citems", {
		"action": "getUltimasNoticias",
		"movil": true
	}, function(items){
		var primero = true;
		$.each(items, function(i, noticia){
			var pl = $(plantillas['noticiaCorousel']);
			setDatos(pl, noticia);
			
			if (primero){
				primero = false;
				pl.addClass("active");
			}
			
			$("#ultimasNoticias").find(".carousel-inner").append(pl);
		});
		
		$("#ultimasNoticias").carousel();
	}, "json");
	
	
	/*Departamentos*/
	$.post(server + "listadepartamentos", {
		"movil": true,
		"json": true
	}, function(departamentos){
		$.each(departamentos, function(key, depa){
			var plDepa = $(plantillas['menu.departamento']);
			
			$.each(depa, function(campo, valor){
				plDepa.find("[campo=" + campo + "]").html(valor);
			});
			
			if (depa.icono != undefined && depa.icono != ""){
				plDepa.find(".icono").prop("src", server + depa.icono);
				plDepa.find(".icono2").prop("src", server + depa.icono);
				//plDepa.css("background-image", "url(" + server + depa.icono + ")");
				
				plDepa.find(".icono").show();
				plDepa.find(".icono2").show();
			}else{
				plDepa.find(".icono").remove();
				plDepa.find(".icono2").hide();
			}
			
			if (depa.color2 == undefined || depa.color2 == "")
				plDepa.css("background-color", depa.color1);
			else
				plDepa.css("background-image", "linear-gradient(90deg, " + depa.color1 + ", " + depa.color2 + ")");
				
			plDepa.attr("json", depa.json);
			plDepa.click(function(){
				callDepartamento(depa);
			});
			
			$(".departamentos").append(plDepa);
		});
	}, "json");
	
	/* Datos del perfil */
	objUsuario = new TUsuario;
	objUsuario.getData({
		fn: {
			after: function(resp){
				$.each(resp, function(key, valor){
					$('[campo="usuario.' + key + '"]').html(valor);
				});
				
				$(".imagenUsuario").attr("src", "images/usuario.jpg");
				$(".imagenUsuario").prop("src", (resp.imagenPerfil == '' || resp.imagenPerfil == undefined)?"images/usuario.jpg":(server + resp.imagenPerfil));
				
			}
		}
	});
	
	$("[showpanel]").each(function(){
		$(this).click(function(){
			callPanel($(this).attr("showpanel"));
		});
	});
	
	
	console.info("Home cargado");
}