
<?php
	// COP4331 Group 15, 6/7/2021
	// Creates an API endpoint that allows the user to search through the existing
	// contacts.

	$inData = getRequestInfo();

	// Initializes the search values.
	$searchResults = [];
	$searchCount = 0;

	// Establishes a connection with the mySQL database.
	$conn = new mysqli("localhost", "Group15Admin", "ByVivec", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		// Prepares and executes a mySQL statement that selects all contacts with a
		// similar first and last name and the given userID
	$stmt = $conn->prepare("SELECT * FROM Contacts WHERE CONCAT_WS(' ', FirstName, LastName) LIKE ? AND (UserID = ?) ORDER BY LastName, FirstName");
	$unifiedSearch = "%" . $inData["query"] . "%";
	$stmt->bind_param("si", $unifiedSearch, $inData["userID"]);
	$stmt->execute();

		if ($result = $stmt->get_result())
		{
			// Loops through the resulting values of the mySQL statement and pushes them
			// to an array.
			while ($row = $result->fetch_assoc())
			{
				$searchCount++;
				array_push($searchResults, $row);
			}

			// Returns that values found or an error if no values are found.
			if ($searchCount == 0)
			{
				returnWithError("No results found.");
			}
			else
			{
				returnWithInfo(json_encode($searchResults));
			}
		}
		else
		{
			returnWithError("Debug: Empty result set");
		}

		$stmt->close();
		$conn->close();
	}


	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError($err)
	{
		// Returns with the error in JSON.
		$retValue = '{"ID":0,"FirstName":"","LastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}

	function returnWithInfo($searchResults)
	{
		// Returns with the contact info in JSON.
		$retValue = '{"results": ' . $searchResults . ' ,"error":""}';
		sendResultInfoAsJson($retValue);
	}
