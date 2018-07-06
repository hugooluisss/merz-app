function callPerfil(){
	console.info("Llamando a perfil");
	$("[modulo]").html(plantillas["perfil"]);
	$("#panelBuscar").addClass("panelBtnBuscar");
	
	
	$("#imgPerfil").prop("src", (objUsuario.imagenPerfil == '' || objUsuario.imagenPerfil == undefined)?"img/usuario.jpg":(server + objUsuario.imagenPerfil));
	
	setDatos($("[panel=perfil]"), objUsuario.datos);
	
	$('#winDatos').on('shown.bs.modal', function (event){
		$('#winDatos').find("input:text:visible:first").focus();
		
		$.each(objUsuario.datos, function(key, valor){
			$("#winDatos").find("[campo=" + key + "]").val(valor);
		});
	});
	
	objUsuario.getTotalNewsNotificaciones({
		fn: {
			after: function(resp){
				$("[campo=totalNotificaciones]").text(resp.total);
			}
		}
	});
	
	$("[showvista]").click(function(){
		console.log($(this).attr("showvista"));
		switch($(this).attr("showvista")){
			case 'contactos':
				callContactos();
			break;
		}
	});
	console.info("Perfil cargado");
}