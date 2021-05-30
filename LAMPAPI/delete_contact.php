
<?php
  $inData = getRequestInfo();

  $ID = $inData["ID"];

  $conn = new mysqli("localhost", "Group15Admin", "ByVivec", "COP4331");
  if( $conn->connect_error )
  {
    returnWithError( $conn->connect_error );
  }
  else
  {
    $stmt1 = $conn->prepare("SELECT * FROM Contacts WHERE ID = ?");
    $stmt1->bind_param("i", $ID);
    $stmt1->execute();
    $result = $stmt1->get_result();
    $stmt1->close();
    if( $row = $result->fetch_assoc() )
		{
      $stmt2 = $conn->prepare("DELETE FROM Contacts WHERE ID = ?");
      $stmt2->bind_param("i", $ID);
      $stmt2->execute();
      $stmt2->close();
      $conn->close();
      returnWithError("");
      echo "\nContact deleted successfully.";
		}
		else
		{
			returnWithError("No Records Found");
		}
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
?>
