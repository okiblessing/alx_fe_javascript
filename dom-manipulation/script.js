let quotes = [];

// Simulated server data (mock API)
const serverQuotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
    { text: "Do what you can, with what you have, where you are.", category: "Motivation" },
];

// Load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to fetch quotes from the simulated server
function fetchServerQuotes() {
    // Simulate a delay for server response
    setTimeout(() => {
        // Merge server data with local data
        let newQuotes = serverQuotes.filter(serverQuote => !quotes.some(quote => quote.text === serverQuote.text));
        if (newQuotes.length > 0) {
            quotes.push(...newQuotes);
            saveQuotes();
            notifyUser(`${newQuotes.length} new quotes added from server!`);
            filterQuotes();
        }
    }, 1000);
}

// Notify user about updates
function notifyUser(message) {
    const notification = document.getElementById('notification');
    notification.innerText = message;
    setTimeout(() => notification.innerText = '', 3000); // Clear after 3 seconds
}

// Populate categories dynamically
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = [...new Set(quotes.map(quote => quote.category))];

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';
    categoryFilter.value = lastSelectedCategory;
}

// Function to filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem('lastSelectedCategory', selectedCategory);

    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    displayQuotes(filteredQuotes);
}

// Function to display quotes
function displayQuotes(quotesToDisplay) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = '';

    if (quotesToDisplay.length === 0) {
        quoteDisplay.innerHTML = "No quotes available for this category.";
        return;
    }

    quotesToDisplay.forEach(quote => {
        const quoteElement = document.createElement('div');
        quoteElement.innerHTML = `"${quote.text}" - <strong>${quote.category}</strong>`;
        quoteDisplay.appendChild(quoteElement);
    });
}

// Function to add a new quote
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value.trim();
    const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (quoteText && quoteCategory) {
        quotes.push({ text: quoteText, category: quoteCategory });
        saveQuotes();
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        alert('Quote added successfully!');

        populateCategories();
        filterQuotes();
    } else {
        alert('Please enter both a quote and a category.');
    }
}

// Function to create the add quote form dynamically
function createAddQuoteForm() {
    const formContainer = document.getElementById('quoteFormContainer');

    const quoteInput = document.createElement('input');
    quoteInput.id = 'newQuoteText';
    quoteInput.type = 'text';
    quoteInput.placeholder = 'Enter a new quote';

    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';

    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    addButton.addEventListener('click', addQuote);

    formContainer.appendChild(quoteInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addButton);
}

// Export quotes as JSON
function exportToJson() {
    const jsonString = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    
    URL.revokeObjectURL(url);
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                alert('Quotes imported successfully!');
                populateCategories();
                filterQuotes();
            } else {
                alert('Invalid file format. Please upload a valid JSON file.');
            }
        } catch (e) {
            alert('Error reading the file: ' + e.message);
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// Event listener for "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', () => {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    
    if (filteredQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const quote = filteredQuotes[randomIndex];
        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.innerHTML = `"${quote.text}" - <strong>${quote.category}</strong>`;
    } else {
        document.getElementById('quoteDisplay').innerHTML = "No quotes available for this category.";
    }
});

// Initial load of quotes from local storage
loadQuotes();
populateCategories();
filterQuotes(); 
createAddQuoteForm(); 

// Periodically fetch server quotes
setInterval(fetchServerQuotes, 10000); // Check for updates every 10 seconds
