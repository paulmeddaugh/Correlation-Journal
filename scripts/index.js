function chkIfAllFieldsEntered(event) {
	var username = document.getElementById("Username");
	var password = document.getElementById("Password");
	
	// Builds error message if error
	let error = null, focusObject = null;
	if (username.value == "") {
		error = "Please enter your username.";
		focusObject = username;
	} 
	if (password.value == "") {
		error = (error) ? 
			error.substring(0, error.length - 1) + " and password." : "Please enter your password.";
		if (!focusObject) focusObject = password;
	}

	if (error) {
		alert(error);
		focusObject.focus();

	} else {
		// database query
		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200) {
				let result = xhr.responseText;
				console.log(result);
				let jsonData = JSON.parse(result);

				let rowData = jsonData.length;
			
				if (rowData > 0) {

					let rowdata;
					for (var i = 0; i < rowData; i++) {
						rowdata = jsonData[i];
					}

					if (username.value.toLowerCase() == rowdata.username.toLowerCase() &&
							password.value == rowdata.password) {
						sessionStorage.setItem("uid", rowdata.uid);	
						sessionStorage.setItem('username', rowdata.username);
						sessionStorage.setItem('nameu', rowdata.nameu);
						window.open("./pages/home.html", '_self');
					} else {
						alert("Invalid username/password."); 
						return false;
					}

				} else {
					console.log("Empty return json.");
				}
			}
		}
		xhr.open("GET", "./php/index.php?username=" + username.value + "&password=" + password.value);
		xhr.send();
		return false;
	}
}