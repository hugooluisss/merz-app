function callDepartamento(departamento){
	$("#menuSecciones").hide("slide", { direction: "left" }, 500);
	
	$(".noticia").remove();
	$(".noticias").hide();
	
	$(".archivo").remove();
	$(".archivos").hide();
	
	$.each(departamento, function(campo, valor){
		$("[panel=departamento]").find("[campo=" + campo + "]").html(valor);
	});
	
	$("[panel=departamento]").find(".icono").attr("src", server + departamento.icono);
	
	if(departamento.portada){
		$("[panel=departamento]").find(".portada").css("background-image", "url(" + server + departamento.portada + ")");
		$("[panel=departamento]").find(".portada").show();
	}else
		$("[panel=departamento]").find(".portada").hide();
	
	$("[panel=departamento]").find(".head").css("background", "linear-gradient(180deg, " + departamento.color1 + ", " + departamento.color2 + ")");
	
	
	
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
				$.each(noticia[0], function(campo, valor){
					pl.find("[campo=" + campo + "]").html(valor);
				});
				
				$(".noticias").append(pl);
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
				$.each(archivo[0], function(campo, valor){
					pl.find("[campo=" + campo + "]").html(valor);
				});
				
				$(".archivos").find(".contenido").append(pl);
			});
			$(".archivos").show();
		}
	}, "json");
	
	showPanel("departamento");
}