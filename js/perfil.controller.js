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
					li = $('<li />', {
						class: "encabezado",
						text: contacto.nombre[0].toUpperCase()
					});
					
					$(".listaContactos ul").append(li);
				}
				
				var li = $('<li />', {
					text: contacto.nombre
				});
				
				$(".listaContactos ul").append(li);
			});
			
			$(".espera").hide();
		}, "json");
	});
}