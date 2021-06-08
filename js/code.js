var urlBase = 'http://contacts.tallens.codes/LAMPAPI';
var extension = 'php';

var userData = {
	userID: -1,
	firstName: "",
	lastName: ""
}

/*
 * Authentication-Relevant Code
 */

function doSignup() {

	var firstname = document.getElementById("firstname").value;
	var lastname = document.getElementById("lastname").value;
	var login = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	var hash = md5(password);


	var jsonPayload = '{"FirstName" : "' + firstname + '", "LastName" : "' + lastname + '", "Login" : "' + login + '", "Password" : "' + hash + '"}';
	// var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	var url = urlBase + '/sign_up.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				var jsonObject = JSON.parse(xhr.responseText);

				userData.userID = jsonObject.ID;

				if (userData.userID < 1) {
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
	catch (err) {
		//document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doLogin() {
	var login = document.getElementById("login").value;
	var password = document.getElementById("password").value;
	var hash = md5(password);

	document.getElementById("loginResult").innerHTML = "";

	var jsonPayload = '{"Login" : "' + login + '", "Password" : "' + hash + '"}';
	// var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	var url = urlBase + '/log_in.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				var jsonObject = JSON.parse(xhr.responseText);
				userData.userID = jsonObject.ID;

				if (userData.userID < 1) {
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
	catch (err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doLogout() {
	userData.userID = -1;
	userData.firstName = "";
	userData.lastName = "";
	document.cookie = "userData= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";

	window.location.href = "index.html";
}

/*
 * Contact-specific functionality
 */

function doGetContact() {
	// Get the information from the URL
	var queryString = window.location.search;
	var urlParams = new URLSearchParams(queryString);

	if (!urlParams.has('id')) {
		// The page is missing a key ID. Send the user to the search page
		window.location.href = "homepage.html";
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
		if (this.readyState == 4 && this.status == 200) {
			var jsonResponse = JSON.parse(this.responseText);

			if (jsonResponse.error.length > 0) {
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

function doGetContactForDelete() {
	// Get the information from the URL
	var queryString = window.location.search;
	var urlParams = new URLSearchParams(queryString);

	if (!urlParams.has('id')) {
		// The page is missing a key ID. Send the user to the search page
		window.location.href = "homepage.html";
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
		if (this.readyState == 4 && this.status == 200) {
			var jsonResponse = JSON.parse(this.responseText);

			if (jsonResponse.error.length > 0) {
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

function doDeleteContact() {
	// 1. Get the ID of the contact to delete
	//    - In the URL
	var queryString = window.location.search;
	var urlParams = new URLSearchParams(queryString);
	var targetID = urlParams.get('id');

	var payload = {
		"ID": targetID
	}

	var url = urlBase + '/delete_contact.' + extension;

	// 2. Create the XMLHTTP request to delete the contact
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);

	xhr.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var jsonResponse = JSON.parse(this.responseText);

			if (jsonResponse.error.length > 0) {
				// Something went wrong
				document.getElementById("delete-error").innerText = jsonResponse.error;
				return;
			}

			// 3. If it's all good, redirect to the home page
			window.location.href = "/homepage.html";
		}
	}

	xhr.send(JSON.stringify(payload));
}

function doGetRelevantContacts() {
	// Get our search value
	var query = document.getElementById("searchbox").value ?? "";

	if (query.length <= 0) {
		// We have no query. Display a "Begin typing to display results"
		document.getElementById("results-table").innerHTML = `
					<tr>
						<td><h4>Begin typing to search contacts</h4></td>
					</tr>
				`;
		return;
	}

	var payload = {
		"query": query,
		"userID": userData.userID ?? 0
	}

	var url = urlBase + "/search_contacts." + extension;

	// Get relevant data from server
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var jsonResponse = JSON.parse(this.responseText);

			if (jsonResponse.error.length > 0 && jsonResponse.error !== "No results found.") {
				// Error in the process.
				console.log(jsonResponse.error);
				return;
			}

			// Get all results from the response
			var results = jsonResponse.results;
			var resultsHTML = "";

			for (var i in results) {
				// Create & format a result contact
				// Append to the results string
				resultsHTML += formatContactResult(results[i]);
			}

			if (results.length <= 0) {
				// Display "no results" message
				document.getElementById("results-table").innerHTML = `
					<tr>
						<td><h2>No Results</h2></td>
					</tr>
				`;
			} else {
				document.getElementById("results-table").innerHTML = resultsHTML;
			}

		}
	}

	xhr.send(JSON.stringify(payload));
}

function formatContactResult(contact) {
	var html = `
		<tr>
			<td>
				<h3>${contact.LastName ?? "Contact"}, ${contact.FirstName ?? "Example"}</h3>
				
				<address>
					<strong>📧: ${contact.Email ?? "ExampleContact@Example.com"}</strong>
					<br>📱: ${contact.PhoneNumber ?? "+1 (407) 555-555"}
					<br>🏠: ${contact.Address ?? "42 Wallaby Way Sydney"}
				</address>
					
			</td>
			<td>
				<div class="d-flex flex-column justify-content-around align-items-end">
					<a href="editContact.html?id=${contact.ID ?? -1}" class="btn btn-light btn-xs m-2" title="Edit">
						<i><img src="images/pencil-square.svg" width="20" alt="pencil-square"/></i>
					</a>
					<a href="deleteContact.html?id=${contact.ID ?? -1}" class="btn btn-danger btn-xs m-2" title="Delete">
						<i><img src="images/person-x.svg" width="20" alt="person-x"/></i>
					</a>
				</div>
			</td>
		</tr>
	`;
	return html;
}

function addContact() {

	const inputFirstName = document.getElementById("input-firstname");
	const inputLastName = document.getElementById("input-lastname");
	const inputEmail = document.getElementById("input-email");
	const inputPhone = document.getElementById("input-phone");
	const inputAddress = document.getElementById("input-address");

	var payload = {
		"FirstName": inputFirstName.value,
		"LastName": inputLastName.value,
		"Email": inputEmail.value,
		"PhoneNumber": inputPhone.value,
		"Address": inputAddress.value,
		"UserID": userData.userID
	};

	var url = urlBase + '/create_contact.' + extension;

	// Get relevant data from server
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var jsonResponse = JSON.parse(this.responseText);

			if (jsonResponse.error.length > 0) {
				// Error in the process.
				console.log(jsonResponse.error);
				document.getElementById("newContactResult").innerText = jsonResponse.error;
				return;
			}

			// The process succeeded. Inform the user, clear input
			document.getElementById("newContactResult").innerText = "Successfully created a new contact for " + inputFirstName.value + " " + inputLastName.value;
			inputFirstName.value = "";
			inputLastName.value = "";
			inputEmail.value = "";
			inputPhone.value = "";
			inputAddress.value = "";
		}
	}

	xhr.send(JSON.stringify(payload));
}

function doIndexRedirect() {
	// We need to get our user data
	readCookie();

	// If we are logged in, go to the homepage.
	if (userData.userID > 0) {
		window.location.href = "homepage.html";
	} else {
		// If not, go to signup.
		window.location.href = "login.html";
	}
}

function saveCookie() {
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));

	payload = encodeURIComponent(JSON.stringify(userData));
	document.cookie = "userData=" + payload + ";expires=" + date.toGMTString();;
}

function readCookie() {
	var allCookies = document.cookie;
	var split = allCookies.split(";");

	var cookieData = "";

	for (var i = 0; i < split.length; i++) {
		var cookiepair = split[i];
		while (cookiepair.charAt(0) == ' ') {
			cookiepair = cookiepair.substring(1);
		}

		if (cookiepair.indexOf("userData=") == 0) {
			cookieData = cookiepair.substring("userData=".length, cookiepair.length);
		}
	}

	if (cookieData.length <= 0) {
		// No data is loaded
		window.location.href = "index.html";
		return;
	}

	userData = JSON.parse(decodeURIComponent(cookieData));
	//document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
}

function doGetContactForUpdate() {
	// Get the information from the URL
	var queryString = window.location.search;
	var urlParams = new URLSearchParams(queryString);

	if (!urlParams.has('id')) {
		// The page is missing a key ID. Send the user to the search page
		window.location.href = "homepage.html";
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
		if (this.readyState == 4 && this.status == 200) {
			var jsonResponse = JSON.parse(this.responseText);

			if (jsonResponse.error.length > 0) {
				// Error in the process.
				console.log(jsonResponse.error);
				return;
			}

			// We have contact information. Display on the webpage.
			document.getElementById("input-firstname").value = jsonResponse.FirstName;
			document.getElementById("input-lastname").value = jsonResponse.LastName;
			document.getElementById("input-email").value = jsonResponse.Email;
			document.getElementById("input-phone").value = jsonResponse.PhoneNumber;
			document.getElementById("input-address").value = jsonResponse.Address;
		}
	}

	xhr.send(JSON.stringify(payload));
}


function doEditContact() {
	// 1. Get the ID of the contact to update
	var queryString = window.location.search;
	var urlParams = new URLSearchParams(queryString);
	var targetID = urlParams.get('id');

	// 2. Get the various parts of the contact
	var firstname = document.getElementById("input-firstname").value;
	var lastname = document.getElementById("input-lastname").value;
	var email = document.getElementById("input-email").value;
	var phone = document.getElementById("input-phone").value;
	var address = document.getElementById("input-address").value;

	if(firstname.length <= 0 || lastname.length <= 0) {
		// Both are empty. User should fill these.
		return false;
	}

	var payload = {
		"ID": targetID,
		"FirstName": firstname,
		"LastName": lastname,
		"Email": email,
		"PhoneNumber": phone,
		"Address": address
	}

	var url = urlBase + '/update_contact.' + extension;

	// 2. Create the XMLHTTP request to update the contact
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);

	xhr.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var jsonResponse = JSON.parse(this.responseText);

			if (jsonResponse.error.length > 0) {
				// Something went wrong
				document.getElementById("delete-error").innerText = jsonResponse.error;
				return;
			}

			// 3. If it's all good, redirect to the home page
			window.location.href = "/homepage.html";
		}
	}

	xhr.send(JSON.stringify(payload));
	return true;
}

function doAddDevCheck() {
	// If we have "dev=true" in the URL
	var queryString = window.location.search;
	var urlParams = new URLSearchParams(queryString);
	if (urlParams.has("dev")) {
		// Make the random button appear
		document.getElementById("dev-random-button").classList.remove("d-none");
	}
}

function generateRandomContact() {
	// Get a random name from api.namefake.com
	const namefakeurl = "https://randomuser.me/api/";

	var xhr = new XMLHttpRequest();
	xhr.open("GET", namefakeurl, true);

	xhr.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var jsonResponse = JSON.parse(this.responseText);

			var userData = jsonResponse.results[0];

			document.getElementById("input-firstname").value = userData.name.first;
			document.getElementById("input-lastname").value = userData.name.last;
			document.getElementById("input-email").value = userData.email;
			document.getElementById("input-phone").value = userData.phone;
			document.getElementById("input-address").value = userData.location.street.number + " " + userData.location.street.name;
		}
	}

	xhr.send();
}
