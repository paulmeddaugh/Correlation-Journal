
    <?php
	  $combined = $_POST["combined"];
	  $deCombined = json_decode($combined, true);
	  $dClength = sizeof($deCombined);
	  
	// Connect to MySQL
	$db = mysqli_connect("localhost", "root", "r23dFh5LbPNqJB", "Team4");
	if (mysqli_connect_errno()) {
		print "Connect failed: " . mysqli_connect_error();
		exit();
	}
	
	$query = "INSERT INTO Team4.Sells(`4sale_id`, item_idInventory, seller_idUser, quantity, price) VALUES ";
	
	for ($i = 0; $i < $dClength; $i++) {
		  if($i != $dClength -1){
		$query .= "$deCombined[$i],";
		  }else{
			  $query .= "$deCombined[$i];";
		  }
} 

	$result = mysqli_query($db, $query);

	if (!$result) {
		print "Transaction Failed" .
		mysqli_error();
		exit;
	}else{
		print "Items Updated!";
		return true;
	}
	
	mysqli_close($db);
?>
