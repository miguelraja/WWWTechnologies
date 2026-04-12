function nextStep(step) {
	let tabTrigger = document.querySelector(
		`button[data-bs-target="#step${step}"]`
	);

	let tab = new bootstrap.Tab(tabTrigger);
    updateProgress(step)
	tab.show();
}

function previousStep(step) {
	let tabTrigger = document.querySelector(
		`button[data-bs-target="#step${step}"]`
	);

	let tab = new bootstrap.Tab(tabTrigger);
    updateProgress(step)
	tab.show();
}
function submitForm() {
    showAlert("Registration completed successfully", "success")
}

function showAlert(message, type) {
    let area = document.getElementById("alert-area");
	let alert = document.createElement("div");

	alert.className = "alert alert-" + type;
	alert.textContent = message;

	area.appendChild(alert);
	setTimeout(() => alert.remove(), 3000);
}

function validateStep1(){
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    if(name === "" || email === ""){
        showAlert("Please fill all fields", "danger");
        return false;
    }
    return true;
}

function updateProgress(step) {
	let progress = document.getElementById("wizardProgress");
	let percent = (step / 3) * 100;

	progress.style.width = percent + "%";
}