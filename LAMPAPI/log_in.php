
<?php
	// COP4331 Group 15, 6/7/2021
	// Creates an API endpoint that allows the user to log in to a pre-existing
	// account.

	$inData = getRequestInfo();

	// Initializes the input values.
	$ID = 0;
	$FirstName = "";
	$LastName = "";

	// Establishes a connection with the mySQL database.
	$conn = new mysqli("localhost", "Group15Admin", "ByVivec", "COP4331");
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		// Prepares and executes a mySQL statement that selects a user from the
		// database with the inputted login and password.
		$stmt = $conn->prepare("SELECT ID,FirstName,LastName FROM Users WHERE Login=? AND Password =?");
		$stmt->bind_param("ss", $inData["Login"], $inData["Password"]);
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc() )
		{
			// Returns with the selected users info if they are found.
			returnWithInfo( $row['FirstName'], $row['LastName'], $row['ID'], $row['Login'] );
		}
		else
		{
			returnWithError("No Records Found");
		}

		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError( $err )
	{
		// Returns with the error in JSON.
		$retValue = '{"ID":0,"FirstName":"","LastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $FirstName, $LastName, $ID, $Login )
	{
		// Returns with the contact info in JSON.
		$retValue = '{"ID":' . $ID . ',"FirstName":"' . $FirstName . '","LastName":"' . $LastName . '","Login":"' . $Login . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
