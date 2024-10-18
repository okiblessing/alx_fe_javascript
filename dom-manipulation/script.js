     // script.js

// Array to store quote objects
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Motivation" },
    { text: "The purpose of our lives is to be happy.", category: "Happiness" },
];

// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText.trim() !== '' && newQuoteCategory.trim() !== '') {
        // Create a new quote object
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        
        // Add the new quote to the array
        quotes.push(newQuote);

        // Clear the input fields
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';

        // Display the new quote
        showRandomQuote();
    } else {
        alert("Please enter both a quote and a category.");
    }
}

// Add event listener to the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
a