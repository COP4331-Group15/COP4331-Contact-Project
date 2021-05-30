var urlBase = 'http://contacts.tallens.codes/LAMPAPI';
var extension = 'php';

var userData = {
	userID: -1,
	firstName: "",
	lastName: ""
}

function doSignup()
{
	
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

				userData.userID = jsonObject.ID;
		
				if( userData.userID < 1 )
				{		
					//document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				userData.firstName = jsonObject.FirstName; //test this with api from backend
				userData.lastName = jsonObject.LastName;

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
				userData.userID = jsonObject.ID;
		
				if( userData.userID < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				userData.firstName = jsonObject.FirstName; //test this with api from backend
				userData.lastName = jsonObject.LastName;

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

function doGetContact() 
{
	// Get the information from the URL
	var queryString = window.location.search;
	var urlParams = new URLSearchParams(queryString);

	if(!urlParams.has('id')) {
		// The page is missing a key ID. Send the user to the search page
		window.location.href = "search.html";
		return;
	}

	var targetID = urlParams.get('id');

	var payload = {
		"ID": targetID
	};

	var url = urlBase + '/get_contact.' + extension;

	// Get relevant data from server
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			var jsonResponse = JSON.parse(this.responseText);

			if(jsonResponse.error.length > 0) {
				// Error in the process.
				console.log(jsonResponse.error);
				return;
			}

			// We have contact information. Display on the webpage.
			document.getElementById("contact-firstName").innerText = jsonResponse.FirstName;
			document.getElementById("contact-lastName").innerText = jsonResponse.LastName;
			document.getElementById("contact-email").innerText = jsonResponse.Email;
			document.getElementById("contact-phone").innerText = jsonResponse.PhoneNumber;
			document.getElementById("contact-address").innerText = jsonResponse.Address;
		}
	}

	xhr.send(JSON.stringify(payload));
}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	
	payload = encodeURIComponent(JSON.stringify(userData));
	document.cookie = "userData=" + payload + ";expires=" + date.toGMTString();;
}

function readCookie()
{
	var allCookies = document.cookie;
	var split = allCookies.split(";");

	var cookieData = "";

	for(var i = 0; i < split.length; i++) {
		var cookiepair = split[i];
		while(cookiepair.charAt(0) == ' ') {
			cookiepair = cookiepair.substring(1);
		}

		if(cookiepair.indexOf("userData=") == 0) {
			cookieData = cookiepair.substring("userData=".length, cookiepair.length);
		}
	}

	if(cookieData.length <= 0) {
		// No data is loaded
		window.location.href = "index.html";
		return;
	}

	userData = JSON.parse(decodeURIComponent(cookieData));
	//document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
}

function doLogout()
{
	userData.userID = -1;
	userData.firstName = "";
	userData.lastName = "";
	document.cookie = "userData= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}
