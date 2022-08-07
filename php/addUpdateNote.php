<?php

  $idUser = $_GET["idUser"];
  $idNotebook = isset($_GET["idNotebook"]) ? $_GET["idNotebook"] : null;   		  // Param used for an existing notebook
  $newNotebookName = isset($_GET["newNotebookName"]) ? $_GET["newNotebookName"] : null; // Param used for creating a new one
  $title = $_GET["title"];
  $text = $_GET["text"];
  $quotes = $_GET["quotes"];
  $isMain = filter_var($_GET["isMain"], FILTER_VALIDATE_BOOLEAN);
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
	if (!$idNote) {
		$query = "INSERT INTO Notes (title, idEmotion, text, quotes, idNotebook, idUser, isMain)
			VALUES ('$title', null, '$text', '$quotes', '$idNotebook', '$idUser', '$isMain')";
		$result = mysqli_query($db, $query);
	} else {
		$query = "UPDATE Notes 
			SET title = '$title', text = '$text', quotes = '$quotes', idNotebook = '$idNotebook', 
				idUser = '$idUser', isMain = '$isMain'
			WHERE idNote = '$idNote'";
		$result = mysqli_query($db, $query);
	}
	

	if (!$result) {
		print "Error: The note could not be " . ((!$idNote) ? "created.\n" : "updated.\n") . 
		mysqli_error($db);
		exit;
	} else {
		print "Note " . ((!$idNote) ? "created." : "updated.");
		return true;
	}

	mysqli_close($db);
?>