var server = "http://somosmerz.com/panel_app/";
//var server = "http://192.168.2.4/merz/";
//var server = "http://localhost/merz/";
var panelActivo = "";

function showPanel(panel, efecto = 0, after){
	console.log("Ocultando ", $(this).attr("showPanel"), "Mostrando ", $(this).attr("showPanel"));
	duracion = 500;
	
	if (after == undefined)
		after = null;
	
	$("[panel=" + panelActivo + "]").hide();
	
	switch(efecto){
		case 'faderight':
			$("[panel=" + panel + "]").show("slide", { direction: "right" }, duracion);
		break;
		case 'fadeleft':
			$("[panel=" + panel + "]").show("slide", { direction: "left" }, duracion);
		break;
		case 'slow':
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
	plantillas['menu.departamento'] = "";
	plantillas['quienessomos'] = "";
	plantillas['noticia'] = "";
	plantillas['archivo'] = "";
	
	plantillas['privacidad'] = "";
	plantillas['contactos'] = "";
	plantillas['contacto'] = "";
	
	$.each(plantillas, function(pl, valor){
		$.get("vistas/" + pl + ".html", function(html){
			plantillas[pl] = html;
		});
	});
};

function setButtonsBack(el){
	el.find("#btnHidePerfil").click(function(){
		$("[panel=perfil]").hide("slide", { direction: "right" }, 500);
		$("[panel=home]").show();
	});
	
	el.find("#btnHideDepto").click(function(){
		alert("Hola");
		$("[panel=departamento]").hide("slide", { direction: "right" }, 500);
		$("[panel=home]").show();
	});
	
	el.find("button[data-target]").click(function(){
		var self = $(this);
		$(".cinta").hide();
		$(self.attr("data-target")).show("slide", { direction: "left" }, 500);
	});
	
	el.find("#menuBack").click(function(){
		$("#menuSecciones").hide("slide", { direction: "left" }, 500, function(){
			$(".cinta").show();
		});
	});
	
	
	el.find("[showpanel]").click(function(){
		showPanel($(this).attr("showpanel"), "faderight");
		$("div[vista]").hide();
	});
	
	
	el.find("[data-target]").click(function(){
		var self = $(this);
		$(".cinta").hide();
		$(self.attr("data-target")).show("slide", { direction: "left" }, 500);
	});
}