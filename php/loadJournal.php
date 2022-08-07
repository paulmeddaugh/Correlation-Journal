<?php

  $idUser = $_GET["idUser"];
  $idNotebook = isset($_GET["idNotebook"]);
  $getEmotions = isset($_GET["getEmotions"]);
  
  // Connect to MySQL
  	$db = mysqli_connect("localhost", "root", "", "Team4");
	if (mysqli_connect_errno()) {
		print "Connect failed: " . mysqli_connect_error();
		exit();
	}
	
    if (!$idNotebook) {
        // Selects all notes of a user
        $query = "SELECT idNote, title, idEmotion, dateCreated, text, quotes, n.idNotebook, isMain 
            FROM Notes n 
            INNER JOIN User u ON u.idUser = n.idUser
            WHERE n.idUser = '$idUser'";
    } else {
        // Selects all notes from a user's notebook
        $query = "SELECT idNote, title, idEmotion, dateCreated, text, quotes, n.idNotebook, isMain 
            FROM Notes n 
            INNER JOIN User u ON u.idUser = n.idUser
            WHERE n.idUser = '$idUser' AND n.idNotebook = '$idNotebook'";
    }
    $notesResult = mysqli_query($db, $query);

    // Gets all notebooks
    $notebooksQuery = "SELECT idNotebook, name FROM Notebooks";
    $notebooksResult = mysqli_query($db, $notebooksQuery);
	
    // Gets all connections
    $connectionsQuery = "SELECT idNote1, idNote2 FROM Connections WHERE idUser = '$idUser'";
    $connectionsResult = mysqli_query($db, $connectionsQuery);
    
	if (!$notesResult || !$notebooksResult || !$connectionsResult) {
		print "Error: the query could not be executed.\n" . 
		mysqli_error($db);
		exit;
	}
	
	$notes_num_rows = mysqli_num_rows($notesResult);
    $notebooks_num_rows = mysqli_num_rows($notebooksResult);
    $connections_num_rows = mysqli_num_rows($connectionsResult);

	$notesArray = array();
    $notebooksArray = array();
    $connectionsArray = array();

	// If there are rows in the result, put them in an HTML table
	if ($notes_num_rows + $notebooks_num_rows + $connections_num_rows > 0) {    // output data of each row
		
        $notesIndex = 0;
		while($row = $notesResult->fetch_assoc()) {
			$x = new stdClass();
			// names are what you want to use; but the indexes are from the DB
			$x->idNote = $row["idNote"];
			$x->title = $row["title"];
			$x->idEmotion = $row["idEmotion"];
			$x->dateCreated = $row["dateCreated"];
			$x->text = $row["text"];
            $x->quotes = $row["quotes"];
            $x->idNotebook = $row["idNotebook"];
            $x->isMain = $row["isMain"];
			
			$notesArray[$notesIndex] = $x;
			
			$notesIndex = $notesIndex + 1;
		}

        $notebooksIndex = 0;
		while($row = $notebooksResult->fetch_assoc()) {
			$x = new stdClass();
			// names are what you want to use; but the indexes are from the DB
			$x->idNotebook = $row["idNotebook"];
			$x->name = $row["name"];
			
			$notebooksArray[$notebooksIndex] = $x;
			
			$notebooksIndex = $notebooksIndex + 1;
		}

        $connectionsIndex = 0;
		while($row = $connectionsResult->fetch_assoc()) {
			$x = new stdClass();
			// names are what you want to use; but the indexes are from the DB
			$x->idNote1 = $row["idNote1"];
			$x->idNote2 = $row["idNote2"];
			
			$connectionsArray[$connectionsIndex] = $x;
			
			$connectionsIndex = $connectionsIndex + 1;
		}

        $result = new stdClass();
        $result->notes = $notesArray;
        $result->notebooks = $notebooksArray;
        $result->connections = $connectionsArray;
		
		$responseJSON = json_encode($result);
	} else {
		// no folders for this user; that'd be wierd
		$responseJSON = json_encode("");
	}

	echo $responseJSON;
	mysqli_close($db);
?>