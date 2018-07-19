function callQuienesSomos(){
	console.info("Llamando a quienes somos");
	$("[modulo]").html(plantillas["quienesSomos"]);
	$("#panelBuscar").addClass("panelBtnBuscar");
	setPanel();
	
	$("button[codigo]").click(function(){
		var btn = $(this);
		
		if ("quienesSomos-quienesSomos" == btn.attr("codigo"))
			$(".portada").show();
		else
			$(".portada").hide();
		
		$.post(server + "cappmovil", {
			"movil": true,
			"action": "getSeccion",
			"codigo": btn.attr("codigo")
		}, function(resp){
			cuerpo = $(resp.cuerpo);
			setDatos($("#vista"), resp);
			
			cuerpo.find("img").each(function(){
				el = $(this);
				el.attr("src", server + el.attr("src"));
			});
			$("#vista").find("[campo=cuerpo]").html(cuerpo);
			$("#vista").find(".titulo").html(resp.titulo);
			$("#vista").show();
		}, "json");
	});
	
	$("#vista").find(".btnAtras").click(function(){
		$("#vista").hide();
	});
	
	console.info("Quienes somos cargado");
}