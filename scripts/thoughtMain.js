function displayDate() {
    const date = new Date();
    document.getElementById("date").innerHTML = date.toLocaleDateString();
}