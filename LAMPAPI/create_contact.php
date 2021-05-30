
<?php
  $inData = getRequestInfo();

  $FirstName = $inData["FirstName"];
  $LastName = $inData["LastName"];
  $Email = $inData["Email"];
  $PhoneNumber = $inData["PhoneNumber"];
  $Address = $inData["Address"];
  $UserID = $inData["UserID"];


  $conn = new mysqli("localhost", "Group15Admin", "ByVivec", "COP4331");
  if( $conn->connect_error )
  {
    returnWithError( $conn->connect_error );
  }
  else
  {
    $stmt = $conn->prepare("INSERT into Contacts (FirstName, LastName, Email, PhoneNumber, Address, UserID) VALUES(?,?,?,?,?,?)");
    $stmt->bind_param("sssssi", $FirstName, $LastName, $Email, $PhoneNumber, $Address, $UserID);
    $stmt->execute();
    $lastID = $conn->insert_id;
    $stmt->close();
    $stmt2 = $conn->prepare("SELECT * FROM Contacts WHERE ID = ?");
    $stmt2->bind_param("s", $lastID);
    $stmt2->execute();
    $result = $stmt2->get_result();

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
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
  }

  function returnWithInfo( $ID, $FirstName, $LastName, $Email, $PhoneNumber, $Address )
	{
		$retValue = '{"ID":' . $ID . ',"FirstName":"' . $FirstName . '","LastName":"' .
      $LastName . '","Email":"' . $Email . '","PhoneNumber":"' . $PhoneNumber .
      '","Address":"' . $Address . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>
