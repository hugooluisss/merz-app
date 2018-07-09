function callContactos(){
	console.info("Llamando a contactos");
	$("[modulo]").html(plantillas["contactos"]);
	$("#panelBuscar").addClass("panelBtnBuscar");
	setPanel();
	
	$.post(server + "contactos", {
		"json": true,
		"usuario": objUsuario.idUsuario,
		"movil": true
	},
	function(contactos){
		var inicial = "";
		$(".listaContactos").find("div").remove();
		$.each(contactos, function(key, contacto){
			var dvContacto = $(plantillas['contacto']);
			setDatos(dvContacto, contacto);
			
			dvContacto.find("img.foto").attr("src", server + contacto.fotoPerfil);
			nombreClass = "item" + contacto.idUsuario;
			console.log(dvContacto, dvContacto.find(".datosContacto.row"));
			dvContacto.find(".datosContacto.row").addClass(nombreClass);
			dvContacto.find(".fa").attr("data-target", "." + nombreClass);
			$(".listaContactos").append(dvContacto);
		});
		
		$(".espera").hide();
	}, "json");
	
	console.info("Contactos cargado");
}