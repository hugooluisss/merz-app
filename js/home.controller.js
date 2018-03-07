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
		
		$("button[data-target]").click(function(){
			var self = $(this);
			$(self.attr("data-target")).show("slide", { direction: "left" }, 500)
		});
		
		$("#menuBack").click(function(){
			$("#menuSecciones").hide("slide", { direction: "left" }, 500)
		});
	}
};

//app.initialize();

$(document).ready(function(){
	app.onDeviceReady();
	
	getPlantillas();
	showPanel("home");
	
	$("[showPanel]").click(function(){
		showPanel($(this).attr("showPanel"), "faderight");
		$("div[vista]").hide();
	});
	
	$("[showVista]").click(function(){
		$.get("vistas/" + $(this).attr("showVista") + ".html", function(resp){
			$("div[vista]").html(resp);
			$("div[vista]").show();
		});
	});
	
	objUsuario = new TUsuario;
	objUsuario.getData({
		fn: {
			after: function(resp){
				$.each(resp, function(key, valor){
					$('[campo="usuario.' + key + '"]').html(valor);
				});
			}
		}
	});
	
	$.post(server + "listadepartamentos", {
		"movil": true,
		"json": true
	}, function(departamentos){
		$.each(departamentos, function(key, depa){
			var plDepa = $(plantillas['menu.departamento']);
			
			$.each(depa, function(campo, valor){
				plDepa.find("[campo=" + campo + "]").html(valor);
			});
			if (depa.color2 == undefined)
				plDepa.css("background", depa.color1);
			else
				plDepa.css("background", "linear-gradient(90deg, " + depa.color1 + ", " + depa.color2 + ")");
			$(".departamentos").append(plDepa);
		});
	}, "json");
});