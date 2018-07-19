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
			console.log(contacto);
			var dvContacto = $(plantillas['contacto']);
			setDatos(dvContacto, contacto);
			if (contacto.fotoPerfil != ' ')
				dvContacto.find("img.foto").attr("src", server + contacto.fotoPerfil);
			nombreClass = "item" + contacto.idUsuario;
			dvContacto.find(".datosContacto.row").addClass(nombreClass);
			dvContacto.find(".fa").attr("data-target", "." + nombreClass);
			$(".listaContactos").append(dvContacto);
		});
		
		$(".espera").hide();
	}, "json");
	
	console.info("Contactos cargado");
}