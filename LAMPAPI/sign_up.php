
<?php
  $inData = getRequestInfo();

  $FirstName = $inData["FirstName"];
  $LastName = $inData["LastName"];
  $Login = $inData["Login"];
  $Password = $inData["Password"];

  $conn = new mysqli("localhost", "Group15Admin", "ByVivec", "COP4331");
  if( $conn->connect_error )
  {
    returnWithError( $conn->connect_error );
  }
  else
  {
    $stmt = $conn->prepare("INSERT into Users (FirstName, LastName, Login, Password) VALUES(?,?,?,?)");
    $stmt->bind_param("ssss", $FirstName, $LastName, $Login, $Password);
    $stmt->execute();
    $lastID = $conn->insert_id;
    $stmt->close();
    $stmt2 = $conn->prepare("SELECT * FROM Users WHERE ID = ?");
    $stmt2->bind_param("i", $lastID);
    $stmt2->execute();
    $result = $stmt2->get_result();

    if( $row = $result->fetch_assoc() )
		{
			returnWithInfo( $row['ID'], $row['FirstName'], $row['LastName'], $row['Login'] );
		}
		else
		{
			returnWithError("Bad Input Syntax");
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
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
  }

  function returnWithInfo( $ID, $FirstName, $LastName, $Login )
	{
		$retValue = '{"ID":' . $ID . ',"FirstName":"' . $FirstName . '","LastName":"' .
      $LastName . '","Login":"' . $Login . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>
