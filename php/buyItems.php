

    <?php
	  $combined = $_POST["combined"];
	  $TotalPrice = $_POST["TotalPrice"];
	  $combined2 = $_POST["combined2"];
	  $combined3 = $_POST["combined3"];
	  $combined4 = $_POST["combined4"];
	  $combined5 = $_POST["combined5"];
	  $combined6 = $_POST["combined6"];
	  $user = $_POST["user"];
	  
	  $tranaction = json_decode($combined, true);
	  $sellerBals = json_decode($combined2, true);
	  $insertInven = json_decode($combined3, true);
	  $insertOwns = json_decode($combined4, true);
	  $updateSells = json_decode($combined5, true);
	  $updateOwns = json_decode($combined6, true);
	  $tLen = sizeof($tranaction);
	  $sBLen = sizeof($sellerBals);
	  $iILen = sizeof($insertInven);
	  $iOLen = sizeof($insertOwns);
	  $uSLen = sizeof($updateSells);
	  $uOLen = sizeof($updateOwns);
	  
	// Connect to MySQL
	$db = mysqli_connect("localhost", "root", "r23dFh5LbPNqJB", "Team4");
	if (mysqli_connect_errno()) {
		print "Connect failed: " . mysqli_connect_error();
		exit();
	}
	
	$query = "INSERT INTO Team4.Transactions(Tid, quantity, price, buyer_idUser, seller_idUser, item_idInventory) VALUES ";
	
	for ($i = 0; $i < $tLen; $i++) {
		if ($i != $tLen -1) {
			$query .= "$tranaction[$i],";
		} else {
			$query .= "$tranaction[$i];";
		}
	} 
	
	$query2 = "UPDATE Team4.User SET curBal = CASE ";
	
	for ($j = 0; $j < $sBLen; $j++) {
		if ($j != $sBLen -1) {
			$query2 .= "$sellerBals[$j] ";
		} else {
			$query2 .= "$sellerBals[$j] ELSE curBal END;";
		}
	} 
	
	$query3 = "Insert Into Team4.Inventory (`idInventory`, `Pname`, `Pdescription`) VALUES ";
	
	for ($x = 0; $x < $iILen; $x++) {
		if ($x != $iILen -1) {
			$query3 .= "$insertInven[$x],";
		} else {
			$query3 .= "$insertInven[$x];";
		}
	} 
	
	$query4 = "Insert INTO Team4.Owns (`item_idInventory`,`owner_idUser`,`quantity`) VALUES ";
	
	for ($k = 0; $k < $iOLen; $k++) {
		if ($k != $iOLen -1) {
			$query4 .= "$insertOwns[$k],";
		} else {
			$query4 .= "$insertOwns[$k];";
		}
	} 
	
	$query5 = "UPDATE Team4.Sells SET quantity = CASE ";
	
	for ($q = 0; $q < $uSLen; $q++) {
		if ($q != $uSLen -1) {
			$query5 .= "$updateSells[$q] ";
		} else {
			$query5 .= "$updateSells[$q] ELSE quantity END;";
		}
	} 
	
	$query6 = "UPDATE Team4.Owns SET quantity = CASE ";
	
	for ($e = 0; $e <  $uOLen; $e++) {
		  if($e !=  $uOLen -1){
		$query6 .= "$updateOwns[$e] ";
		  }else{
			  $query6 .= "$updateOwns[$e] ELSE quantity END;";
		  }
	} 
	
	$query7 = "UPDATE Team4.User
			  SET 
				 curBal = curBal - $TotalPrice
			  WHERE
				idUser = $user";
				

	$result = mysqli_query($db, $query);
	
	$result2 = mysqli_query($db, $query2);
	
	$result3 = mysqli_query($db, $query3);
	
	$result4 = mysqli_query($db, $query4);
	
	$result5 = mysqli_query($db, $query5);
	
	$result6 = mysqli_query($db, $query6);
	
	$result7 = mysqli_query($db, $query7);
	
	$db->close();
	
	if (!$result || !$result2 || !$result3 && $iILen != 0 || !$result4 && $iOLen != 0 || !$result5 || !$result6 && $uOLen != 0 || !$result7) {
		if(!$result){
			print "query failed" .
		mysqli_error();
		}else if(!$result2){
			print "query2 failed" .
		mysqli_error();
		}else if(!$result3 && $iILen != 0){
			print "query3 failed" . $insertInven[0] .
		mysqli_error();
		}else if(!$result4 && $iOLen != 0){
			print "query4 failed" . $iOLen .
		mysqli_error();
		}else if(!$result5){
			print "query5 failed" .
		mysqli_error();
		}else if(!$result6 && $uOLen != 0){
			print "query6 failed" . $uOLen .
		mysqli_error();
		}else if(!$result7){
			print "query7 failed" .
		mysqli_error();
		}
		exit;
	}else{
		print "Items Bought!";
		return true;
	}
	
	mysqli_close($db);
?>
