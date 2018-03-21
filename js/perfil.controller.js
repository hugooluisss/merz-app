function callPerfil(departamento){	
	$("[panel=perfil] [showPanel]").click(function(){
		showPanel($(this).attr("showpanel"), "faderight");
		$("div[vista]").hide();
	});
	
	$("[panel=perfil] [showVista]").click(function(){
		$.get("vistas/" + $(this).attr("showvista") + ".html", function(resp){
			$("div[vista]").html(resp);
			$("div[vista]").show();
			
			$("[panel] [hidevista]").click(function(){
				$("[panel] [vista]").hide();
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
}