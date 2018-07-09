function callNotificaciones(){
	console.info("Llamando a notificaciones");
	$("[modulo]").html(plantillas["notificaciones"]);
	$("#panelBuscar").addClass("panelBtnBuscar");
	setPanel();
	
	objUsuario.getNotificaciones({
		fn: {
			after:function(notificaciones){
				$.each(notificaciones, function(i, notificacion){
					var pl = $(plantillas['notificacion']);
					
					$.each(notificacion, function(campo, valor){
						pl.find("[campo=" + campo + "]").text(valor);
					});
					
					if (notificacion.leido == 0)
						$(".dvListaNotificaciones").find(".nuevas").append(pl);
					else
						$(".dvListaNotificaciones").find(".anteriores").append(pl);
				});
			}
		}
	});
	
	console.info("Privacidad cargado");
}