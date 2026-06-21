let input = document.getElementById("Input");
let button = document.getElementById("Button");

button.addEventListener("click", () => {
    let age = parseInt(input.value);

    if (isNaN(age) || age > 120 || age < 0) {
        alert("Будь ласка, введіть коректне число.");
    } else if (age < 18) {
        alert("Ви неповнолітній.");
    } else {
        alert("Ви повнолітній.");
    }
});