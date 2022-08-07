<?php
	  $idNotebook = $_POST["idNotebook"];

	// Connect to MySQL
	$db = mysqli_connect("localhost", "root", "", "Team4");
	if (mysqli_connect_errno()) {
		print "Connect failed: " . mysqli_connect_error();
		exit();
	}

	// Submit the query for the list of folders
    $query = "DELETE FROM Notes WHERE idNotebook = '$idNotebook'";
	$query2 = "DELETE FROM Notebooks WHERE idNotebook = '$idNotebook'";

	$result = mysqli_query($db, $query);
    $result2 = mysqli_query($db, $query2);

	if (!$result || !$result2) {
		print "Unable to delete notebook.\n" .
		mysqli_error($db);
		exit;
	}else{
		print "Notebook deleted.";
		return true;
	}
	
	mysqli_close($db);
?>