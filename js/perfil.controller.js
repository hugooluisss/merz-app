function callPerfil(departamento){	
	$("[panel=perfil] [showPanel]").click(function(){
		showPanel($(this).attr("showpanel"), "faderight");
		$("div[vista]").hide();
		$(".grupo").show();
	});
	
	$("[showvista=notificaciones]").click(function(){
		objUsuario.getNotificaciones({
			fn: {
				after:function(notificaciones){
					$.each(notificaciones, function(i, notificacion){
						console.log(notificacion);
					});
				}
			}
		});
	});
	
	$("[panel=perfil] [showVista]").click(function(){
		$(".grupo").hide();
		$.get("vistas/" + $(this).attr("showvista") + ".html", function(resp){
			$("div[vista]").html(resp);
			$("div[vista]").show();
			
			$("[panel] [hidevista]").click(function(){
				$("[panel] [vista]").hide();
				$(".grupo").show();
			});
			
			$(".busquedaContactos #txtBuscarContacto").keyup(function(){
				if ($(this).val() == '')
					$(".listaContactos").find("li").show();
				else
					var texto = $(this).val().toUpperCase();
					$(".listaContactos").find("li.contacto").each(function(){
						var li = $(this);
						
						if (li.attr("busqueda").toUpperCase().search(texto) >= 0)
							li.show();
						else
							li.hide();
					});
			});
		});
	});
	
	$("[showvista=contactos]").click(function(){
		$(".espera").show();
		$.post(server + "contactos", {
			"json": true,
			"movil": true
		},
		function(contactos){
			var inicial = "";
			$(".listaContactos").find("li").remove();
			$.each(contactos, function(key, contacto){
				if (contacto.nombre[0] != inicial){
					var li = $("<li />", {
						class: "encabezado",
						text: contacto.nombre[0].toUpperCase()
					});
					
					$(".listaContactos ul").append(li);
				}
				
				var li = $("<li />", {
					text: contacto.nombre + " " + contacto.apellidos,
					class: "contacto",
					busqueda: contacto.nombre + " " + contacto.apellidos
				});
				
				li.click(function(){
					$("#winContacto").modal();
					
					$.each(contacto, function(campo, valor){
						$("#winContacto").find("[campo=" + campo + "]").html(valor);
					});
					
					$("#winContacto").find("[campo=fotoPerfil]").prop("src", contacto.fotoPerfil == ' '?"images/usuario.jpg":(server + contacto.fotoPerfil));
				});
				
				$(".listaContactos ul").append(li);
			});
			
			$(".espera").hide();
		}, "json");
	});
	
	$("#btnSalir").click(function(){
		window.localStorage.removeItem("session");
		
		location.href = "index.html";
	});
	
	
	$("#btnCamara").click(function(){
		if (navigator.camera != undefined){
			navigator.camera.getPicture(function(imageData) {
					objUsuario.setImagenPerfil({
						"imagen": imageData,
						fn: {
							before: function(){
								$("#imgPerfil").prop("src", "images/usuario.jpg");
								$(".imagenUsuario").attr("src", "images/usuario.jpg");
							},
							after: function(resp){
								if (resp.band){
									alertify.success("La fotografía se cargó con éxito");
									$("#imgPerfil").attr("src", "data:image/jpeg;base64," + imageData);
									
									$(".imagenUsuario").attr("src", "data:image/jpeg;base64," + imageData);
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
	
	
	$("#imgPerfil").prop("src", (objUsuario.imagenPerfil == '' || objUsuario.imagenPerfil == undefined)?"images/usuario.jpg":(server + objUsuario.imagenPerfil));
	
	$('#winDatos').on('shown.bs.modal', function (event){
		$('#winDatos').find("input:text:visible:first").focus();
		
		$.each(objUsuario.datos, function(key, valor){
			$("#winDatos").find("[campo=" + key + "]").val(valor);
		});
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
}