var user = sessionStorage.getItem("username");

function check(EleId, corForm){
		var varSlice;
		if(corForm && EleId.value.length < 27){
			return 0;
		}
	else{
		if(EleId.value.length != 0){
			varSlice = EleId.value.slice(0,0);
			EleId.value = varSlice;
			EleId.focus();
			EleId.select();
			return 1;
		}
	}	
	}
	
	function chkUSN(){
		var usn = document.getElementById("usn");
		var corForm = /^[a-zA-Z0-9@-_$]*$/.test(usn.value);
		if (check(usn,corForm) == 1){
			alert("Please enter a valid Username");
		}
		console.log("username:" + usn.value);
	}
	
	function chkRemind(){
		var rem = document.getElementById("reminder");
		var remS;
		if(rem.value.length > 45){
			alert("Password cannot be over 45 characters");
			remS = rem.value.slice(0,0);
			document.getElementById("reminder").value = remS;
			document.getElementById("reminder").focus();
			document.getElementById("reminder").select();
		} 
		console.log("Reminder:" + rem.value);
	}
	function chkEmpty(){
		var tf = true;
		var usn = document.getElementById("usn");
		var rem = document.getElementById("reminder");
		
		if (usn.value == "" && tf != false){
			tf = false;
			alert("Box(s) is empty cannot proceed");
			document.getElementById("usn").focus();
			document.getElementById("usn").select();
		}else if(rem.value == "" && tf != false){
			alert("Box(s) is empty cannot proceed");
			tf = false;
			document.getElementById("reminder").focus();
			document.getElementById("reminder").select();
		}else{
			
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var result = xhr.responseText;
				
				var jsonData = JSON.parse(result);
				
				var rowCount = jsonData.length;
				
				if (rowCount > 0) {
					for (var i = 0; i < rowCount; i++) {
						var rowdata = jsonData[i];
						console.log(rowdata);
					}
					 document.getElementById("pwdLoc").innerHTML = rowdata.password;
				     console.log(result);
				} else{
					alert("No password associated with given username and reminder"); 
					window.open('remind.html', '_self');
				}
			  }
			}
			xhr.open("GET", "../php/remind.php?usn=" + usn.value + "&rem="+ rem.value);// 
			xhr.send();
		
		return tf;
		}
	}