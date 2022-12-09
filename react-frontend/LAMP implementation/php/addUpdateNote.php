<?php

  $idUser = $_GET["idUser"];
  $idNotebook = isset($_GET["idNotebook"]) ? $_GET["idNotebook"] : null;   		  // Param used for an existing notebook
  $newNotebookName = isset($_GET["newNotebookName"]) ? $_GET["newNotebookName"] : null; // Param used for creating a new one
  $title = $_GET["title"];
  $text = $_GET["text"];
  $quotes = $_GET["quotes"];
  $isMain = filter_var($_GET["isMain"], FILTER_VALIDATE_BOOLEAN);
  $addConnections = isset($_GET["addConnections"]) ? json_decode($_GET["addConnections"], true) : null;
  $deleteConnections = isset($_GET["removeConnections"]) ? json_decode($_GET["removeConnections"], true) : null;
  $idNote = isset($_GET["idNote"]) ? $_GET["idNote"] : null; // Updating a note
  
  // Connect to MySQL
  	$db = mysqli_connect("localhost", "root", "", "Team4");
	if (mysqli_connect_errno()) {
		print "Connect failed: " . mysqli_connect_error();
		exit();
	}
	
	// Create notebook if new
	if ($newNotebookName) {
		$newNotebookInsert = "INSERT INTO Notebooks (idUser, name) VALUES ('$idUser', '$newNotebookName')";
		$newNotebookResult = mysqli_query($db, $newNotebookInsert);

		if (!$newNotebookResult) {
			print "Unable to create new notebook named '$newNotebookName'\n" .
			mysqli_error($db);
			exit;
		}

		// Gets id of new notebook
		$newNotebookQuery = "SELECT * FROM Notebooks WHERE name = '$newNotebookName'";
		$result2 = mysqli_query($db, $newNotebookQuery);

		$row = $result2->fetch_assoc();
		$idNotebook = $row["idNotebook"];

		print "New notebook '$newNotebookName' created.\n";
	}

	$query = '';
	$result = new stdClass();
	if (!$idNote) { // Creates a new note
		$query = "INSERT INTO Notes (title, idEmotion, text, quotes, idNotebook, idUser, isMain)
			VALUES ('$title', null, '$text', '$quotes', '$idNotebook', '$idUser', '$isMain')";
		$result = mysqli_query($db, $query);

		// Gets the new note's id
		$queryIdNote = "SELECT idNote FROM Notes ORDER BY idNote DESC LIMIT 1"; // Gets last inserted record
		$idNote = mysqli_query($db, $queryIdNote)->fetch_assoc()["idNote"];

	} else { // Updates a note
		$query = "UPDATE Notes 
			SET title = '$title', text = '$text', quotes = '$quotes', idNotebook = '$idNotebook', 
				idUser = '$idUser', isMain = '$isMain'
			WHERE idNote = '$idNote'";
		$result = mysqli_query($db, $query);
	}

	$connectionsArray = array_merge($addConnections, $deleteConnections);
	$addConnectionsLen = count($addConnections);
	$connectionsArrayLen = count($connectionsArray);
	$connectionResult = true;

	for($i = 0; $i < $connectionsArrayLen; $i++) {
		$idNote1 = min($connectionsArray[$i], $idNote);
		$idNote2 = max($connectionsArray[$i], $idNote);
		
		if ($i <= $addConnections) {
			$query = "INSERT INTO Connections (idNote1, idNote2, idNotebook, idUser)
				VALUES ('$idNote1', '$idNote2', '$idNotebook', '$idUser')";
		} else {
			$query = "DELETE FROM Connections 
				WHERE idNote1 = '$idNote1' AND idNote2 = '$idNote2' AND idUser = '$idUser'";
		}
		
		$result = mysqli_query($db, $query);
	
		if (!$result) {
			print "Unable to " . (($i < $addConnectionsLen) ? "create connection" : "remove connection") .
			" '$idNote1' to '$idNote2'.\n" .
			mysqli_error($db);
			$connectionResult = false;
		} else {
			print "Connection created from '$idNote1' to '$idNote2'\n";
		}
	}

	if (!$result || !$connectionResult) {
		print "Error: The note could not be " . ((!$idNote) ? "created.\n" : "updated.\n") . 
		mysqli_error($db);
		exit;
	} else {
		print "Note " . ((!$idNote) ? "created." : "updated.");
		return true;
	}

	mysqli_close($db);
?>