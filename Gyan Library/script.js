/* ==========================================================================
   GYAN LIBRARY - INTERACTION LOGIC (script.js)
   Aesthetic: Fast, responsive, dynamic feedback loops
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    /* 1. SCROLL PROGRESS INDICATOR & STICKY NAVBAR */
    const header = document.getElementById('header');
    const scrollProgress = document.getElementById('scroll-progress');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    const updateScrollState = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Progress bar width
        if (docHeight > 0) {
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        } else {
            scrollProgress.style.width = '0%';
        }
        
        // Sticky Navbar styling transition
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Active Nav Link highlighting on scroll
        let currentActiveSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentActiveSectionId = section.getAttribute('id');
            }
        });
        
        if (currentActiveSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentActiveSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    };

    window.addEventListener('scroll', updateScrollState);
    updateScrollState(); // Trigger initial execution


    /* 2. MOBILE NAVIGATION DRAWER */
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    const toggleDrawer = (open) => {
        if (open) {
            mobileDrawer.classList.add('active');
            drawerOverlay.classList.add('active');
            hamburgerBtn.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stop background scrolling
        } else {
            mobileDrawer.classList.remove('active');
            drawerOverlay.classList.remove('active');
            hamburgerBtn.classList.remove('active');
            document.body.style.overflow = ''; // Resume background scrolling
        }
    };

    hamburgerBtn.addEventListener('click', () => {
        const isOpen = mobileDrawer.classList.contains('active');
        toggleDrawer(!isOpen);
    });

    closeDrawerBtn.addEventListener('click', () => toggleDrawer(false));
    drawerOverlay.addEventListener('click', () => toggleDrawer(false));

    // Close mobile drawer when a link is clicked
    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleDrawer(false);
        });
    });


    /* 3. SCROLL REVEAL ANIMATIONS (Intersection Observer) */
    const revealElements = document.querySelectorAll(
        '.reveal-fade, .reveal-slide-up, .reveal-slide-left, .reveal-slide-right, .reveal-fade-delay-1, .reveal-fade-delay-2, .reveal-fade-delay-3'
    );

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); // Trigger animation once
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(element => {
            element.classList.add('revealed');
        });
    }


    /* 4. BOOK COLLECTION SEARCH & DYNAMIC FILTER SYSTEM */
    const searchInput = document.getElementById('search-input');
    const searchClearBtn = document.getElementById('search-clear-btn');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const bookCards = document.querySelectorAll('.book-card');
    const noResults = document.getElementById('no-results');

    let activeFilter = 'all';
    let searchQuery = '';

    const filterBooks = () => {
        let matchCount = 0;

        bookCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const title = card.getAttribute('data-title').toLowerCase();
            const author = card.getAttribute('data-author').toLowerCase();
            
            // Check if matches category filter
            const matchesFilter = (activeFilter === 'all' || category.toLowerCase() === activeFilter.toLowerCase());
            
            // Check if matches text search
            const matchesSearch = (
                title.includes(searchQuery) || 
                author.includes(searchQuery) ||
                category.toLowerCase().includes(searchQuery)
            );

            if (matchesFilter && matchesSearch) {
                card.classList.remove('hidden');
                matchCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        // Toggle No Results alert
        if (matchCount === 0) {
            noResults.style.display = 'flex';
        } else {
            noResults.style.display = 'none';
        }
    };

    // Category button clicks
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.getAttribute('data-filter');
            filterBooks();
        });
    });

    // Keyword search input
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        
        // Show/hide clear search button
        if (searchQuery.length > 0) {
            searchClearBtn.style.display = 'block';
        } else {
            searchClearBtn.style.display = 'none';
        }
        
        filterBooks();
    });

    // Clear search keyword button
    searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        searchClearBtn.style.display = 'none';
        searchInput.focus();
        filterBooks();
    });


    /* 5. CONTACT FORM VALIDATION & SUCCESS DIALOG */
    const contactForm = document.getElementById('contact-form');
    const successModal = document.getElementById('success-modal');
    const successUserName = document.getElementById('success-user-name');
    const btnModalClose = document.getElementById('btn-modal-close');

    // Utility function to set validation errors
    const setFieldError = (inputId, errorId, isValid, errorMessage) => {
        const inputField = document.getElementById(inputId);
        const formGroup = inputField.closest('.form-group');
        const errorSpan = document.getElementById(errorId);

        if (!isValid) {
            formGroup.classList.add('error');
            if (errorSpan) {
                errorSpan.style.display = 'flex';
                if (errorMessage) errorSpan.innerHTML = errorMessage;
            }
        } else {
            formGroup.classList.remove('error');
            if (errorSpan) errorSpan.style.display = 'none';
        }
    };

    // Event listeners to clear errors on typing
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            const formGroup = input.closest('.form-group');
            if (formGroup.classList.contains('error')) {
                formGroup.classList.remove('error');
                const errorSpan = formGroup.querySelector('.error-msg');
                if (errorSpan) errorSpan.style.display = 'none';
            }
        });
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isFormValid = true;
        
        // Validate Name
        const nameVal = document.getElementById('full-name').value.trim();
        if (nameVal === '') {
            setFieldError('full-name', 'name-error', false, 'Full name is required');
            isFormValid = false;
        } else {
            setFieldError('full-name', 'name-error', true);
        }
        
        // Validate Email
        const emailVal = document.getElementById('email-address').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailVal === '') {
            setFieldError('email-address', 'email-error', false, 'Email address is required');
            isFormValid = false;
        } else if (!emailRegex.test(emailVal)) {
            setFieldError('email-address', 'email-error', false, 'Please enter a valid email address');
            isFormValid = false;
        } else {
            setFieldError('email-address', 'email-error', true);
        }
        
        // Validate Phone (10-digit number)
        const phoneVal = document.getElementById('phone-number').value.trim();
        const phoneRegex = /^\d{10}$/;
        if (phoneVal === '') {
            setFieldError('phone-number', 'phone-error', false, 'Phone number is required');
            isFormValid = false;
        } else if (!phoneRegex.test(phoneVal)) {
            setFieldError('phone-number', 'phone-error', false, 'Please enter a valid 10-digit mobile number');
            isFormValid = false;
        } else {
            setFieldError('phone-number', 'phone-error', true);
        }
        
        // Validate Subject
        const subjectVal = document.getElementById('form-subject').value.trim();
        if (subjectVal === '') {
            setFieldError('form-subject', 'subject-error', false, 'Subject is required');
            isFormValid = false;
        } else {
            setFieldError('form-subject', 'subject-error', true);
        }
        
        // Validate Message
        const messageVal = document.getElementById('form-message').value.trim();
        if (messageVal === '') {
            setFieldError('form-message', 'message-error', false, 'Message content cannot be blank');
            isFormValid = false;
        } else {
            setFieldError('form-message', 'message-error', true);
        }
        
        // If all fields are valid, trigger success feedback
        if (isFormValid) {
            successUserName.textContent = nameVal;
            successModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            contactForm.reset();
        }
    });

    btnModalClose.addEventListener('click', () => {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close success modal by clicking outside it
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });


    /* 6. AUTH MODAL PORTAL (SIGN IN & SIGN UP) */
    const signinNav = document.getElementById('btn-signin-nav');
    const signinDrawer = document.getElementById('btn-signin-drawer');
    const signinModal = document.getElementById('signin-modal');
    const closeSigninX = document.getElementById('close-signin-x');
    
    const signinView = document.getElementById('signin-view');
    const signupView = document.getElementById('signup-view');
    const toggleToSignup = document.getElementById('toggle-to-signup');
    const toggleToSignin = document.getElementById('toggle-to-signin');
    
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');

    const openSigninModal = () => {
        toggleDrawer(false); // Close mobile menu drawer if open
        signinModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Show Sign In by default
        signinView.style.display = 'block';
        signupView.style.display = 'none';
        signinView.classList.remove('hidden');
        signupView.classList.add('hidden');
    };

    const closeSigninModal = () => {
        signinModal.classList.remove('active');
        document.body.style.overflow = '';
        signinForm.reset();
        signupForm.reset();
        
        // Remove validation errors from both forms
        const formGroups = signinModal.querySelectorAll('.form-group');
        formGroups.forEach(g => g.classList.remove('error'));
        const errorSpans = signinModal.querySelectorAll('.error-msg');
        errorSpans.forEach(s => s.style.display = 'none');
    };

    signinNav.addEventListener('click', openSigninModal);
    signinDrawer.addEventListener('click', openSigninModal);
    closeSigninX.addEventListener('click', closeSigninModal);

    // Toggle View listeners
    toggleToSignup.addEventListener('click', (e) => {
        e.preventDefault();
        signinView.style.display = 'none';
        signinView.classList.add('hidden');
        signupView.style.display = 'block';
        signupView.classList.remove('hidden');
    });

    toggleToSignin.addEventListener('click', (e) => {
        e.preventDefault();
        signupView.style.display = 'none';
        signupView.classList.add('hidden');
        signinView.style.display = 'block';
        signinView.classList.remove('hidden');
    });

    // Close auth modal by clicking outside
    signinModal.addEventListener('click', (e) => {
        if (e.target === signinModal) {
            closeSigninModal();
        }
    });

    // Transform nav menu buttons after successful login/registration
    let currentMemberName = "You";
    const transitionToLoggedInState = (memberName, cardId) => {
        currentMemberName = memberName;
        if (typeof updateLeaderboard === 'function') {
            updateLeaderboard(currentMemberName);
        }
        const loggedInElement = `
            <div class="user-profile-badge" id="user-profile-badge" style="display: flex; align-items: center; gap: 8px; color: var(--accent-gold); font-size: 0.95rem; font-weight: 500; cursor: pointer; border: 1px solid var(--accent-gold); padding: 6px 14px; border-radius: 4px; transition: var(--transition-fast);">
                <i class="fa-solid fa-circle-user" style="font-size: 1.15rem;"></i>
                <span>${memberName}</span>
            </div>
        `;
        
        // Swap Nav Sign In Button for Member Profile Icon
        const navBtnParent = signinNav.parentElement;
        navBtnParent.innerHTML = loggedInElement;
        
        // Swap Drawer Sign In Button as well
        const drawerBtnParent = signinDrawer.parentElement;
        drawerBtnParent.innerHTML = `
            <div class="user-profile-badge" style="display: flex; justify-content: center; align-items: center; gap: 8px; color: var(--accent-gold); font-size: 1.1rem; font-weight: 600; padding: 10px 0; border: 1px dashed var(--accent-gold); border-radius: 6px;">
                <i class="fa-solid fa-circle-user" style="font-size: 1.3rem;"></i>
                <span>Card: ${cardId}</span>
            </div>
        `;
        
        // Add click action for Member View
        setTimeout(() => {
            const newProfileBadge = document.getElementById('user-profile-badge');
            if (newProfileBadge) {
                newProfileBadge.addEventListener('click', () => {
                    alert(`Cardholder: ${memberName}\nCard ID: ${cardId}\nLocker Allocation: Active (Zone C-4)`);
                });
            }
        }, 100);
    };

    // Sign in form submit
    signinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const cardIdInput = document.getElementById('signin-card-id');
        const passwordInput = document.getElementById('signin-password');
        const cardIdVal = cardIdInput.value.trim();
        const passwordVal = passwordInput.value.trim();
        
        let isValid = true;
        
        // Card ID Validate
        if (cardIdVal === '') {
            setFieldError('signin-card-id', 'signin-id-error', false, 'Locker/Library Card ID is required');
            isValid = false;
        } else if (cardIdVal.length < 5) {
            setFieldError('signin-card-id', 'signin-id-error', false, 'Card ID should be at least 5 characters');
            isValid = false;
        } else {
            setFieldError('signin-card-id', 'signin-id-error', true);
        }
        
        // Password Validate
        if (passwordVal === '') {
            setFieldError('signin-password', 'signin-pass-error', false, 'Password is required');
            isValid = false;
        } else if (passwordVal.length < 4) {
            setFieldError('signin-password', 'signin-pass-error', false, 'Password should be at least 4 characters');
            isValid = false;
        } else {
            setFieldError('signin-password', 'signin-pass-error', true);
        }
        
        if (isValid) {
            closeSigninModal();
            transitionToLoggedInState('Member View', cardIdVal);
        }
    });

    // Sign up form submit
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('signup-name');
        const emailInput = document.getElementById('signup-email');
        const goalSelect = document.getElementById('signup-goal');
        const passwordInput = document.getElementById('signup-password');
        const confirmInput = document.getElementById('signup-confirm');
        
        const nameVal = nameInput.value.trim();
        const emailVal = emailInput.value.trim();
        const goalVal = goalSelect.value;
        const passwordVal = passwordInput.value.trim();
        const confirmVal = confirmInput.value.trim();
        
        let isValid = true;
        
        // Validate Name
        if (nameVal === '') {
            setFieldError('signup-name', 'signup-name-error', false, 'Full name is required');
            isValid = false;
        } else {
            setFieldError('signup-name', 'signup-name-error', true);
        }
        
        // Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailVal === '') {
            setFieldError('signup-email', 'signup-email-error', false, 'Email address is required');
            isValid = false;
        } else if (!emailRegex.test(emailVal)) {
            setFieldError('signup-email', 'signup-email-error', false, 'Please enter a valid email address');
            isValid = false;
        } else {
            setFieldError('signup-email', 'signup-email-error', true);
        }
        
        // Validate Goal/Aspirant Group
        if (goalVal === '') {
            setFieldError('signup-goal', 'signup-goal-error', false, 'Please select your study goal');
            isValid = false;
        } else {
            setFieldError('signup-goal', 'signup-goal-error', true);
        }
        
        // Validate Password
        if (passwordVal === '') {
            setFieldError('signup-password', 'signup-pass-error', false, 'Create a password');
            isValid = false;
        } else if (passwordVal.length < 6) {
            setFieldError('signup-password', 'signup-pass-error', false, 'Password must be at least 6 characters');
            isValid = false;
        } else {
            setFieldError('signup-password', 'signup-pass-error', true);
        }
        
        // Validate Confirm Password
        if (confirmVal === '') {
            setFieldError('signup-confirm', 'signup-confirm-error', false, 'Confirm your password');
            isValid = false;
        } else if (confirmVal !== passwordVal) {
            setFieldError('signup-confirm', 'signup-confirm-error', false, 'Passwords do not match');
            isValid = false;
        } else {
            setFieldError('signup-confirm', 'signup-confirm-error', true);
        }
        
        if (isValid) {
            closeSigninModal();
            const generatedCardId = `GYAN-2025-${Math.floor(1000 + Math.random() * 9000)}`;
            alert(`Registration Successful!\nWelcome, ${nameVal}.\nYour Library Card ID is: ${generatedCardId}\nUse this Card ID to sign in next time.`);
            transitionToLoggedInState(nameVal, generatedCardId);
        }
    });

    // Clear signin errors on change
    signinForm.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            const formGroup = input.closest('.form-group');
            if (formGroup.classList.contains('error')) {
                formGroup.classList.remove('error');
                const errorSpan = formGroup.querySelector('.error-msg');
                if (errorSpan) errorSpan.style.display = 'none';
            }
        });
    });

    // Clear signup errors on change
    signupForm.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', () => {
            const formGroup = input.closest('.form-group');
            if (formGroup.classList.contains('error')) {
                formGroup.classList.remove('error');
                const errorSpan = formGroup.querySelector('.error-msg');
                if (errorSpan) errorSpan.style.display = 'none';
            }
        });
    });

    /* 7. FAQ ACCORDION FUNCTIONALITY */
    const faqHeaders = document.querySelectorAll('.faq-header');

    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const faqItem = header.closest('.faq-item');
            const faqBody = faqItem.querySelector('.faq-body');
            const isActive = faqItem.classList.contains('active');

            // Close all other FAQ items for accordion behavior
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    item.querySelector('.faq-body').style.maxHeight = null;
                    item.querySelector('.faq-header').setAttribute('aria-expanded', 'false');
                }
            });

            if (!isActive) {
                faqItem.classList.add('active');
                faqBody.style.maxHeight = faqBody.scrollHeight + 'px';
                header.setAttribute('aria-expanded', 'true');
            } else {
                faqItem.classList.remove('active');
                faqBody.style.maxHeight = null;
                header.setAttribute('aria-expanded', 'false');
            }
        });
    });


    /* 8. GALLERY LIGHTBOX */
    const galleryItems      = document.querySelectorAll('.gallery-item');
    const lightboxOverlay   = document.getElementById('lightbox-overlay');
    const lightboxImg       = document.getElementById('lightbox-img');
    const lightboxCaption   = document.getElementById('lightbox-caption');
    const lightboxCounter   = document.getElementById('lightbox-counter');
    const lightboxSpinner   = document.getElementById('lightbox-spinner');
    const lightboxClose     = document.getElementById('lightbox-close');
    const lightboxPrev      = document.getElementById('lightbox-prev');
    const lightboxNext      = document.getElementById('lightbox-next');

    const totalImages = galleryItems.length;
    let currentIndex  = 0;

    /**
     * Opens the lightbox and loads the image at `index`.
     */
    const openLightbox = (index) => {
        currentIndex = index;
        lightboxOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        loadLightboxImage(index);
    };

    /**
     * Closes the lightbox and restores page scroll.
     */
    const closeLightbox = () => {
        lightboxOverlay.classList.remove('active');
        document.body.style.overflow = '';
        // Small delay before clearing src so close animation plays cleanly
        setTimeout(() => {
            lightboxImg.src = '';
            lightboxImg.alt = '';
        }, 400);
    };

    /**
     * Loads the image for `index` into the lightbox.
     * Shows a spinner while the image is fetching.
     */
    const loadLightboxImage = (index) => {
        const item    = galleryItems[index];
        const imgEl   = item.querySelector('.gallery-img');
        const caption = item.querySelector('.gallery-caption span')
                            ? item.querySelector('.gallery-caption span').textContent
                            : (imgEl.alt || '');

        // Show spinner, hide image
        lightboxSpinner.classList.add('visible');
        lightboxImg.classList.add('loading');

        // Update counter and caption immediately
        lightboxCaption.textContent  = caption;
        lightboxCounter.textContent  = `${index + 1} / ${totalImages}`;

        // Update prev/next button disabled state
        lightboxPrev.disabled = (index === 0);
        lightboxNext.disabled = (index === totalImages - 1);

        // Load image
        const tempImg = new Image();
        tempImg.onload = () => {
            lightboxImg.src = tempImg.src;
            lightboxImg.alt = imgEl.alt;
            lightboxImg.classList.remove('loading');
            lightboxSpinner.classList.remove('visible');
        };
        tempImg.onerror = () => {
            // Fallback: try to set directly even if load event fails
            lightboxImg.src = imgEl.src;
            lightboxImg.alt = imgEl.alt;
            lightboxImg.classList.remove('loading');
            lightboxSpinner.classList.remove('visible');
        };
        tempImg.src = imgEl.src;
    };

    /**
     * Navigate to previous image.
     */
    const showPrev = () => {
        if (currentIndex > 0) {
            currentIndex--;
            loadLightboxImage(currentIndex);
        }
    };

    /**
     * Navigate to next image.
     */
    const showNext = () => {
        if (currentIndex < totalImages - 1) {
            currentIndex++;
            loadLightboxImage(currentIndex);
        }
    };

    // Attach click handlers to every gallery item
    galleryItems.forEach((item) => {
        item.addEventListener('click', () => {
            const index = parseInt(item.getAttribute('data-index'), 10);
            openLightbox(index);
        });
    });

    // Close button
    lightboxClose.addEventListener('click', closeLightbox);

    // Prev / Next buttons
    lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
    lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

    // Click outside the image content closes the lightbox
    lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay) {
            closeLightbox();
        }
    });

    // Keyboard navigation: Escape = close, ArrowLeft = prev, ArrowRight = next
    document.addEventListener('keydown', (e) => {
        if (!lightboxOverlay.classList.contains('active')) return;
        if (e.key === 'Escape')      { closeLightbox(); }
        if (e.key === 'ArrowLeft')   { showPrev(); }
        if (e.key === 'ArrowRight')  { showNext(); }
    });

    // Touch / swipe support for mobile
    let touchStartX = 0;
    let touchEndX   = 0;
    const SWIPE_THRESHOLD = 50;

    lightboxOverlay.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    lightboxOverlay.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > SWIPE_THRESHOLD) {
            if (diff > 0) {
                showNext(); // swipe left → next
            } else {
                showPrev(); // swipe right → prev
            }
        }
    }, { passive: true })    /* ==========================================================================
       DAILY QUIZ & PRACTICE ZONE ENGINE (MULTILINGUAL)
       ========================================================================== */
    const localization = {
        "en": {
            "next": "Next Question",
            "prev": "Previous",
            "submit": "Submit Quiz",
            "quit": "Quit Quiz",
            "score": "Score",
            "accuracy": "Accuracy Rate",
            "timeTaken": "Time Taken",
            "totalQuestions": "Total Questions",
            "correctAnswers": "Correct Answers",
            "wrongAnswers": "Wrong Answers",
            "unattempted": "Unattempted",
            "percentage": "Percentage",
            "quitConfirm": "Are you sure you want to quit the quiz? Your current progress will be lost.",
            "submitConfirm": "Are you sure you want to submit your quiz?",
            "clearHistoryConfirm": "Are you sure you want to clear your quiz history? This will reset all your performance statistics.",
            "timeUp": "Time is up! Your quiz will be submitted automatically.",
            "anotherQuiz": "Try Another Quiz",
            "quizHome": "Quiz Home",
            "offlineNotice": "API connection timed out. Loading curated offline questions.",
            "chooseLangTitle": "Choose Your Quiz Language",
            "chooseLangDesc": "Select the language in which you want to attempt the quiz.",
            "langValidationError": "Please select a language to continue.",
            "langSelectBack": "Back",
            "langSelectContinue": "Continue"
        },
        "hi": {
            "next": "अगला प्रश्न",
            "prev": "पिछला",
            "submit": "क्विज़ जमा करें",
            "quit": "क्विज़ छोड़ें",
            "score": "स्कोर",
            "accuracy": "सटीकता दर",
            "timeTaken": "लिया गया समय",
            "totalQuestions": "कुल प्रश्न",
            "correctAnswers": "सही उत्तर",
            "wrongAnswers": "गलत उत्तर",
            "unattempted": "बिना प्रयास किए",
            "percentage": "प्रतिशत",
            "quitConfirm": "क्या आप सच में क्विज़ छोड़ना चाहते हैं? आपका वर्तमान प्रयास खो जाएगा।",
            "submitConfirm": "क्या आप सच में अपनी क्विज़ जमा करना चाहते हैं?",
            "clearHistoryConfirm": "क्या आप सच में अपना क्विज़ इतिहास मिटाना चाहते हैं? इससे आपके सभी आंकड़े रीसेट हो जाएंगे।",
            "timeUp": "समय समाप्त! आपका क्विज़ अपने आप जमा हो जाएगा।",
            "anotherQuiz": "दूसरा क्विज़ खेलें",
            "quizHome": "क्विज़ होम",
            "offlineNotice": "एपीआई कनेक्शन विफल रहा। ऑफ़लाइन प्रश्न लोड किए जा रहे हैं।",
            "chooseLangTitle": "अपनी क्विज़ भाषा चुनें",
            "chooseLangDesc": "उस भाषा का चयन करें जिसमें आप क्विज़ का प्रयास करना चाहते हैं।",
            "langValidationError": "कृपया आगे बढ़ने के लिए भाषा चुनें।",
            "langSelectBack": "पीछे",
            "langSelectContinue": "आगे बढ़ें"
        },
        "bilingual": {
            "next": "Next / अगला",
            "prev": "Prev / पिछला",
            "submit": "Submit / जमा करें",
            "quit": "Quit / छोड़ें",
            "score": "Score / स्कोर",
            "accuracy": "Accuracy / सटीकता",
            "timeTaken": "Time / समय",
            "totalQuestions": "Total / कुल प्रश्न",
            "correctAnswers": "Correct / सही उत्तर",
            "wrongAnswers": "Wrong / गलत उत्तर",
            "unattempted": "Unattempted / बिना प्रयास",
            "percentage": "Percentage / प्रतिशत",
            "quitConfirm": "Are you sure you want to quit? / क्या आप सच में क्विज़ छोड़ना चाहते हैं?",
            "submitConfirm": "Are you sure you want to submit? / क्या आप सच में अपनी क्विज़ जमा करना चाहते हैं?",
            "clearHistoryConfirm": "Are you sure you want to clear history? / क्या आप सच में इतिहास मिटाना चाहते हैं?",
            "timeUp": "Time is up! / समय समाप्त!",
            "anotherQuiz": "Try Another / दूसरा खेलें",
            "quizHome": "Quiz Home / होम",
            "offlineNotice": "API failed. Loading offline questions. / ऑफ़लाइन लोड किए जा रहे हैं।",
            "chooseLangTitle": "Choose Quiz Language / भाषा चुनें",
            "chooseLangDesc": "Select quiz language / भाषा चुनें",
            "langValidationError": "Please select a language / कृपया भाषा चुनें",
            "langSelectBack": "Back / पीछे",
            "langSelectContinue": "Continue / आगे बढ़ें"
        }
    };

    const categoryTranslations = {
        "Current Affairs": { en: "Current Affairs", hi: "सामयिक विषय", bilingual: "Current Affairs / सामयिक विषय" },
        "General Knowledge": { en: "General Knowledge", hi: "सामान्य ज्ञान", bilingual: "General Knowledge / सामान्य ज्ञान" },
        "General Studies": { en: "General Studies", hi: "सामान्य अध्ययन", bilingual: "General Studies / सामान्य अध्ययन" },
        "UPSC": { en: "UPSC Preparation", hi: "संघ लोक सेवा आयोग", bilingual: "UPSC / संघ लोक सेवा आयोग" },
        "SSC": { en: "SSC CGL / CHSL", hi: "कर्मचारी चयन आयोग", bilingual: "SSC / कर्मचारी चयन आयोग" },
        "Banking": { en: "Banking & Finance", hi: "बैंकिंग और वित्त", bilingual: "Banking & Finance / बैंकिंग और वित्त" },
        "Railway": { en: "Railway (RRB)", hi: "रेलवे भर्ती बोर्ड", bilingual: "Railway / रेलवे भर्ती बोर्ड" },
        "State PCS": { en: "State PCS", hi: "राज्य लोक सेवा आयोग", bilingual: "State PCS / राज्य लोक सेवा आयोग" }
    };

    const offlineQuizData = {
        "Current Affairs": [
            {
                question: {
                    en: "Which country successfully landed the Chandrayaan-3 mission near the South Pole of the Moon?",
                    hi: "किस देश ने चंद्रमा के दक्षिणी ध्रुव के पास चंद्रयान-3 मिशन को सफलतापूर्वक उतारा?",
                    bilingual: "Which country successfully landed the Chandrayaan-3 mission near the South Pole of the Moon?\n\nकिस देश ने चंद्रमा के दक्षिणी ध्रुव के पास चंद्रयान-3 मिशन को सफलतापूर्वक उतारा?"
                },
                correct_answer: { en: "India", hi: "भारत", bilingual: "India / भारत" },
                incorrect_answers: [
                    { en: "USA", hi: "अमेरिका", bilingual: "USA / अमेरिका" },
                    { en: "Russia", hi: "रूस", bilingual: "Russia / रूस" },
                    { en: "China", hi: "चीन", bilingual: "China / चीन" }
                ]
            },
            {
                question: {
                    en: "Who won the Nobel Peace Prize in 2023?",
                    hi: "2023 में नोबेल शांति पुरस्कार किसने जीता?",
                    bilingual: "Who won the Nobel Peace Prize in 2023?\n\n2023 में नोबेल शांति पुरस्कार किसने जीता?"
                },
                correct_answer: { en: "Narges Mohammadi", hi: "नरगिस मोहम्मदी", bilingual: "Narges Mohammadi / नरगिस मोहम्मदी" },
                incorrect_answers: [
                    { en: "Maria Ressa", hi: "मारिया रेसा", bilingual: "Maria Ressa / मारिया रेसा" },
                    { en: "Malala Yousafzai", hi: "मलाला यूसुफजई", bilingual: "Malala Yousafzai / मलाला यूसुफजई" },
                    { en: "Dmitry Muratov", hi: "दिमित्री मुरातोव", bilingual: "Dmitry Muratov / दिमित्री मुरातोव" }
                ]
            },
            {
                question: {
                    en: "Which city hosted the G20 Summit in September 2023?",
                    hi: "सितंबर 2023 में किस शहर ने G20 शिखर सम्मेलन की मेजबानी की?",
                    bilingual: "Which city hosted the G20 Summit in September 2023?\n\nसितंबर 2023 में किस शहर ने G20 शिखर सम्मेलन की मेजबानी की?"
                },
                correct_answer: { en: "New Delhi", hi: "नई दिल्ली", bilingual: "New Delhi / नई दिल्ली" },
                incorrect_answers: [
                    { en: "Rome", hi: "रोम", bilingual: "Rome / रोम" },
                    { en: "Bali", hi: "बाली", bilingual: "Bali / बाली" },
                    { en: "Tokyo", hi: "टोक्यो", bilingual: "Tokyo / टोक्यो" }
                ]
            },
            {
                question: {
                    en: "In which city were the 2024 Olympic Games held?",
                    hi: "2024 ओलंपिक खेल किस शहर में आयोजित किए गए थे?",
                    bilingual: "In which city were the 2024 Olympic Games held?\n\n2024 ओलंपिक खेल किस शहर में आयोजित किए गए थे?"
                },
                correct_answer: { en: "Paris", hi: "पेरिस", bilingual: "Paris / पेरिस" },
                incorrect_answers: [
                    { en: "London", hi: "लंदन", bilingual: "London / लंदन" },
                    { en: "Los Angeles", hi: "लॉस एंजिल्स", bilingual: "Los Angeles / लॉस एंजिल्स" },
                    { en: "Tokyo", hi: "टोक्यो", bilingual: "Tokyo / टोक्यो" }
                ]
            },
            {
                question: {
                    en: "Which organization launched the James Webb Space Telescope?",
                    hi: "किस संगठन ने जेम्स वेब स्पेस टेलीस्कोप लॉन्च किया?",
                    bilingual: "Which organization launched the James Webb Space Telescope?\n\nकिस संगठन ने जेम्स वेब स्पेस टेलीस्कोप लॉन्च किया?"
                },
                correct_answer: { en: "NASA", hi: "नासा", bilingual: "NASA / नासा" },
                incorrect_answers: [
                    { en: "ESA", hi: "ईएसए", bilingual: "ESA / ईएसए" },
                    { en: "ISRO", hi: "इसरो", bilingual: "ISRO / इसरो" },
                    { en: "Roscosmos", hi: "रोस्कोस्मोस", bilingual: "Roscosmos / रोस्कोस्मोस" }
                ]
            },
            {
                question: {
                    en: "What is the name of the AI chatbot launched by OpenAI in late 2022?",
                    hi: "2022 के अंत में OpenAI द्वारा लॉन्च किए गए AI चैटबॉट का नाम क्या है?",
                    bilingual: "What is the name of the AI chatbot launched by OpenAI in late 2022?\n\n2022 के अंत में OpenAI द्वारा लॉन्च किए गए AI चैटबॉट का नाम क्या है?"
                },
                correct_answer: { en: "ChatGPT", hi: "चैटजीपीटी", bilingual: "ChatGPT / चैटजीपीटी" },
                incorrect_answers: [
                    { en: "Bard", hi: "बार्ड", bilingual: "Bard / बार्ड" },
                    { en: "Gemini", hi: "जेमिनी", bilingual: "Gemini / जेमिनी" },
                    { en: "Claude", hi: "क्लोड", bilingual: "Claude / क्लोड" }
                ]
            },
            {
                question: {
                    en: "Who is the current Secretary-General of the United Nations?",
                    hi: "संयुक्त राष्ट्र के वर्तमान महासचिव कौन हैं?",
                    bilingual: "Who is the current Secretary-General of the United Nations?\n\nसंयुक्त राष्ट्र के वर्तमान महासचिव कौन हैं?"
                },
                correct_answer: { en: "António Guterres", hi: "एंटोनियो गुटेरेस", bilingual: "António Guterres / एंटोनियो गुटेरेस" },
                incorrect_answers: [
                    { en: "Ban Ki-moon", hi: "बान की मून", bilingual: "Ban Ki-moon / बान की मून" },
                    { en: "Kofi Annan", hi: "कोफी अन्नान", bilingual: "Kofi Annan / कोफी अन्नान" },
                    { en: "Tedros Adhanom", hi: "टेड्रोस एडहानोम", bilingual: "Tedros Adhanom / टेड्रोस एडहानोम" }
                ]
            },
            {
                question: {
                    en: "Which team won the ICC Men's Cricket World Cup 2023?",
                    hi: "किस टीम ने ICC पुरुष क्रिकेट विश्व कप 2023 जीता?",
                    bilingual: "Which team won the ICC Men's Cricket World Cup 2023?\n\nकिस टीम ने ICC पुरुष क्रिकेट विश्व कप 2023 जीता?"
                },
                correct_answer: { en: "Australia", hi: "ऑस्ट्रेलिया", bilingual: "Australia / ऑस्ट्रेलिया" },
                incorrect_answers: [
                    { en: "India", hi: "भारत", bilingual: "India / भारत" },
                    { en: "South Africa", hi: "दक्षिण अफ्रीका", bilingual: "South Africa / दक्षिण अफ्रीका" },
                    { en: "New Zealand", hi: "न्यूजीलैंड", bilingual: "New Zealand / न्यूजीलैंड" }
                ]
            },
            {
                question: {
                    en: "Which country is the newest member of NATO, joining in 2024?",
                    hi: "2024 में शामिल होने वाला नाटो का नवीनतम सदस्य देश कौन सा है?",
                    bilingual: "Which country is the newest member of NATO, joining in 2024?\n\n2024 में शामिल होने वाला नाटो का नवीनतम सदस्य देश कौन सा है?"
                },
                correct_answer: { en: "Sweden", hi: "स्वीडन", bilingual: "Sweden / स्वीडन" },
                incorrect_answers: [
                    { en: "Finland", hi: "फिनलैंड", bilingual: "Finland / फिनलैंड" },
                    { en: "Ukraine", hi: "यूक्रेन", bilingual: "Ukraine / यूक्रेन" },
                    { en: "Switzerland", hi: "स्विट्जरलैंड", bilingual: "Switzerland / स्विट्जरलैंड" }
                ]
            },
            {
                question: {
                    en: "What is the primary objective of India's Aditya-L1 mission?",
                    hi: "भारत के आदित्य-L1 मिशन का मुख्य उद्देश्य क्या है?",
                    bilingual: "What is the primary objective of India's Aditya-L1 mission?\n\nभारत के आदित्य-L1 मिशन का मुख्य उद्देश्य क्या है?"
                },
                correct_answer: { en: "To study the Sun", hi: "सूर्य का अध्ययन करना", bilingual: "To study the Sun / सूर्य का अध्ययन करना" },
                incorrect_answers: [
                    { en: "To study Mars", hi: "मंगल का अध्ययन करना", bilingual: "To study Mars / मंगल का अध्ययन करना" },
                    { en: "To study Venus", hi: "शुक्र का अध्ययन करना", bilingual: "To study Venus / शुक्र का अध्ययन करना" },
                    { en: "To study the Moon", hi: "चंद्रमा का अध्ययन करना", bilingual: "To study the Moon / चंद्रमा का अध्ययन करना" }
                ]
            }
        ],
        "General Knowledge": [
            {
                question: {
                    en: "What is the capital of France?",
                    hi: "फ्रांस की राजधानी क्या है?",
                    bilingual: "What is the capital of France?\n\nफ्रांस की राजधानी क्या है?"
                },
                correct_answer: { en: "Paris", hi: "पेरिस", bilingual: "Paris / पेरिस" },
                incorrect_answers: [
                    { en: "London", hi: "लंदन", bilingual: "London / लंदन" },
                    { en: "Berlin", hi: "बर्लिन", bilingual: "Berlin / बर्लिन" },
                    { en: "Rome", hi: "रोम", bilingual: "Rome / रोम" }
                ]
            },
            {
                question: {
                    en: "Which is the largest ocean on Earth?",
                    hi: "पृथ्वी पर सबसे बड़ा महासागर कौन सा है?",
                    bilingual: "Which is the largest ocean on Earth?\n\nपृथ्वी पर सबसे बड़ा महासागर कौन सा है?"
                },
                correct_answer: { en: "Pacific Ocean", hi: "प्रशांत महासागर", bilingual: "Pacific Ocean / प्रशांत महासागर" },
                incorrect_answers: [
                    { en: "Atlantic Ocean", hi: "अटलांटिक महासागर", bilingual: "Atlantic Ocean / अटलांटिक महासागर" },
                    { en: "Indian Ocean", hi: "हिंद महासागर", bilingual: "Indian Ocean / हिंद महासागर" },
                    { en: "Arctic Ocean", hi: "आर्कटिक महासागर", bilingual: "Arctic Ocean / आर्कटिक महासागर" }
                ]
            },
            {
                question: {
                    en: "Who wrote the play 'Romeo and Juliet'?",
                    hi: "'रोमियो और जूलियट' नाटक किसने लिखा था?",
                    bilingual: "Who wrote the play 'Romeo and Juliet'?\n\n'रोमियो और जूलियट' नाटक किसने लिखा था?"
                },
                correct_answer: { en: "William Shakespeare", hi: "विलियम शेक्सपियर", bilingual: "William Shakespeare / विलियम शेक्सपियर" },
                incorrect_answers: [
                    { en: "Charles Dickens", hi: "चार्ल्स डिकेंस", bilingual: "Charles Dickens / चार्ल्स डिकेंस" },
                    { en: "Leo Tolstoy", hi: "लियो टॉल्स्टॉय", bilingual: "Leo Tolstoy / लियो टॉल्स्टॉय" },
                    { en: "Mark Twain", hi: "मार्क ट्वेन", bilingual: "Mark Twain / मार्क ट्वेन" }
                ]
            },
            {
                question: {
                    en: "What is the chemical symbol for gold?",
                    hi: "सोने का रासायनिक प्रतीक क्या है?",
                    bilingual: "What is the chemical symbol for gold?\n\nसोने का रासायनिक प्रतीक क्या है?"
                },
                correct_answer: { en: "Au", hi: "Au", bilingual: "Au / सोना" },
                incorrect_answers: [
                    { en: "Ag", hi: "Ag", bilingual: "Ag / चांदी" },
                    { en: "Gd", hi: "Gd", bilingual: "Gd" },
                    { en: "Fe", hi: "Fe", bilingual: "Fe / लोहा" }
                ]
            },
            {
                question: {
                    en: "Which is the tallest mountain in the world?",
                    hi: "विश्व का सबसे ऊँचा पर्वत कौन सा है?",
                    bilingual: "Which is the tallest mountain in the world?\n\nविश्व का सबसे ऊँचा पर्वत कौन सा है?"
                },
                correct_answer: { en: "Mount Everest", hi: "माउंट एवरेस्ट", bilingual: "Mount Everest / माउंट एवरेस्ट" },
                incorrect_answers: [
                    { en: "K2", hi: "के2", bilingual: "K2" },
                    { en: "Kangchenjunga", hi: "कंचनजंगा", bilingual: "Kangchenjunga / कंचनजंगा" },
                    { en: "Lhotse", hi: "लहोत्से", bilingual: "Lhotse" }
                ]
            },
            {
                question: {
                    en: "How many planets are there in our Solar System?",
                    hi: "हमारे सौरमंडल में कितने ग्रह हैं?",
                    bilingual: "How many planets are there in our Solar System?\n\nहमारे सौरमंडल में कितने ग्रह हैं?"
                },
                correct_answer: { en: "8", hi: "8", bilingual: "8" },
                incorrect_answers: [
                    { en: "9", hi: "9", bilingual: "9" },
                    { en: "7", hi: "7", bilingual: "7" },
                    { en: "10", hi: "10", bilingual: "10" }
                ]
            },
            {
                question: {
                    en: "Which country is home to the Kangaroo?",
                    hi: "कंगारू किस देश का मूल निवासी है?",
                    bilingual: "Which country is home to the Kangaroo?\n\nकंगारू किस देश का मूल निवासी है?"
                },
                correct_answer: { en: "Australia", hi: "ऑस्ट्रेलिया", bilingual: "Australia / ऑस्ट्रेलिया" },
                incorrect_answers: [
                    { en: "South Africa", hi: "दक्षिण अफ्रीका", bilingual: "South Africa / दक्षिण अफ्रीका" },
                    { en: "New Zealand", hi: "न्यूजीलैंड", bilingual: "New Zealand / न्यूजीलैंड" },
                    { en: "Austria", hi: "ऑस्ट्रिया", bilingual: "Austria / ऑस्ट्रिया" }
                ]
            },
            {
                question: {
                    en: "What is the hardest natural substance on Earth?",
                    hi: "पृथ्वी पर सबसे कठोर प्राकृतिक पदार्थ कौन सा है?",
                    bilingual: "What is the hardest natural substance on Earth?\n\nपृथ्वी पर सबसे कठोर प्राकृतिक पदार्थ कौन सा है?"
                },
                correct_answer: { en: "Diamond", hi: "हीरा", bilingual: "Diamond / हीरा" },
                incorrect_answers: [
                    { en: "Gold", hi: "सोना", bilingual: "Gold / सोना" },
                    { en: "Iron", hi: "लोहा", bilingual: "Iron / लोहा" },
                    { en: "Granite", hi: "ग्रेनाइट", bilingual: "Granite / ग्रेनाइट" }
                ]
            },
            {
                question: {
                    en: "Which gas do plants absorb from the atmosphere for photosynthesis?",
                    hi: "पौधे प्रकाश संश्लेषण के लिए वायुमंडल से कौन सी गैस अवशोषित करते हैं?",
                    bilingual: "Which gas do plants absorb from the atmosphere for photosynthesis?\n\nपौधे प्रकाश संश्लेषण के लिए वायुमंडल से कौन सी गैस अवशोषित करते हैं?"
                },
                correct_answer: { en: "Carbon Dioxide", hi: "कार्बन डाइऑक्साइड", bilingual: "Carbon Dioxide / कार्बन डाइऑक्साइड" },
                incorrect_answers: [
                    { en: "Oxygen", hi: "ऑक्सीजन", bilingual: "Oxygen / ऑक्सीजन" },
                    { en: "Nitrogen", hi: "नाइट्रोजन", bilingual: "Nitrogen / नाइट्रोजन" },
                    { en: "Hydrogen", hi: "हाइड्रोजन", bilingual: "Hydrogen / हाइड्रोजन" }
                ]
            },
            {
                question: {
                    en: "Who is known as the 'Father of Computers'?",
                    hi: "'कंप्यूटर के जनक' के रूप में किसे जाना जाता है?",
                    bilingual: "Who is known as the 'Father of Computers'?\n\n'कंप्यूटर के जनक' के रूप में किसे जाना जाता है?"
                },
                correct_answer: { en: "Charles Babbage", hi: "चार्ल्स बैबेज", bilingual: "Charles Babbage / चार्ल्स बैबेज" },
                incorrect_answers: [
                    { en: "Alan Turing", hi: "एलन ट्यूरिंग", bilingual: "Alan Turing / एलन ट्यूरिंग" },
                    { en: "Bill Gates", hi: "बिल गेट्स", bilingual: "Bill Gates / बिल गेट्स" },
                    { en: "Steve Jobs", hi: "स्टीव जॉब्स", bilingual: "Steve Jobs / स्टीव जॉब्स" }
                ]
            }
        ],
        "General Studies": [
            {
                question: {
                    en: "Which layer of the atmosphere contains the ozone layer?",
                    hi: "वायुमंडल की किस परत में ओजोन परत होती है?",
                    bilingual: "Which layer of the atmosphere contains the ozone layer?\n\nवायुमंडल की किस परत में ओजोन परत होती है?"
                },
                correct_answer: { en: "Stratosphere", hi: "समताप मंडल", bilingual: "Stratosphere / समताप मंडल" },
                incorrect_answers: [
                    { en: "Troposphere", hi: "क्षोभमंडल", bilingual: "Troposphere / क्षोभमंडल" },
                    { en: "Mesosphere", hi: "मध्यमंडल", bilingual: "Mesosphere / मध्यमंडल" },
                    { en: "Thermosphere", hi: "बाह्य वायुमंडल", bilingual: "Thermosphere / बाह्य वायुमंडल" }
                ]
            },
            {
                question: {
                    en: "What is the powerhouse of the cell?",
                    hi: "कोशिका का पावरहाउस किसे कहा जाता है?",
                    bilingual: "What is the powerhouse of the cell?\n\nकोशिका का पावरहाउस किसे कहा जाता है?"
                },
                correct_answer: { en: "Mitochondria", hi: "माइटोकॉन्ड्रिया", bilingual: "Mitochondria / माइटोकॉन्ड्रिया" },
                incorrect_answers: [
                    { en: "Nucleus", hi: "केंद्रक", bilingual: "Nucleus / केंद्रक" },
                    { en: "Ribosome", hi: "राइबोसोम", bilingual: "Ribosome / राइबोसोम" },
                    { en: "Golgi Apparatus", hi: "गॉल्जी उपकरण", bilingual: "Golgi Apparatus / गॉल्जी उपकरण" }
                ]
            },
            {
                question: {
                    en: "Which planet is known as the Red Planet?",
                    hi: "किस ग्रह को लाल ग्रह के रूप में जाना जाता है?",
                    bilingual: "Which planet is known as the Red Planet?\n\nकिस ग्रह को लाल ग्रह के रूप में जाना जाता है?"
                },
                correct_answer: { en: "Mars", hi: "मंगल", bilingual: "Mars / मंगल" },
                incorrect_answers: [
                    { en: "Venus", hi: "शुक्र", bilingual: "Venus / शुक्र" },
                    { en: "Jupiter", hi: "बृहस्पति", bilingual: "Jupiter / बृहस्पति" },
                    { en: "Saturn", hi: "शनि", bilingual: "Saturn / शनि" }
                ]
            },
            {
                question: {
                    en: "Who proposed the Theory of Relativity?",
                    hi: "सापेक्षता का सिद्धांत किसने प्रतिपादित किया था?",
                    bilingual: "Who proposed the Theory of Relativity?\n\nसापेक्षता का सिद्धांत किसने प्रतिपादित किया था?"
                },
                correct_answer: { en: "Albert Einstein", hi: "अल्बर्ट आइंस्टीन", bilingual: "Albert Einstein / अल्बर्ट आइंस्टीन" },
                incorrect_answers: [
                    { en: "Isaac Newton", hi: "आइज़क न्यूटन", bilingual: "Isaac Newton / आइज़क न्यूटन" },
                    { en: "Galileo Galilei", hi: "गैलीलियो गैलीली", bilingual: "Galileo Galilei / गैलीलियो गैलीली" },
                    { en: "Stephen Hawking", hi: "स्टीफन हॉकिंग", bilingual: "Stephen Hawking / स्टीफन हॉकिंग" }
                ]
            },
            {
                question: {
                    en: "What is the primary source of energy for the Earth's ecosystems?",
                    hi: "पृथ्वी के पारिस्थितिकी प्रणालियों के लिए ऊर्जा का प्राथमिक स्रोत क्या है?",
                    bilingual: "What is the primary source of energy for the Earth's ecosystems?\n\nपृथ्वी के पारिस्थितिकी प्रणालियों के लिए ऊर्जा का प्राथमिक स्रोत क्या है?"
                },
                correct_answer: { en: "The Sun", hi: "सूर्य", bilingual: "The Sun / सूर्य" },
                incorrect_answers: [
                    { en: "Geothermal Heat", hi: "भू-तापीय ऊर्जा", bilingual: "Geothermal Heat / भू-तापीय ऊर्जा" },
                    { en: "Wind", hi: "पवन ऊर्जा", bilingual: "Wind / पवन ऊर्जा" },
                    { en: "Fossil Fuels", hi: "जीवाश्म ईंधन", bilingual: "Fossil Fuels / जीवाश्म ईंधन" }
                ]
            },
            {
                question: {
                    en: "Which acid is present in lemon?",
                    hi: "नींबू में कौन सा अम्ल मौजूद होता है?",
                    bilingual: "Which acid is present in lemon?\n\nनींबू में कौन सा अम्ल मौजूद होता है?"
                },
                correct_answer: { en: "Citric Acid", hi: "साइट्रिक अम्ल", bilingual: "Citric Acid / साइट्रिक अम्ल" },
                incorrect_answers: [
                    { en: "Acetic Acid", hi: "एसिटिक अम्ल", bilingual: "Acetic Acid / एसिटिक अम्ल" },
                    { en: "Lactic Acid", hi: "लैक्टिक अम्ल", bilingual: "Lactic Acid / लैक्टिक अम्ल" },
                    { en: "Tartaric Acid", hi: "टार्टरिक अम्ल", bilingual: "Tartaric Acid / टार्टरिक अम्ल" }
                ]
            },
            {
                question: {
                    en: "What is the percentage of nitrogen in Earth's atmosphere?",
                    hi: "पृथ्वी के वायुमंडल में नाइट्रोजन का प्रतिशत कितना है?",
                    bilingual: "What is the percentage of nitrogen in Earth's atmosphere?\n\nपृथ्वी के वायुमंडल में नाइट्रोजन का प्रतिशत कितना है?"
                },
                correct_answer: { en: "78%", hi: "78%", bilingual: "78%" },
                incorrect_answers: [
                    { en: "21%", hi: "21%", bilingual: "21%" },
                    { en: "0.04%", hi: "0.04%", bilingual: "0.04%" },
                    { en: "0.9%", hi: "0.9%", bilingual: "0.9%" }
                ]
            },
            {
                question: {
                    en: "Deficiency of Vitamin A leads to which disease?",
                    hi: "विटामिन ए की कमी से कौन सा रोग होता है?",
                    bilingual: "Deficiency of Vitamin A leads to which disease?\n\nविटामिन ए की कमी से कौन सा रोग होता है?"
                },
                correct_answer: { en: "Night Blindness", hi: "रतौंधी", bilingual: "Night Blindness / रतौंधी" },
                incorrect_answers: [
                    { en: "Scurvy", hi: "स्कर्वी", bilingual: "Scurvy / स्कर्वी" },
                    { en: "Rickets", hi: "सूखा रोग (Rickets)", bilingual: "Rickets / सूखा रोग" },
                    { en: "Beriberi", hi: "बेरीबेरी", bilingual: "Beriberi / बेरीबेरी" }
                ]
            },
            {
                question: {
                    en: "What is the pH level of pure water?",
                    hi: "शुद्ध जल का पीएच (pH) मान कितना होता है?",
                    bilingual: "What is the pH level of pure water?\n\nशुद्ध जल का पीएच (pH) मान कितना होता है?"
                },
                correct_answer: { en: "7", hi: "7", bilingual: "7" },
                incorrect_answers: [
                    { en: "5", hi: "5", bilingual: "5" },
                    { en: "9", hi: "9", bilingual: "9" },
                    { en: "0", hi: "0", bilingual: "0" }
                ]
            },
            {
                question: {
                    en: "Who discovered Penicillin?",
                    hi: "पेनिसिलिन की खोज किसने की थी?",
                    bilingual: "Who discovered Penicillin?\n\nपेनिसिलिन की खोज किसने की थी?"
                },
                correct_answer: { en: "Alexander Fleming", hi: "अलेक्जेंडर फ्लेमिंग", bilingual: "Alexander Fleming / अलेक्जेंडर फ्लेमिंग" },
                incorrect_answers: [
                    { en: "Louis Pasteur", hi: "लुई पाश्चर", bilingual: "Louis Pasteur / लुई पाश्चर" },
                    { en: "Marie Curie", hi: "मैरी क्यूरी", bilingual: "Marie Curie / मैरी क्यूरी" },
                    { en: "Edward Jenner", hi: "एडवर्ड जेनर", bilingual: "Edward Jenner / एडवर्ड जेनर" }
                ]
            }
        ],
        "UPSC": [
            {
                question: {
                    en: "Who was the first President of the Constituent Assembly of India?",
                    hi: "भारत की संविधान सभा के पहले अध्यक्ष कौन थे?",
                    bilingual: "Who was the first President of the Constituent Assembly of India?\n\nभारत की संविधान सभा के पहले अध्यक्ष कौन थे?"
                },
                correct_answer: { en: "Dr. Sachchidananda Sinha", hi: "डॉ सच्चिदानंद सिन्हा", bilingual: "Dr. Sachchidananda Sinha / डॉ सच्चिदानंद सिन्हा" },
                incorrect_answers: [
                    { en: "Dr. Rajendra Prasad", hi: "डॉ राजेन्द्र प्रसाद", bilingual: "Dr. Rajendra Prasad / डॉ राजेन्द्र प्रसाद" },
                    { en: "Dr. B.R. Ambedkar", hi: "डॉ बी.आर. अम्बेडकर", bilingual: "Dr. B.R. Ambedkar / डॉ बी.आर. अम्बेडकर" },
                    { en: "Jawaharlal Nehru", hi: "जवाहरलाल नेहरू", bilingual: "Jawaharlal Nehru / जवाहरलाल नेहरू" }
                ]
            },
            {
                question: {
                    en: "Which Fundamental Right cannot be suspended even during a National Emergency?",
                    hi: "राष्ट्रीय आपातकाल के दौरान भी कौन सा मौलिक अधिकार निलंबित नहीं किया जा सकता?",
                    bilingual: "Which Fundamental Right cannot be suspended even during a National Emergency?\n\nराष्ट्रीय आपातकाल के दौरान भी कौन सा मौलिक अधिकार निलंबित नहीं किया जा सकता?"
                },
                correct_answer: { en: "Right to Life and Personal Liberty", hi: "जीवन और व्यक्तिगत स्वतंत्रता का अधिकार", bilingual: "Right to Life / जीवन और स्वतंत्रता का अधिकार" },
                incorrect_answers: [
                    { en: "Right to Freedom of Speech", hi: "भाषण की स्वतंत्रता का अधिकार", bilingual: "Freedom of Speech / भाषण की स्वतंत्रता" },
                    { en: "Right to Equality", hi: "समानता का अधिकार", bilingual: "Right to Equality / समानता का अधिकार" },
                    { en: "Right to Constitutional Remedies", hi: "संवैधानिक उपचारों का अधिकार", bilingual: "Constitutional Remedies / संवैधानिक उपचार" }
                ]
            },
            {
                question: {
                    en: "The concept of 'Directive Principles of State Policy' in the Indian Constitution is borrowed from which country?",
                    hi: "भारतीय संविधान में 'राज्य के नीति निर्देशक तत्व' की अवधारणा किस देश से ली गई है?",
                    bilingual: "The concept of 'Directive Principles of State Policy' is borrowed from which country?\n\n'राज्य के नीति निर्देशक तत्व' की अवधारणा किस देश से ली गई है?"
                },
                correct_answer: { en: "Ireland", hi: "आयरलैंड", bilingual: "Ireland / आयरलैंड" },
                incorrect_answers: [
                    { en: "USA", hi: "अमेरिका", bilingual: "USA / अमेरिका" },
                    { en: "USSR", hi: "सोवियत संघ", bilingual: "USSR / सोवियत संघ" },
                    { en: "United Kingdom", hi: "ब्रिटेन", bilingual: "United Kingdom / ब्रिटेन" }
                ]
            },
            {
                question: {
                    en: "Who is the ex-officio Chairman of the Rajya Sabha in India?",
                    hi: "भारत में राज्यसभा के पदेन सभापति कौन हैं?",
                    bilingual: "Who is the ex-officio Chairman of the Rajya Sabha in India?\n\nभारत में राज्यसभा के पदेन सभापति कौन हैं?"
                },
                correct_answer: { en: "The Vice-President", hi: "उपराष्ट्रपति", bilingual: "The Vice-President / उपराष्ट्रपति" },
                incorrect_answers: [
                    { en: "The Prime Minister", hi: "प्रधानमंत्री", bilingual: "The Prime Minister / प्रधानमंत्री" },
                    { en: "The Speaker of Lok Sabha", hi: "लोकसभा अध्यक्ष", bilingual: "The Speaker / लोकसभा अध्यक्ष" },
                    { en: "The President", hi: "राष्ट्रपति", bilingual: "The President / राष्ट्रपति" }
                ]
            },
            {
                question: {
                    en: "Which Indian ruler founded the Maurya Empire?",
                    hi: "किस भारतीय शासक ने मौर्य साम्राज्य की स्थापना की थी?",
                    bilingual: "Which Indian ruler founded the Maurya Empire?\n\nकिस भारतीय शासक ने मौर्य साम्राज्य की स्थापना की थी?"
                },
                correct_answer: { en: "Chandragupta Maurya", hi: "चन्द्रगुप्त मौर्य", bilingual: "Chandragupta Maurya / चन्द्रगुप्त मौर्य" },
                incorrect_answers: [
                    { en: "Ashoka the Great", hi: "सम्राट अशोक", bilingual: "Ashoka / सम्राट अशोक" },
                    { en: "Samudragupta", hi: "समुद्रगुप्त", bilingual: "Samudragupta / समुद्रगुप्त" },
                    { en: "Harsha", hi: "हर्षवर्धन", bilingual: "Harsha / हर्षवर्धन" }
                ]
            },
            {
                question: {
                    en: "In which year did the partition of Bengal take place under Lord Curzon?",
                    hi: "लॉर्ड कर्जन के तहत बंगाल का विभाजन किस वर्ष हुआ था?",
                    bilingual: "In which year did the partition of Bengal take place under Lord Curzon?\n\nलॉर्ड कर्जन के तहत बंगाल का विभाजन किस वर्ष हुआ था?"
                },
                correct_answer: { en: "1905", hi: "1905", bilingual: "1905" },
                incorrect_answers: [
                    { en: "1911", hi: "1911", bilingual: "1911" },
                    { en: "1909", hi: "1909", bilingual: "1909" },
                    { en: "1919", hi: "1919", bilingual: "1919" }
                ]
            },
            {
                question: {
                    en: "Who started the Quit India Movement in 1942?",
                    hi: "1942 में भारत छोड़ो आंदोलन किसने शुरू किया था?",
                    bilingual: "Who started the Quit India Movement in 1942?\n\n1942 में भारत छोड़ो आंदोलन किसने शुरू किया था?"
                },
                correct_answer: { en: "Mahatma Gandhi", hi: "महात्मा गांधी", bilingual: "Mahatma Gandhi / महात्मा गांधी" },
                incorrect_answers: [
                    { en: "Subhas Chandra Bose", hi: "सुभाष चंद्र बोस", bilingual: "Subhas Chandra Bose / सुभाष चंद्र बोस" },
                    { en: "Jawaharlal Nehru", hi: "जवाहरलाल नेहरू", bilingual: "Jawaharlal Nehru / जवाहरलाल नेहरू" },
                    { en: "Bhagat Singh", hi: "भगत सिंह", bilingual: "Bhagat Singh / भगत सिंह" }
                ]
            },
            {
                question: {
                    en: "Which schedule of the Indian Constitution contains provisions regarding anti-defection?",
                    hi: "भारतीय संविधान की कौन सी अनुसूची दल-बदल विरोधी प्रावधानों से संबंधित है?",
                    bilingual: "Which schedule contains provisions regarding anti-defection?\n\nसंविधान की कौन सी अनुसूची दल-बदल विरोधी प्रावधानों से संबंधित है?"
                },
                correct_answer: { en: "Tenth Schedule", hi: "दसवीं अनुसूची", bilingual: "Tenth Schedule / दसवीं अनुसूची" },
                incorrect_answers: [
                    { en: "Eighth Schedule", hi: "आठवीं अनुसूची", bilingual: "Eighth Schedule / आठवीं अनुसूची" },
                    { en: "Ninth Schedule", hi: "नौवीं अनुसूची", bilingual: "Ninth Schedule / नौवीं अनुसूची" },
                    { en: "Eleventh Schedule", hi: "ग्यारहवीं अनुसूची", bilingual: "Eleventh Schedule / ग्यारहवीं अनुसूची" }
                ]
            },
            {
                question: {
                    en: "What is the term of a member of the Rajya Sabha?",
                    hi: "राज्यसभा के सदस्य का कार्यकाल कितना होता है?",
                    bilingual: "What is the term of a member of the Rajya Sabha?\n\nराज्यसभा के सदस्य का कार्यकाल कितना होता है?"
                },
                correct_answer: { en: "6 Years", hi: "6 वर्ष", bilingual: "6 Years / 6 वर्ष" },
                incorrect_answers: [
                    { en: "5 Years", hi: "5 वर्ष", bilingual: "5 Years / 5 वर्ष" },
                    { en: "4 Years", hi: "4 वर्ष", bilingual: "4 Years / 4 वर्ष" },
                    { en: "Permanent", hi: "स्थायी (Permanent)", bilingual: "Permanent / स्थायी" }
                ]
            },
            {
                question: {
                    en: "Where is the headquarters of the International Court of Justice located?",
                    hi: "अंतर्राष्ट्रीय न्यायालय का मुख्यालय कहाँ स्थित है?",
                    bilingual: "Where is the headquarters of the International Court of Justice located?\n\nअंतर्राष्ट्रीय न्यायालय का मुख्यालय कहाँ स्थित है?"
                },
                correct_answer: { en: "The Hague", hi: "द हेग", bilingual: "The Hague / द हेग" },
                incorrect_answers: [
                    { en: "Geneva", hi: "जेनेवा", bilingual: "Geneva / जेनेवा" },
                    { en: "New York", hi: "न्यू यॉर्क", bilingual: "New York / न्यू यॉर्क" },
                    { en: "Vienna", hi: "वियना", bilingual: "Vienna / वियना" }
                ]
            }
        ],
        "SSC": [
            {
                question: {
                    en: "Who was the first Governor-General of independent India?",
                    hi: "स्वतंत्र भारत के पहले गवर्नर-जनरल कौन थे?",
                    bilingual: "Who was the first Governor-General of independent India?\n\nस्वतंत्र भारत के पहले गवर्नर-जनरल कौन थे?"
                },
                correct_answer: { en: "Lord Mountbatten", hi: "लॉर्ड माउंटबेटन", bilingual: "Lord Mountbatten / लॉर्ड माउंटबेटन" },
                incorrect_answers: [
                    { en: "C. Rajagopalachari", hi: "सी. राजगोपालाचारी", bilingual: "C. Rajagopalachari / सी. राजगोपालाचारी" },
                    { en: "Dr. Rajendra Prasad", hi: "डॉ राजेन्द्र प्रसाद", bilingual: "Dr. Rajendra Prasad / डॉ राजेन्द्र प्रसाद" },
                    { en: "Warren Hastings", hi: "वारंग हेस्टिंग्स", bilingual: "Warren Hastings" }
                ]
            },
            {
                question: {
                    en: "Which river is known as the 'Sorrow of Bengal'?",
                    hi: "किस नदी को 'बंगाल का शोक' कहा जाता है?",
                    bilingual: "Which river is known as the 'Sorrow of Bengal'?\n\nकिस नदी को 'बंगाल का शोक' कहा जाता है?"
                },
                correct_answer: { en: "Damodar River", hi: "दामोदर नदी", bilingual: "Damodar River / दामोदर नदी" },
                incorrect_answers: [
                    { en: "Kosi River", hi: "कोसी नदी", bilingual: "Kosi River / कोसी नदी" },
                    { en: "Ganges River", hi: "गंगा नदी", bilingual: "Ganges / गंगा नदी" },
                    { en: "Hooghly River", hi: "हुगली नदी", bilingual: "Hooghly / हुगली नदी" }
                ]
            },
            {
                question: {
                    en: "The standard time of India is ahead of Greenwich Mean Time (GMT) by how much?",
                    hi: "भारत का मानक समय ग्रीनविच मीन टाइम (GMT) से कितना आगे है?",
                    bilingual: "The standard time of India is ahead of GMT by how much?\n\nभारत का मानक समय GMT से कितना आगे है?"
                },
                correct_answer: { en: "5 hours 30 minutes", hi: "5 घंटे 30 मिनट", bilingual: "5h 30m / 5 घंटे 30 मिनट" },
                incorrect_answers: [
                    { en: "4 hours 30 minutes", hi: "4 घंटे 30 मिनट", bilingual: "4h 30m / 4 घंटे 30 मिनट" },
                    { en: "6 hours", hi: "6 घंटे", bilingual: "6 hours / 6 घंटे" },
                    { en: "5 hours", hi: "5 घंटे", bilingual: "5 hours / 5 घंटे" }
                ]
            },
            {
                question: {
                    en: "Which of the following is a Kharif crop?",
                    hi: "निम्नलिखित में से कौन सी खरीफ की फसल है?",
                    bilingual: "Which of the following is a Kharif crop?\n\nनिम्नलिखित में से कौन सी खरीफ की फसल है?"
                },
                correct_answer: { en: "Rice", hi: "चावल", bilingual: "Rice / चावल" },
                incorrect_answers: [
                    { en: "Wheat", hi: "गेहूं", bilingual: "Wheat / गेहूं" },
                    { en: "Mustard", hi: "सरसों", bilingual: "Mustard / सरसों" },
                    { en: "Gram", hi: "चना", bilingual: "Gram / चना" }
                ]
            },
            {
                question: {
                    en: "Where is the famous Sun Temple located?",
                    hi: "प्रसिद्ध सूर्य मंदिर कहाँ स्थित है?",
                    bilingual: "Where is the famous Sun Temple located?\n\nप्रसिद्ध सूर्य मंदिर कहाँ स्थित है?"
                },
                correct_answer: { en: "Konark", hi: "कोणार्क", bilingual: "Konark / कोणार्क" },
                incorrect_answers: [
                    { en: "Madurai", hi: "मदुरै", bilingual: "Madurai / मदुरै" },
                    { en: "Khajuraho", hi: "खजुराहो", bilingual: "Khajuraho / खजुराहो" },
                    { en: "Tanjore", hi: "तंजौर", bilingual: "Tanjore / तंजौर" }
                ]
            },
            {
                question: {
                    en: "Who wrote the national song 'Vande Mataram'?",
                    hi: "राष्ट्रीय गीत 'वंदे मातरम' किसने लिखा था?",
                    bilingual: "Who wrote the national song 'Vande Mataram'?\n\nराष्ट्रीय गीत 'वंदे मातरम' किसने लिखा था?"
                },
                correct_answer: { en: "Bankim Chandra Chattopadhyay", hi: "बंकिम चंद्र चट्टोपाध्याय", bilingual: "Bankim Chandra / बंकिम चंद्र" },
                incorrect_answers: [
                    { en: "Rabindranath Tagore", hi: "रवींद्रनाथ टैगोर", bilingual: "Rabindranath / रवींद्रनाथ" },
                    { en: "Sarojini Naidu", hi: "सरोजिनी नायडू", bilingual: "Sarojini Naidu / सरोजिनी नायडू" },
                    { en: "Sri Aurobindo", hi: "श्री अरविन्द", bilingual: "Sri Aurobindo" }
                ]
            },
            {
                question: {
                    en: "Which metal is the best conductor of electricity?",
                    hi: "कौन सी धातु विद्युत की सबसे अच्छी सुचालक है?",
                    bilingual: "Which metal is the best conductor of electricity?\n\nकौन सी धातु विद्युत की सबसे अच्छी सुचालक है?"
                },
                correct_answer: { en: "Silver", hi: "चांदी", bilingual: "Silver / चांदी" },
                incorrect_answers: [
                    { en: "Copper", hi: "तांबा", bilingual: "Copper / तांबा" },
                    { en: "Aluminum", hi: "एल्युमिनियम", bilingual: "Aluminum / एल्युमिनियम" },
                    { en: "Gold", hi: "सोना", bilingual: "Gold / सोना" }
                ]
            },
            {
                question: {
                    en: "What is the SI unit of power?",
                    hi: "शक्ति का एसआई (SI) मात्रक क्या है?",
                    bilingual: "What is the SI unit of power?\n\nशक्ति का एसआई (SI) मात्रक क्या है?"
                },
                correct_answer: { en: "Watt", hi: "वाट", bilingual: "Watt / वाट" },
                incorrect_answers: [
                    { en: "Joule", hi: "जूल", bilingual: "Joule / जूल" },
                    { en: "Newton", hi: "न्यूटन", bilingual: "Newton / न्यूटन" },
                    { en: "Volt", hi: "वोल्ट", bilingual: "Volt / वोल्ट" }
                ]
            },
            {
                question: {
                    en: "Which classical dance originated in Tamil Nadu?",
                    hi: "तमिलनाडु में किस शास्त्रीय नृत्य की उत्पत्ति हुई थी?",
                    bilingual: "Which classical dance originated in Tamil Nadu?\n\nतमिलनाडु में किस शास्त्रीय नृत्य की उत्पत्ति हुई थी?"
                },
                correct_answer: { en: "Bharatanatyam", hi: "भरतनाट्यम", bilingual: "Bharatanatyam / भरतनाट्यम" },
                incorrect_answers: [
                    { en: "Kathak", hi: "कथक", bilingual: "Kathak / कथक" },
                    { en: "Kathakali", hi: "कथकली", bilingual: "Kathakali / कथकली" },
                    { en: "Kuchipudi", hi: "कुचिपुड़ी", bilingual: "Kuchipudi / कुचिपुड़ी" }
                ]
            },
            {
                question: {
                    en: "Which instrument is used to measure atmospheric pressure?",
                    hi: "वायुमंडलीय दबाव मापने के लिए किस उपकरण का उपयोग किया जाता है?",
                    bilingual: "Which instrument is used to measure atmospheric pressure?\n\nवायुमंडलीय दबाव मापने के लिए किस उपकरण का उपयोग किया जाता है?"
                },
                correct_answer: { en: "Barometer", hi: "बैरोमीटर", bilingual: "Barometer / बैरोमीटर" },
                incorrect_answers: [
                    { en: "Thermometer", hi: "थर्मामीटर", bilingual: "Thermometer / थर्मामीटर" },
                    { en: "Hygrometer", hi: "हाइग्रोमीटर", bilingual: "Hygrometer / हाइग्रोमीटर" },
                    { en: "Anemometer", hi: "एनेमोमीटर", bilingual: "एनेमोमीटर" }
                ]
            }
        ],
        "Banking": [
            {
                question: {
                    en: "Which organization regulates the monetary policy in India?",
                    hi: "भारत में मौद्रिक नीति को कौन सा संगठन नियंत्रित करता है?",
                    bilingual: "Which organization regulates the monetary policy in India?\n\nभारत में मौद्रिक नीति को कौन सा संगठन नियंत्रित करता है?"
                },
                correct_answer: { en: "Reserve Bank of India (RBI)", hi: "भारतीय रिजर्व बैंक (RBI)", bilingual: "RBI / भारतीय रिजर्व बैंक" },
                incorrect_answers: [
                    { en: "Ministry of Finance", hi: "वित्त मंत्रालय", bilingual: "Finance Ministry / वित्त मंत्रालय" },
                    { en: "Securities and Exchange Board of India (SEBI)", hi: "सेबी (SEBI)", bilingual: "SEBI" },
                    { en: "State Bank of India (SBI)", hi: "एसबीआई (SBI)", bilingual: "SBI" }
                ]
            },
            {
                question: {
                    en: "What does GDP stand for?",
                    hi: "जीडीपी (GDP) का पूर्ण रूप क्या है?",
                    bilingual: "What does GDP stand for?\n\nजीडीपी (GDP) का पूर्ण रूप क्या है?"
                },
                correct_answer: { en: "Gross Domestic Product", hi: "सकल घरेलू उत्पाद", bilingual: "Gross Domestic Product / सकल घरेलू उत्पाद" },
                incorrect_answers: [
                    { en: "Gross Development Percentage", hi: "सकल विकास प्रतिशत", bilingual: "Gross Dev Percentage" },
                    { en: "General Domestic Product", hi: "सामान्य घरेलू उत्पाद", bilingual: "General Domestic Product" },
                    { en: "Government Debt Portfolio", hi: "सरकारी ऋण पोर्टफोलियो", bilingual: "Government Debt Portfolio" }
                ]
            },
            {
                question: {
                    en: "In banking terminology, what does NPA stand for?",
                    hi: "बैंकिंग शब्दावली में, एनपीए (NPA) का क्या अर्थ है?",
                    bilingual: "In banking terminology, what does NPA stand for?\n\nबैंकिंग शब्दावली में, एनपीए (NPA) का क्या अर्थ है?"
                },
                correct_answer: { en: "Non-Performing Asset", hi: "गैर-निष्पादित परिसंपत्ति", bilingual: "Non-Performing Asset / गैर-निष्पादित परिसंपत्ति" },
                incorrect_answers: [
                    { en: "Net Profit Account", hi: "शुद्ध लाभ खाता", bilingual: "Net Profit Account" },
                    { en: "National Pension Association", hi: "राष्ट्रीय पेंशन एसोसिएशन", bilingual: "National Pension Association" },
                    { en: "New Portfolio Allocation", hi: "नया पोर्टफोलियो आवंटन", bilingual: "New Portfolio Allocation" }
                ]
            },
            {
                question: {
                    en: "Which bank is the largest public sector bank in India?",
                    hi: "भारत का सबसे बड़ा सार्वजनिक क्षेत्र का बैंक कौन सा है?",
                    bilingual: "Which bank is the largest public sector bank in India?\n\nभारत का सबसे बड़ा सार्वजनिक क्षेत्र का बैंक कौन सा है?"
                },
                correct_answer: { en: "State Bank of India", hi: "भारतीय स्टेट बैंक (SBI)", bilingual: "State Bank of India / भारतीय स्टेट बैंक" },
                incorrect_answers: [
                    { en: "Punjab National Bank", hi: "पंजाब नेशनल बैंक (PNB)", bilingual: "PNB" },
                    { en: "Bank of Baroda", hi: "बैंक ऑफ बड़ौदा (BOB)", bilingual: "BOB" },
                    { en: "Canara Bank", hi: "केनरा बैंक", bilingual: "Canara Bank" }
                ]
            },
            {
                question: {
                    en: "What is the term for the rate at which the RBI lends money to commercial banks in the short term?",
                    hi: "वह दर क्या कहलाती है जिस पर RBI वाणिज्यिक बैंकों को अल्पकालिक ऋण देता है?",
                    bilingual: "What is the rate at which RBI lends money to commercial banks?\n\nवह दर क्या कहलाती है जिस पर RBI वाणिज्यिक बैंकों को अल्पकालिक ऋण देता है?"
                },
                correct_answer: { en: "Repo Rate", hi: "रेपो दर (Repo Rate)", bilingual: "Repo Rate / रेपो दर" },
                incorrect_answers: [
                    { en: "Reverse Repo Rate", hi: "रिवर्स रेपो दर", bilingual: "Reverse Repo Rate" },
                    { en: "Bank Rate", hi: "बैंक दर", bilingual: "Bank Rate / बैंक दर" },
                    { en: "CRR", hi: "सीआरआर (CRR)", bilingual: "CRR" }
                ]
            },
            {
                question: {
                    en: "Which of the following is NOT a regulatory body in India?",
                    hi: "निम्नलिखित में से कौन सा भारत में नियामक निकाय नहीं है?",
                    bilingual: "Which of the following is NOT a regulatory body in India?\n\nनिम्नलिखित में से कौन सा भारत में नियामक निकाय नहीं है?"
                },
                correct_answer: { en: "AMFI", hi: "एम्फी (AMFI)", bilingual: "AMFI" },
                incorrect_answers: [
                    { en: "SEBI", hi: "सेबी (SEBI)", bilingual: "SEBI" },
                    { en: "RBI", hi: "आरबीआई (RBI)", bilingual: "RBI" },
                    { en: "IRDAI", hi: "इरडा (IRDAI)", bilingual: "IRDAI" }
                ]
            },
            {
                question: {
                    en: "Where is the headquarters of the World Bank located?",
                    hi: "विश्व बैंक का मुख्यालय कहाँ स्थित है?",
                    bilingual: "Where is the headquarters of the World Bank located?\n\nविश्व बैंक का मुख्यालय कहाँ स्थित है?"
                },
                correct_answer: { en: "Washington, D.C.", hi: "वाशिंगटन डी.सी.", bilingual: "Washington, D.C. / वाशिंगटन डी.सी." },
                incorrect_answers: [
                    { en: "New York", hi: "न्यू यॉर्क", bilingual: "New York / न्यू यॉर्क" },
                    { en: "Geneva", hi: "जेनेवा", bilingual: "Geneva / जेनेवा" },
                    { en: "London", hi: "लंदन", bilingual: "London / लंदन" }
                ]
            },
            {
                question: {
                    en: "What is inflation?",
                    hi: "मुद्रास्फीति (Inflation) क्या है?",
                    bilingual: "What is inflation?\n\nमुद्रास्फीति (Inflation) क्या है?"
                },
                correct_answer: { en: "A general increase in prices and fall in the purchasing value of money", hi: "कीमतों में सामान्य वृद्धि और मुद्रा के क्रय मूल्य में गिरावट", bilingual: "Price rise & fall in money value / कीमतों में वृद्धि" },
                incorrect_answers: [
                    { en: "A decrease in unemployment rates", hi: "बेरोजगारी दरों में कमी", bilingual: "Decrease in unemployment" },
                    { en: "An increase in currency exchange rates", hi: "मुद्रा विनिमय दरों में वृद्धि", bilingual: "Increase in exchange rates" },
                    { en: "A rise in stock market indices", hi: "शेयर बाजार के सूचकांकों में वृद्धि", bilingual: "Rise in stock market" }
                ]
            },
            {
                question: {
                    en: "What is the primary function of commercial banks?",
                    hi: "वाणिज्यिक बैंकों का प्राथमिक कार्य क्या है?",
                    bilingual: "What is the primary function of commercial banks?\n\nवाणिज्यिक बैंकों का प्राथमिक कार्य क्या है?"
                },
                correct_answer: { en: "Accepting deposits and lending money", hi: "जमा स्वीकार करना और ऋण देना", bilingual: "Accepting deposits & lending / जमा स्वीकार करना व ऋण देना" },
                incorrect_answers: [
                    { en: "Printing currency notes", hi: "मुद्रा नोट छापना", bilingual: "Printing currency" },
                    { en: "Formulating foreign trade policy", hi: "विदेशी व्यापार नीति तैयार करना", bilingual: "Formulating trade policy" },
                    { en: "Regulating stock exchanges", hi: "शेयर बाजारों का नियमन करना", bilingual: "Regulating stock markets" }
                ]
            },
            {
                question: {
                    en: "Which card allows users to buy goods or services on credit up to a pre-approved limit?",
                    hi: "कौन सा कार्ड उपयोगकर्ताओं को पूर्व-अनुमोदित सीमा तक क्रेडिट पर सामान या सेवाएं खरीदने की अनुमति देता है?",
                    bilingual: "Which card allows users to buy goods on credit?\n\nकौन सा कार्ड पूर्व-अनुमोदित सीमा तक क्रेडिट पर सामान खरीदने की अनुमति देता है?"
                },
                correct_answer: { en: "Credit Card", hi: "क्रेडिट कार्ड", bilingual: "Credit Card / क्रेडिट कार्ड" },
                incorrect_answers: [
                    { en: "Debit Card", hi: "डेबिट कार्ड", bilingual: "Debit Card / डेबिट कार्ड" },
                    { en: "ATM Card", hi: "एटीएम कार्ड", bilingual: "ATM Card / एटीएम कार्ड" },
                    { en: "Smart Card", hi: "स्मार्ट कार्ड", bilingual: "Smart Card / स्मार्ट कार्ड" }
                ]
            }
        ],
        "Railway": [
            {
                question: {
                    en: "In which year did the first passenger train run in India?",
                    hi: "भारत में पहली यात्री ट्रेन किस वर्ष चली थी?",
                    bilingual: "In which year did the first passenger train run in India?\n\nभारत में पहली यात्री ट्रेन किस वर्ष चली थी?"
                },
                correct_answer: { en: "1853", hi: "1853", bilingual: "1853" },
                incorrect_answers: [
                    { en: "1848", hi: "1848", bilingual: "1848" },
                    { en: "1857", hi: "1857", bilingual: "1857" },
                    { en: "1862", hi: "1862", bilingual: "1862" }
                ]
            },
            {
                question: {
                    en: "Between which two stations did the first train run in India?",
                    hi: "भारत में पहली ट्रेन किन दो स्टेशनों के बीच चली थी?",
                    bilingual: "Between which two stations did the first train run in India?\n\nभारत में पहली ट्रेन किन दो स्टेशनों के बीच चली थी?"
                },
                correct_answer: { en: "Bombay and Thane", hi: "बॉम्बे और ठाणे", bilingual: "Bombay and Thane / बॉम्बे और ठाणे" },
                incorrect_answers: [
                    { en: "Howrah and Hooghly", hi: "हावड़ा और हुगली", bilingual: "Howrah and Hooghly / हावड़ा और हुगली" },
                    { en: "Delhi and Meerut", hi: "दिल्ली और मेरठ", bilingual: "Delhi and Meerut / दिल्ली और मेरठ" },
                    { en: "Madras and Arkonam", hi: "मद्रास और अरकोणम", bilingual: "Madras and Arkonam" }
                ]
            },
            {
                question: {
                    en: "Who was the Governor-General of India when railways were first introduced?",
                    hi: "जब रेलवे पहली बार शुरू किया गया था तब भारत के गवर्नर-जनरल कौन थे?",
                    bilingual: "Who was the Governor-General of India when railways were introduced?\n\nजब रेलवे पहली बार शुरू किया गया था तब भारत के गवर्नर-जनरल कौन थे?"
                },
                correct_answer: { en: "Lord Dalhousie", hi: "लॉर्ड डलहौजी", bilingual: "Lord Dalhousie / लॉर्ड डलहौजी" },
                incorrect_answers: [
                    { en: "Lord Canning", hi: "लॉर्ड कैनिंग", bilingual: "Lord Canning / लॉर्ड कैनिंग" },
                    { en: "Lord Bentinck", hi: "लॉर्ड बेंटिक", bilingual: "Lord Bentinck" },
                    { en: "Lord Curzon", hi: "लॉर्ड कर्जन", bilingual: "Lord Curzon" }
                ]
            },
            {
                question: {
                    en: "Where is the headquarters of Indian Railways located?",
                    hi: "भारतीय रेलवे का मुख्यालय कहाँ स्थित है?",
                    bilingual: "Where is the headquarters of Indian Railways located?\n\nभारतीय रेलवे का मुख्यालय कहाँ स्थित है?"
                },
                correct_answer: { en: "New Delhi", hi: "नई दिल्ली", bilingual: "New Delhi / नई दिल्ली" },
                incorrect_answers: [
                    { en: "Mumbai", hi: "मुंबई", bilingual: "Mumbai / मुंबई" },
                    { en: "Kolkata", hi: "कोलकाता", bilingual: "Kolkata / कोलकाता" },
                    { en: "Chennai", hi: "चेन्नई", bilingual: "Chennai / चेन्नई" }
                ]
            },
            {
                question: {
                    en: "Which is the longest railway platform in the world?",
                    hi: "विश्व का सबसे लंबा रेलवे प्लेटफॉर्म कौन सा है?",
                    bilingual: "Which is the longest railway platform in the world?\n\nविश्व का सबसे लंबा रेलवे प्लेटफॉर्म कौन सा है?"
                },
                correct_answer: { en: "Hubballi Junction (India)", hi: "हुबली जंक्शन (भारत)", bilingual: "Hubballi Junction / हुबली जंक्शन" },
                incorrect_answers: [
                    { en: "Gorakhpur (India)", hi: "गोरखपुर (भारत)", bilingual: "Gorakhpur / गोरखपुर" },
                    { en: "Kharagpur (India)", hi: "खड़गपुर (भारत)", bilingual: "Kharagpur / खड़गपुर" },
                    { en: "Grand Central Terminal (USA)", hi: "ग्रैंड सेंट्रल टर्मिनल (USA)", bilingual: "Grand Central" }
                ]
            },
            {
                question: {
                    en: "Which engine was used in the first train of India?",
                    hi: "भारत की पहली ट्रेन में किस इंजन का उपयोग किया गया था?",
                    bilingual: "Which engine was used in the first train of India?\n\nभारत की पहली ट्रेन में किस इंजन का उपयोग किया गया था?"
                },
                correct_answer: { en: "Steam Engine", hi: "भाप इंजन (Steam)", bilingual: "Steam Engine / भाप इंजन" },
                incorrect_answers: [
                    { en: "Diesel Engine", hi: "डीजल इंजन", bilingual: "Diesel Engine / डीजल इंजन" },
                    { en: "Electric Engine", hi: "इलेक्ट्रिक इंजन", bilingual: "Electric Engine / इलेक्ट्रिक इंजन" },
                    { en: "Solar Engine", hi: "सौर इंजन", bilingual: "Solar Engine" }
                ]
            },
            {
                question: {
                    en: "How many zones are there in Indian Railways?",
                    hi: "भारतीय रेलवे में कितने जोन हैं?",
                    bilingual: "How many zones are there in Indian Railways?\n\nभारतीय रेलवे में कितने जोन हैं?"
                },
                correct_answer: { en: "19 Zones", hi: "19 जोन", bilingual: "19 Zones / 19 जोन" },
                incorrect_answers: [
                    { en: "17 Zones", hi: "17 जोन", bilingual: "17 Zones / 17 जोन" },
                    { en: "15 Zones", hi: "15 जोन", bilingual: "15 Zones" },
                    { en: "12 Zones", hi: "12 जोन", bilingual: "12 Zones" }
                ]
            },
            {
                question: {
                    en: "Which train is known as the fastest train in India currently?",
                    hi: "वर्तमान में भारत की सबसे तेज ट्रेन के रूप में किस ट्रेन को जाना जाता है?",
                    bilingual: "Which train is known as the fastest train in India currently?\n\nवर्तमान में भारत की सबसे तेज ट्रेन के रूप में किस ट्रेन को जाना जाता है?"
                },
                correct_answer: { en: "Vande Bharat Express", hi: "वंदे भारत एक्सप्रेस", bilingual: "Vande Bharat / वंदे भारत एक्सप्रेस" },
                incorrect_answers: [
                    { en: "Gatimaan Express", hi: "गतिमान एक्सप्रेस", bilingual: "Gatimaan Express / गतिमान एक्सप्रेस" },
                    { en: "Shatabdi Express", hi: "शताब्दी एक्सप्रेस", bilingual: "Shatabdi Express / शताब्दी एक्सप्रेस" },
                    { en: "Rajdhani Express", hi: "राजधानी एक्सप्रेस", bilingual: "Rajdhani Express / राजधानी एक्सप्रेस" }
                ]
            },
            {
                question: {
                    en: "What is the track gauge of Broad Gauge in Indian Railways?",
                    hi: "भारतीय रेलवे में ब्रॉड गेज (Broad Gauge) की चौड़ाई कितनी होती है?",
                    bilingual: "What is the track gauge of Broad Gauge in Indian Railways?\n\nभारतीय रेलवे में ब्रॉड गेज की चौड़ाई कितनी होती है?"
                },
                correct_answer: { en: "1.676 meters", hi: "1.676 मीटर", bilingual: "1.676 meters / मीटर" },
                incorrect_answers: [
                    { en: "1.000 meter", hi: "1.000 मीटर", bilingual: "1.000 meter / मीटर" },
                    { en: "0.762 meter", hi: "0.762 मीटर", bilingual: "0.762 meter / मीटर" },
                    { en: "1.435 meters", hi: "1.435 मीटर", bilingual: "1.435 meters" }
                ]
            },
            {
                question: {
                    en: "Which station is the highest railway station in India?",
                    hi: "भारत का सबसे ऊँचा रेलवे स्टेशन कौन सा है?",
                    bilingual: "Which station is the highest railway station in India?\n\nभारत का सबसे ऊँचा रेलवे स्टेशन कौन सा है?"
                },
                correct_answer: { en: "Ghoom", hi: "घूम", bilingual: "Ghoom / घूम" },
                incorrect_answers: [
                    { en: "Shimla", hi: "शिमला", bilingual: "Shimla / शिमला" },
                    { en: "Ooty", hi: "ऊटी", bilingual: "Ooty / ऊटी" },
                    { en: "Darjeeling", hi: "दार्जिलिंग", bilingual: "Darjeeling / दार्जिलिंग" }
                ]
            }
        ],
        "State PCS": [
            {
                question: {
                    en: "Under which Article of the Constitution can a Governor recommend President's Rule in a state?",
                    hi: "संविधान के किस अनुच्छेद के तहत राज्यपाल राज्य में राष्ट्रपति शासन की सिफारिश कर सकता है?",
                    bilingual: "Under which Article can a Governor recommend President's Rule?\n\nसंविधान के किस अनुच्छेद के तहत राज्यपाल राज्य में राष्ट्रपति शासन की सिफारिश कर सकता है?"
                },
                correct_answer: { en: "Article 356", hi: "अनुच्छेद 356", bilingual: "Article 356 / अनुच्छेद 356" },
                incorrect_answers: [
                    { en: "Article 352", hi: "अनुच्छेद 352", bilingual: "Article 352" },
                    { en: "Article 360", hi: "अनुच्छेद 360", bilingual: "Article 360" },
                    { en: "Article 370", hi: "अनुच्छेद 370", bilingual: "Article 370" }
                ]
            },
            {
                question: {
                    en: "Who is the executive head of a State Government in India?",
                    hi: "भारत में राज्य सरकार का कार्यकारी प्रमुख कौन होता है?",
                    bilingual: "Who is the executive head of a State Government in India?\n\nभारत में राज्य सरकार का कार्यकारी प्रमुख कौन होता है?"
                },
                correct_answer: { en: "The Governor", hi: "राज्यपाल", bilingual: "The Governor / राज्यपाल" },
                incorrect_answers: [
                    { en: "The Chief Minister", hi: "मुख्यमंत्री", bilingual: "Chief Minister / मुख्यमंत्री" },
                    { en: "The Speaker of Assembly", hi: "विधानसभा अध्यक्ष", bilingual: "Assembly Speaker / विधानसभा अध्यक्ष" },
                    { en: "The Chief Justice of High Court", hi: "उच्च न्यायालय के मुख्य न्यायाधीश", bilingual: "Chief Justice / मुख्य न्यायाधीश" }
                ]
            },
            {
                question: {
                    en: "What is the minimum age required to become a member of the State Legislative Council (MLC)?",
                    hi: "राज्य विधान परिषद (MLC) का सदस्य बनने के लिए न्यूनतम आयु कितनी है?",
                    bilingual: "What is the minimum age required to become an MLC?\n\nराज्य विधान परिषद का सदस्य बनने के लिए न्यूनतम आयु कितनी है?"
                },
                correct_answer: { en: "30 Years", hi: "30 वर्ष", bilingual: "30 Years / 30 वर्ष" },
                incorrect_answers: [
                    { en: "25 Years", hi: "25 वर्ष", bilingual: "25 Years / 25 वर्ष" },
                    { en: "35 Years", hi: "35 वर्ष", bilingual: "35 Years / 35 वर्ष" },
                    { en: "21 Years", hi: "21 वर्ष", bilingual: "21 Years" }
                ]
            },
            {
                question: {
                    en: "Which body conducts exams for appointments to state services?",
                    hi: "राज्य सेवाओं में नियुक्तियों के लिए परीक्षा कौन सी संस्था आयोजित करती है?",
                    bilingual: "Which body conducts exams for appointments to state services?\n\nराज्य सेवाओं में नियुक्तियों के लिए परीक्षा कौन सी संस्था आयोजित करती है?"
                },
                correct_answer: { en: "State Public Service Commission", hi: "राज्य लोक सेवा आयोग (SPSC)", bilingual: "State PSC / राज्य लोक सेवा आयोग" },
                incorrect_answers: [
                    { en: "UPSC", hi: "संघ लोक सेवा आयोग (UPSC)", bilingual: "UPSC" },
                    { en: "Staff Selection Commission", hi: "कर्मचारी चयन आयोग (SSC)", bilingual: "SSC" },
                    { en: "State Government Secretariat", hi: "राज्य सरकार सचिवालय", bilingual: "State Secretariat" }
                ]
            },
            {
                question: {
                    en: "The Panchayati Raj system was first introduced in which Indian state?",
                    hi: "पंचायती राज व्यवस्था सबसे पहले किस भारतीय राज्य में शुरू की गई थी?",
                    bilingual: "The Panchayati Raj system was first introduced in which state?\n\nपंचायती राज व्यवस्था सबसे पहले किस भारतीय राज्य में शुरू की गई थी?"
                },
                correct_answer: { en: "Rajasthan", hi: "राजस्थान", bilingual: "Rajasthan / राजस्थान" },
                incorrect_answers: [
                    { en: "Andhra Pradesh", hi: "आंध्र प्रदेश", bilingual: "Andhra Pradesh / आंध्र प्रदेश" },
                    { en: "Uttar Pradesh", hi: "उत्तर प्रदेश", bilingual: "Uttar Pradesh / उत्तर प्रदेश" },
                    { en: "Gujarat", hi: "गुजरात", bilingual: "Gujarat / गुजरात" }
                ]
            },
            {
                question: {
                    en: "Who appoints the Chief Minister of a state in India?",
                    hi: "भारत में किसी राज्य के मुख्यमंत्री की नियुक्ति कौन करता है?",
                    bilingual: "Who appoints the Chief Minister of a state in India?\n\nभारत में किसी राज्य के मुख्यमंत्री की नियुक्ति कौन करता है?"
                },
                correct_answer: { en: "The Governor", hi: "राज्यपाल", bilingual: "The Governor / राज्यपाल" },
                incorrect_answers: [
                    { en: "The President", hi: "राष्ट्रपति", bilingual: "The President / राष्ट्रपति" },
                    { en: "The Chief Justice of India", hi: "भारत के मुख्य न्यायाधीश", bilingual: "Chief Justice of India" },
                    { en: "The Prime Minister", hi: "प्रधानमंत्री", bilingual: "Prime Minister / प्रधानमंत्री" }
                ]
            },
            {
                question: {
                    en: "What is the maximum strength of a State Legislative Assembly (Vidhan Sabha) as per the Constitution?",
                    hi: "संविधान के अनुसार राज्य विधानसभा (Vidhan Sabha) की अधिकतम सदस्य संख्या कितनी हो सकती है?",
                    bilingual: "What is the constitutional max strength of Vidhan Sabha?\n\nसंविधान के अनुसार विधानसभा की अधिकतम सदस्य संख्या कितनी हो सकती है?"
                },
                correct_answer: { en: "500 members", hi: "500 सदस्य", bilingual: "500 members / 500 सदस्य" },
                incorrect_answers: [
                    { en: "400 members", hi: "400 सदस्य", bilingual: "400 members / 400 सदस्य" },
                    { en: "250 members", hi: "250 सदस्य", bilingual: "250 members / 250 सदस्य" },
                    { en: "300 members", hi: "300 सदस्य", bilingual: "300 members" }
                ]
            },
            {
                question: {
                    en: "Which state High Court has the largest jurisdiction in terms of number of states?",
                    hi: "राज्यों की संख्या के मामले में किस राज्य के उच्च न्यायालय का क्षेत्राधिकार सबसे बड़ा है?",
                    bilingual: "Which High Court has the largest jurisdiction in terms of number of states?\n\nराज्यों की संख्या के मामले में किस उच्च न्यायालय का क्षेत्राधिकार सबसे बड़ा है?"
                },
                correct_answer: { en: "Guwahati High Court", hi: "गुवाहाटी उच्च न्यायालय", bilingual: "Guwahati High Court / गुवाहाटी उच्च न्यायालय" },
                incorrect_answers: [
                    { en: "Bombay High Court", hi: "बम्बई उच्च न्यायालय", bilingual: "Bombay High Court / बम्बई उच्च न्यायालय" },
                    { en: "Calcutta High Court", hi: "कलकत्ता उच्च न्यायालय", bilingual: "Calcutta High Court" },
                    { en: "Madras High Court", hi: "मद्रास उच्च न्यायालय", bilingual: "Madras High Court" }
                ]
            },
            {
                question: {
                    en: "The power to create or abolish Legislative Councils in states rests with whom?",
                    hi: "राज्यों में विधान परिषदों को बनाने या समाप्त करने की शक्ति किसके पास है?",
                    bilingual: "The power to create or abolish Legislative Councils rests with whom?\n\nराज्यों में विधान परिषदों को बनाने या समाप्त करने की शक्ति किसके पास है?"
                },
                correct_answer: { en: "Parliament of India", hi: "भारत की संसद", bilingual: "Parliament / भारत की संसद" },
                incorrect_answers: [
                    { en: "The President", hi: "राष्ट्रपति", bilingual: "The President / राष्ट्रपति" },
                    { en: "State Legislative Assembly", hi: "राज्य विधानसभा", bilingual: "State Assembly / राज्य विधानसभा" },
                    { en: "Governor of the State", hi: "राज्य के राज्यपाल", bilingual: "Governor / राज्यपाल" }
                ]
            },
            {
                question: {
                    en: "Who is the first law officer of a State in India?",
                    hi: "भारत में किसी राज्य का प्रथम विधि अधिकारी कौन होता है?",
                    bilingual: "Who is the first law officer of a State in India?\n\nभारत में किसी राज्य का प्रथम विधि अधिकारी कौन होता है?"
                },
                correct_answer: { en: "The Advocate General", hi: "महाधिवक्ता (Advocate General)", bilingual: "Advocate General / महाधिवक्ता" },
                incorrect_answers: [
                    { en: "The Attorney General", hi: "महान्यायावादी (Attorney General)", bilingual: "Attorney General" },
                    { en: "The Solicitor General", hi: "सॉलिसिटर जनरल", bilingual: "Solicitor General" },
                    { en: "The Chief Justice of State High Court", hi: "राज्य उच्च न्यायालय के मुख्य न्यायाधीश", bilingual: "Chief Justice / मुख्य न्यायाधीश" }
                ]
            }
        ]
    };

    // Quiz DOM Elements
    const viewCategories = document.getElementById('view-quiz-categories');
    const viewLanguage = document.getElementById('view-quiz-language');
    const viewLoading = document.getElementById('view-quiz-loading');
    const viewError = document.getElementById('view-quiz-error');
    const viewPlayer = document.getElementById('view-quiz-player');
    const viewResult = document.getElementById('view-quiz-result');

    const statsAttempted = document.getElementById('stats-attempted');
    const statsAccuracy = document.getElementById('stats-accuracy');
    const statsBest = document.getElementById('stats-best');
    const statsLatest = document.getElementById('stats-latest');
    const statsChartFill = document.getElementById('stats-chart-fill');
    const statsChartText = document.getElementById('stats-chart-text');
    const leaderboardList = document.getElementById('leaderboard-list');
    const quizHistoryList = document.getElementById('quiz-history-list');
    const btnClearHistory = document.getElementById('btn-clear-history');

    // Language Screen Handles
    const langOptionCards = document.querySelectorAll('.lang-option-card');
    const langValidationMsg = document.getElementById('lang-validation-msg');
    const langValidationText = document.getElementById('lang-validation-text');
    const btnLangBack = document.getElementById('btn-lang-back');
    const btnLangContinue = document.getElementById('btn-lang-continue');
    const langPanelTitle = document.getElementById('lang-panel-title');
    const langPanelDesc = document.getElementById('lang-panel-desc');

    const hudCategory = document.getElementById('hud-category');
    const hudProgress = document.getElementById('hud-progress');
    const hudTimerTime = document.getElementById('hud-timer-time');
    const hudTimer = document.getElementById('hud-timer');
    const hudProgressFill = document.getElementById('hud-progress-fill');
    const playerQuestionText = document.getElementById('player-question-text');
    const playerOptionsContainer = document.getElementById('player-options-container');

    const btnPlayerPrev = document.getElementById('btn-player-prev');
    const btnPlayerNext = document.getElementById('btn-player-next');
    const btnPlayerSubmit = document.getElementById('btn-player-submit');
    const btnPlayerQuit = document.getElementById('btn-player-quit');

    const resultBadge = document.getElementById('result-badge');
    const resultGradeTitle = document.getElementById('result-grade-title');
    const resultFeedbackDesc = document.getElementById('result-feedback-desc');
    const resultScoreRatio = document.getElementById('result-score-ratio');
    const resultScorePercent = document.getElementById('result-score-percent');

    const resValTotal = document.getElementById('res-val-total');
    const resValCorrect = document.getElementById('res-val-correct');
    const resValWrong = document.getElementById('res-val-wrong');
    const resValUnattempted = document.getElementById('res-val-unattempted');
    const resValTime = document.getElementById('res-val-time');
    const resValAccuracy = document.getElementById('res-val-accuracy');

    const btnResultAnother = document.getElementById('btn-result-another');
    const btnResultHome = document.getElementById('btn-result-home');
    const btnQuizRetry = document.getElementById('btn-quiz-retry');
    const btnQuizFallback = document.getElementById('btn-quiz-fallback');
    const btnQuizBackError = document.getElementById('btn-quiz-back-error');

    // Quiz State
    let quizState = {
        categoryName: "",
        categoryId: null,
        selectedLanguage: null, // "en", "hi", "bilingual"
        questions: [],
        currentIndex: 0,
        userAnswers: [],
        timerSeconds: 600,
        timerIntervalId: null,
        quizType: "online",
        timeTakenSeconds: 0
    };

    // Helper: Get localized UI string
    function getLoc(key) {
        const lang = quizState.selectedLanguage || 'en';
        return localization[lang][key] || localization['en'][key] || '';
    }

    // Helper: Decode HTML Entities
    function decodeHtml(html) {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    // Helper: Shuffle Array
    function shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]
            ];
        }
        return array;
    }

    // Circular Chart fill logic
    function updateCircularChart(percent) {
        if (statsChartFill) {
            statsChartFill.style.strokeDasharray = `${percent}, 100`;
        }
        if (statsChartText) {
            statsChartText.textContent = `${percent}%`;
        }
    }

    // Render Previous Attempts List
    function renderHistory(history) {
        if (!quizHistoryList) return;
        
        if (!history || history.length === 0) {
            quizHistoryList.innerHTML = '<p class="no-history-msg">No quizzes attempted yet.</p>';
            if (btnClearHistory) btnClearHistory.classList.add('hidden');
            return;
        }

        if (btnClearHistory) btnClearHistory.classList.remove('hidden');
        let html = '';
        for (let i = history.length - 1; i >= 0; i--) {
            const item = history[i];
            const langLabel = item.language ? ` • ${item.language}` : '';
            html += `
                <div class="history-item-row">
                    <div class="history-item-top">
                        <span>${item.category}</span>
                        <span class="gold-text">${item.correct}/${item.total}</span>
                    </div>
                    <div class="history-item-bottom">
                        <span>${item.date}${langLabel}</span>
                        <span>Acc: ${item.accuracy}%</span>
                    </div>
                </div>
            `;
        }
        quizHistoryList.innerHTML = html;
    }

    // Calculate Dashboard metrics and render
    function initQuizDashboard() {
        if (!statsAttempted) return;
        
        const history = JSON.parse(localStorage.getItem('gyan_quiz_history') || '[]');
        const total = history.length;
        statsAttempted.textContent = total;

        if (total === 0) {
            statsAccuracy.textContent = '0%';
            statsBest.textContent = '0/10';
            statsLatest.textContent = '-';
            updateCircularChart(0);
            renderHistory(history);
            return;
        }

        let totalCorrect = 0;
        let totalQuestionsAttempted = 0;
        let maxCorrect = 0;
        let latestScore = '-';

        history.forEach((attempt, index) => {
            totalCorrect += attempt.correct;
            totalQuestionsAttempted += attempt.total;
            if (attempt.correct > maxCorrect) {
                maxCorrect = attempt.correct;
            }
            if (index === history.length - 1) {
                latestScore = `${attempt.correct}/${attempt.total}`;
            }
        });

        const avgAccuracy = totalQuestionsAttempted > 0 ? Math.round((totalCorrect / totalQuestionsAttempted) * 100) : 0;
        statsAccuracy.textContent = `${avgAccuracy}%`;
        statsBest.textContent = `${maxCorrect}/10`;
        statsLatest.textContent = latestScore;

        updateCircularChart(avgAccuracy);
        renderHistory(history);
    }

    // Render leaderboard entries (incorporating user score dynamically)
    function updateLeaderboard(userName) {
        if (!leaderboardList) return;
        
        const history = JSON.parse(localStorage.getItem('gyan_quiz_history') || '[]');
        
        let bestCorrect = 0;
        let bestAccuracy = 0;
        
        history.forEach(item => {
            if (item.correct > bestCorrect) {
                bestCorrect = item.correct;
                bestAccuracy = item.accuracy;
            } else if (item.correct === bestCorrect && item.accuracy > bestAccuracy) {
                bestAccuracy = item.accuracy;
            }
        });
        
        const defaults = [
            { name: "Rohan Sharma", score: 10, accuracy: 100 },
            { name: "Sneha Patel", score: 9, accuracy: 90 },
            { name: "Amit Singh", score: 9, accuracy: 90 },
            { name: "Priya Verma", score: 8, accuracy: 80 }
        ];
        
        let entries = [...defaults];
        if (history.length > 0) {
            entries.push({ name: userName || "You", score: bestCorrect, accuracy: bestAccuracy, isUser: true });
        }
        
        entries.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return b.accuracy - a.accuracy;
        });
        
        let html = '';
        entries.slice(0, 5).forEach((entry, idx) => {
            const rankNum = idx + 1;
            let rankClass = '';
            let crown = '';
            if (rankNum === 1) { rankClass = 'first-rank'; crown = '<i class="fa-solid fa-crown"></i> '; }
            else if (rankNum === 2) { rankClass = 'second-rank'; }
            else if (rankNum === 3) { rankClass = 'third-rank'; }
            
            const userHighlight = entry.isUser ? 'style="border: 1px solid var(--accent-gold); background-color: rgba(212,175,55,0.06);"' : '';
            const displayName = entry.isUser ? `<strong class="gold-text">${entry.name}</strong>` : entry.name;
            
            html += `
                <div class="leaderboard-row ${rankClass}" ${userHighlight}>
                    <span class="lead-rank">${crown}${rankNum}</span>
                    <span class="lead-name">${displayName}</span>
                    <span class="lead-score">${entry.score}/10</span>
                </div>
            `;
        });
        
        leaderboardList.innerHTML = html;
    }

    // Switch view panel screens
    function switchScreen(screenName) {
        if (!viewCategories) return;
        
        viewCategories.classList.add('hidden');
        viewCategories.style.display = 'none';
        viewLanguage.classList.add('hidden');
        viewLanguage.style.display = 'none';
        viewLoading.classList.add('hidden');
        viewLoading.style.display = 'none';
        viewError.classList.add('hidden');
        viewError.style.display = 'none';
        viewPlayer.classList.add('hidden');
        viewPlayer.style.display = 'none';
        viewResult.classList.add('hidden');
        viewResult.style.display = 'none';

        if (screenName === 'categories') {
            viewCategories.classList.remove('hidden');
            viewCategories.style.display = 'block';
        } else if (screenName === 'language') {
            viewLanguage.classList.remove('hidden');
            viewLanguage.style.display = 'block';
        } else if (screenName === 'loading') {
            viewLoading.classList.remove('hidden');
            viewLoading.style.display = 'flex';
        } else if (screenName === 'error') {
            viewError.classList.remove('hidden');
            viewError.style.display = 'flex';
        } else if (screenName === 'player') {
            viewPlayer.classList.remove('hidden');
            viewPlayer.style.display = 'block';
        } else if (screenName === 'result') {
            viewResult.classList.remove('hidden');
            viewResult.style.display = 'block';
        }
    }

    // Flow Routing: Category click opens mandatory Language Selection Screen
    function selectCategoryForQuiz(catId, catName) {
        quizState.categoryId = parseInt(catId);
        quizState.categoryName = catName;
        
        // Always reset language selections for a new attempt
        quizState.selectedLanguage = null;
        
        langOptionCards.forEach(c => c.classList.remove('selected-lang'));
        const checks = viewLanguage.querySelectorAll('.lang-card-check i');
        checks.forEach(i => {
            i.className = 'fa-regular fa-circle';
        });
        
        if (langValidationMsg) {
            langValidationMsg.classList.add('hidden');
            langValidationMsg.style.display = 'none';
        }
        
        // Reset translation state of selections view
        if (langPanelTitle) langPanelTitle.textContent = "Choose Your Quiz Language";
        if (langPanelDesc) langPanelDesc.textContent = "Select the language in which you want to attempt the quiz.";
        if (btnLangBack) btnLangBack.innerHTML = `<i class="fa-solid fa-arrow-left"></i> Back`;
        if (btnLangContinue) btnLangContinue.innerHTML = `Continue <i class="fa-solid fa-arrow-right"></i>`;
        
        switchScreen('language');
    }

    function translateLanguageView(lang) {
        if (!langPanelTitle) return;
        if (lang === 'hi') {
            langPanelTitle.textContent = "अपनी क्विज़ भाषा चुनें";
            langPanelDesc.textContent = "उस भाषा का चयन करें जिसमें आप क्विज़ का प्रयास करना चाहते हैं।";
            btnLangBack.innerHTML = `<i class="fa-solid fa-arrow-left"></i> पीछे`;
            btnLangContinue.innerHTML = `आगे बढ़ें <i class="fa-solid fa-arrow-right"></i>`;
        } else if (lang === 'bilingual') {
            langPanelTitle.textContent = "Choose Quiz Language / भाषा चुनें";
            langPanelDesc.textContent = "Select quiz language / भाषा चुनें";
            btnLangBack.innerHTML = `<i class="fa-solid fa-arrow-left"></i> Back / पीछे`;
            btnLangContinue.innerHTML = `Continue / आगे बढ़ें <i class="fa-solid fa-arrow-right"></i>`;
        } else {
            langPanelTitle.textContent = "Choose Your Quiz Language";
            langPanelDesc.textContent = "Select the language in which you want to attempt the quiz.";
            btnLangBack.innerHTML = `<i class="fa-solid fa-arrow-left"></i> Back`;
            btnLangContinue.innerHTML = `Continue <i class="fa-solid fa-arrow-right"></i>`;
        }
    }

    // Load curated offline quiz questions mapped to the selected language
    function loadOfflineQuiz() {
        quizState.quizType = 'offline';
        const curated = offlineQuizData[quizState.categoryName];
        const selectedQuestions = curated ? curated : offlineQuizData["General Knowledge"];
        
        const cloned = JSON.parse(JSON.stringify(selectedQuestions));
        shuffle(cloned);
        
        quizState.questions = cloned.slice(0, 10).map(q => {
            const lang = quizState.selectedLanguage || 'en';
            
            const qText = q.question[lang] || q.question['en'];
            const correct = q.correct_answer[lang] || q.correct_answer['en'];
            const incorrects = q.incorrect_answers.map(ans => ans[lang] || ans['en']);
            
            const choices = [...incorrects, correct];
            shuffle(choices);
            
            return {
                questionText: qText,
                correctAnswer: correct,
                choices: choices
            };
        });
        initPlayer();
    }

    // Fetch quiz questions from Open Trivia DB API
    function fetchQuestions(catId, catName) {
        const apiUrl = `https://opentdb.com/api.php?amount=10&type=multiple&category=${catId}`;
        quizState.quizType = 'online';

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 seconds timeout

        // Localize error views
        if (btnQuizRetry) {
            btnQuizRetry.innerHTML = `<i class="fa-solid fa-arrows-rotate"></i> ` + (quizState.selectedLanguage === 'hi' ? 'फिर से कोशिश करें' : (quizState.selectedLanguage === 'bilingual' ? 'Retry / पुनः प्रयास' : 'Retry Connection'));
        }
        if (btnQuizFallback) {
            btnQuizFallback.innerHTML = `<i class="fa-solid fa-power-off"></i> ` + (quizState.selectedLanguage === 'hi' ? 'ऑफ़लाइन क्विज़ शुरू करें' : (quizState.selectedLanguage === 'bilingual' ? 'Start Offline / ऑफ़लाइन शुरू करें' : 'Start Curated Offline Quiz'));
        }
        if (btnQuizBackError) {
            btnQuizBackError.innerHTML = quizState.selectedLanguage === 'hi' ? 'श्रेणियों पर वापस जाएं' : (quizState.selectedLanguage === 'bilingual' ? 'Categories / श्रेणियाँ' : 'Back to Categories');
        }

        fetch(apiUrl, { signal: controller.signal })
            .then(res => res.json())
            .then(data => {
                clearTimeout(timeoutId);
                if (data.response_code === 0 && data.results && data.results.length >= 5) {
                    quizState.questions = data.results.map(q => {
                        const correct = decodeHtml(q.correct_answer);
                        const incorrects = q.incorrect_answers.map(ans => decodeHtml(ans));
                        const allChoices = [...incorrects, correct];
                        shuffle(allChoices);

                        let qText = decodeHtml(q.question);
                        const lang = quizState.selectedLanguage;
                        if (lang === 'hi') {
                            qText = `<div style="font-size: 0.82rem; color: var(--accent-gold); margin-bottom: 6px; font-weight: 600;"><i class="fa-solid fa-language"></i> [लाइव एपीआई प्रश्न - केवल अंग्रेजी में उपलब्ध]</div>` + qText;
                        } else if (lang === 'bilingual') {
                            qText = `<div style="font-size: 0.82rem; color: var(--accent-gold); margin-bottom: 6px; font-weight: 600;"><i class="fa-solid fa-language"></i> [Live API Question - English only]</div>` + qText;
                        }

                        return {
                            questionText: qText,
                            correctAnswer: correct,
                            choices: allChoices
                        };
                    });
                    initPlayer();
                } else {
                    throw new Error("Invalid response code or insufficient results");
                }
            })
            .catch(err => {
                clearTimeout(timeoutId);
                console.warn("Quiz API fetch failed, loading offline fallback questions. Error:", err);
                const errorDetailEl = document.getElementById('quiz-error-detail');
                if (errorDetailEl) {
                    if (quizState.selectedLanguage === 'hi') {
                        errorDetailEl.textContent = `हम लाइव क्विज़ सर्वर से कनेक्ट नहीं हो सके (कारण: ${err.message || 'नेटवर्क ऑफलाइन'}). आप पुनः प्रयास कर सकते हैं या ऑफ़लाइन खेल सकते हैं!`;
                    } else if (quizState.selectedLanguage === 'bilingual') {
                        errorDetailEl.textContent = `Connection failed / कनेक्शन विफल (Reason: ${err.message || 'Offline'}). Retry or play offline / पुनः प्रयास करें या ऑफ़लाइन खेलें!`;
                    } else {
                        errorDetailEl.textContent = `We couldn't connect to the Open Trivia Database API (Reason: ${err.message || 'Timeout/Network offline'}). You can retry or play our offline quiz!`;
                    }
                }
                switchScreen('error');
            });
    }

    // Initialize player state
    function initPlayer() {
        quizState.currentIndex = 0;
        quizState.userAnswers = new Array(quizState.questions.length).fill(null);
        switchScreen('player');
        
        if (hudCategory) {
            const trans = categoryTranslations[quizState.categoryName];
            hudCategory.textContent = trans ? (trans[quizState.selectedLanguage] || trans['en']) : quizState.categoryName;
        }

        if (btnPlayerQuit) {
            btnPlayerQuit.innerHTML = `<i class="fa-solid fa-xmark"></i> ${getLoc('quit')}`;
        }

        loadQuestion(0);
        startCountdown();
    }

    // Timer functions
    function updateTimerText(totalSeconds) {
        if (!hudTimerTime) return;
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        hudTimerTime.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function startCountdown() {
        if (hudTimer) hudTimer.classList.remove('warning-timer');
        updateTimerText(quizState.timerSeconds);

        quizState.timerIntervalId = setInterval(() => {
            quizState.timerSeconds--;
            quizState.timeTakenSeconds++;

            updateTimerText(quizState.timerSeconds);

            if (quizState.timerSeconds <= 60 && hudTimer) {
                hudTimer.classList.add('warning-timer');
            }

            if (quizState.timerSeconds <= 0) {
                clearInterval(quizState.timerIntervalId);
                alert(getLoc('timeUp'));
                submitQuiz();
            }
        }, 1000);
    }

    // Load active question view
    function loadQuestion(index) {
        quizState.currentIndex = index;
        const total = quizState.questions.length;
        
        if (hudProgress) {
            const lang = quizState.selectedLanguage;
            if (lang === 'hi') {
                hudProgress.textContent = `प्रश्न ${index + 1} का ${total}`;
            } else if (lang === 'bilingual') {
                hudProgress.textContent = `Question ${index + 1} of ${total} / प्रश्न ${index + 1} का ${total}`;
            } else {
                hudProgress.textContent = `Question ${index + 1} of ${total}`;
            }
        }
        
        if (hudProgressFill) {
            const fillPercent = ((index + 1) / total) * 100;
            hudProgressFill.style.width = `${fillPercent}%`;
        }

        const q = quizState.questions[index];
        if (playerQuestionText) playerQuestionText.innerHTML = q.questionText;

        if (playerOptionsContainer) {
            playerOptionsContainer.innerHTML = '';
            const alphabet = ['A', 'B', 'C', 'D'];
            
            q.choices.forEach((choice, choiceIdx) => {
                const btn = document.createElement('button');
                btn.className = 'player-option-btn';
                
                const isSelected = (quizState.userAnswers[index] === choice);
                if (isSelected) btn.classList.add('selected-option');

                const checkIcon = isSelected ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle';

                btn.innerHTML = `
                    <span class="option-marker">${alphabet[choiceIdx]}</span>
                    <span class="option-text"></span>
                    <span class="option-check"><i class="${checkIcon}"></i></span>
                `;
                btn.querySelector('.option-text').textContent = choice;

                btn.addEventListener('click', () => {
                    selectOption(choice);
                });

                playerOptionsContainer.appendChild(btn);
            });
        }

        if (btnPlayerPrev) {
            btnPlayerPrev.disabled = (index === 0);
            btnPlayerPrev.innerHTML = `<i class="fa-solid fa-chevron-left"></i> ${getLoc('prev')}`;
        }
        if (index === total - 1) {
            if (btnPlayerNext) { btnPlayerNext.classList.add('hidden'); btnPlayerNext.style.display = 'none'; }
            if (btnPlayerSubmit) {
                btnPlayerSubmit.classList.remove('hidden');
                btnPlayerSubmit.style.display = 'inline-flex';
                btnPlayerSubmit.innerHTML = `${getLoc('submit')} <i class="fa-solid fa-check-double"></i>`;
            }
        } else {
            if (btnPlayerNext) {
                btnPlayerNext.classList.remove('hidden');
                btnPlayerNext.style.display = 'inline-flex';
                btnPlayerNext.innerHTML = `${getLoc('next')} <i class="fa-solid fa-chevron-right"></i>`;
            }
            if (btnPlayerSubmit) { btnPlayerSubmit.classList.add('hidden'); btnPlayerSubmit.style.display = 'none'; }
        }
    }

    // Handle Option Click
    function selectOption(choiceText) {
        quizState.userAnswers[quizState.currentIndex] = choiceText;
        
        const buttons = playerOptionsContainer.querySelectorAll('.player-option-btn');
        buttons.forEach(btn => {
            const text = btn.querySelector('.option-text').textContent;
            const check = btn.querySelector('.option-check i');
            
            if (text === choiceText) {
                btn.classList.add('selected-option');
                check.className = 'fa-solid fa-circle-check';
            } else {
                btn.classList.remove('selected-option');
                check.className = 'fa-regular fa-circle';
            }
        });
    }

    // Submit Quiz & Render Results
    function submitQuiz() {
        if (quizState.timerIntervalId) {
            clearInterval(quizState.timerIntervalId);
        }

        const questionsList = quizState.questions;
        let correctCount = 0;
        let wrongCount = 0;
        let unattemptedCount = 0;

        questionsList.forEach((q, idx) => {
            const ans = quizState.userAnswers[idx];
            if (ans === null) unattemptedCount++;
            else if (ans === q.correctAnswer) correctCount++;
            else wrongCount++;
        });

        const totalQuestions = questionsList.length;
        const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
        
        const attempted = correctCount + wrongCount;
        const accuracy = attempted > 0 ? Math.round((correctCount / attempted) * 100) : 0;

        const timeTakenMins = Math.floor(quizState.timeTakenSeconds / 60);
        const timeTakenSecs = quizState.timeTakenSeconds % 60;
        const timeTakenStr = `${timeTakenMins.toString().padStart(2, '0')}:${timeTakenSecs.toString().padStart(2, '0')}`;

        const langMapFormatted = {
            'en': 'English',
            'hi': 'Hindi',
            'bilingual': 'Bilingual'
        };
        const langFormatted = langMapFormatted[quizState.selectedLanguage] || 'English';

        const dateObj = new Date();
        const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
        const dateStr = dateObj.toLocaleDateString('en-US', dateOptions);

        const newAttempt = {
            date: dateStr,
            category: quizState.categoryName,
            language: langFormatted,
            correct: correctCount,
            total: totalQuestions,
            accuracy: percentage,
            timeTaken: timeTakenStr,
            timeTakenSec: quizState.timeTakenSeconds
        };

        const history = JSON.parse(localStorage.getItem('gyan_quiz_history') || '[]');
        history.push(newAttempt);
        localStorage.setItem('gyan_quiz_history', JSON.stringify(history));

        // Localize breakdown stats labels
        const breakdownLabels = {
            'total': document.querySelector('#view-quiz-result .breakdown-card:nth-child(1) .breakdown-label'),
            'correct': document.querySelector('#view-quiz-result .breakdown-card:nth-child(2) .breakdown-label'),
            'wrong': document.querySelector('#view-quiz-result .breakdown-card:nth-child(3) .breakdown-label'),
            'unattempted': document.querySelector('#view-quiz-result .breakdown-card:nth-child(4) .breakdown-label'),
            'timeTaken': document.querySelector('#view-quiz-result .breakdown-card:nth-child(5) .breakdown-label'),
            'accuracy': document.querySelector('#view-quiz-result .breakdown-card:nth-child(6) .breakdown-label')
        };

        if (breakdownLabels.total) breakdownLabels.total.textContent = getLoc('totalQuestions');
        if (breakdownLabels.correct) breakdownLabels.correct.textContent = getLoc('correctAnswers');
        if (breakdownLabels.wrong) breakdownLabels.wrong.textContent = getLoc('wrongAnswers');
        if (breakdownLabels.unattempted) breakdownLabels.unattempted.textContent = getLoc('unattempted');
        if (breakdownLabels.timeTaken) breakdownLabels.timeTaken.textContent = getLoc('timeTaken');
        if (breakdownLabels.accuracy) breakdownLabels.accuracy.textContent = getLoc('accuracy');

        if (resValTotal) resValTotal.textContent = totalQuestions;
        if (resValCorrect) resValCorrect.textContent = correctCount;
        if (resValWrong) resValWrong.textContent = wrongCount;
        if (resValUnattempted) resValUnattempted.textContent = unattemptedCount;
        if (resValTime) resValTime.textContent = timeTakenStr;
        if (resValAccuracy) resValAccuracy.textContent = `${accuracy}%`;
        if (resultScoreRatio) resultScoreRatio.textContent = `${correctCount}/${totalQuestions}`;
        
        const pctLabel = quizState.selectedLanguage === 'hi' ? 'स्कोर' : (quizState.selectedLanguage === 'bilingual' ? 'Score / स्कोर' : 'Score');
        if (resultScorePercent) resultScorePercent.textContent = `${percentage}% ${pctLabel}`;

        let medalHtml = '';
        let gradeTitle = '';
        let feedbackDesc = '';

        if (percentage >= 90) {
            medalHtml = '<i class="fa-solid fa-medal gold-text" style="color: var(--accent-gold); filter: drop-shadow(0 0 10px rgba(212,175,55,0.4));"></i>';
            if (quizState.selectedLanguage === 'hi') {
                gradeTitle = "उत्कृष्ट प्रदर्शन!";
                feedbackDesc = "आपने इस क्विज़ श्रेणी में उत्कृष्ट महारत का प्रदर्शन किया है!";
            } else if (quizState.selectedLanguage === 'bilingual') {
                gradeTitle = "Outstanding / उत्कृष्ट!";
                feedbackDesc = "Excellent mastery in this category! / उत्कृष्ट महारत का प्रदर्शन किया!";
            } else {
                gradeTitle = "Outstanding Job!";
                feedbackDesc = "You have demonstrated excellent mastery in this quiz category!";
            }
        } else if (percentage >= 70) {
            medalHtml = '<i class="fa-solid fa-medal" style="color: #b0bec5; filter: drop-shadow(0 0 10px rgba(176,190,197,0.4));"></i>';
            if (quizState.selectedLanguage === 'hi') {
                gradeTitle = "बहुत अच्छा!";
                feedbackDesc = "एक शानदार स्कोर! 10/10 का उत्तम स्कोर प्राप्त करने के लिए अभ्यास करते रहें।";
            } else if (quizState.selectedLanguage === 'bilingual') {
                gradeTitle = "Very Good / बहुत अच्छा!";
                feedbackDesc = "Keep practicing for a perfect 10/10! / अभ्यास करते रहें।";
            } else {
                gradeTitle = "Very Good!";
                feedbackDesc = "A great score! Keep practicing to achieve a perfect 10/10.";
            }
        } else if (percentage >= 50) {
            medalHtml = '<i class="fa-solid fa-medal" style="color: #cd7f32; filter: drop-shadow(0 0 10px rgba(205,127,50,0.4));"></i>';
            if (quizState.selectedLanguage === 'hi') {
                gradeTitle = "अच्छा प्रयास!";
                feedbackDesc = "आप उत्तीर्ण हुए! अपने नोट्स की समीक्षा करें और स्कोर सुधारने के लिए फिर से प्रयास करें।";
            } else if (quizState.selectedLanguage === 'bilingual') {
                gradeTitle = "Good Effort / अच्छा प्रयास!";
                feedbackDesc = "You passed! Try again to improve. / स्कोर सुधारने के लिए फिर से प्रयास करें।";
            } else {
                gradeTitle = "Good Effort!";
                feedbackDesc = "You passed! Review your notes and try again to improve your score.";
            }
        } else {
            medalHtml = '<i class="fa-solid fa-graduation-cap" style="color: var(--text-light-muted);"></i>';
            if (quizState.selectedLanguage === 'hi') {
                gradeTitle = "सीखते रहें!";
                feedbackDesc = "निराश न हों। सीखना एक यात्रा है—अपने ज्ञान का परीक्षण करने के लिए फिर से प्रयास करें।";
            } else if (quizState.selectedLanguage === 'bilingual') {
                gradeTitle = "Keep Learning / सीखते रहें!";
                feedbackDesc = "Learning is a journey—try again! / पुनः प्रयास करें।";
            } else {
                gradeTitle = "Keep Learning!";
                feedbackDesc = "Don't be discouraged. Learning is a journey—try again to test your knowledge.";
            }
        }

        if (resultBadge) resultBadge.innerHTML = medalHtml;
        if (resultGradeTitle) resultGradeTitle.textContent = gradeTitle;
        if (resultFeedbackDesc) resultFeedbackDesc.textContent = feedbackDesc;

        if (btnResultAnother) btnResultAnother.innerHTML = `<i class="fa-solid fa-repeat"></i> ${getLoc('anotherQuiz')}`;
        if (btnResultHome) btnResultHome.innerHTML = `<i class="fa-solid fa-house"></i> ${getLoc('quizHome')}`;

        switchScreen('result');
        initQuizDashboard();
        updateLeaderboard(currentMemberName);
    }

    function startQuiz(catId, catName) {
        selectCategoryForQuiz(catId, catName);
    }

    function startQuizAfterLanguageSelection() {
        quizState.currentIndex = 0;
        quizState.userAnswers = [];
        quizState.questions = [];
        quizState.timerSeconds = 600;
        quizState.timeTakenSeconds = 0;

        if (quizState.timerIntervalId) {
            clearInterval(quizState.timerIntervalId);
        }

        switchScreen('loading');
        
        // Localize loader title
        const loadingMessageEl = viewLoading.querySelector('h3');
        const loadingSubEl = viewLoading.querySelector('p');
        if (loadingMessageEl) {
            const lang = quizState.selectedLanguage;
            if (lang === 'hi') {
                loadingMessageEl.textContent = "ओपन ट्रिविया डेटाबेस से कनेक्ट किया जा रहा है...";
                if (loadingSubEl) loadingSubEl.textContent = "आपके लिए 10 नए बहुविकल्पीय प्रश्न लोड किए जा रहे हैं।";
            } else if (lang === 'bilingual') {
                loadingMessageEl.textContent = "Connecting to Open Trivia Database / डेटाबेस से कनेक्ट किया जा रहा है...";
                if (loadingSubEl) loadingSubEl.textContent = "Fetching 10 fresh questions / 10 नए बहुविकल्पीय प्रश्न लोड किए जा रहे हैं।";
            } else {
                loadingMessageEl.textContent = "Connecting to Open Trivia Database...";
                if (loadingSubEl) loadingSubEl.textContent = "Fetching 10 fresh multiple-choice questions for you.";
            }
        }

        fetchQuestions(quizState.categoryId, quizState.categoryName);
    }

    // Set up category cards click listeners
    const categoryCards = document.querySelectorAll('.quiz-cat-card');
    categoryCards.forEach(card => {
        const catId = card.getAttribute('data-cat-id');
        const catName = card.getAttribute('data-cat-name');
        const startBtn = card.querySelector('.cat-start-btn');
        
        if (startBtn) {
            startBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                selectCategoryForQuiz(catId, catName);
            });
        }
        
        card.addEventListener('click', () => {
            selectCategoryForQuiz(catId, catName);
        });
    });

    // Language selection card clicks
    langOptionCards.forEach(card => {
        card.addEventListener('click', () => {
            const lang = card.getAttribute('data-lang');
            quizState.selectedLanguage = lang;
            
            langOptionCards.forEach(c => c.classList.remove('selected-lang'));
            card.classList.add('selected-lang');
            
            langOptionCards.forEach(c => {
                const check = c.querySelector('.lang-card-check i');
                if (c === card) {
                    check.className = 'fa-solid fa-circle-check';
                } else {
                    check.className = 'fa-regular fa-circle';
                }
            });
            
            if (langValidationMsg) {
                langValidationMsg.classList.add('hidden');
                langValidationMsg.style.display = 'none';
            }
            
            translateLanguageView(lang);
        });
    });

    if (btnLangContinue) {
        btnLangContinue.addEventListener('click', () => {
            if (!quizState.selectedLanguage) {
                if (langValidationText) {
                    langValidationText.textContent = "Please select a language to continue. / कृपया आगे बढ़ने के लिए भाषा चुनें।";
                }
                if (langValidationMsg) {
                    langValidationMsg.classList.remove('hidden');
                    langValidationMsg.style.display = 'flex';
                }
                return;
            }
            startQuizAfterLanguageSelection();
        });
    }

    if (btnLangBack) {
        btnLangBack.addEventListener('click', () => {
            switchScreen('categories');
        });
    }

    // Navigation and Control buttons click listeners
    if (btnPlayerPrev) {
        btnPlayerPrev.addEventListener('click', () => {
            if (quizState.currentIndex > 0) {
                loadQuestion(quizState.currentIndex - 1);
            }
        });
    }

    if (btnPlayerNext) {
        btnPlayerNext.addEventListener('click', () => {
            if (quizState.currentIndex < quizState.questions.length - 1) {
                loadQuestion(quizState.currentIndex + 1);
            }
        });
    }

    if (btnPlayerSubmit) {
        btnPlayerSubmit.addEventListener('click', () => {
            if (confirm(getLoc('submitConfirm'))) {
                submitQuiz();
            }
        });
    }

    if (btnPlayerQuit) {
        btnPlayerQuit.addEventListener('click', () => {
            if (confirm(getLoc('quitConfirm'))) {
                if (quizState.timerIntervalId) {
                    clearInterval(quizState.timerIntervalId);
                }
                switchScreen('categories');
            }
        });
    }

    if (btnQuizRetry) {
        btnQuizRetry.addEventListener('click', () => {
            startQuizAfterLanguageSelection();
        });
    }

    if (btnQuizFallback) {
        btnQuizFallback.addEventListener('click', () => {
            loadOfflineQuiz();
        });
    }

    if (btnQuizBackError) {
        btnQuizBackError.addEventListener('click', () => {
            switchScreen('categories');
        });
    }

    if (btnResultAnother) {
        btnResultAnother.addEventListener('click', () => {
            startQuizAfterLanguageSelection();
        });
    }

    if (btnResultHome) {
        btnResultHome.addEventListener('click', () => {
            switchScreen('categories');
        });
    }

    if (btnClearHistory) {
        btnClearHistory.addEventListener('click', () => {
            if (confirm(getLoc('clearHistoryConfirm'))) {
                localStorage.removeItem('gyan_quiz_history');
                initQuizDashboard();
                updateLeaderboard(currentMemberName);
            }
        });
    }

    // Initialize Dashboard & Leaderboard on Page Load
    initQuizDashboard();
    updateLeaderboard(currentMemberName);

});

