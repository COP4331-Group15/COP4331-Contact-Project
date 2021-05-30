<?php

	$inData = getRequestInfo();

	$searchResults = [];
	$searchCount = 0;

	$conn = new mysqli("localhost", "Group15Admin", "ByVivec", "COP4331");
	if ($conn->connect_error) {
		returnWithError($conn->connect_error);
	}

	$stmt = $conn->prepare("SELECT * FROM Contacts WHERE (FirstName LIKE ?) AND (LastName LIKE ?) AND (UserID = ?) ");
	$FirstName = "%" . $inData["searchFirst"] . "%";
	$LastName = "%" . $inData["searchLast"] . "%";
	$stmt->bind_param("ssi", $FirstName, $LastName, $inData["userID"]);
	$stmt->execute();

	//$result should get the result set 
	if ($result = $stmt->get_result()) {
		while ($row = $result->fetch_assoc()) {
			$searchCount++;
			array_push($searchResults, $row);
		}

		//incase of empty result set, return no results, otherwise return data
		if ($searchCount == 0) {
			returnWithError("No results found.");
		} else {
			returnWithInfo(json_encode($searchResults));
		}
	} else returnWithError("Debug: Empty result set");

	//in each iteraion of the loop, $row should get the next available row

	$stmt->close();
	$conn->close();


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
		$retValue = '{"ID":0,"FirstName":"","LastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}

	function returnWithInfo($searchResults)
	{
		$retValue = '{"results": ' . $searchResults . ' ,"error":""}';
		sendResultInfoAsJson($retValue);
	}
?>