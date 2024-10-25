// Selecting elements from the DOM
const addItemForm = document.getElementById('addItemForm');
const itemList = document.getElementById('itemList');
const removeItemButton = document.getElementById('removeItemButton');
const creditForm = document.getElementById('creditForm');
const creditList = document.getElementById('creditList');
const errorMessage = document.createElement('p');  // For displaying error messages
document.body.insertBefore(errorMessage, document.querySelector('main'));

// Sample inventory data for demonstration
const sampleInventory = [
    { id: 1, name: 'Apple', quantity: 10, price: 1.99 },
    { id: 2, name: 'Banana', quantity: 20, price: 0.99 },
    { id: 3, name: 'Orange', quantity: 15, price: 1.49 }
];

// Sample credits data for demonstration
const sampleCredits = [
    { name: 'John Doe', amount: 100 },
    { name: 'Jane Smith', amount: 200 }
];
function toggleMenu() {
    const navLinks = document.getElementById("navLinks");
    navLinks.classList.toggle("show");
}


// Function to fetch and display items
async function fetchItems() {
    try {
        const response = await fetch('http://localhost:3000/items');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const items = await response.json();

        // If the inventory is empty, use sample data
        const dataToShow = items.length > 0 ? items : sampleInventory;

        itemList.innerHTML = ''; // Clear the list
        // Sort items by ID before displaying
        dataToShow.sort((a, b) => a.id - b.id).forEach(item => {
            const li = document.createElement('li');
            li.textContent = `ID: ${item.id}, ${item.name} - Quantity: ${item.quantity} - Price: $${item.price.toFixed(2)}`;
            itemList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching items:', error);
        displayError('Failed to fetch items. Please try again later.');
    }
}

// Function to fetch and display customer credits
async function fetchCredits() {
    try {
        const response = await fetch('http://localhost:3000/customers/credits');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const credits = await response.json();

        const dataToShow = credits.length > 0 ? credits : sampleCredits;
        
        creditList.innerHTML = ''; // Clear the list
        dataToShow.forEach(credit => {
            const li = document.createElement('li');
            li.textContent = `${credit.name} - Credit: $${credit.amount.toFixed(2)}`;
            creditList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching credits:', error);
        displayError('Failed to fetch customer credits. Please try again later.');
    }
}

// Function to display error messages in the UI
function displayError(message) {
    errorMessage.textContent = message;
    errorMessage.style.color = 'red';
}

// Handle form submission for adding items
addItemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('itemName').value;
    const quantity = document.getElementById('itemQuantity').value;
    const price = document.getElementById('itemPrice').value;

    try {
        const response = await fetch('http://localhost:3000/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, quantity, price })
        });

        if (!response.ok) {
            throw new Error('Failed to add item');
        }

        // Clear the form
        addItemForm.reset();
        fetchItems(); // Refresh the item list
    } catch (error) {
        console.error('Error adding item:', error);
        displayError('Failed to add item. Please check your input and try again.');
    }
});

// Handle item removal
removeItemButton.addEventListener('click', async () => {
    const id = document.getElementById('removeItemId').value;
    try {
        const response = await fetch(`http://localhost:3000/items/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to remove item');
        }

        // Clear the input field
        document.getElementById('removeItemId').value = '';
        fetchItems(); // Refresh the item list
    } catch (error) {
        console.error('Error removing item:', error);
        displayError('Failed to remove item. Please try again.');
    }
});

// Handle form submission for customer credits
creditForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('customerName').value;
    const amount = document.getElementById('creditAmount').value;

    try {
        const response = await fetch('http://localhost:3000/customers/credits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, amount })
        });

        if (!response.ok) {
            throw new Error('Failed to add credit');
        }

        // Clear the form
        creditForm.reset();
        fetchCredits(); // Refresh the credit list
    } catch (error) {
        console.error('Error adding credit:', error);
        displayError('Failed to add credit. Please check your input and try again.');
    }
});

// Initial fetch for items and credits
fetchItems();
fetchCredits();



//api
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Mock database
let items = [];
let credits = [];

// Get all items
app.get('/items', (req, res) => {
    res.json(items);
});

// Add a new item
app.post('/items', (req, res) => {
    const newItem = { id: items.length + 1, ...req.body };
    items.push(newItem);
    res.status(201).json(newItem);
});

// Delete an item by ID
app.delete('/items/:id', (req, res) => {
    items = items.filter(item => item.id != req.params.id);
    res.status(200).send();
});

// Get customer credits
app.get('/customers/credits', (req, res) => {
    res.json(credits);
});

// Add customer credit
app.post('/customers/credits', (req, res) => {
    credits.push(req.body);
    res.status(201).json(req.body);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


//sales report page code

// Fetch sales report data from your API
async function fetchSalesReport() {
    try {
        const response = await fetch('http://localhost:3000/sales'); // Replace with your API endpoint
        if (!response.ok) {
            throw new Error('Failed to fetch sales report');
        }
        const salesData = await response.json(); // Parse JSON data
        displaySalesReport(salesData); // Call the function to display the data
    } catch (error) {
        console.error('Error fetching sales report:', error);
        alert('Could not load sales report. Please try again later.');
    }
}

// Function to display the sales data in a table
function displaySalesReport(salesData) {
    const salesTableBody = document.getElementById('salesTableBody'); // Table body where rows will be added
    salesTableBody.innerHTML = ''; // Clear any existing content

    // Loop through sales data and create table rows
    salesData.forEach(sale => {
        const row = document.createElement('tr');
        
        const saleDateCell = document.createElement('td');
        saleDateCell.textContent = new Date(sale.date).toLocaleDateString(); // Format date
        row.appendChild(saleDateCell);

        const itemNameCell = document.createElement('td');
        itemNameCell.textContent = sale.itemName;
        row.appendChild(itemNameCell);

        const quantityCell = document.createElement('td');
        quantityCell.textContent = sale.quantity;
        row.appendChild(quantityCell);

        const totalPriceCell = document.createElement('td');
        totalPriceCell.textContent = `$${(sale.quantity * sale.unitPrice).toFixed(2)}`; // Calculate total price
        row.appendChild(totalPriceCell);

        salesTableBody.appendChild(row); // Append the row to the table body
    });
}

// Initial function call to fetch and display the sales report when the page loads
fetchSalesReport();


//odermanagmentcss

// Fetch order data
async function fetchOrders() {
    try {
        const response = await fetch('http://localhost:3000/orders'); // Replace with your API endpoint
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }
        const orders = await response.json();
        displayOrders(orders); // Call function to display orders
    } catch (error) {
        console.error('Error fetching orders:', error);
        alert('Could not load orders. Please try again later.');
    }
}

// Function to display orders in the table
function displayOrders(orders) {
    const orderTableBody = document.getElementById('orderTableBody');
    orderTableBody.innerHTML = ''; // Clear any existing content

    // Loop through orders and create table rows
    orders.forEach(order => {
        const row = document.createElement('tr');

        const orderIdCell = document.createElement('td');
        orderIdCell.textContent = order.id;
        row.appendChild(orderIdCell);

        const customerNameCell = document.createElement('td');
        customerNameCell.textContent = order.customerName;
        row.appendChild(customerNameCell);

        const orderItemCell = document.createElement('td');
        orderItemCell.textContent = order.item;
        row.appendChild(orderItemCell);

        const orderQuantityCell = document.createElement('td');
        orderQuantityCell.textContent = order.quantity;
        row.appendChild(orderQuantityCell);

        const orderPriceCell = document.createElement('td');
        orderPriceCell.textContent = `$${order.price.toFixed(2)}`;
        row.appendChild(orderPriceCell);

        orderTableBody.appendChild(row);
    });
}

// Handle form submission for adding orders
document.getElementById('addOrderForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const customerName = document.getElementById('customerName').value;
    const item = document.getElementById('orderItem').value;
    const quantity = document.getElementById('orderQuantity').value;
    const price = document.getElementById('orderPrice').value;

    try {
        const response = await fetch('http://localhost:3000/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ customerName, item, quantity, price })
        });

        if (!response.ok) {
            throw new Error('Failed to add order');
        }

        // Clear the form and refresh orders
        document.getElementById('addOrderForm').reset();
        fetchOrders();
    } catch (error) {
        console.error('Error adding order:', error);
        alert('Failed to add order. Please try again.');
    }
});

// Handle order updates
document.getElementById('updateOrderForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('updateOrderId').value;
    const customerName = document.getElementById('updateCustomerName').value;
    const item = document.getElementById('updateOrderItem').value;
    const quantity = document.getElementById('updateOrderQuantity').value;
    const price = document.getElementById('updateOrderPrice').value;

    try {
        const response = await fetch(`http://localhost:3000/orders/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ customerName, item, quantity, price })
        });

        if (!response.ok) {
            throw new Error('Failed to update order');
        }

        // Clear the form and refresh orders
        document.getElementById('updateOrderForm').reset();
        fetchOrders();
    } catch (error) {
        console.error('Error updating order:', error);
        alert('Failed to update order. Please try again.');
    }
});

// Handle order removal
document.getElementById('removeOrderButton').addEventListener('click', async () => {
    const id = document.getElementById('removeOrderId').value;

    try {
        const response = await fetch(`http://localhost:3000/orders/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to remove order');
        }

        // Clear the input field and refresh orders
        document.getElementById('removeOrderId').value = '';
        fetchOrders();
    } catch (error) {
        console.error('Error removing order:', error);
        alert('Failed to remove order. Please try again.');
    }
});

// Fetch orders when the page loads
fetchOrders();

