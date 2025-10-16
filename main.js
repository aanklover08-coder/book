
// main.js for College Library
// All JS logic will be moved here step by step.

// College Library JS - Restored
// All previous JS logic restored for full functionality

// Set current year in footer
function setFooterYear() {
  if (document.getElementById('year')) {
    document.getElementById('year').textContent = new Date().getFullYear();
  }
}

// Add to Cart button style
const addToCartBtnStyle = 'background:#6366f1; color:#fff; border-radius:8px; font-weight:700; padding:10px 20px; border:none; box-shadow:0 2px 8px rgba(99,102,241,0.08); transition:background 0.2s; cursor:pointer; margin-top:10px;';

// Add search functionality
function filterBooksBySearch(books, searchTerm) {
  if (!searchTerm) return books;
  return books.filter(book => book.title.toLowerCase().includes(searchTerm.toLowerCase()));
}

// Home Tab
function renderHomeTab() {
  const searchTerm = document.getElementById('searchInput')?.value || '';
  // Home books
  const homeBooks = [
    {
      title: 'Chemistry KTU Text',
      author: 'KTU Board',
      available: true,
      cover: 'https://covers.openlibrary.org/b/isbn/9788120345799-L.jpg',
      description: 'Official KTU Chemistry textbook for first year students.'
    },
    {
      title: 'Wings of Fire',
      author: 'A.P.J. Abdul Kalam',
      available: false,
      cover: 'https://covers.openlibrary.org/b/isbn/9780141036533-L.jpg',
      description: 'Autobiography of Dr. A.P.J. Abdul Kalam, former President of India.'
    },
    {
      title: 'KTU Maths Guide',
      author: 'KTU Faculty',
      available: true,
      cover: 'https://covers.openlibrary.org/b/isbn/9788120345928-L.jpg',
      description: 'Comprehensive guide for KTU mathematics syllabus.'
    },
    {
      title: 'Let Us C',
      author: 'Yashavant Kanetkar',
      available: true,
      cover: 'https://covers.openlibrary.org/b/isbn/9780070534483-L.jpg',
      description: 'Popular programming book for beginners and KTU students.'
    },
    {
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      available: false,
      cover: 'https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg',
      description: 'Famous novel about following your dreams.'
    }
  ];
  const filteredHomeBooks = filterBooksBySearch(homeBooks, searchTerm);
  let homeHtml = `
    <h2 class="section-title">Welcome to College Library</h2>
    <p>Browse, borrow, and sell books. Use the navigation above to explore features for students and teachers.</p>
    <div class="book-grid" style="margin-top:30px;">
      ${filteredHomeBooks.map(book => `
        <div class="book-card">
          <img src="${book.cover}" class="book-image" alt="${book.title}" />
          <div class="book-content">
            <div class="book-title">${book.title}</div>
            <div class="book-author">${book.author}</div>
            <div class="availability-badge ${book.available ? 'available' : 'unavailable'}">${book.available ? 'Available' : 'Not Available'}</div>
            <div class="book-description">${book.description}</div>
            <button onclick="addToCartHome('${book.title}', ${book.available})" class="btn btn-primary" style="${addToCartBtnStyle}">Add to Cart</button>
          </div>
        </div>
      `).join('')}
    </div>
    <p id="homeNotification"></p>
  `;
  // Add books listed for sale in Marketplace to Home tab
  if (window.marketplaceBooks && marketplaceBooks.length > 0) {
    const filteredMarketBooks = filterBooksBySearch(marketplaceBooks, searchTerm);
    if (filteredMarketBooks.length > 0) {
      const marketBooksHtml = filteredMarketBooks.map((b, i) => `
        <div class="book-card">
          ${b.image ? `<img src="${b.image}" class="book-image" alt="${b.title}" />` : ''}
          <div class="book-content">
            <div class="book-title">${b.title}</div>
            <div class="book-author">Student Seller</div>
            <div class="availability-badge available">For Sale</div>
            <div class="book-description">Price: ₹${b.price}</div>
            <button onclick="addToCartHome('${b.title}', true)" class="btn btn-primary" style="${addToCartBtnStyle}">Add to Cart</button>
          </div>
        </div>
      `).join('');
      homeHtml += `<h3 style='margin-top:40px;'>Books for Sale</h3><div class='book-grid'>${marketBooksHtml}</div>`;
    }
  }
  document.getElementById('mainContent').innerHTML = homeHtml;
}

