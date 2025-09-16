// Book data
const books = [
  { id: 1, title: 'Advanced Calculus', type: 'textbooks', available: true },
  { id: 2, title: 'Organic Chemistry', type: 'textbooks', available: false },
  { id: 3, title: 'To Kill a Mockingbird', type: 'novels', available: true },
  { id: 4, title: '1984', type: 'novels', available: true },
  { id: 5, title: 'GRE Prep', type: 'guides', available: true },
  { id: 6, title: 'GMAT Guide', type: 'guides', available: false },
  { id: 7, title: 'Technical Writing', type: 'others', available: true }
];

let cart = [];
let unavailableRequests = [];

function login() {
  document.getElementById('login').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  showTab('student');
}

function showTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.style.display = 'none');
  document.getElementById(tab).style.display = 'block';
}

function filterBooks(type) {
  const list = books.filter(b => b.type === type);
  const bookList = document.getElementById('bookList');
  bookList.innerHTML = list.map(book => `
    <div>
      <span>${book.title}</span>
      <button onclick="addToCart(${book.id})">Add to Cart</button>
      <span style="color:${book.available ? 'green' : 'red'};margin-left:10px;">${book.available ? 'Available' : 'Not Available'}</span>
    </div>
  `).join('');
  // Responsive scroll to top for mobile
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Make nav buttons clickable and highlight active tab
document.querySelectorAll('#dashboard nav button').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('#dashboard nav button').forEach(b => b.classList.remove('active-tab'));
    this.classList.add('active-tab');
    showTab(this.textContent.toLowerCase());
  });
});

// Responsive styling for active tab (add to your CSS file or use inline style)
function addToCart(id) {
  const book = books.find(b => b.id === id);
  if (book.available) {
    cart.push(book);
    updateCart();
    document.getElementById('notification').textContent = '';
  } else {
    unavailableRequests.push(book.id);
    document.getElementById('notification').textContent = `${book.title} is not available. You will be notified when it is.`;
  }
}

function updateCart() {
  const cartItems = document.getElementById('cartItems');
  cartItems.innerHTML = cart.map(b => `<li>${b.title}</li>`).join('');
}

// Simulate book becoming available
setInterval(() => {
  unavailableRequests.forEach(id => {
    const book = books.find(b => b.id === id);
    if (!book.available && Math.random() < 0.2) { // 20% chance
      book.available = true;
      document.getElementById('notification').textContent = `${book.title} is now available!`;
      unavailableRequests = unavailableRequests.filter(bid => bid !== id);
    }
  });
}, 5000);

// Sell books
const sellBtn = document.querySelector('#sell button');
sellBtn && sellBtn.addEventListener('click', () => {
  const title = document.querySelector('#sell input[type=text]').value;
  const price = document.querySelector('#sell input[type=number]').value;
  if (title && price) {
    const div = document.createElement('div');
    div.textContent = `Book: ${title} | Price: ₹${price}`;
    document.getElementById('sell').appendChild(div);
  }
});
