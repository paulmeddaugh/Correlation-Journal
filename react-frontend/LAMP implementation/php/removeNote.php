<?php
	$idNote = $_POST["idNote"];

	// Connect to MySQL
	$db = mysqli_connect("localhost", "root", "", "Team4");
	if (mysqli_connect_errno()) {
		print "Connect failed: " . mysqli_connect_error();
		exit();
	}

	// Submit the query for the list of folders
    $query = "DELETE FROM Notes WHERE idNote = '$idNote'";

	$result = mysqli_query($db, $query);

	if (!$result) {
		print "Unable to delete note.\n" .
		mysqli_error($db);
		exit;
	}else{
		print "Note deleted.";
		return true;
	}
	
	mysqli_close($db);
?>