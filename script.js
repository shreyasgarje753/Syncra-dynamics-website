// ============================================
// SYNCRA DYNAMICS - JavaScript Functionality
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Hero Slider Functionality
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');
    let slideInterval;

    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (dots[index]) {
            dots[index].classList.add('active');
        }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function stopSlider() {
        clearInterval(slideInterval);
    }

    function resetSlider() {
        stopSlider();
        startSlider();
    }

    // Navigation button events
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextSlide();
            resetSlider();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
            resetSlider();
        });
    }

    // Dot navigation events
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentSlide = index;
            showSlide(currentSlide);
            resetSlider();
        });
    });

    // Pause slider on hover
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        heroSlider.addEventListener('mouseenter', stopSlider);
        heroSlider.addEventListener('mouseleave', startSlider);
    }

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    if (heroSlider) {
        heroSlider.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });

        heroSlider.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            nextSlide();
            resetSlider();
        }
        if (touchEndX > touchStartX + 50) {
            prevSlide();
            resetSlider();
        }
    }

    // Handle image loading errors and show placeholders
    function checkImageLoad() {
        slides.forEach((slide, index) => {
            const img = slide.querySelector('.slide-image');
            const placeholder = slide.querySelector('.slide-placeholder');
            
            if (img && placeholder) {
                // Check if image is already loaded
                if (img.complete) {
                    if (img.naturalHeight === 0) {
                        // Image failed to load
                        img.classList.add('error');
                        placeholder.classList.remove('hide');
                    } else {
                        // Image loaded successfully
                        img.classList.add('loaded');
                        placeholder.classList.add('hide');
                    }
                } else {
                    // Image still loading - add event listeners
                    img.addEventListener('load', function() {
                        this.classList.add('loaded');
                        if (placeholder) {
                            placeholder.classList.add('hide');
                        }
                    }, { once: true });
                    
                    img.addEventListener('error', function() {
                        this.classList.add('error');
                        if (placeholder) {
                            placeholder.classList.remove('hide');
                        }
                    }, { once: true });
                }
            }
        });
    }

    // Initialize slider
    if (slides.length > 0) {
        checkImageLoad();
        showSlide(0);
        startSlider();
        
        // Recheck images after a delay to catch any loading issues
        setTimeout(checkImageLoad, 1000);
    }

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
        });
    });

    // Active Navigation Link on Scroll
    const sections = document.querySelectorAll('section[id]');
    
    function activateNavLink() {
        let current = '';
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', activateNavLink);

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // FAQ Category Tabs
    const faqCategoryBtns = document.querySelectorAll('.faq-category-btn');
    const faqCategories = document.querySelectorAll('.faq-category');

    faqCategoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');

            // Remove active class from all buttons and categories
            faqCategoryBtns.forEach(b => b.classList.remove('active'));
            faqCategories.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button and corresponding category
            this.classList.add('active');
            const targetCategory = document.getElementById(`faq-${category}`);
            if (targetCategory) {
                targetCategory.classList.add('active');
            }
        });
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // Here you would typically send the data to a server
            // For now, we'll show an alert and reset the form
            console.log('Form submitted:', formData);
            
            // Show success message (in a real application, this would be handled by the backend)
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        });
    }

    // Animate on Scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all product cards and other elements for animation
    const animateElements = document.querySelectorAll('.product-card, .drawing-card, .stat-item, .contact-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Parallax Effect for Hero Section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const heroContent = hero.querySelector('.hero-content');
            if (heroContent && scrolled < hero.offsetHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
                heroContent.style.opacity = 1 - (scrolled / hero.offsetHeight) * 0.5;
            }
        });
    }

    // Gear Animation Enhancement
    const gears = document.querySelectorAll('.gear');
    gears.forEach((gear, index) => {
        gear.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
        });
        
        gear.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
        });
    });

    // Product Card Hover Effect Enhancement
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.product-icon');
            if (icon) {
                icon.style.transition = 'transform 0.4s ease, filter 0.4s ease';
            }
        });
    });

    // Dropdown Menu Close on Outside Click
    document.addEventListener('click', function(e) {
        const dropdown = document.querySelector('.dropdown');
        if (dropdown && !dropdown.contains(e.target)) {
            const dropdownMenu = dropdown.querySelector('.dropdown-menu');
            if (dropdownMenu && window.innerWidth > 768) {
                // Dropdown will be handled by CSS hover on desktop
                // This is just for mobile if needed
            }
        }
    });

    // Window Resize Handler
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
        }
    });

    // Loading Animation
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        setTimeout(function() {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });

    // Scroll to Top Button
    function createScrollToTopButton() {
        const button = document.createElement('button');
        button.innerHTML = '↑';
        button.className = 'scroll-to-top';
        button.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #00a8e8, #0077b6);
            border: 2px solid #00a8e8;
            border-radius: 50%;
            color: white;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
            box-shadow: 0 4px 15px rgba(0, 168, 232, 0.5);
        `;
        
        button.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                button.style.opacity = '1';
                button.style.visibility = 'visible';
            } else {
                button.style.opacity = '0';
                button.style.visibility = 'hidden';
            }
        });
        
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 25px rgba(0, 168, 232, 0.7)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(0, 168, 232, 0.5)';
        });
        
        document.body.appendChild(button);
    }
    
    // Initialize scroll to top button
    createScrollToTopButton();
});

