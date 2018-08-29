function callQuienesSomos(view){
	console.info("Llamando a quienes somos");
	$("[modulo]").html(plantillas["quienesSomos"]);
	if (view != undefined){
		$("#vista").find(".btnAtras").click(function(){
			callPanel("home");
		});
	}
	
	$("#panelBuscar").addClass("panelBtnBuscar");
	setPanel();
	
	$("button[codigo]").click(function(){
		var btn = $(this);
		
		showVista(btn.attr("codigo"));
	});
	
	$("#vista").find(".btnAtras").click(function(){
		$("#vista").hide();
	});
	
	console.info("Quienes somos cargado");
	
	function showVista(vista){
		if ("quienesSomos-quienesSomos" == vista)
			$(".portada").show();
		else
			$(".portada").hide();
		
		$.post(server + "cappmovil", {
			"movil": true,
			"action": "getSeccion",
			"codigo": vista
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
	}
	
	
	if (view != null || view != undefined){
		showVista(view);
	}
}