window.addToCartHome = function(title, available) {
  if (available) {
    window.cart = window.cart || [];
    cart.push({ title });
    document.getElementById('homeNotification').textContent = '';
    updateCartCount();
    renderCartTab();
  } else {
    document.getElementById('homeNotification').textContent = `${title} is not available. You will be notified when it is.`;
  }
};

// Add search button and Enter key support
function setupSearchBar() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    // Add search button if not present
    let searchBtn = document.getElementById('searchBtn');
    if (!searchBtn) {
      searchBtn = document.createElement('button');
      searchBtn.id = 'searchBtn';
      searchBtn.innerHTML = '🔍';
      searchBtn.type = 'button';
      searchBtn.style.background = '#6366f1';
      searchBtn.style.color = '#fff';
      searchBtn.style.border = 'none';
      searchBtn.style.borderRadius = '50%';
      searchBtn.style.width = '32px';
      searchBtn.style.height = '32px';
      searchBtn.style.marginLeft = '8px';
      searchBtn.style.cursor = 'pointer';
      searchBtn.style.fontSize = '1.1rem';
      searchBtn.style.display = 'flex';
      searchBtn.style.alignItems = 'center';
      searchBtn.style.justifyContent = 'center';
      searchInput.parentNode.appendChild(searchBtn);
    }
    searchBtn.onclick = function() {
      const activeTab = document.querySelector('.nav-link.active')?.dataset.tab;
      if (activeTab === 'home') {
        renderHomeTab();
      }
    };
    // Also support Enter key
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        const activeTab = document.querySelector('.nav-link.active')?.dataset.tab;
        if (activeTab === 'home') {
          renderHomeTab();
        }
      }
    });
  }
}

// Navigation and tab logic
function setupTabs() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      const tab = this.dataset.tab;
      if (tab === 'home') renderHomeTab();
      // TODO: Add render functions for other tabs (students, teachers, marketplace, profile, cart)
    });
  });
}

// Initialize everything on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  setFooterYear();
  setupSearchBar();
  setupTabs();
  renderHomeTab();
});

