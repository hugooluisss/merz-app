function callBusqueda(){
	$("#panelBuscar").find("input").click(function(){
		$("#dvBusqueda").show("blind", {}, 1000, function(){
			$(".searchNoticias").find("input").val("");
			$("#contenidoBusqueda").find(".noticia").remove();
			
			setTimeout(function(){
				$("#dvBusqueda").find("#txtBusquedaNoticia").focus().select();
			}, 1000);
		});
	});
	
	$("#dvBusqueda").find(".cerrar").click(function(){
		$("#dvBusqueda").hide("blind", {}, 1000, function(){
			$("#panelBuscar").find("input").val("");
		});
	});
	
	$("#dvBusqueda").find("#btnBuscar").click(function(){
		if ($("#dvBusqueda").find("#txtBusquedaNoticia").val() == '')
			$("#dvBusqueda").find("#txtBusquedaNoticia").select();
		else{
			$.post(server + "citems", {
				"movil": true,
				"action": "search",
				"texto": $("#dvBusqueda").find("#txtBusquedaNoticia").val()
			}, function(items){
				$("#contenidoBusqueda").find(".item").remove();
				$.each(items, function(i, item){
					click = false;
					pl = undefined;
					switch(item.tipo){
						case 'Noticia':
							var pl = $(plantillas['resumenNoticia']);
							pl.find(".media-left").find("img").css("background", item.departamento.color1);
							pl.find("[campo=titulo]").css("color", item.departamento.color1);
							click =  true;
							setDatos(pl, item);
							setDatos(pl, item.datos);
							setDatos(pl, item.departamento);
						break;
						case 'Evento':
							var pl = $(plantillas['resumenEvento']);
							setDatos(pl, item);
							setDatos(pl, item.datos);
						break;
						case 'Documento':
							var pl = $(plantillas['resumenArchivo']);
							setDatos(pl, item);
							setDatos(pl, item.datos);
							click =  true;
						break;
						case 'Contacto':
							var pl = $(plantillas['contacto']);
							if (item.fotoPerfil != ' ' && item.fotoPerfil != undefined)
								pl.find("img.foto").attr("src", server + item.fotoPerfil);
								
							nombreClass = "item" + item.idUsuario;
							pl.find("[contacto]").addClass(nombreClass);
							pl.find(".mostrar").attr("data-target", "." + nombreClass);
							
							$(".espera").hide();
							
							setDatos(pl, item);
							console.info("Contacto definido");
						break;
					}
					
					if (pl != undefined){
						pl.attr("datos", JSON.stringify(item));
						$("#contenidoBusqueda").append(pl);
					}
					
					if (click && pl != undefined){
						switch(item.tipo){
							case 'Noticia':
								pl.click(function(){
									item = $.parseJSON($(this).attr("datos"));
									$("#winNoticia").find("[campo=titulo]").text(item.titulo).css("color", "white");
									$("#winNoticia").find(".modal-header").css("background", item.departamento.color1);
									$("#winNoticia").find(".modal-body").html(item.datos.cuerpo);
									$("#winNoticia").modal();
								});
							break;
							case 'Documento':
								pl.click(function(){
									window.open(server + item.archivo, '_system');
								});
							break;
						}
					}
				});
			}, "json");
		}
	});
	
	$("#dvBusqueda").find(".barraTop").find(".limpiar").click(function(){
		$("#dvBusqueda").find("#txtBusquedaNoticia").val("");
		$("#dvBusqueda").find("#txtBusquedaNoticia").select();
		$("#contenidoBusqueda").find(".item").remove();
	});
}