TUsuario = function(){
	var self = this;
	self.idUsuario = window.locateStorage.getItem("session");
	
	this.isLogin = function(){
		if (self.idUsuario == '' || self.idUsuario == undefined || self.idUsuario == null) return false;
		if (self.idUsuario != window.locateStorage.getItem("session")) return false;
		
		return true;
	};
	
	this.login = function(datos){
		if (datos.before !== undefined) datos.before();
		
		$.post(server + 'clogin', {
			"usuario": datos.usuario,
			"pass": datos.pass, 
			"action": 'login',
			"movil": 'true'
		}, function(resp){
			if (resp.band == false)
				console.log(resp.mensaje);
			else{
				window.localStorage.setItem("session", resp.idUsuario);
				self.idUsuario = resp.idUsuario;
			}
				
			if (datos.after !== undefined)
				datos.after(resp);
		}, "json");
	};
};