//de esta manera se puede prevenir la acción por defecto, es este caso no se enviara el formulario
//este event puede tener otro nombre, pero debe de ser igual que el de .preventDefault();
function procesa_envio(event) //la "e" es el event con otro nombre
{
  event.preventDefault();

	console.log("Procesando envío!!!");
	
	let salida = document.getElementById("salida");
	
	let nombre = document.getElementById("nombre_contacto");
//value mira que contiene la variable 
	if (nombre.value.length < 2)
	{
		salida.value = "El nombre debe de tener almenos 2 caracteres";
		
		nombre.style.color = "#ff0000";
		nombre.style.border = "1px solid #ff0000";
		salida.style.color = "#ff0000";
		
		nombre.focus(); //dirije la antencion al campo deseado
		return false;
	}
		nombre.style.color = "#00ff00";
		nombre.style.border = "1px solid #00ff00";
		salida.style.color = "#00ff00";

	let email = document.getElementById("email_contacto");
	if (email.value.length < 6)
	{
		salida.value = "El e-mail debe de tener almenos 6 caracteres";
		
		email.style.color = "#ff0000";
		email.style.border = "1px solid #ff0000";
		salida.style.color = "#ff0000";
		
		email.focus();
		return false;
	}
		email.style.color = "#00ff00";
		email.style.border = "1px solid #00ff00";
		salida.style.color = "#00ff00";
		
	let mensaje = document.getElementById("mensaje_contacto");
	if (mensaje.value.length < 5)
	{
		salida.value = "El mensaje debe de tener almenos 5 caracteres";
		
		mensaje.style.color = "#ff0000";
		mensaje.style.border = "1px salid #ff0000";
		salida.style.color = "#ff0000";
		
		mensaje.focus();
		return false;
	}
		mensaje.style.color = "#00ff00";
		mensaje.style.border = "1px solid #00ff00";
		salida.style.color = "#00ff00";
		
		
	document.getElementById("form_contacto").submit();
}