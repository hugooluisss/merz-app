function callContactos(){
	console.info("Llamando a contactos");
	$("[modulo]").html(plantillas["contactos"]);
	$("#panelBuscar").addClass("panelBtnBuscar");
	
	objUsuario.getTotalNewsNotificaciones({
		fn: {
			after: function(resp){
				$("[campo=totalNotificaciones]").text(resp.total);
			}
		}
	});
	
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
			setDatos(dvContacto, contacto)
			
			dvContacto.find("img.foto").attr("src", server + contacto.fotoPerfil);
			$(".listaContactos").append(dvContacto);
			
			
			dvContacto.click(function(){
				$("#winContacto").modal();
				
				$.each(contacto, function(campo, valor){
					$("#winContacto").find("[campo=" + campo + "]").html(valor);
				});
				
				$("#winContacto").find("[campo=fotoPerfil]").prop("src", contacto.fotoPerfil == ' '?"images/usuario.jpg":(server + contacto.fotoPerfil));
			});
		});
		
		$(".espera").hide();
	}, "json");
	
	console.info("Contactos cargado");
}