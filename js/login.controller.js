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
			showPanel("home", "slow");
		}, true);
		
		showPanel("home", "slow");
		objUsuario = new TUsuario;
		
		$("[showPanel]").click(function(){
			showPanel($(this).attr("showPanel"));
		});
		
		$("#txtUsuario").val(window.localStorage.getItem("loginuser"));
		$("#txtPass").val(window.localStorage.getItem("loginpass"));
		
		$("#chkPass").prop("checked", $("#txtPass").val() != '');
		
		$("#chkPass").click(function(){
			if (!$("#chkPass").is(":checked")){
				window.localStorage.removeItem("loginpass");
				window.localStorage.removeItem("loginuser");
			}
		});
		
		$("#frmLogin").validate({
			debug: true,
			errorClass: "validateError",
			rules: {
				txtUsuario: "required",
				txtPass: "required"
			},
			wrapper: 'span',
			submitHandler: function(form){
				objUsuario.login({
					'usuario': $("#txtUsuario").val(), 
					'pass': $("#txtPass").val(), 
					fn: {
						before: function(){
							$("#frmLogin [type=submit]").prop("disabled", true);
						},
						after: function(data){
							$("#frmLogin [type=submit]").prop("disabled", false);
							
							if (data.band == true){
								if ($("#chkPass").is(":checked")){
									window.localStorage.setItem("loginpass", $("#txtPass").val());
									window.localStorage.setItem("loginuser", $("#txtUsuario").val());
								}
								location.href = "inicio.html";
							}else
								mensajes.alert({"mensaje": "Tus datos no son correctos, intenta nuevamente", "titulo": "Identificación de usuario"});
						}
					}
				});
			}
		});
	}
};

//app.initialize();

$(document).ready(function(){
	app.onDeviceReady();
});