function callDepartamento(departamento){
	console.info("Llamando a un departamento");
	console.log(departamento);
	
	if (departamento.panel != "" && departamento.panel != undefined){
		callPanel(departamento.panel, departamento.vista);
	}else{
		$("[modulo]").html(plantillas["departamento"]);
		$("#panelBuscar").addClass("panelBtnBuscar");
		setPanel();
		
		setDatos($("[modulo]"), departamento);
		$(".grupo").find(".barra").css("background", departamento.color1);
		$(".logoDepartamento").prop("src", server + departamento.icono);
		
		if(departamento.portada != '')
			$("[panel=departamento]").find(".portada").css("background-image", "url(" + server + departamento.portada + ")");
		else
			$("[panel=departamento]").find(".portada").css("background-image", "url(img/portadaNoticia.png)");
			
			
		$(".formulario").hide();
		
		if (departamento.shownoticia == 0)
			$(".noticias").parent().parent().hide();
		else{
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
						img = $(noticia.cuerpo).find("img").attr("src");
						if (img != undefined)
							pl.find("img").attr("src", img);
							
						pl.find("[campo=dia]").html(noticia.objActualizada.dia);
						pl.find("[campo=mes]").html(mesLetra(noticia.objActualizada.mes));
						pl.find("[campo=anio]").html(noticia.objActualizada.anio);
						
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
		}
		
		/* Noticias */
		if (departamento.showfija == 0)
			$(".noticiasFijas").parent().parent().hide();
		else{
			$.post(server + "getNoticiaFija", {
				"departamento": departamento.idDepartamento,
				"json": true,
				"movil": true
			}, function(noticias){
				if (noticias.length == 0)
					$(".noticiasFijas").hide();
				else{
					$.each(noticias, function(){
						var noticia = $(this);
						var pl = $(plantillas['noticiaFija']);
						noticia = noticia[0];
						$.each(noticia, function(campo, valor){
							pl.find("[campo=" + campo + "]").html(valor);
						});
						img = $(noticia.cuerpo).find("img").attr("src");
						if (img != undefined)
							pl.find("img").attr("src", img);
							
						pl.find("[campo=dia]").html(noticia.objActualizada.dia);
						pl.find("[campo=mes]").html(mesLetra(noticia.objActualizada.mes));
						pl.find("[campo=anio]").html(noticia.objActualizada.anio);
						
						$(".noticiasFijas").append(pl);
						
						pl.click(function(){
							console.log(noticia);
							$("#winNoticia").find("[campo=titulo]").text(noticia.titulo).css("color", "white");
							$("#winNoticia").find(".modal-header").css("background", noticia.color1);
							$("#winNoticia").find(".modal-body").html(noticia.cuerpo);
							$("#winNoticia").modal();
						});
					});
					$(".noticiasFijas").show();
				}
			}, "json");
		}
		
		
		/* Archivos */
		if (departamento.showarchivos == 0)
			$(".archivos").parent().parent().hide();
		else{
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
						
						$(".archivos").append(pl);
						
						pl.click(function(){
							window.open(server + archivo.archivo, '_system');
						});
					});
					$(".archivos").show();
				}
			}, "json");
		}
		
		/* Eventos */
		if (departamento.showcalendario == 0)
			$("#calendario").parent().parent().hide();
		else{
			listaEventos = [];
			$.post(server + "listaeventos", {
				"departamento": departamento.idDepartamento,
				"json": true,
				"movil": true
			}, function(eventos){
				$("#dvCalendario").html("");
				if (eventos.length == 0){
					$("#dvListaEventosPanel").parent().parent().hide();
				}else{
					$("#dvListaEventosPanel").find(".contenido").find(".evento").remove();
					for (i in eventos){
						var evento = $(eventos[i]);
						var pl = $(plantillas['eventoCalendario']);
						evento = evento[0];
						$.each(evento, function(campo, valor){
							pl.find("[campo=" + campo + "]").html(valor);
						});
						
						aux = {'Date': new Date(evento.anio, (evento.mes-1), evento.dia), 'Title': evento.titulo, 'Link': 'function'};
						listaEventos.push(aux);
						
						$("#dvListaEventosPanel").append(pl);
					}
					$("#dvListaEventosPanel").show();
					
					caleandar(document.getElementById('calendario'), listaEventos, {
							//backgroundDateTime: departamento.color1,
							EventClick: function (el){
								el = $(el)[0];
								$.post(server + "citems", {
									'action': 'eventosDia',
									'fecha': el.anio + '-' + el.mes + '-' + el.dia,
									"movil": true,
									"departamento": departamento.idDepartamento,
								}, function(eventos){
									console.log("Eventos");
									div = $("#dvListaEventosPanel");
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
				}
			}, "json");
		}
		
		/* Contactos */
		if (departamento.showcontactos == 0)
			$(".contactos").parent().parent().hide();
		else{
			$.post(server + "listacontactosdepartamento", {
				"departamento": departamento.idDepartamento,
				"json": true,
				"movil": true
			}, function(contactos){
				if (contactos.length == 0)
					$(".contactos").hide();
				else{
					$.each(contactos, function(){
						var contacto = $(this);
						contacto = contacto[0];
						var pl = $(plantillas['contactoDepto']);
						console.log(contacto);
						$.each(contacto, function(campo, valor){
							pl.find("[campo=" + campo + "]").html(valor);
							
						});
						
						if (contacto.fotoPerfil != ' ')
							pl.find("img.foto").attr("src", server + contacto.fotoPerfil);
						
						$(".contactos").append(pl);
					});
					$(".contactos").show();
				}
			}, "json");
		}
		
		
		$(".formulario").hide();
		if (departamento.formulario != '' && departamento.formulario != null && departamento.showform == 1){
			$(".formulario").show();
			
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
		
		/*	
		$("#showBtnCalendario").click(function(){
			$("[panel=calendarioEventos]").show();
			$("#dvCalendario").html("");
			
			
		});
		*/
		console.info("Departamento cargado");
	}
}