
<?php
  // COP4331 Group 15, 6/7/2021
  // Creates an API endpoint that allows the user to delete stored contacts.

  $inData = getRequestInfo();

  // Takes in the users input ID for the contact to be deleted.
  $ID = $inData["ID"];

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
    $stmt1 = $conn->prepare("SELECT * FROM Contacts WHERE ID = ?");
    $stmt1->bind_param("i", $ID);
    $stmt1->execute();
    $result = $stmt1->get_result();
    $stmt1->close();
    if( $row = $result->fetch_assoc() )
		{
      // If the correct ID value is exists, prepares and executes a mySQL
      // statement that deletes the contact with the inputted ID value.
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
    // Returns with the error in JSON.
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
  }
?>
