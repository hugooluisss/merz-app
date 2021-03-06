TUsuario = function(){
	var self = this;
	self.idUsuario = window.localStorage.getItem("session");
	self.datos = {};
	
	this.isLogin = function(){
		if (self.idUsuario == '' || self.idUsuario == undefined || self.idUsuario == null) return false;
		if (self.idUsuario != window.localStorage.getItem("session")) return false;
		
		return true;
	};
	
	this.login = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		
		$.post(server + 'clogin', {
			"usuario": datos.usuario,
			"pass": datos.pass, 
			"action": 'login',
			"movil": 'true'
		}, function(resp){
			if (resp.band == false)
				console.log(resp.mensaje);
			else{
				window.localStorage.setItem("session", resp.datos.usuario);
				self.idUsuario = resp.datos.idUsuario;
			}
				
			if (datos.fn.after !== undefined)
				datos.fn.after(resp);
		}, "json");
	};
	
	this.getData = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		
		var usuario = datos.idUsuario == undefined?self.idUsuario:datos.idUsuario;
		
		$.post(server + 'cusuarios', {
			"id": usuario,
			"action": 'getData',
			"movil": 'true'
		}, function(resp){
			self.datos = resp;
			self.imagenPerfil = self.datos.imagenPerfil;
			if (datos.fn.after !== undefined)
				datos.fn.after(resp);
		}, "json");
	}
	
	this.setImagenPerfil = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		$.post(server + 'cusuarios', {
			"usuario": self.idUsuario,
			"imagen": datos.imagen,
			"action": 'setImagenPerfil',
			"movil": 1
		}, function(data){
			if (data.band == false)
				console.log("Ocurrió un error");
			else
				self.imagenPerfil = datos.imagen;
				
			if (datos.fn.after !== undefined)
				datos.fn.after(data);
		}, "json");
	}
	
	this.add = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		
		$.post(server + 'cusuarios', {
				"id": self.idUsuario,
				"nombre": datos.nombre,
				"apellidos": datos.apellidos, 
				"email": datos.email,
				"nacimiento": datos.nacimiento,
				"numemp": datos.numemp,
				"imss": datos.imss,
				"rfc": datos.rfc,
				"fechaingreso": datos.fechaingreso,
				"pass": datos.pass,
				"action": "add",
				"movil": 1
			}, function(data){
				if (data.band == false)
					console.log(data.mensaje);
					
				if (datos.fn.after !== undefined)
					datos.fn.after(data);
			}, "json");
	};
	
	this.getNotificaciones = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		
		$.post(server + 'cnotificaciones', {
				"usuario": self.idUsuario,
				"action": "getNotificaciones",
				"movil": 1,
				"json": true
			}, function(data){
				if (datos.fn.after !== undefined)
					datos.fn.after(data);
			}, "json");
	};
	
	this.getTotalNewsNotificaciones = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		
		$.post(server + "cnotificaciones", {
			"movil": true,
			"action": "getTotalNotificaciones",
			"usuario": self.idUsuario
		}, function(data){
			if (datos.fn.after !== undefined)
				datos.fn.after(data);
		}, "json");
	};
};