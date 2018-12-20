function callPrivacidad(){
	console.info("Llamando a privacidad");
	$("[modulo]").html(plantillas["privacidad"]);
	$("#panelBuscar").addClass("panelBtnBuscar");
	setPanel();
	
	console.info("Privacidad cargado");
}