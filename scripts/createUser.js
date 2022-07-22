function _(x) {
	return document.getElementById(x);
}

function check(EleId, corForm){
	let varSlice;
	if (corForm && EleId.value.length < 27) {
		return 0;
	} else {
		if (EleId.value.length != 0) {
			varSlice = EleId.value.slice(0,0);
			EleId.value = varSlice;
			EleId.focus();
			EleId.select();
			return 1;
		}
	}	
}
	
	function chkEmail(){
		var email = document.getElementById("email");
		var corForm = /^[a-zA-Z0-9@.]*$/.test(email.value);
		var match = /[.]/.test(email.value);
		var match2 = /[@]/.test(email.value);
		if (check(email,corForm) == 1){
			alert("Please enter a valid Email");
		}
		if(check(email,match) == 1){
			alert("Please include a '.' ");
		}
		if(check(email,match2) == 1){
			alert("Please include a '@' ");
		}
		console.log("Email: " + email.value);
	}
	
	function chkName(){
		var name = document.getElementById("name");
		var corForm = /^[a-zA-Z ]*$/.test(name.value);
		if (check(name,corForm) == 1){
			alert("Please enter a valid Name");
		}
		console.log("Name: " + name.value);
	}
	function chkUSN(){
		var usn = document.getElementById("usn");
		var corForm = /^[a-zA-Z0-9@-_$]*$/.test(usn.value);
		if (check(usn,corForm) == 1){
			alert("Please enter a valid Username");
		}
		console.log("Username: " + usn.value);
	}
	function chkPassword(){
		var pwd = document.getElementById("pwd");
		var pwdS;
		if(pwd.value.length > 15){
			alert("Password cannot be over 15 characters");
			pwdS = pwd.value.slice(0,0);
			document.getElementById("pwd").value = pwdS;
			document.getElementById("pwd").focus();
			document.getElementById("pwd").select();
		} else if(pwd.value.length < 8 && pwd.value.length != 0){
			alert("Password cannot be less than 8 characters");
			pwdS = pwd.value.slice(0,0);
			document.getElementById("pwd").value = pwdS;
			document.getElementById("pwd").focus();
			document.getElementById("pwd").select();
		}
		console.log("Password: " + pwd.value);
	}
	
	function chkREpwd(){
		var repwd = document.getElementById("repwd");
		var pwd = document.getElementById("pwd");
		var repwdS;
		var pwdS;
		if(repwd.value != pwd.value && repwd.value.length != 0){
			alert("Passwords do not match!");
			repwdS = repwd.value.slice(0,0);
			pwdS = pwd.value.slice(0,0);
			document.getElementById("repwd").value = repwdS;
			document.getElementById("pwd").value = pwdS;
			document.getElementById("pwd").focus();
			document.getElementById("pwd").select();
		}
		console.log("rePassword: " + repwd.value);
	}
	function chkRemind(){
		var rem = document.getElementById("reminder");
		var remS;
		if(rem.value.length > 45){
			alert("Reminder cannot be over 45 characters");
			remS = rem.value.slice(0,0);
			document.getElementById("reminder").value = remS;
			document.getElementById("reminder").focus();
			document.getElementById("reminder").select();
		} 
		console.log("Reminder: " + rem.value);
	}
	
	function isEmpty(x){
		if(x.value == ""){
			alert("Box(s) is empty cannot proceed");
		}
	}
	
	function chkEmpty(){
		
		let fieldsToCheck = [
			document.getElementById("email"),
			document.getElementById("name"),
			document.getElementById("usn"),
			document.getElementById("pwd"),
			document.getElementById("repwd"),
			document.getElementById("reminder")
		];

		for (let field of fieldsToCheck) {
			if (field.value == "") {
				alert("Box(s) is empty cannot proceed");
				field.focus();
				return false;
			}
		}
			
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "../php/createUser.php", true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var result = xhr.responseText;
				alert(result);
				if(result.includes("User created!")) {
					window.open('../index.html', '_self');
				}
			}
		}

		let params = "email=".concat(email.value)
			.concat("&name=").concat(name.value)
			.concat("&usn=").concat(usn.value)
			.concat("&pwd=").concat(pwd.value)
			.concat("&rem=").concat(rem.value);

		xhr.send(params);
	    
		return true;
	}