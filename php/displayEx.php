<?php
  
  // Connect to MySQL
  	$db = mysqli_connect("localhost", "root", "r23dFh5LbPNqJB", "Team4");
	if (mysqli_connect_errno()) {
		print "Connect failed: " . mysqli_connect_error();
		exit();
	}
	
	// Submit the query for the list of folders
	$query = "SELECT Team4.Sells.`4sale_id`, Team4.Sells.seller_idUser, Team4.Inventory.idInventory, Team4.User.username, Team4.Sells.quantity, Pname, Pdescription, Team4.Sells.price
		FROM Team4.Inventory
		INNER JOIN Team4.Sells ON
		Team4.Inventory.idInventory = Team4.Sells.item_idInventory
		INNER JOIN Team4.User ON 
		Team4.Sells.seller_idUser = Team4.User.idUser";
	
	$result = mysqli_query($db, $query);
	$db->close();
	
	if (!$result) {
		print "Error - the query could not be executed" . 
		mysqli_error();
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
			$x->saleID = $row["4sale_id"];
			$x->sellId = $row["seller_idUser"];
			$x->Iid = $row["idInventory"];
			$x->username = $row["username"];
			$x->sellquan = $row["quantity"];
			$x->Iname = $row["Pname"];
			$x->descrip = $row["Pdescription"];
			$x->Sellprice = $row["price"];
			
			$myarray[$index] = $x;
			
			$index = $index + 1;
		}
		
		$responseJSON = json_encode($myarray);
	} else {
		// no folders for this user; that'd be wierd
		$responseJSON = json_encode("");
	}

	echo $responseJSON;
?>