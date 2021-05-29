var urlBase = 'http://contacts.tallens.codes';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

function doSignup()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	var firstname = document.getElementById("firstname").value;
	var lastname = document.getElementById("lastname").value;
	var login = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	var hash = md5( password );
	

	var jsonPayload = '{"FirstName" : "' + firstname + '", "LastName" : "' + lastname + '", "Login" : "' +  login + '", "Password" : "' + hash + '"}';
	// var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	var url = urlBase + '/sign_up.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.ID;
		
				if( userId < 1 )
				{		
					//document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.FirstName; //test this with api from backend
				lastName = jsonObject.LastName;

				saveCookie();
				
				window.location.href = "index.html";
				
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		//document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	var login = document.getElementById("login").value;
	var password = document.getElementById("password").value;
	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	var jsonPayload = '{"Login" : "' + login + '", "Password" : "' + hash + '"}';
	// var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	var url = urlBase + '/log_in.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.ID;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.FirstName; //test this with api from backend
				lastName = jsonObject.LastName;

				saveCookie();
				
				window.location.href = "index.html";
				
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		//document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}