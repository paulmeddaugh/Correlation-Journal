<?php
	  $iName = $_POST["iName"];
	  $des = $_POST["des"];
	  $quan = $_POST["quan"];
	  $user = $_POST["user"];

	// Connect to MySQL
	$db = mysqli_connect("localhost", "root", "r23dFh5LbPNqJB", "Team4");
	if (mysqli_connect_errno()) {
		print "Connect failed: " . mysqli_connect_error();
		exit();
	}

	// Submit the query for the list of folders
	$query = "INSERT INTO Team4.Inventory(idInventory, Pname, Pdescription) VALUES (NULL, '$iName', '$des');";
	$query2 = "INSERT INTO Team4.Owns(item_idInventory, owner_idUser, quantity) VALUES (last_insert_id(), $user, $quan);";

	$result = mysqli_query($db, $query);
	$result2 = mysqli_query($db, $query2);

	if (!$result || !$result2) {
		print "Unable to insert item in inventory/DB error" .
		mysqli_error();
		exit;
	}else{
		print "Item Inserted!";
		return true;
	}
	
	mysqli_close($db);
?>