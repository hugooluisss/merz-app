/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var db = null;
var objUsuario;
var plantillas = {};

var app = {
	// Application Constructor
	initialize: function() {
		this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicitly call 'app.receivedEvent(...);'
	onDeviceReady: function() {
		document.addEventListener("backbutton", function(){
			return false;
		}, true);
		
		window.plugins.PushbotsPlugin.initialize("5ad4c3cd1db2dc46e312c9a5", {
			"android": {
				"sender_id":"431227519870",
				"icon": "white_notification_icon",
				"iconColor": "#123456"
			}
		});
		
		window.plugins.PushbotsPlugin.on("notification:received", function(data){
			console.log("received:", data);
			var datos = JSON.stringify(data);
			window.plugins.PushbotsPlugin.resetBadge();
			
			//Silent notifications Only [iOS only]
			//Send CompletionHandler signal with PushBots notification Id
			window.plugins.PushbotsPlugin.done(data.pb_n_id);
			if (data.aps.alert != '')
				alertify.success(data.aps.alert);
				
			window.plugins.PushbotsPlugin.resetBadge();
		});
		
		// Should be called once the notification is clicked
		window.plugins.PushbotsPlugin.on("notification:clicked", function(data){
			console.log("clicked:" + JSON.stringify(data));
			if (data.message != undefined)
				alertify.success(data.message);
				
			window.plugins.PushbotsPlugin.resetBadge();
		});	
		
		//window.plugins.PushbotsPlugin.debug(true);
		// Should be called once the device is registered successfully with Apple or Google servers
		window.plugins.PushbotsPlugin.on("registered", function(token){
			console.log("Token de registro", token);
			
			window.plugins.PushbotsPlugin.tag("app");
			window.plugins.PushbotsPlugin.setAlias("user_" + window.localStorage.getItem("session"));
			
			alertify.log("Tu equipo quedó registrado para recibir notificaciones");
		});
		
		//Get device token
		window.plugins.PushbotsPlugin.getRegistrationId(function(token){
		    console.log("Registration Id:" + token);
		});	
		
		window.plugins.PushbotsPlugin.on("user:ids", function (data) {
			console.log("user:ids" + JSON.stringify(data));
			
			// userToken = data.token; 
			// userId = data.userId
		});
		
		window.plugins.PushbotsPlugin.tag("app");
		window.plugins.PushbotsPlugin.setAlias("user_" + window.localStorage.getItem("session"));
		
		window.plugins.PushbotsPlugin.resetBadge();
		window.plugins.PushbotsPlugin.toggleNotifications(true);
	}
};

app.initialize();

$(document).ready(function(){
//	app.onDeviceReady();
	
	objUsuario = new TUsuario;
	if (!objUsuario.isLogin())
		location.href = "index.html";
			
	getPlantillas();
	showPanel("home");
	
	/*Últimas noticias*/
	$.post(server + "citems", {
		"action": "getUltimasNoticias",
		"movil": true
	}, function(items){
		var primero = true;
		$.each(items, function(i, noticia){
			var pl = $(plantillas['noticiaCorousel']);
			setDatos(pl, noticia);
			
			if (primero){
				primero = false;
				pl.addClass("active");
			}
			
			$("#ultimasNoticias").find(".carousel-inner").append(pl);
		});
		
		$("#ultimasNoticias").carousel();
	}, "json");
	
	
	/*Departamentos*/
	$.post(server + "listadepartamentos", {
		"movil": true,
		"json": true
	}, function(departamentos){
		$.each(departamentos, function(key, depa){
			var plDepa = $(plantillas['menu.departamento']);
			
			$.each(depa, function(campo, valor){
				plDepa.find("[campo=" + campo + "]").html(valor);
			});
			
			if (depa.icono != undefined && depa.icono != ""){
				plDepa.find(".icono").prop("src", server + depa.icono);
				plDepa.find(".icono2").prop("src", server + depa.icono);
				//plDepa.css("background-image", "url(" + server + depa.icono + ")");
				
				plDepa.find(".icono").show();
				plDepa.find(".icono2").show();
			}else{
				plDepa.find(".icono").remove();
				plDepa.find(".icono2").hide();
			}
			
			if (depa.color2 == undefined || depa.color2 == "")
				plDepa.css("background-color", depa.color1);
			else
				plDepa.css("background-image", "linear-gradient(90deg, " + depa.color1 + ", " + depa.color2 + ")");
				
			plDepa.attr("json", depa.json);
			plDepa.click(function(){
				callDepartamento(depa)
			});
			
			$(".departamentos").append(plDepa);
		});
	}, "json");
	
	/* Datos del perfil */
	objUsuario = new TUsuario;
	objUsuario.getData({
		fn: {
			after: function(resp){
				$.each(resp, function(key, valor){
					$('[campo="usuario.' + key + '"]').html(valor);
				});
				
				$(".imagenUsuario").attr("src", "images/usuario.jpg");
				$(".imagenUsuario").prop("src", (resp.imagenPerfil == '' || resp.imagenPerfil == undefined)?"images/usuario.jpg":(server + resp.imagenPerfil));
				
			}
		}
	});
	
	$.post(server + "cnotificaciones", {
		"movil": true,
		"action": "getTotalNotificaciones",
		"usuario": objUsuario.idUsuario
	}, function(resp){
		$("[notificaciones]").text(resp.total);
	}, "json");
});