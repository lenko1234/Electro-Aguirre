document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = 'white';
                navLinks.style.padding = '20px';
                navLinks.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }
        });
    }

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                    // Close mobile menu if open
                    if (window.innerWidth <= 768 && navLinks) {
                        navLinks.style.display = 'none';
                    }
                }
            }
        });
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '10px 0';
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.padding = '15px 0';
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        }
    });

    // Simple Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.feature-card, .product-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // WhatsApp Consultation Logic for Product Cards
    // Resusable WhatsApp Logic
    const whatsappNumber = '5493446530460';
    function setupWhatsappButtons() {
        document.querySelectorAll('.product-card').forEach(card => {
            const title = card.querySelector('h3')?.textContent.trim();
            const consultBtn = card.querySelector('.btn');

            if (title && consultBtn && consultBtn.textContent.trim() === 'Consultar') {
                const message = encodeURIComponent(`Hola, como estas? Quisiera consultar por: ${title}`);
                consultBtn.href = `https://wa.me/${whatsappNumber}?text=${message}`;
                consultBtn.target = '_blank';
                consultBtn.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }

    // Initial setup
    setupWhatsappButtons();


    // Sanity Integration with Filtering
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
        const PROJECT_ID = 'gbe69kxi';
        const DATASET = 'production';
        const QUERY = encodeURIComponent('*[_type == "catalogoItem"]{title, description, category, "imageUrl": image.asset->url}');
        const API_URL = `https://${PROJECT_ID}.api.sanity.io/v2022-03-07/data/query/${DATASET}?query=${QUERY}`;

        let allProducts = []; // Store all products globally
        let currentFilter = null; // Track current filter

        // Function to render products
        function renderProducts(products) {
            productsGrid.innerHTML = ''; // Clear grid

            if (!products || products.length === 0) {
                productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No hay productos en esta categoría.</p>';
                return;
            }

            products.forEach(product => {
                const article = document.createElement('article');
                article.className = 'product-card';
                article.dataset.category = product.category || '';

                const imgSrc = product.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image';

                article.innerHTML = `
                    <div class="card-image">
                        <img src="${imgSrc}" alt="${product.title}">
                    </div>
                    <div class="card-content">
                        <h3>${product.title}</h3>
                        <p>${product.description || ''}</p>
                        <a href="#" class="btn btn-outline"
                            style="background: var(--primary-color); color: white; margin-top: 15px; font-size: 0.9rem; padding: 8px 20px;">Consultar</a>
                    </div>
                `;

                // Apply animation styles
                article.style.opacity = '0';
                article.style.transform = 'translateY(20px)';
                article.style.transition = 'all 0.6s ease-out';

                productsGrid.appendChild(article);

                // Observe for animation
                observer.observe(article);
            });

            // Setup buttons for new elements
            setupWhatsappButtons();
        }

        // Function to filter products by category
        function filterByCategory(category) {
            currentFilter = category;

            if (!category || category.includes('Todos')) {
                // Show all products
                renderProducts(allProducts);
            } else {
                // Filter products by category
                const filtered = allProducts.filter(p => p.category === category);
                renderProducts(filtered);
            }

            // Update active state on filter links
            document.querySelectorAll('.filter-list a').forEach(link => {
                link.style.color = '';
                link.style.fontWeight = '';
            });

            const activeLink = Array.from(document.querySelectorAll('.filter-list a'))
                .find(link => link.textContent.trim().startsWith(category || 'Todos'));

            if (activeLink) {
                activeLink.style.color = 'var(--primary-color)';
                activeLink.style.fontWeight = '600';
            }
        }

        // Fetch products from Sanity
        fetch(API_URL)
            .then(res => res.json())
            .then(({ result }) => {
                allProducts = result || [];

                if (allProducts.length === 0) {
                    productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No hay productos cargados en este momento.</p>';
                    return;
                }

                // Render all products initially
                renderProducts(allProducts);

                // Setup filter click handlers
                document.querySelectorAll('.filter-list a').forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const categoryText = link.textContent.trim().replace(/\s*›\s*$/, '').trim();
                        filterByCategory(categoryText);
                    });
                });
            })
            .catch(err => {
                console.error('Error fetching Sanity products:', err);
                productsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: red;">Hubo un error cargando el catálogo. <br/> <small>${err.message}</small></p>`;
            });
    }

    // Load Random Products for Home Page
    const homeProductsGrid = document.getElementById('home-products-grid');
    if (homeProductsGrid) {
        const PROJECT_ID = 'gbe69kxi';
        const DATASET = 'production';
        const QUERY = encodeURIComponent('*[_type == "catalogoItem"]{title, description, category, "imageUrl": image.asset->url}');
        const API_URL = `https://${PROJECT_ID}.api.sanity.io/v2022-03-07/data/query/${DATASET}?query=${QUERY}`;

        fetch(API_URL)
            .then(res => res.json())
            .then(({ result }) => {
                homeProductsGrid.innerHTML = ''; // Clear loading message

                if (!result || result.length === 0) {
                    homeProductsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No hay productos disponibles.</p>';
                    return;
                }

                // Shuffle and get 4 random products
                const shuffled = result.sort(() => 0.5 - Math.random());
                const randomProducts = shuffled.slice(0, 4);

                randomProducts.forEach(product => {
                    const article = document.createElement('article');
                    article.className = 'product-card';

                    const imgSrc = product.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image';

                    article.innerHTML = `
                        <div class="card-image">
                            <img src="${imgSrc}" alt="${product.title}">
                        </div>
                        <div class="card-content">
                            <h3>${product.title}</h3>
                            <p>${product.description || ''}</p>
                        </div>
                    `;

                    // Apply animation styles
                    article.style.opacity = '0';
                    article.style.transform = 'translateY(20px)';
                    article.style.transition = 'all 0.6s ease-out';

                    homeProductsGrid.appendChild(article);

                    // Observe for animation
                    observer.observe(article);
                });
            })
            .catch(err => {
                console.error('Error fetching home products:', err);
                homeProductsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: red;">Error cargando productos.</p>`;
            });
    }
});