// --- Students Tab Data and Logic ---
const studentProfile = {
  name: 'Amit Kumar',
  semester: '5th',
  department: 'Computer Science',
  class: 'B.Tech',
  image: 'https://placehold.co/100x100?text=Student'
};
const studentBooks = [
  { id: 1, title: 'Advanced Calculus', available: true },
  { id: 2, title: 'Organic Chemistry', available: false },
  { id: 3, title: 'To Kill a Mockingbird', available: true },
  { id: 4, title: '1984', available: true },
  { id: 5, title: 'GRE Prep', available: true },
  { id: 6, title: 'GMAT Guide', available: false },
  { id: 7, title: 'Technical Writing', available: true }
];
let unavailableRequests = [];
function renderStudentsTab() {
  document.getElementById('mainContent').innerHTML = `
    <h3 style="margin-top:30px;">Available Books</h3>
    <div class="book-grid" id="bookList">
      ${studentBooks.map(book => `
        <div class="book-card">
          <img src="https://placehold.co/300x200?text=${encodeURIComponent(book.title)}" class="book-image" alt="${book.title}" />
          <div class="book-content">
            <div class="book-title">${book.title}</div>
            <div class="book-author">KTU</div>
            <div class="availability-badge ${book.available ? 'available' : 'unavailable'}">${book.available ? 'Available' : 'Not Available'}</div>
            <button onclick="addToCart(${book.id})" class="btn btn-primary" style="${addToCartBtnStyle}">Add to Cart</button>
          </div>
        </div>
      `).join('')}
    </div>
    <p id="studentNotification"></p>
  `;
}
window.addToCart = function(id) {
  const book = studentBooks.find(b => b.id === id);
  window.cart = window.cart || [];
  if (book.available) {
    cart.push(book);
    document.getElementById('studentNotification').textContent = '';
    updateCartCount();
    renderCartTab();
  } else {
    unavailableRequests.push(book.id);
    document.getElementById('studentNotification').textContent = `${book.title} is not available. You will be notified when it is.`;
  }
};
setInterval(() => {
  unavailableRequests.forEach(id => {
    const book = studentBooks.find(b => b.id === id);
    if (!book.available && Math.random() < 0.2) {
      book.available = true;
      document.getElementById('studentNotification').textContent = `${book.title} is now available!`;
      unavailableRequests = unavailableRequests.filter(bid => bid !== id);
      renderStudentsTab();
    }
  });
}, 5000);
// --- Teachers Tab ---
function renderTeachersTab() {
  document.getElementById('mainContent').innerHTML = `
    <h2 class="section-title">Teacher Resources</h2>
    <p>Reference books, guides, and research papers for KTU faculty members.</p>
    <div class="book-grid" style="margin-top:30px;">
      <div class="book-card">
        <img src="https://placehold.co/300x200?text=KTU+Teaching+Guide" class="book-image" alt="KTU Teaching Guide" />
        <div class="book-content">
          <div class="book-title">KTU Teaching Guide</div>
          <div class="book-author">KTU Faculty</div>
          <div class="availability-badge available">Available</div>
          <div class="book-description">Comprehensive guide for teaching KTU syllabus.</div>
          <button onclick="addToCartTeacher('KTU Teaching Guide', true)" class="btn btn-primary" style="${addToCartBtnStyle}">Add to Cart</button>
        </div>
      </div>
      <div class="book-card">
        <img src="https://placehold.co/300x200?text=KTU+Research+Paper+2024" class="book-image" alt="KTU Research Paper 2024" />
        <div class="book-content">
          <div class="book-title">KTU Research Paper 2024</div>
          <div class="book-author">KTU Research Group</div>
          <div class="availability-badge available">Available</div>
          <div class="book-description">Latest research paper published by KTU faculty.</div>
          <button onclick="addToCartTeacher('KTU Research Paper 2024', true)" class="btn btn-primary" style="${addToCartBtnStyle}">Add to Cart</button>
        </div>
      </div>
      <div class="book-card">
        <img src="https://placehold.co/300x200?text=Engineering+Pedagogy" class="book-image" alt="Engineering Pedagogy" />
        <div class="book-content">
          <div class="book-title">Engineering Pedagogy</div>
          <div class="book-author">KTU Board</div>
          <div class="availability-badge unavailable">Not Available</div>
          <div class="book-description">Pedagogical approaches for engineering education at KTU.</div>
          <button onclick="addToCartTeacher('Engineering Pedagogy', false)" class="btn btn-primary" style="${addToCartBtnStyle}">Add to Cart</button>
        </div>
      </div>
      <div class="book-card">
        <img src="https://placehold.co/300x200?text=Digital+Signal+Processing" class="book-image" alt="Digital Signal Processing" />
        <div class="book-content">
          <div class="book-title">Digital Signal Processing</div>
          <div class="book-author">KTU Faculty</div>
          <div class="availability-badge available">Available</div>
          <div class="book-description">Reference book for DSP course in KTU.</div>
          <button onclick="addToCartTeacher('Digital Signal Processing', true)" class="btn btn-primary" style="${addToCartBtnStyle}">Add to Cart</button>
        </div>
      </div>
      <div class="book-card">
        <img src="https://placehold.co/300x200?text=Machine+Learning+Research" class="book-image" alt="Machine Learning Research" />
        <div class="book-content">
          <div class="book-title">Machine Learning Research</div>
          <div class="book-author">KTU Research Team</div>
          <div class="availability-badge unavailable">Not Available</div>
          <div class="book-description">Recent advances in machine learning by KTU researchers.</div>
          <button onclick="addToCartTeacher('Machine Learning Research', false)" class="btn btn-primary" style="${addToCartBtnStyle}">Add to Cart</button>
        </div>
      </div>
      <div class="book-card">
        <img src="https://placehold.co/300x200?text=Control+Systems+Guide" class="book-image" alt="Control Systems Guide" />
        <div class="book-content">
          <div class="book-title">Control Systems Guide</div>
          <div class="book-author">KTU Faculty</div>
          <div class="availability-badge available">Available</div>
          <div class="book-description">Guide for teaching control systems in KTU engineering courses.</div>
          <button onclick="addToCartTeacher('Control Systems Guide', true)" class="btn btn-primary" style="${addToCartBtnStyle}">Add to Cart</button>
        </div>
      </div>
    </div>
    <p id="teacherNotification"></p>
  `;
}
window.addToCartTeacher = function(title, available) {
  window.cart = window.cart || [];
  if (available) {
    cart.push({ title });
    document.getElementById('teacherNotification').textContent = '';
    updateCartCount();
    renderCartTab();
  } else {
    document.getElementById('teacherNotification').textContent = `${title} is not available. You will be notified when it is.`;
  }
};
// --- Marketplace Tab ---
window.marketplaceBooks = window.marketplaceBooks || [];
function renderMarketplaceTab() {
  const marketplaceBooks = window.marketplaceBooks;
  document.getElementById('mainContent').innerHTML = `
    <h2 class="section-title">Marketplace</h2>
    <div style="display:flex; flex-wrap:wrap; gap:40px; align-items:flex-start; margin-bottom:40px;">
      <div style="flex:1; min-width:320px;">
        <h3 style="color:#3730a3; margin-bottom:16px;">Sell a Book</h3>
        <form id="sellForm" class="marketplace-form" style="background:#f1f5f9; border-radius:12px; box-shadow:0 2px 8px rgba(60,72,100,0.06); padding:24px 20px; margin-bottom:24px;" enctype="multipart/form-data">
          <input type="text" id="sellTitle" placeholder="Book Title" required style="padding:10px 14px; border-radius:8px; border:1px solid #d1d5db; font-size:1rem; margin-bottom:8px; background:#fff; width:100%;" />
          <input type="number" id="sellPrice" placeholder="Price" required style="padding:10px 14px; border-radius:8px; border:1px solid #d1d5db; font-size:1rem; margin-bottom:8px; background:#fff; width:100%;" />
          <input type="file" id="sellImage" accept="image/*" style="margin-bottom:8px;" />
          <button type="submit" style="background:#6366f1; color:#fff; border-radius:8px; font-weight:700; padding:10px 20px; border:none; box-shadow:0 2px 8px rgba(99,102,241,0.08); transition:background 0.2s; cursor:pointer;">List Book</button>
        </form>
      </div>
      <div style="flex:2; min-width:320px;">
        <h3 style="color:#3730a3; margin-bottom:16px;">Buy a Book</h3>
        <div id="marketList">
          ${marketplaceBooks.length === 0 ? '<p style="color:#64748b; text-align:center; padding:20px;">No books listed yet.</p>' : marketplaceBooks.map((b, i) => `
            <div class="book-card" style="margin-bottom:15px; box-shadow:0 2px 8px rgba(60,72,100,0.08); border-radius:12px;">
              <div class="book-content">
                ${b.image ? `<img src="${b.image}" class="book-image" alt="${b.title}" />` : ''}
                <div class="book-title" style="font-size:1.1rem; color:#3730a3; font-weight:700;">${b.title}</div>
                <div class="book-author" style="color:#64748b;">Student Seller</div>
                <div class="availability-badge available" style="background:#dcfce7; color:#166534;">For Sale</div>
                <div class="book-description" style="margin-bottom:8px;">Price: ₹${b.price}</div>
                <button onclick="buyBook(${i})" class="btn btn-primary" style="margin-top:10px; background:#6366f1; color:#fff; border-radius:8px; font-weight:700; padding:8px 16px; border:none;">Buy</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  document.getElementById('sellForm').onsubmit = function(e) {
    e.preventDefault();
    const title = document.getElementById('sellTitle').value;
    const price = document.getElementById('sellPrice').value;
    const imageInput = document.getElementById('sellImage');
    let image = '';
    if (imageInput.files && imageInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        image = evt.target.result;
  window.marketplaceBooks.push({ title, price, image });
  renderMarketplaceTab();
      };
      reader.readAsDataURL(imageInput.files[0]);
    } else {
  window.marketplaceBooks.push({ title, price, image: '' });
  renderMarketplaceTab();
    }
  };
  window.buyBook = function(index) {
    alert('Thank you for buying ' + marketplaceBooks[index].title + '!');
    marketplaceBooks.splice(index, 1);
    renderMarketplaceTab();
  }
};
// --- Profile Tab ---
function renderProfileTab() {
  document.getElementById('mainContent').innerHTML = `
    <div class="profile-card" style="max-width:500px; margin:0 auto; background:#fff; border-radius:16px; box-shadow:0 2px 12px rgba(60,72,100,0.10); padding:32px 28px;">
      <div class="profile-header" style="display:flex; align-items:center; gap:24px; margin-bottom:24px;">
        <img src="${studentProfile.image}" alt="Student Photo" class="profile-image" style="width:100px; height:100px; border-radius:50%; object-fit:cover; border:4px solid #6366f1; background:#f1f5f9;" />
        <div class="profile-info">
          <div class="profile-name" style="font-size:1.5rem; font-weight:700; color:#3730a3; margin-bottom:8px;">${studentProfile.name}</div>
          <div class="profile-details" style="color:#64748b;">
            <div class="detail-group" style="margin-bottom:4px;"><label style="font-weight:600; color:#1e293b;">Class:</label> ${studentProfile.class}</div>
            <div class="detail-group" style="margin-bottom:4px;"><label style="font-weight:600; color:#1e293b;">Semester:</label> ${studentProfile.semester}</div>
            <div class="detail-group"><label style="font-weight:600; color:#1e293b;">Department:</label> ${studentProfile.department}</div>
          </div>
        </div>
      </div>
      <div class="profile-history" style="margin-top:16px;">
        <h3 style="color:#3730a3; margin-bottom:12px;">Borrowed Books History</h3>
        <ul style="background:#f1f5f9; border-radius:10px; padding:20px; color:#334155;">
          <li style="margin-bottom:8px;">Advanced Calculus <span style="color:#22c55e; font-weight:600;">(Returned)</span></li>
          <li style="margin-bottom:8px;">To Kill a Mockingbird <span style="color:#22c55e; font-weight:600;">(Returned)</span></li>
          <li>Let Us C <span style="color:#f59e42; font-weight:600;">(Due: 2025-10-10)</span></li>
        </ul>
      </div>
    </div>
  `;
}
// --- Cart Tab ---
let cart = [];
function updateCartCount() {
  document.getElementById('cartCount').textContent = cart.length;
}
function renderCartTab() {
  document.getElementById('mainContent').innerHTML = `
    <h2 class="section-title">Cart</h2>
    <div class="cart-box" style="background:#fff; border-radius:12px; box-shadow:0 2px 8px rgba(60,72,100,0.08); padding:24px 20px; max-width:500px; margin:0 auto;">
      <ul id="cartItems" style="list-style:none; padding:0;">
        ${cart.length === 0 ? '<li style="color:#64748b; text-align:center; padding:20px;">Your cart is empty.</li>' : cart.map((b, i) => `
          <li style="background:#e0e7ff; margin-bottom:10px; padding:12px 16px; border-radius:8px; font-weight:500; color:#3730a3; display:flex; justify-content:space-between; align-items:center;">
            <span>${b.title}</span>
            <button onclick="buyCartItem(${i})" style="background:#22c55e; color:#fff; border:none; border-radius:8px; padding:6px 16px; font-weight:600; cursor:pointer; margin-left:10px;">Buy</button>
          </li>
        `).join('')}
      </ul>
      ${cart.length > 0 ? '<button onclick="buyAllCart()" style="margin-top:20px; width:100%; background:#4f46e5; color:#fff; border:none; border-radius:8px; padding:12px 0; font-size:1.1rem; font-weight:700; cursor:pointer;">Buy All</button>' : ''}
      <p id="notification" style="color:#991b1b; font-weight:600; margin-top:10px;"></p>
    </div>
  `;
}
window.buyCartItem = function(index) {
  alert('Thank you for buying ' + cart[index].title + '!');
  cart.splice(index, 1);
  updateCartCount();
  renderCartTab();
};
window.buyAllCart = function() {
  if (cart.length === 0) return;
  showCartSummaryModal();
};
function showCartSummaryModal() {
  const oldModal = document.getElementById('cartSummaryModal');
  if (oldModal) oldModal.remove();
  const total = cart.length * 100;
  const modal = document.createElement('div');
  modal.id = 'cartSummaryModal';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100vw';
  modal.style.height = '100vh';
  modal.style.background = 'rgba(30,41,59,0.4)';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.zIndex = '9999';
  modal.innerHTML = `
    <div style="background:#fff; border-radius:16px; box-shadow:0 4px 24px rgba(60,72,100,0.18); padding:32px 28px; min-width:320px; max-width:90vw;">
      <h2 style="margin-bottom:18px; color:#1e293b;">Order Summary</h2>
      <ul style="list-style:none; padding:0; margin-bottom:18px;">
        ${cart.map(b => `<li style="margin-bottom:8px;">${b.title} <span style="float:right;">₹100</span></li>`).join('')}
      </ul>
      <div style="font-weight:700; font-size:1.1rem; margin-bottom:18px;">Total: <span style="color:#4f46e5;">₹${total}</span></div>
      <div style="margin-bottom:18px;">
        <label for="paymentMode" style="font-weight:600;">Payment Mode:</label>
        <select id="paymentMode" style="margin-left:10px; padding:6px 12px; border-radius:6px; border:1px solid #d1d5db;">
          <option value="upi">UPI</option>
          <option value="card">Credit/Debit Card</option>
          <option value="cod">Cash on Delivery</option>
        </select>
      </div>
      <div style="display:flex; gap:12px;">
        <button onclick="confirmCartPurchase()" style="background:#22c55e; color:#fff; border:none; border-radius:8px; padding:10px 24px; font-weight:700; font-size:1rem; cursor:pointer;">Confirm & Pay</button>
        <button onclick="closeCartSummaryModal()" style="background:#e2e8f0; color:#1e293b; border:none; border-radius:8px; padding:10px 24px; font-weight:600; font-size:1rem; cursor:pointer;">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}
window.closeCartSummaryModal = function() {
  const modal = document.getElementById('cartSummaryModal');
  if (modal) modal.remove();
};
window.confirmCartPurchase = function() {
  alert('Thank you for your purchase!');
  cart = [];
  updateCartCount();
  closeCartSummaryModal();
  renderCartTab();
};
// --- Navigation Logic ---
function setActiveTab(tabName) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    link.setAttribute('aria-pressed', 'false');
    if (link.dataset.tab === tabName) {
      link.classList.add('active');
      link.setAttribute('aria-pressed', 'true');
    }
  });
}
function handleTabClick(e) {
  const tab = e.target.closest('.nav-link');
  if (!tab) return;
  const tabName = tab.dataset.tab;
  setActiveTab(tabName);
  switch(tabName) {
    case 'home': renderHomeTab(); break;
    case 'students': renderStudentsTab(); break;
    case 'teachers': renderTeachersTab(); break;
    case 'marketplace': renderMarketplaceTab(); break;
    case 'profile': renderProfileTab(); break;
    case 'cart': renderCartTab(); break;
  }
}

// Initialization logic
document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('.nav-links').addEventListener('click', handleTabClick);
  updateCartCount();
  renderHomeTab();
});
