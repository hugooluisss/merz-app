var server = "http://somosmerz.com/panel_app/";
//var server = "http://192.168.2.4/merz/";
//var server = "http://localhost/merz/";
var panelActivo = "";

function showPanel(panel, efecto, after){
	duracion = 500;
	
	if (after == undefined)
		after = null;
	
	$("[panel=" + panelActivo + "]").hide();
	$("#buscar").removeClass("panelBtnBuscar");
	
	switch(efecto){
		case 'faderight_':
			$("[panel=" + panel + "]").show("slide", { direction: "right" }, duracion);
		break;
		case 'fadeleft_':
			$("[panel=" + panel + "]").show("slide", { direction: "left" }, duracion);
		break;
		case 'slow_':
			$("[panel=" + panel + "]").show("slow", after);
		break;
		default:
			$("[panel=" + panel + "]").show(1, after);
	}
	if ($("[panel=" + panel + "]").attr("btnAtras") != "no")
		$("#panelBuscar").addClass("panelBtnBuscar");
	panelActivo = panel;
}

function checkConnection() {
	try{
		var networkState = navigator.connection.type;
	
		var states = {};
		states[Connection.UNKNOWN]  = 'Unknown connection';
		states[Connection.ETHERNET] = 'Ethernet connection';
		states[Connection.WIFI]     = 'WiFi connection';
		states[Connection.CELL_2G]  = 'Cell 2G connection';
		states[Connection.CELL_3G]  = 'Cell 3G connection';
		states[Connection.CELL_4G]  = 'Cell 4G connection';
		states[Connection.CELL]     = 'Cell generic connection';
		states[Connection.NONE]     = 'No network connection';
		
		switch(networkState){
			case Connection.NONE: 
				alertify.error("Verifica tu conexión, la aplicación necesita conexión a internet");
				return false;
			break;
			default:
				return true;
		}
	}catch(e){
		return true;
	}
}

var mensajes = {
	alert: function(data){
		if (data.funcion == undefined)
			data.funcion = function(){};
			
		if (data.titulo == undefined)
			data.titulo = " ";
		
		try{
			navigator.notification.alert(data.mensaje, data.funcion, data.titulo, data.boton);
		}catch(err){
			window.alert(data.mensaje);
		}

	},
	
	confirm: function(data){
		if (data.funcion == undefined)
			data.funcion = function(){};
			
		if (data.titulo == undefined)
			data.titulo = " ";
		
		
		try{
			navigator.notification.confirm(data.mensaje, data.funcion, data.titulo, data.botones);
		}catch(err){
			if (confirm(data.mensaje))
				data.funcion(1);
			else
				data.funcion(2);
		}
	},
	
	log: function(data){
		alertify.log(data.mensaje);
	},
	
	prompt: function(data){
		if (data.funcion == undefined)
			data.funcion = function(){};
			
		if (data.titulo == undefined)
			data.titulo = " ";
		
		
		try{
			navigator.notification.prompt(data.mensaje, data.funcion, data.titulo, data.botones);
		}catch(err){
			var result = prompt(data.mensaje);
			data.funcion({
				buttonIndex: 1,
				input1: result
			});
		}
	},
};


function getPlantillas(after){
	var cont = 0;
	$.each(plantillas, function(){
		cont++;
	});
	
	$.each(plantillas, function(pl, valor){
		$.get("vistas/" + pl + ".html", function(html){
			plantillas[pl] = html;
			
			cont--;
			if (cont == 0)
				after();
		});
	});
};

function setDatos(plantilla, datos){
	$.each(datos, function(i, valor){
		antes = plantilla.find("[campo=" + i + "]").attr("before") || ""; 
		despues = plantilla.find("[campo=" + i + "]").attr("after") || ""; 
		valor =  antes + valor + despues;
		plantilla.find("[campo=" + i + "]").html(valor);
		plantilla.find("[campo=" + i + "]").val(valor);
	});
}

function setPanel(){
	$("[showpanel]").click(function(){
		callPanel($(this).attr("showpanel"));
	});
	
	objUsuario.getTotalNewsNotificaciones({
		fn: {
			after: function(resp){
				$("[notificaciones]").text(resp.sinLeer);
			}
		}
	});
}

function callPanel(panel, vista){
	switch(panel){
		case 'contactos':
			callContactos(vista);
		break;
		case 'perfil':
			callPerfil(vista);
		break;
		case 'privacidad':
			callPrivacidad(vista);
		break;
		case 'notificaciones':
			callNotificaciones(vista);
		break;
		case 'home':
			callHome(vista);
		break;
		case 'quienesSomos':
			callQuienesSomos(vista);
		break;
		default:
			console.log("Sin llamada", panel);
		break;
	}
}

function mesLetra(mes){
	switch(mes){
		case 1: case '01': return "Enero"; break;
		case 2: case '02': return "Febrero"; break;
		case 3: case '03': return "Marzo"; break;
		case 4: case '04': return "Abril"; break;
		case 5: case '05': return "Mayo"; break;
		case 6: case '06': return "Junio"; break;
		case 7: case '07': return "Julio"; break;
		case 8: case '08': return "Agosto"; break;
		case 9: case '09': return "Septiembre"; break;
		case 10: case '10': return "Octubre"; break;
		case 11: case '11': return "Noviembre"; break;
		case 12: case '12': return "Diciembre"; break;
	}
}