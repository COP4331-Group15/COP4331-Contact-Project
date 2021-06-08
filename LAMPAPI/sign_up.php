
<?php
  // COP4331 Group 15, 6/7/2021
  // Creates an API endpoint that allows the user to create an account.
  $inData = getRequestInfo();

  // Takes in the users input for the necessary fields to create an account.
  $FirstName = $inData["FirstName"];
  $LastName = $inData["LastName"];
  $Login = $inData["Login"];
  $Password = $inData["Password"];

  // Establishes a connection with the mySQL database.
  $conn = new mysqli("localhost", "Group15Admin", "ByVivec", "COP4331");
  if( $conn->connect_error )
  {
    returnWithError( $conn->connect_error );
  }
  else
  {
    // Prepares and executes a mySQL statement that selects all users with the
    // inputted login to check if any accounts with the given login already
    // exist.
    $stmt0 = $conn->prepare("SELECT * FROM Users WHERE Login = ?");
    $stmt0->bind_param("s", $Login);
    $stmt0->execute();
    $result0 = $stmt0->get_result();
    if( $row = $result0->fetch_assoc() )
    {
      // Returns an error if an account with the given login already exists.
      returnWithError("User with the provided login already exists");
      $stmt0->close();
    }
    else
    {
      // Prepares and executes a mySQL statement that inserts the new user's info
      // into the database.
      $stmt0->close();
      $stmt1 = $conn->prepare("INSERT into Users (FirstName, LastName, Login, Password) VALUES(?,?,?,?)");
      $stmt1->bind_param("ssss", $FirstName, $LastName, $Login, $Password);
      $stmt1->execute();

      // Gets the ID the user was inserted at and uses another mySQL statement
      // to select that row.
      $lastID = $conn->insert_id;
      $stmt1->close();
      $stmt2 = $conn->prepare("SELECT * FROM Users WHERE ID = ?");
      $stmt2->bind_param("i", $lastID);
      $stmt2->execute();
      $result = $stmt2->get_result();

      // Returns with the info of the inserted user if it was inserted correctly.
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

  function returnWithInfo( $ID, $FirstName, $LastName, $Login )
	{
    // Returns with the contact info in JSON.
		$retValue = '{"ID":' . $ID . ',"FirstName":"' . $FirstName . '","LastName":"' .
      $LastName . '","Login":"' . $Login . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>
