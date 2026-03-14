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
        const QUERY = encodeURIComponent('*[_type == "catalogoItem"]{title, description, branch, category, categorySucursal, subcategorySistemasModulares, subcategoryVentiladores, subcategoryIluminacionExterior, subcategoryIluminacionHogar, subcategoryProteccionesElectricas, "imageUrl": image.asset->url}');
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

            // Sort products intelligently - group similar products together, then sort numerically
            const productGroups = [
                { keywords: ['panel'] },
                { keywords: ['plafón', 'plafon'] },
                { keywords: ['tira', 'cinta'] },
                { keywords: ['aplique'] },
                { keywords: ['colgante'] },
                { keywords: ['lámpara', 'lampara'] },
                { keywords: ['morseto'] },
                { keywords: ['pinza'] },
                { keywords: ['ménsula', 'mensula'] },
                { keywords: ['tilla'] },
                { keywords: ['morsa'] },
                { keywords: ['fusible'] },
                { keywords: ['derivador'] },
                { keywords: ['conjunto'] },
                { keywords: ['guardamotor'] },
                { keywords: ['disyuntor', 'diferencial'] },
                { keywords: ['termomagnética', 'termomagnetica', 'térmica', 'termica', 'pilar'] },
                { keywords: ['spotline'] },
                { keywords: ['spot'] },
            ];

            // Shuffle groups order on each page load (Fisher-Yates)
            for (let i = productGroups.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [productGroups[i], productGroups[j]] = [productGroups[j], productGroups[i]];
            }

            const getGroupPriority = (title) => {
                const titleLower = title.toLowerCase();
                const index = productGroups.findIndex(group =>
                    group.keywords.some(keyword => titleLower.includes(keyword))
                );
                return index === -1 ? 999 : index;
            };

            const sortedProducts = [...products].sort((a, b) => {

                // Extract model code for LCT products (e.g., "PKD-14" from "LCT PKD-14 – Morseto...")
                const getLCTModelCode = (title) => {
                    const lctMatch = title.match(/LCT\s+([A-Z]+-[\dA-Z]+)/i);
                    if (lctMatch) {
                        return lctMatch[1];
                    }
                    return null;
                };

                // Extract numbers from titles with priority for amperage ratings
                const getNumber = (title) => {
                    // 1. Try to match range pattern (e.g., "1 - 1,6A" or "1,6A - 2,5A")
                    const rangeMatch = title.match(/(\d+(?:[.,]\d+)?)(?:\s*A)?\s*-\s*(\d+(?:[.,]\d+)?)\s*A/i);
                    if (rangeMatch) {
                        return parseFloat(rangeMatch[1].replace(',', '.'));
                    }

                    // 2. Try to match amperage pattern (e.g., "1x50A" -> 50, or "10A")
                    // Prioritize numbers that are followed by "A" (Amperes)
                    const ampPattern = /(\d+(?:[.,]\d+)?)\s*A/i;
                    const ampMatch = title.match(ampPattern);
                    if (ampMatch) {
                        return parseFloat(ampMatch[1].replace(',', '.'));
                    }

                    const xAmpMatch = title.match(/\d+x(\d+)A/i);
                    if (xAmpMatch) {
                        return parseFloat(xAmpMatch[1].replace(',', '.'));
                    }

                    // 3. For LCT products, extract the number from the model code
                    const modelCode = getLCTModelCode(title);
                    if (modelCode) {
                        const numberMatch = modelCode.match(/(\d+)/);
                        if (numberMatch) {
                            return parseFloat(numberMatch[1]);
                        }
                    }

                    // 4. Then try to match general numbers (e.g., "JELUZ. 20092" -> 20092)
                    const numberMatch = title.match(/(\d+(?:[.,/]\d+)?)/);
                    if (numberMatch) {
                        return parseFloat(numberMatch[1].replace(',', '.').replace('/', '.'));
                    }

                    return null;
                };

                const groupA = getGroupPriority(a.title);
                const groupB = getGroupPriority(b.title);

                // Different groups - sort by group priority
                if (groupA !== groupB) {
                    return groupA - groupB;
                }

                // Same group - sort by numbers if available
                const numA = getNumber(a.title);
                const numB = getNumber(b.title);

                // Both have numbers - sort numerically
                if (numA !== null && numB !== null) {
                    if (numA !== numB) {
                        return numA - numB;
                    }
                    // If numbers are same (e.g. 10A vs 10A), fall back to alphabetical
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
                article.dataset.category = product.category || product.categorySucursal || '';
                article.dataset.subcategory = subcategory;
                article.dataset.branch = product.branch || 'casaCentral';

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

            const activeBranch = document.getElementById('btn-casa-central').classList.contains('active') ? 'casaCentral' : 'sucursalIluminacion';
            let filtered = allProducts.filter(p => (p.branch || 'casaCentral') === activeBranch);

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
                    filtered = filtered.filter(p => p.category === category || p.categorySucursal === category);
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
                    const dataCategory = link.getAttribute('data-category');
                    return (dataCategory === category) || link.textContent.trim().startsWith(category || 'Todos');
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

        // Define attachFilterHandlers within this scope
        function attachFilterHandlers() {
            // Re-setup subcategory toggle
            setupSubcategoryToggle();

            // Re-setup filter click handlers
            document.querySelectorAll('.filter-list a').forEach(link => {
                // Skip if this link is already handled by setupSubcategoryToggle
                const category = link.getAttribute('data-category');
                const subcategory = link.getAttribute('data-subcategory');
                const categoriesWithSubcategories = ['Sistemas modulares', 'Ventiladores', 'Iluminación Exterior', 'Iluminación Hogar', 'Protecciones eléctricas'];

                // If this is a main category link with subcategories, skip it (handled by setupSubcategoryToggle)
                if (category && !subcategory && categoriesWithSubcategories.includes(category)) {
                    return;
                }

                link.addEventListener('click', (e) => {
                    e.preventDefault();

                    if (category && subcategory) {
                        // Subcategory click
                        filterByCategory(category, subcategory);
                    } else if (category) {
                        // Main category click (without subcategories)
                        filterByCategory(category);
                    } else {
                        // "Todos los productos" or other text-based filters
                        const categoryText = link.textContent.trim().replace(/\s*›\s*$/, '').trim();
                        filterByCategory(categoryText);
                    }
                });
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

                // Render products for the active branch initially
                filterByCategory(null);

                // Setup branch selector
                const btnCasaCentral = document.getElementById('btn-casa-central');
                const btnSucursalIluminacion = document.getElementById('btn-sucursal-iluminacion');
                const categoriesList = document.getElementById('categories-list');

                if (btnCasaCentral && btnSucursalIluminacion && categoriesList) {
                    const casaCentralHTML = categoriesList.innerHTML;
                    const sucursalIluminacionHTML = `
                        <li><a href="#" data-category="" style="color: var(--primary-color); font-weight: 600;">Todos los Productos <i class="fas fa-chevron-right"></i></a></li>
                        <li><a href="#" data-category="Colgantes">Colgantes <i class="fas fa-chevron-right"></i></a></li>
                        <li><a href="#" data-category="Veladores">Veladores <i class="fas fa-chevron-right"></i></a></li>
                        <li><a href="#" data-category="Lámparas de escritorio">Lámparas de escritorio <i class="fas fa-chevron-right"></i></a></li>
                        <li><a href="#" data-category="Lámparas de pie">Lámparas de pie <i class="fas fa-chevron-right"></i></a></li>
                        <li><a href="#" data-category="Spots">Spots <i class="fas fa-chevron-right"></i></a></li>
                        <li><a href="#" data-category="Pantallas">Pantallas <i class="fas fa-chevron-right"></i></a></li>
                    `;

                    btnCasaCentral.addEventListener('click', () => {
                        if (btnCasaCentral.classList.contains('active')) return;
                        btnCasaCentral.classList.add('active');
                        btnSucursalIluminacion.classList.remove('active');
                        categoriesList.innerHTML = casaCentralHTML;
                        attachFilterHandlers();
                        filterByCategory(null); // Shows all for current branch
                    });

                    btnSucursalIluminacion.addEventListener('click', () => {
                        if (btnSucursalIluminacion.classList.contains('active')) return;
                        btnSucursalIluminacion.classList.add('active');
                        btnCasaCentral.classList.remove('active');
                        categoriesList.innerHTML = sucursalIluminacionHTML;
                        attachFilterHandlers();
                        filterByCategory(null); // Shows all for current branch
                    });
                }

                // Initial attachment of handlers
                attachFilterHandlers();

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

                // RE-SCROLL TO HASH: Since Sanity content is dynamic and shifts the page height,
                // we re-trigger the scroll to the hash after the content is loaded.
                if (window.location.hash) {
                    const hash = window.location.hash;
                    // Wait a bit more for images and layout to stabilize
                    setTimeout(() => {
                        const target = document.querySelector(hash);
                        if (target) {
                            const navbarHeight = 90;
                            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                        }
                    }, 1000);
                }
            })
            .catch(err => {
                console.error('Error fetching home products:', err);
                homeProductsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: red;">Error cargando productos.</p>`;
            });
    }
});
