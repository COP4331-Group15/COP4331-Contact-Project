
<?php
  // COP4331 Group 15, 6/7/2021
  // Creates an API endpoint that allows the user to create custom contacts.

  $inData = getRequestInfo();

  // Takes in the users input for the necessary fields to create a contact.
  $FirstName = $inData["FirstName"];
  $LastName = $inData["LastName"];
  $Email = $inData["Email"];
  $PhoneNumber = $inData["PhoneNumber"];
  $Address = $inData["Address"];
  $UserID = $inData["UserID"];

  // Establishes a connection with the mySQL database.
  $conn = new mysqli("localhost", "Group15Admin", "ByVivec", "COP4331");
  if( $conn->connect_error )
  {
    returnWithError( $conn->connect_error );
  }
  else
  {
    // Prepares and executes a mySQL statement that inserts the custom contact
    // into the database.
    $stmt = $conn->prepare("INSERT into Contacts (FirstName, LastName, Email, PhoneNumber, Address, UserID) VALUES(?,?,?,?,?,?)");
    $stmt->bind_param("sssssi", $FirstName, $LastName, $Email, $PhoneNumber, $Address, $UserID);
    $stmt->execute();

    // Gets the ID the contact was inserted at and uses another mySQL statement
    // to select that row.
    $lastID = $conn->insert_id;
    $stmt->close();
    $stmt2 = $conn->prepare("SELECT * FROM Contacts WHERE ID = ?");
    $stmt2->bind_param("s", $lastID);
    $stmt2->execute();
    $result = $stmt2->get_result();

    // Returns with the info of the inserted contact if it was inserted correctly.
    if( $row = $result->fetch_assoc() )
		{
			returnWithInfo( $row['ID'], $row['FirstName'], $row['LastName'], $row['Email'],
       $row['PhoneNumber'],  $row['Address'] );
		}
		else
		{
			returnWithError("Bad Input Syntax");
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
