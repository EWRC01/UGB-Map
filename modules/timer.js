// Function to click the button
function clickButton() {
    const button = document.getElementById('calculateInstructionsButton');
    button.click(); // Simulate a click on the button
    // Set an interval to call the clickButton function every 2 seconds (2000 milliseconds)
    const intervalId = setInterval(clickButton, 5000);
    clearInterval(intervalId);
}
