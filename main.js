document.addEventListener('DOMContentLoaded', () => {
    // Sticky Navbar
    // Sticky Navbar
    const navbar = document.querySelector('.navbar');
    const hero = document.querySelector('.hero'); // Get the hero section

    function updateNavbar() {
        // If there's a hero section, wait until we pass it (minus a small offset)
        // If no hero (other pages), apply 'scrolled' styling immediately (set threshold to -1)
        const triggerHeight = hero ? (hero.offsetHeight - 100) : -1;

        if (window.scrollY > triggerHeight) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateNavbar);
    updateNavbar(); // Init on load

    // --- Mobile Menu ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('fa-bars');
            mobileToggle.classList.toggle('fa-times');
        });
    }

    // --- Shopping Cart Logic ---
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPriceEl = document.getElementById('cart-total-price');
    const cartBtnText = document.querySelector('.cart-text');


    const mobileCartBtn = document.getElementById('mobile-cart-btn');
    const mobileCartCountEl = document.querySelector('.cart-text-mobile');

    // Init
    updateCartUI();

    // Open/Close Modal
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cartModal.classList.add('open');
            renderCartItems();
        });
    }

    if (mobileCartBtn) {
        mobileCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cartModal.classList.add('open');
            renderCartItems();
        });
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            cartModal.classList.remove('open');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('open');
        }
    });

    // Add to Cart Function
    function addToCart(title, price, image) {
        const existingItem = cart.find(item => item.title === title);
        if (existingItem) {
            existingItem.qty++;
        } else {
            cart.push({ title, price, image, qty: 1 });
        }
        saveCart();
        updateCartUI();

        // Auto open cart to show valid feedback or just shake button?
        // For now, let's just sweet alert or console
        // alert(`${title} added to cart!`);
        if (cartBtn) {
            cartBtn.classList.add('pulse');
            setTimeout(() => cartBtn.classList.remove('pulse'), 500);
        }
    }

    // Remove/Decrease
    function updateItemQty(title, change) {
        const item = cart.find(item => item.title === title);
        if (item) {
            item.qty += change;
            if (item.qty <= 0) {
                cart = cart.filter(i => i.title !== title);
            }
        }
        saveCart();
        updateCartUI();
        renderCartItems();
    }

    function removeItem(title) {
        cart = cart.filter(item => item.title !== title);
        saveCart();
        updateCartUI();
        renderCartItems();
    }

    // Save to LocalStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Update UI (Navbar Button)
    function updateCartUI() {
        const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

        if (cartBtn) {
            if (cart.length > 0) {
                cartBtn.classList.add('active');
                cartBtn.innerHTML = `<i class="fas fa-shopping-basket"></i> <span class="cart-price">${total.toFixed(2)} ₼</span>`;
            } else {
                cartBtn.classList.remove('active');
                cartBtn.innerHTML = `<i class="fas fa-shopping-bag"></i> <span class="cart-text">Səbət</span>`;
            }
        }

        if (cartTotalPriceEl) {
            cartTotalPriceEl.innerText = `${total.toFixed(2)} ₼`;
        }

        if (mobileCartCountEl) {
            mobileCartCountEl.innerText = `${total.toFixed(2)} ₼`;
        }
    }

    // Render Items in Modal
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-msg">Səbətiniz boşdur.</p>';
            cartTotalPriceEl.innerText = '0.00 ₼';
            return;
        }

        cart.forEach(item => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-img">
            <div class="cart-item-info">
                <h4>${item.title}</h4>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" data-action="decrease" data-title="${item.title}">-</button>
                <span class="item-qty">${item.qty}</span>
                <button class="qty-btn" data-action="increase" data-title="${item.title}">+</button>
                <span class="item-total">${(item.price * item.qty).toFixed(2)} ₼</span>
                <button class="remove-btn" data-action="remove" data-title="${item.title}"><i class="fas fa-trash"></i></button>
            </div>
        `;
            cartItemsContainer.appendChild(div);
        });

        // Update total in footer
        const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
        if (cartTotalPriceEl) {
            cartTotalPriceEl.innerText = `${total.toFixed(2)} ₼`;
        }
    }

    // Event Delegation for Cart Items
    cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const action = target.dataset.action;
        const title = target.dataset.title;

        if (action === 'increase') {
            updateItemQty(title, 1);
        } else if (action === 'decrease') {
            updateItemQty(title, -1);
        } else if (action === 'remove') {
            removeItem(title);
        }
    });

    // Fly to Cart Animation
    function flyToCart(sourceDetails, targetBtn) {
        if (!sourceDetails || !targetBtn) return;

        // Create clone
        const flyImg = document.createElement('img');
        flyImg.src = sourceDetails.src;
        flyImg.classList.add('fly-img-anim');

        // Initial Position
        const rect = sourceDetails.getBoundingClientRect();
        flyImg.style.width = `${rect.width}px`;
        flyImg.style.height = `${rect.height}px`;
        flyImg.style.top = `${rect.top}px`;
        flyImg.style.left = `${rect.left}px`;

        document.body.appendChild(flyImg);

        // Target Position
        const targetRect = targetBtn.getBoundingClientRect();

        // Trigger Animation
        requestAnimationFrame(() => {
            flyImg.style.top = `${targetRect.top + 10}px`;
            flyImg.style.left = `${targetRect.left + 10}px`;
            flyImg.style.width = '30px';
            flyImg.style.height = '30px';
            flyImg.style.opacity = '0';
        });

        // Cleanup
        setTimeout(() => {
            flyImg.remove();
        }, 1600); // Match CSS transition duration
    }

    // Attach Event Listeners to "Add to Cart" Buttons
    // We need to fetch data from the DOM card
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Prevent opening link if inside an anchor
            e.preventDefault();

            const card = btn.closest('.card');
            const title = card.querySelector('h3').innerText;
            const priceText = card.querySelector('.text-accent').innerText.replace(' ₼', '');
            const price = parseFloat(priceText);
            const imageEl = card.querySelector('img');
            const image = imageEl.src;

            // Trigger Animation
            // Trigger Animation
            // Determine visible target
            let targetBtn = null;

            // Check visibility using offsetParent (null if hidden)
            if (mobileCartBtn && mobileCartBtn.offsetParent !== null) {
                targetBtn = mobileCartBtn;
            } else if (cartBtn && cartBtn.offsetParent !== null) {
                targetBtn = cartBtn;
            } else {
                // Fallback (e.g. if both hidden or logic fails)
                targetBtn = cartBtn || mobileCartBtn;
            }

            if (targetBtn) {
                flyToCart(imageEl, targetBtn);
            }

            // Add to cart with slight delay to sync with arrival? 
            // Or immediate. Immediate feels snappier.
            addToCart(title, price, image);
        });
    });


    // --- Loyalty System Logic ---
    let user = JSON.parse(localStorage.getItem('defne_user')) || null;
    const profileBtn = document.getElementById('profile-btn');
    const profileModal = document.getElementById('profile-modal');
    const closeProfileBtn = document.getElementById('close-profile');
    const loginForm = document.getElementById('login-form');
    const loginView = document.getElementById('profile-login-view');
    const dashboardView = document.getElementById('profile-dashboard-view');

    // UI Elements
    const displayNameEl = document.getElementById('display-name');
    const displayEmailEl = document.getElementById('display-email');
    const avatarTextEl = document.getElementById('avatar-text');
    const creditBalanceEl = document.getElementById('credit-balance');
    const creditProgressEl = document.getElementById('credit-progress');
    const redeem50Btn = document.getElementById('redeem-50');
    const redeem100Btn = document.getElementById('redeem-100');

    // Init Logic
    if (profileBtn && profileModal) {
        // Toggle specific modal
        profileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            profileModal.classList.add('open');
            updateProfileUI();
        });

        if (closeProfileBtn) {
            closeProfileBtn.addEventListener('click', () => {
                profileModal.classList.remove('open');
            });
        }

        // Close on click outside
        window.addEventListener('click', (e) => {
            if (e.target === profileModal) {
                profileModal.classList.remove('open');
            }
        });
    }

    // Login (Create Profile)
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('user-name').value;
            const email = document.getElementById('user-email').value;

            user = {
                name: name,
                email: email,
                credits: 0,
                history: []
            };
            localStorage.setItem('defne_user', JSON.stringify(user));
            updateProfileUI();
        });
    }

    function updateProfileUI() {
        if (!user) {
            loginView.style.display = 'block';
            dashboardView.style.display = 'none';
        } else {
            loginView.style.display = 'none';
            dashboardView.style.display = 'block';

            // Update Info
            displayNameEl.textContent = user.name;
            displayEmailEl.textContent = user.email;
            avatarTextEl.textContent = user.name.charAt(0).toUpperCase();
            creditBalanceEl.textContent = user.credits;

            // Progress Bar (Target 50 or 100)
            let progress = 0;
            if (user.credits < 50) {
                progress = (user.credits / 50) * 100;
            } else if (user.credits < 100) {
                progress = ((user.credits - 50) / 50) * 100; // Progress to next tier
            } else {
                progress = 100;
            }
            creditProgressEl.style.width = `${progress}%`;

            // Enable/Disable Rewards
            if (redeem50Btn) redeem50Btn.disabled = user.credits < 50;
            if (redeem100Btn) redeem100Btn.disabled = user.credits < 100;
        }
    }

    // Fake Checkout & Earn Credits (Hook into "Sifariş vermək")
    const orderBtn = document.querySelector('.cart-footer .btn-primary'); // "Sifariş vermək"
    if (orderBtn) {
        orderBtn.addEventListener('click', () => {
            // Check if cart is empty
            if (cart.length === 0) {
                alert('Səbətiniz boşdur!');
                return;
            }

            // If not logged in, prompt
            if (!user) {
                alert('Sifariş vermək üçün zəhmət olmasa profil yaradın!');
                profileModal.classList.add('open');
                return;
            }

            // Simulate Order Success
            alert(`Sifariş qəbul olundu! Siz 10 Kredit qazandınız! 🎉`);

            // Add Credits
            user.credits += 10;
            user.history.push({ date: new Date().toISOString(), items: cart.length });
            localStorage.setItem('defne_user', JSON.stringify(user));

            // Clear Cart
            cart = [];
            saveCart();
            updateCartUI();
            renderCartItems();
            document.getElementById('cart-modal').classList.remove('open');

            // Show new balance animation
            setTimeout(() => {
                profileModal.classList.add('open');
                updateProfileUI();
            }, 500);
        });
    }

    // Redeem Logic
    if (redeem50Btn) {
        redeem50Btn.addEventListener('click', () => {
            if (confirm('5% endirim üçün 50 kredit istifadə edilsin?')) {
                user.credits -= 50;
                localStorage.setItem('defne_user', JSON.stringify(user));
                updateProfileUI();
                alert('Endirim Kodu Tətbiq Edildi: LOYAL5');
            }
        });
    }
});

// --- Page Transition Logic ---
const transitionOverlay = document.createElement('div');
transitionOverlay.className = 'page-transition';
transitionOverlay.innerHTML = '<div class=\'page-transition-text\'>Yüklənir...</div>';
document.body.appendChild(transitionOverlay);

// Select all links that navigate to internal pages
const navLinksList = document.querySelectorAll('a[href]:not([target=\'_blank\']):not([href^=\'#\']):not([href^=\'tel:\']):not([href^=\'mailto:\'])');

navLinksList.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');

        // 1. Button Pop & Loader
        link.classList.add('btn-loading');

        // 2. Wait 1.2s
        setTimeout(() => {
            // 3. Screen Fade
            transitionOverlay.classList.add('active');

            // 4. Navigate after fade duration
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        }, 1200);
    });

});

// --- Special Deals Slider ---
const sliderTrack = document.getElementById('deals-track');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prev-deal');
const nextBtn = document.getElementById('next-deal');

if (sliderTrack && slides.length > 0) {
    let currentSlide = 0;
    const totalSlides = slides.length;

    function updateSlider() {
        sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        });
    }

    // Optional: Auto-play
    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }, 5000); // Change every 5 seconds
}


