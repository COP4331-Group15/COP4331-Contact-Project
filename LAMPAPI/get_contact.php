
<?php
  $inData = getRequestInfo();

  $ID = $inData["ID"];
  $FirstName = "";
  $LastName = "";
  $Email = "";
  $PhoneNumber = "";
  $Address = "";

  $conn = new mysqli("localhost", "Group15Admin", "ByVivec", "COP4331");
  if( $conn->connect_error )
  {
    returnWithError( $conn->connect_error );
  }
  else
  {
    $stmt = $conn->prepare("SELECT * FROM Contacts WHERE ID = ?");
    $stmt->bind_param("i", $ID);
    $stmt->execute();
    $result = $stmt->get_result();

    if( $row = $result->fetch_assoc() )
		{
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
