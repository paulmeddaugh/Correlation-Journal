<?php
    $idNote1 = $_POST["idNote1"];
    $idNote2 = $_POST["idNote2"];
	$idUser = $_POST["idUser"];
    $action = $_POST["action"];

	// Connect to MySQL
	$db = mysqli_connect("localhost", "root", "", "Team4");
	if (mysqli_connect_errno()) {
		print "Connect failed: " . mysqli_connect_error();
		exit();
	}

	// Add or remove connection based on specified action parameter
    $query = '';
    if ($action == 'add') {
        $query = "INSERT INTO Connections (idNote1, idNote2, idUser)
            VALUES ('$idNote1', '$idNote2', '$idUser')";
    } else {
        $query = "DELETE FROM Connections 
			WHERE idNote1 = '$idNote1' AND idNote2 = '$idNote2' AND idUser = '$idUser'";
    }
    
	$result = mysqli_query($db, $query);

	if (!$result) {
		print "Unable to " . (($action == 'add') ? "create connection.\n" : "remove connection.\n") .
		mysqli_error($db);
		exit;
	}else{
		print "Connection " ($action == 'add') ? "created." : "removed.";
		return true;
	}
	
	mysqli_close($db);
?>