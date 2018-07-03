var server = "http://somosmerz.com/panel_app/";
//var server = "http://192.168.2.4/merz/";
var server = "http://localhost/merz/";
var panelActivo = "";

function showPanel(panel, efecto, after){
	duracion = 500;
	
	if (after == undefined)
		after = null;
	
	$("[panel=" + panelActivo + "]").hide();
	
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


function getPlantillas(){
	//plantillas['menu.departamento'] = "";
	//plantillas['quienessomos'] = "";
	/*
	plantillas['noticia'] = "";
	plantillas['archivo'] = "";
	plantillas['evento'] = "";
	plantillas['eventoCalendario'] = "";
	
	plantillas['privacidad'] = "";
	plantillas['contactos'] = "";
	plantillas['contacto'] = "";
	plantillas['notificacion'] = "";
	plantillas['resumenNoticia'] = "";
	*/
	
	plantillas['noticiaCorousel'] = "";
	plantillas['menu.departamento'] = "";
	
	$.each(plantillas, function(pl, valor){
		$.get("vistas/" + pl + ".html", function(html){
			plantillas[pl] = html;
		});
	});
	
	cargaInit = ["buscar"];
	
	$.each(cargaInit, function(pl, valor){
		console.log("cargando " + valor);
		$.get("vistas/" + valor + ".html", function(html){
			$("body").append(html);
		});
	});
};

function setDatos(plantilla, datos){
	console.log(datos);
	$.each(datos, function(i, valor){
		plantilla.find("[campo=" + i + "]").html(valor);
		plantilla.find("[campo=" + i + "]").val(valor);
	});
	
	console.log(plantilla);
}