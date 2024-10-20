// Initialize an array to store quotes
let quotes = [];

// Load quotes from local storage on initialization
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

    // Restore last selected category
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';
    categoryFilter.value = lastSelectedCategory;
}

// Function to filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem('lastSelectedCategory', selectedCategory); // Save last selected category

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
        saveQuotes(); // Save to local storage
        document.getElementById('newQuoteText').value = ''; // Clear input
        document.getElementById('newQuoteCategory').value = ''; // Clear input
        alert('Quote added successfully!');

        // Update categories in the dropdown
        populateCategories();
        filterQuotes(); // Refresh displayed quotes
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

// Function to export quotes as JSON
function exportToJson() {
    const jsonString = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    
    URL.revokeObjectURL(url); // Clean up
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes(); // Save to local storage
                alert('Quotes imported successfully!');
                populateCategories(); // Update category filter
                filterQuotes(); // Refresh displayed quotes
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
    
    // Show a random quote from the filtered list
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
filterQuotes(); // Display quotes based on the last selected category
createAddQuoteForm(); // Create the add quote form dynamically
