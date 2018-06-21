function callDepartamento(departamento){
	var portadaHeight = $("[panel=departamento]").find(".portada").height();
	$(".noticia").remove();
	$(".noticias").hide();
	
	$(".archivo").remove();
	$(".archivos").hide();
	
	$.each(departamento, function(campo, valor){
		$("[panel=departamento]").find("[campo=" + campo + "]").html(valor);
	});
	
	$("#btnHideDepto").click(function(){
		$("[panel=departamento]").hide();
		$("[panel=home]").show();
	});
	
	$("[panel=departamento]").find(".icono").attr("src", server + departamento.icono);
	
	if(departamento.portada != ''){
		$("[panel=departamento]").find(".portada").css("background-image", "url(" + server + departamento.portada + ")");
		//$("[panel=departamento]").find(".portada").height(portadaHeight);
	}
	
	//$("[panel=departamento]").find(".head").css("background", "linear-gradient(180deg, " + departamento.color1 + ", " + departamento.color2 + ")");
	//$("[panel=departamento]").find(".icono").css("background", "linear-gradient(180deg, " + departamento.color1 + ", " + departamento.color2 + ")");
	
	$("[panel=calendarioEventos]").find(".head").css("background", "linear-gradient(180deg, " + departamento.color1 + ", " + departamento.color2 + ")");
	
	$(".formulario").hide();
	
	if (departamento.formulario != '' && departamento.formulario != null)
		$(".formulario").show();
	
	/* Noticias */
	$.post(server + "listanoticias", {
		"departamento": departamento.idDepartamento,
		"json": true,
		"movil": true
	}, function(noticias){
		if (noticias.length == 0)
			$(".noticias").hide();
		else{
			$.each(noticias, function(){
				var noticia = $(this);
				var pl = $(plantillas['noticia']);
				noticia = noticia[0];
				$.each(noticia, function(campo, valor){
					pl.find("[campo=" + campo + "]").html(valor);
				});
				
				$(".noticias").append(pl);
				
				pl.click(function(){
					console.log(noticia);
					$("#winNoticia").find("[campo=titulo]").text(noticia.titulo).css("color", "white");
					$("#winNoticia").find(".modal-header").css("background", noticia.color1);
					$("#winNoticia").find(".modal-body").html(noticia.cuerpo);
					$("#winNoticia").modal();
				});
			});
			$(".noticias").show();
		}
	}, "json");
	
	/* Archivos */
	$.post(server + "listaarchivos", {
		"departamento": departamento.idDepartamento,
		"json": true,
		"movil": true
	}, function(archivos){
		if (archivos.length == 0)
			$(".archivos").hide();
		else{
			$.each(archivos, function(){
				var archivo = $(this);
				var pl = $(plantillas['archivo']);
				archivo = archivo[0];
				$.each(archivo, function(campo, valor){
					pl.find("[campo=" + campo + "]").html(valor);
				});
				
				$(".archivos").find(".contenido").append(pl);
				
				pl.click(function(){
					window.open(server + archivo.archivo, '_system');
				});
			});
			$(".archivos").show();
		}
	}, "json");
	
	
	/* Eventos */
	listaEventos = [];
	$.post(server + "listaeventos", {
		"departamento": departamento.idDepartamento,
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
				
				aux = {'Date': new Date(evento.anio, (evento.mes-1), evento.dia), 'Title': evento.titulo, 'Link': 'function'};
				listaEventos.push(aux);
				
				$(".eventos").find(".contenido").append(pl);
			});
			$("#showBtnCalendario").show();
			$(".eventos").show();
		}
	}, "json");
	
	showPanel("departamento");
	
	$("#showBtnCalendario").click(function(){
		$("[panel=calendarioEventos]").show();
		$("#dvCalendario").html("");
		
		caleandar(document.getElementById('dvCalendario'), listaEventos, {
			backgroundDateTime: departamento.color1,
			EventClick: function (el){
				el = $(el)[0];
				$.post(server + "citems", {
					'action': 'eventosDia',
					'fecha': el.anio + '-' + el.mes + '-' + el.dia,
					"movil": true,
					"departamento": departamento.idDepartamento,
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
	});
	
	$("[campo=formulario]").submit(function(){
		var datos = [];
		$("[campo=formulario]").find("input, textarea, select").each(function(){
			var el = $(this);
			var data = {};
			data.titulo = el.attr("titulo");
			data.valor = el.val();
			datos.push(data);
		});
		
		$.post(server + "csolicitudes", {
			"action": "add",
			"data": JSON.stringify(datos),
			"usuario": objUsuario.idUsuario,
			"departamento": departamento.idDepartamento,
			"movil": true
		}, function(resp){
			if (resp.band){
				mensajes.alert({"titulo": "Solicitud", "mensaje": "Tu solicitud fue registrada"});
				$("[campo=formulario]")[0].reset();
			}
		}, "json");
	});
}