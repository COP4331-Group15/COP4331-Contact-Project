
<?php
  // COP4331 Group 15, 6/7/2021
  // Creates an API endpoint that allows the user to edit existing contacts.
  $inData = getRequestInfo();

  // Takes in the ID of the contact to be updated as well as the updated values.
  $ID = $inData["ID"];
  $FirstName = $inData["FirstName"];
  $LastName = $inData["LastName"];
  $Email = $inData["Email"];
  $PhoneNumber = $inData["PhoneNumber"];
  $Address = $inData["Address"];

  // Establishes a connection with the mySQL database.
  $conn = new mysqli("localhost", "Group15Admin", "ByVivec", "COP4331");
  if( $conn->connect_error )
  {
    returnWithError( $conn->connect_error );
  }
  else
  {
    // Prepares and executes a mySQL statement that updates the contacts values
    // with the given ID.
    $stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Email = ?,
      PhoneNumber = ?, Address = ? WHERE ID = ?");
    $stmt->bind_param("sssssi", $FirstName, $LastName, $Email, $PhoneNumber, $Address, $ID);
    $stmt->execute();
    $stmt->close();

    // Uses another mySQL statement to select the updated row.
    $stmt2 = $conn->prepare("SELECT * FROM Contacts WHERE ID = ?");
    $stmt2->bind_param("i", $ID);
    $stmt2->execute();
    $result = $stmt2->get_result();

    // Returns with the info of the updated contact if it was updated correctly.
    if( $row = $result->fetch_assoc() )
		{
			returnWithInfo( $row['ID'], $row['FirstName'], $row['LastName'], $row['Email'],
       $row['PhoneNumber'],  $row['Address'] );
		}
		else
		{
			returnWithError("No Records Found");
		}

    $stmt2->close();
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
		$retValue = '{"ID":' . $ID . ',"FirstName":"' . $FirstName . '","LastName":"' . $LastName . '","Email":"' . $Email . '","PhoneNumber":"' . $PhoneNumber . '","Address":"' . $Address . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>
