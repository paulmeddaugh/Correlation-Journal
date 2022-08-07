
 <?php
	$username = $_GET["username"];
    $password = $_GET["password"]; 
	
	// Connect to MySQL
	$db = mysqli_connect("localhost", "root", "", "Team4");
	if (mysqli_connect_errno()) {
		print "Connect failed: " . mysqli_connect_error();
		exit();
	}
	
	// Submit the query for the list of folders
	$query = "SELECT idUser, username, pwd, name 
		FROM Team4.User 
		WHERE username = '$username' AND pwd = '$password'";
	
	$result = mysqli_query($db, $query);
	
	if (!$result) {
		print "Error - the query could not be executed\n" . 
		mysqli_error($db);
		exit;
	}
	
	$num_rows = mysqli_num_rows($result);

	$myarray = array();
	// If there are rows in the result, put them in an HTML table
	if ($num_rows > 0) {    // output data of each row
		$index = 0;
		while($row = $result->fetch_assoc()) {
			$x = new stdClass();
			// names are what you want to use; but the indexes are from the DB
			$x->uid = $row["idUser"];
			$x->username = $row["username"];
			$x->password = $row["pwd"];
			$x->nameu = $row["name"];
			
			$myarray[$index] = $x;
			
			$index = $index + 1;
		}
		
		$responseJSON = json_encode($myarray);
	} else {
		// no folders for this user; that'd be wierd
		$responseJSON = json_encode("");
	}

	echo $responseJSON;

	mysqli_close($db);
?>