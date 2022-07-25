<?php

  $idUser = $_GET["idUser"];
  $idNotebook = isset($_GET["idNotebook"]);   		  // Param used for an existing notebook
  $newNotebookName = isset($_GET["newNotebookName"]); // Param for additionally creating a new one
  $title = $_GET["title"];
  $text = $_GET["text"];
  $quotes = $_GET["quotes"];
  
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

	$query = "INSERT INTO Notes (title, idEmotion, text, quotes, idNotebook, idUser)
		VALUES ('$title', null, '$text', '$quotes', '$idNotebook', '$idUser')";
	$result = mysqli_query($db, $query);

	if (!$result) {
		print "Error: The note could not be created.\n" . 
		mysqli_error($db);
		exit;
	} else {
		print "Note created.";
		return true;
	}

	mysqli_close($db);
?>