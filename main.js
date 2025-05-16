// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!nav.contains(event.target) && !menuToggle.contains(event.target) && nav.classList.contains('active')) {
            nav.classList.remove('active');
        }
    });

    // Check if user is logged in
    function checkLoginStatus() {
        return localStorage.getItem('currentUser') !== null;
    }
    
    // Forum link authorization
    const forumLinks = document.querySelectorAll('a[href="forum.html"]');
    forumLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (!checkLoginStatus()) {
                e.preventDefault();
                window.location.href = 'login.html?redirect=forum';
            }
        });
    });

    // Smooth scrolling for anchor links
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
            }
            
            const targetId = this.getAttribute('href');
            
            // Handle edge case for # links
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Hero button scroll to About section
    const heroButton = document.querySelector('#hero .btn');
    
    if (heroButton) {
        heroButton.addEventListener('click', function() {
            const aboutSection = document.querySelector('#about');
            const headerOffset = 80;
            const elementPosition = aboutSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    }

    // Form submission handling
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form inputs
            const nameInput = this.querySelector('input[type="text"]');
            const emailInput = this.querySelector('input[type="email"]');
            const subjectInput = this.querySelector('input[placeholder="主题"]');
            const messageInput = this.querySelector('textarea');
            
            // Simple validation
            if (!nameInput.value || !emailInput.value || !messageInput.value) {
                alert('请填写所有必填字段！');
                return;
            }
            
            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                alert('请输入有效的电子邮件地址！');
                return;
            }
            
            // Here you would normally send the form data to a server
            // For this demo, we'll just show a success message
            alert('感谢您的留言！我们会尽快回复您。');
            
            // Reset form
            this.reset();
        });
    }

    // Intersection Observer for scroll animations
    if ('IntersectionObserver' in window) {
        const sections = document.querySelectorAll('section');
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        sections.forEach(section => {
            sectionObserver.observe(section);
            section.classList.add('section-hidden');
        });
        
        // Add CSS for animations
        const style = document.createElement('style');
        style.textContent = `
            .section-hidden {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 1s ease, transform 1s ease;
            }
            
            .visible {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }
}); 