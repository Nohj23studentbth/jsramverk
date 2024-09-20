// Fetch JSON data from an API
fetch('https://localhost:3000')
.then(response => response.json())
.then(data => {
    // Convert JSON data to a string
    const jsonString = JSON.stringify(data, null, 2); // Pretty-print with indentation

    // Find the HTML element
    const container = document.getElementById('json-container');

    // Set the JSON string as the content of the HTML element
    container.textContent = jsonString;
})
.catch(error => {
    console.error('Error fetching data:', error);
});