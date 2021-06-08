
<?php
  // COP4331 Group 15, 6/7/2021
  // Creates an API endpoint that allows the user to get a specific contact.

  $inData = getRequestInfo();

  // Takes in the users input ID for the contact to be retrieved.
  $ID = $inData["ID"];
  $FirstName = "";
  $LastName = "";
  $Email = "";
  $PhoneNumber = "";
  $Address = "";

  // Establishes a connection with the mySQL database.
  $conn = new mysqli("localhost", "Group15Admin", "ByVivec", "COP4331");
  if( $conn->connect_error )
  {
    returnWithError( $conn->connect_error );
  }
  else
  {
    // Prepares and executes a mySQL statement that selects the contact with
    // the inputted ID value to check if it exists.
    $stmt = $conn->prepare("SELECT * FROM Contacts WHERE ID = ?");
    $stmt->bind_param("i", $ID);
    $stmt->execute();
    $result = $stmt->get_result();

    if( $row = $result->fetch_assoc() )
		{
      // If the correct ID value is exists, returns with the values of that contact.
			returnWithInfo( $row['ID'], $row['FirstName'], $row['LastName'], $row['Email'],
       $row['PhoneNumber'],  $row['Address'] );
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
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
  }

  function returnWithInfo( $ID, $FirstName, $LastName, $Email, $PhoneNumber, $Address )
	{
    // Returns with the contact info in JSON.
		$retValue = '{"ID":' . $ID . ',"FirstName":"' . $FirstName . '","LastName":"' .
      $LastName . '","Email":"' . $Email . '","PhoneNumber":"' . $PhoneNumber .
      '","Address":"' . $Address . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>
