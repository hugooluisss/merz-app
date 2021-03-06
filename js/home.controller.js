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
			if ($(noticia.cuerpo).find("img").length > 0){
				pl.css("background-image", "url(" + $(noticia.cuerpo).find("img").attr("src") + ")");
				pl.css("background-position", "middle right"); 
				console.log($(noticia.cuerpo).find("img").prop("src"));
			}
			
			$("#ultimasNoticias").find(".carousel-inner").append(pl);
			
			pl.click(function(){
				console.log(noticia);
				$("#winNoticia").find("[campo=titulo]").text(noticia.titulo).css("color", "white");
				$("#winNoticia").find(".modal-header").css("background", "#152b8e");
				$("#winNoticia").find(".modal-body").html(noticia.cuerpo);
				$("#winNoticia").modal();
			});
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
			
			plDepa.css("background-color", depa.color1);
			/*
			if (depa.color2 == undefined || depa.color2 == "")
				plDepa.css("background-color", depa.color1);
			else
				plDepa.css("background-image", "linear-gradient(90deg, " + depa.color1 + ", " + depa.color2 + ")");
			*/	
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
	
	
	/* Eventos */
	listaEventos = [];
	$.post(server + "listaeventos", {
		"json": true,
		"movil": true
	}, function(eventos){
		if (eventos.length == 0){
			$(".eventos").hide();
			$("#showBtnCalendario").hide();
		}else{
			$(".eventos").find(".contenido").find(".evento").remove();
			$.each(eventos, function(){
				var evento = $(this);
				var pl = $(plantillas['evento']);
				evento = evento[0];
				$.each(evento, function(campo, valor){
					pl.find("[campo=" + campo + "]").html(valor);
				});
				
				aux = {'Date': new Date(evento.anio, (evento.mes-1), evento.dia), 'Title': evento.titulo, 'Link': 'function', 'color': evento.color1};
				listaEventos.push(aux);
				
				$(".eventos").append(pl);
			});
			$("#showBtnCalendario").show();
			$(".eventos").show();
		}
	}, "json");
	
	$(".showCalendario").click(function(){
		$("[panel=calendarioEventos]").show();
		$("#dvCalendario").html("");
		caleandar(document.getElementById('dvCalendario'), listaEventos, {
			backgroundDateTime: "#152b8e",
			EventClick: function (el){
				el = $(el)[0];
				$.post(server + "citems", {
					'action': 'eventosDia',
					'fecha': el.anio + '-' + el.mes + '-' + el.dia,
					"movil": true,
					//"departamento": departamento.idDepartamento,
				}, function(eventos){
					div = $("[panel=calendarioEventos]").find("#dvListaEventos");
					var center = $("<center>No existen eventos</center>");
					div.html("");
					div.append(center);
					
					$.each(eventos, function(){
						var evento = $(this);
						console.log(evento);
						var pl = $(plantillas['eventoCalendario']);
						evento = evento[0];
						$.each(evento, function(campo, valor){
							pl.find("[campo=" + campo + "]").html(valor);
						});
						
						div.append(pl);
						center.remove();
					});
					
				}, "json");
			}
		});
		
		$("[panel=calendarioEventos]").find("#dvListaEventos").html("<center>No existen eventos</center>");
	});
	
	
	
	
	
	$("[showpanel]").each(function(){
		$(this).click(function(){
			callPanel($(this).attr("showpanel"));
		});
	});
	
	
	console.info("Home cargado");
}