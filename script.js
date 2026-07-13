document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            nav.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }

    // 2. Header Scroll Effect
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(18, 21, 16, 0.95)';
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
        } else {
            header.style.background = 'var(--glass-bg)';
            header.style.padding = '15px 0';
            header.style.boxShadow = 'none';
        }
    });

    // 3. Scroll Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-up, .fade-in-left, .fade-in-right');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Trigger animations for elements already in viewport on load
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero .fade-up');
        heroElements.forEach(el => el.classList.add('visible'));
    }, 100);

    // 5. Form Validation & Telegram Bot
    const contactForm = document.getElementById('leadForm');
    const formStatus = document.getElementById('formStatus');
    const TELEGRAM_TOKEN = '8334443770:AAFCWnMi4CuIvk7b06NPbH4Wt943IUZGIBE';
    const TELEGRAM_CHAT_ID = '-5540358191'; // Chat ID for Монге & Долаан Оснавной, Приглашения

    if (contactForm) {
        // Init IMask for phone
        const phoneInput = document.getElementById('phone');
        if (phoneInput && window.IMask) {
            IMask(phoneInput, {
                mask: '+{7} (000) 000-00-00'
            });
        }

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email') ? document.getElementById('email').value : 'Нет email';
            const message = document.getElementById('message').value || 'Нет сообщения';
            
            if (name && phone) {
                // Formatting message for Telegram
                const text = `🔥 Новая заявка с сайта!\n\nИмя: ${name}\nТелефон: ${phone}\nEmail: ${email}\nСообщение: ${message}`;
                
                // Show loading state
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.textContent;
                submitBtn.textContent = 'Отправка...';
                submitBtn.disabled = true;

                // Send to Telegram
                fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        chat_id: TELEGRAM_CHAT_ID,
                        text: text
                    })
                })
                .then(response => {
                    if (response.ok) {
                        formStatus.style.display = 'block';
                        formStatus.textContent = 'Спасибо за заявку! Мы свяжемся с вами в ближайшее время.';
                        formStatus.className = 'form-status success';
                        contactForm.reset();
                    } else {
                        formStatus.style.display = 'block';
                        formStatus.textContent = 'Ошибка при отправке. Пожалуйста, попробуйте позже.';
                        formStatus.className = 'form-status error';
                    }
                })
                .catch(error => {
                    formStatus.style.display = 'block';
                    formStatus.textContent = 'Ошибка сети. Пожалуйста, проверьте подключение.';
                    formStatus.className = 'form-status error';
                })
                .finally(() => {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                    
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                        formStatus.className = 'form-status';
                    }, 5000);
                });
            } else {
                formStatus.style.display = 'block';
                formStatus.textContent = 'Пожалуйста, заполните обязательные поля.';
                formStatus.className = 'form-status error';
                // Hide message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                    // Reset display inline so it can be shown again with class toggle
                    setTimeout(() => formStatus.style.display = '', 100);
                }, 5000);
            }
        });
    }

    // 5. Smooth Scroll for Anchor Links (polyfill for browsers that don't support scroll-behavior)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 6. Initialize Swiper Gallery
    if (typeof Swiper !== 'undefined') {
        const gallerySwiper = new Swiper('.gallery-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.gallery-swiper .swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                }
            }
        });
        
        // 7. Initialize Leaders Swiper
        const leadersSwiper = new Swiper('.leaders-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.leaders-swiper .swiper-pagination',
                clickable: true,
            }
        });
    }
});
