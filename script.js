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

    // Load Announcements from Sanity
    const tickerContent = document.querySelector('.ticker-content');
    if (tickerContent) {
        const PROJECT_ID = 'gbe69kxi';
        const DATASET = 'production';
        const QUERY = encodeURIComponent('*[_type == "announcement" && isActive == true] | order(order asc) {text, icon}');
        const API_URL = `https://${PROJECT_ID}.api.sanity.io/v2022-03-07/data/query/${DATASET}?query=${QUERY}`;

        fetch(API_URL)
            .then(res => res.json())
            .then(({ result }) => {
                if (result && result.length > 0) {
                    // Build announcement text
                    const announcementText = result.map(announcement => {
                        const icon = announcement.icon || '📢';
                        return `${icon} ${announcement.text}`;
                    }).join(' • ') + ' •';

                    // Update ticker content (duplicate for seamless loop)
                    tickerContent.innerHTML = `
                        <span>${announcementText}</span>
                        <span>${announcementText}</span>
                    `;
                }
            })
            .catch(err => {
                console.error('Error loading announcements:', err);
                // Keep default content if fetch fails
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

    // Toggle categories button for mobile
    const toggleCategoriesBtn = document.getElementById('toggle-categories');
    const categoriesList = document.getElementById('categories-list');

    if (toggleCategoriesBtn && categoriesList) {
        toggleCategoriesBtn.addEventListener('click', () => {
            categoriesList.classList.toggle('expanded');
            toggleCategoriesBtn.classList.toggle('expanded');

            const isExpanded = categoriesList.classList.contains('expanded');
            toggleCategoriesBtn.innerHTML = isExpanded
                ? 'Ver menos categorías <i class="fas fa-chevron-down"></i>'
                : 'Ver más categorías <i class="fas fa-chevron-down"></i>';
        });
    }


    // Sanity Integration with Filtering
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
        const PROJECT_ID = 'gbe69kxi';
        const DATASET = 'production';
        const QUERY = encodeURIComponent('*[_type == "catalogoItem"]{title, description, category, subcategorySistemasModulares, subcategoryVentiladores, subcategoryIluminacionExterior, subcategoryIluminacionHogar, subcategoryProteccionesElectricas, "imageUrl": image.asset->url}');
        const API_URL = `https://${PROJECT_ID}.api.sanity.io/v2022-03-07/data/query/${DATASET}?query=${QUERY}`;

        let allProducts = []; // Store all products globally
        let currentFilter = null; // Track current filter
        let currentSubcategoryFilter = null; // Track current subcategory filter
        let currentSearchTerm = ''; // Track current search term

        // Function to render products
        function renderProducts(products) {
            productsGrid.innerHTML = ''; // Clear grid

            if (!products || products.length === 0) {
                productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No hay productos en esta categoría.</p>';
                return;
            }

            // Sort products intelligently - numbers first (numerically), then alphabetically
            const sortedProducts = [...products].sort((a, b) => {
                // Extract numbers from titles with priority for amperage ratings
                const getNumber = (title) => {
                    // First, try to match amperage pattern (e.g., "1x50A" -> 50)
                    const amperageMatch = title.match(/\d+x(\d+)A/i);
                    if (amperageMatch) {
                        return parseFloat(amperageMatch[1]);
                    }

                    // Then try to match general numbers (e.g., "JELUZ. 20092" -> 20092)
                    const numberMatch = title.match(/(\d+(?:[.,/]\d+)?)/);
                    if (numberMatch) {
                        return parseFloat(numberMatch[1].replace(',', '.').replace('/', '.'));
                    }

                    return null;
                };

                const numA = getNumber(a.title);
                const numB = getNumber(b.title);

                // Both have numbers - sort numerically
                if (numA !== null && numB !== null) {
                    return numA - numB;
                }

                // Only A has a number - A comes first
                if (numA !== null) return -1;

                // Only B has a number - B comes first
                if (numB !== null) return 1;

                // Neither has numbers - sort alphabetically
                return a.title.localeCompare(b.title, 'es', { sensitivity: 'base' });
            });

            sortedProducts.forEach(product => {
                // Combine subcategories into one field
                const subcategory = product.subcategorySistemasModulares || product.subcategoryVentiladores || product.subcategoryIluminacionExterior || product.subcategoryIluminacionHogar || product.subcategoryProteccionesElectricas || '';

                const article = document.createElement('article');
                article.className = 'product-card';
                article.dataset.category = product.category || '';
                article.dataset.subcategory = subcategory;

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

        // Function to filter products by category and subcategory
        function filterByCategory(category, subcategory = null) {
            currentFilter = category;
            currentSubcategoryFilter = subcategory;

            let filtered = allProducts;

            // Apply category filter
            if (category && !category.includes('Todos')) {
                if (subcategory) {
                    // Filter by both category and subcategory
                    filtered = filtered.filter(p => {
                        const productSubcategory = p.subcategorySistemasModulares || p.subcategoryVentiladores || p.subcategoryIluminacionExterior || p.subcategoryIluminacionHogar || p.subcategoryProteccionesElectricas || '';
                        return p.category === category && productSubcategory === subcategory;
                    });
                } else {
                    // Filter products by category only
                    filtered = filtered.filter(p => p.category === category);
                }
            }

            // Apply search filter
            if (currentSearchTerm) {
                filtered = filtered.filter(p => {
                    const searchLower = currentSearchTerm.toLowerCase();
                    const titleMatch = p.title.toLowerCase().includes(searchLower);
                    const descMatch = (p.description || '').toLowerCase().includes(searchLower);
                    return titleMatch || descMatch;
                });
            }

            renderProducts(filtered);

            // Update active state on filter links
            document.querySelectorAll('.filter-list a').forEach(link => {
                link.style.color = '';
                link.style.fontWeight = '';
            });

            const activeLink = Array.from(document.querySelectorAll('.filter-list a'))
                .find(link => {
                    if (subcategory) {
                        return link.getAttribute('data-subcategory') === subcategory;
                    }
                    return link.textContent.trim().startsWith(category || 'Todos');
                });

            if (activeLink) {
                activeLink.style.color = 'var(--primary-color)';
                activeLink.style.fontWeight = '600';
            }
        }

        // Function to toggle subcategories
        function setupSubcategoryToggle() {
            // Handle categories with subcategories
            const categoriesWithSubcategories = ['Sistemas modulares', 'Ventiladores', 'Iluminación Exterior', 'Iluminación Hogar', 'Protecciones eléctricas'];

            categoriesWithSubcategories.forEach(categoryName => {
                const categoryLink = document.querySelector(`a[data-category="${categoryName}"]:not([data-subcategory])`);
                if (categoryLink) {
                    const parentLi = categoryLink.closest('li');
                    const subcategoryList = parentLi.querySelector('.subcategory-list');

                    if (subcategoryList) {
                        // Toggle subcategories on click
                        categoryLink.addEventListener('click', (e) => {
                            e.preventDefault();
                            const isVisible = subcategoryList.style.display === 'block';
                            subcategoryList.style.display = isVisible ? 'none' : 'block';

                            // Rotate the chevron icon
                            const chevron = categoryLink.querySelector('i');
                            if (chevron) {
                                chevron.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(90deg)';
                                chevron.style.transition = 'transform 0.3s ease';
                            }

                            // Filter by main category
                            filterByCategory(categoryName);
                        });
                    }
                }
            });
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

                // Setup subcategory toggle
                setupSubcategoryToggle();

                // Setup filter click handlers
                document.querySelectorAll('.filter-list a').forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const category = link.getAttribute('data-category');
                        const subcategory = link.getAttribute('data-subcategory');

                        if (category && subcategory) {
                            // Subcategory click
                            filterByCategory(category, subcategory);
                        } else if (category) {
                            // Main category click (Sistemas modulares)
                            // Already handled by setupSubcategoryToggle
                        } else {
                            // Other categories
                            const categoryText = link.textContent.trim().replace(/\s*›\s*$/, '').trim();
                            filterByCategory(categoryText);
                        }
                    });
                });

                // Setup search input handler
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                    searchInput.addEventListener('input', (e) => {
                        currentSearchTerm = e.target.value.trim();
                        // Re-apply current filters with search
                        filterByCategory(currentFilter, currentSubcategoryFilter);
                    });
                }
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
