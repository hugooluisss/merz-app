function callPerfil(){
	console.info("Llamando a perfil");
	$("[modulo]").html(plantillas["perfil"]);
	$("#panelBuscar").addClass("panelBtnBuscar");
	setPanel();
	
	$("#imgPerfil").prop("src", (objUsuario.imagenPerfil == '' || objUsuario.imagenPerfil == undefined)?"img/fotoContacto.png":(server + objUsuario.imagenPerfil));
	
	setDatos($("[panel=perfil]"), objUsuario.datos);
	
	$('#winDatos').on('shown.bs.modal', function (event){
		$('#winDatos').find("input:text:visible:first").focus();
		
		$.each(objUsuario.datos, function(key, valor){
			$("#winDatos").find("[campo=" + key + "]").val(valor);
		});
	});
	
	$("#btnSalir").click(function(){
		mensajes.confirm({"mensaje": "¿Seguro?", "titulo": "Salir", "funcion": function(resp){
				if (resp == 1){
					window.localStorage.removeItem("session");
					location.href = "index.html";
				}
			}
		})
	});
	
	$("#imgPerfil").click(function(){
		if (navigator.camera != undefined){
			navigator.camera.getPicture(function(imageData) {
					objUsuario.setImagenPerfil({
						"imagen": imageData,
						fn: {
							before: function(){
								$("#imgPerfil").prop("src", "images/usuario.jpg");
							},
							after: function(resp){
								if (resp.band){
									alertify.success("La fotografía se cargó con éxito");
									$("#imgPerfil").attr("src", "data:image/jpeg;base64," + imageData);
								}else
									alertify.error("Ocurrió un error al actualizar la fotografía");
							}
						}
					});
				}, function(message){
					alertify.error("Ocurrió un error al guardar la fotografía");
				}, { 
					quality: 100,
					destinationType: Camera.DestinationType.DATA_URL,
					encodingType: Camera.EncodingType.JPEG,
					targetWidth: 250,
					targetHeight: 250,
					correctOrientation: true,
					allowEdit: true
				});
		}else{
			mensajes.log({mensaje: "No se pudo iniciar la cámara"});
			console.log("No se pudo inicializar la cámara");
		}
	});
	
	
	$("#frmActualizarDatos").validate({
		debug: true,
		errorClass: "validateError",
		rules: {
			txtNombre: {
				required : true
			},
			txtCorreo: {
				required : true
			}
		},
		wrapper: 'span',
		submitHandler: function(form){
			form = $(form);
			objUsuario.add({
				"nombre": $("#txtNombre").val(),
				"apellidos": $("#txtApellidos").val(), 
				"email": $("#txtCorreo").val(),
				"nacimiento": $("#txtNacimiento").val(),
				"numemp": $("#txtNumeroEmpleado").val(),
				"imss": $("#txtIMSS").val(),
				"rfc": $("#txtRFC").val(),
				"fechaingreso": $("#txtFechaIngreso").val(),
				fn: {
					before: function(){
						form.find("[type=submit]").prop("disabled", true);
					}, after: function(resp){
						form.find("[type=submit]").prop("disabled", false);
						
						if (resp.band){
							mensajes.log({mensaje: "Tus datos se actualizaron"});
							$("#winDatos").modal("hide");
							
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
						}else
							mensajes.alert({titulo: "Error", mensaje: "Ocurrió un error al actualizar tus datos, prueba nuevamente"});
					}
				}
			});
		}
	});
	
	console.info("Perfil cargado");
	
	$(".showCalendario").click(function(){
		$("[panel=calendarioEventos]").show();
		$("#dvCalendario").html("");
		caleandar(document.getElementById('dvCalendario'), listaEventos, {
			backgroundDateTime: "#152b8e",
			EventClick: function (el){
				el = $(el)[0];
				$.post(server + "citems", {
					'action': 'eventosDia',
					'fecha': el.anio + '-' + el.mes + '-' + el.dia,
					"movil": true,
					//"departamento": departamento.idDepartamento,
				}, function(eventos){
					div = $("[panel=calendarioEventos]").find("#dvListaEventos");
					var center = $("<center>No existen eventos</center>");
					div.html("");
					div.append(center);
					
					$.each(eventos, function(){
						var evento = $(this);
						console.log(evento);
						var pl = $(plantillas['eventoCalendario']);
						evento = evento[0];
						$.each(evento, function(campo, valor){
							pl.find("[campo=" + campo + "]").html(valor);
						});
						
						div.append(pl);
						center.remove();
					});
					
				}, "json");
			}
		});
		
		$("[panel=calendarioEventos]").find("#dvListaEventos").html("<center>No existen eventos</center>");
	});
}