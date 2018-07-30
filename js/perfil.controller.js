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
}