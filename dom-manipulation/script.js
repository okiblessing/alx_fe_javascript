let quotes = [];
const mockApiUrl = 'https://jsonplaceholder.typicode.com/posts';

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

// Fetch quotes from the simulated server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(mockApiUrl);
        const serverQuotes = await response.json();

        // Process the fetched data to extract necessary fields
        const formattedQuotes = serverQuotes.map(post => ({
            text: post.body,
            category: 'General' // Default category
        }));

        // Check for new quotes and handle conflicts
        handleQuotesFromServer(formattedQuotes);
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
        notifyUser('Error fetching quotes from server.');
    }
}

// Handle quotes received from the server
function handleQuotesFromServer(serverQuotes) {
    const newQuotes = [];
    const updatedQuotes = [];

    serverQuotes.forEach(serverQuote => {
        const existingQuote = quotes.find(quote => quote.text === serverQuote.text);
        if (!existingQuote) {
            newQuotes.push(serverQuote);
        } else if (existingQuote.category !== serverQuote.category) {
            // Conflict detected
            updatedQuotes.push(serverQuote);
            quotes = quotes.map(quote => quote.text === serverQuote.text ? serverQuote : quote);
        }
    });

    // Add new quotes to local storage
    if (newQuotes.length > 0) {
        quotes.push(...newQuotes);
        notifyUser(`${newQuotes.length} new quotes added from server!`);
    }
    if (updatedQuotes.length > 0) {
        notifyUser(`${updatedQuotes.length} quotes updated from server!`);
    } else {
        notifyUser('Quotes synced with server!');
    }

    saveQuotes();
    filterQuotes();
}

// Notify user about updates
function notifyUser(message) {
    const notification = document.getElementById('notification');
    notification.innerText = message;
    setTimeout(() => notification.innerText = '', 5000); // Clear after 5 seconds
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
async function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value.trim();
    const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (quoteText && quoteCategory) {
        const newQuote = { text: quoteText, category: quoteCategory };
        quotes.push(newQuote);
        saveQuotes();
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        alert('Quote added successfully!');

        // Post new quote to the server
        await postQuoteToServer(newQuote);

        populateCategories();
        filterQuotes();
    } else {
        alert('Please enter both a quote and a category.');
    }
}

// Function to post a new quote to the server
async function postQuoteToServer(quote) {
    try {
        const response = await fetch(mockApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                body: quote.text,
                title: quote.category // Using category as title for mock API
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to post quote to server');
        }

        const serverResponse = await response.json();
        console.log('Quote posted successfully:', serverResponse);
    } catch (error) {
        console.error('Error posting quote to server:', error);
        notifyUser('Error posting quote to server.');
    }
}

// Function to sync local quotes with the server
async function syncQuotes() {
    await fetchQuotesFromServer(); // Fetch updates from server
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

// Periodically sync quotes with the server
setInterval(syncQuotes, 10000); // Check for updates every 10 seconds
