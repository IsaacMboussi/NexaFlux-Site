document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const postsContainer = document.getElementById('posts-container');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const paginationButtons = document.querySelectorAll('.pagination-btn');
    const newsletterForm = document.getElementById('newsletter-form');
    
    // State
    let currentPage = 1;
    const postsPerPage = 6;
    let currentCategory = 'all';

    // Category Filter Functionality
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter posts
            currentCategory = button.dataset.category;
            currentPage = 1; // Reset to first page
            filterAndDisplayPosts();
        });
    });

    // Pagination Functionality
    function updatePagination() {
        const totalPosts = getCurrentCategoryPosts().length;
        const totalPages = Math.ceil(totalPosts / postsPerPage);
        
        // Update page numbers
        document.querySelector('.current-page').textContent = currentPage;
        document.querySelector('.total-pages').textContent = totalPages;
        
        // Update button states
        document.querySelector('.prev').disabled = currentPage === 1;
        document.querySelector('.next').disabled = currentPage === totalPages;
    }

    paginationButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('prev') && currentPage > 1) {
                currentPage--;
            } else if (button.classList.contains('next')) {
                currentPage++;
            }
            filterAndDisplayPosts();
        });
    });

    // Post Filtering and Display
    function getCurrentCategoryPosts() {
        const allPosts = Array.from(document.querySelectorAll('.blog-post'));
        if (currentCategory === 'all') return allPosts;
        return allPosts.filter(post => post.dataset.category === currentCategory);
    }

    function filterAndDisplayPosts() {
        const posts = getCurrentCategoryPosts();
        const start = (currentPage - 1) * postsPerPage;
        const end = start + postsPerPage;
        
        // Hide all posts
        document.querySelectorAll('.blog-post').forEach(post => {
            post.style.display = 'none';
        });
        
        // Show filtered posts for current page
        posts.slice(start, end).forEach(post => {
            post.style.display = 'block';
        });
        
        updatePagination();
    }

    // Newsletter Functionality
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const successMessage = document.querySelector('.newsletter-success');
        const errorMessage = document.querySelector('.newsletter-error');

        try {
            // Add loading state
            newsletterForm.classList.add('loading');
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Success scenario
            successMessage.classList.add('show');
            errorMessage.classList.remove('show');
            emailInput.value = '';
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 5000);

        } catch (error) {
            // Error scenario
            errorMessage.classList.add('show');
            successMessage.classList.remove('show');
            
            // Hide error message after 5 seconds
            setTimeout(() => {
                errorMessage.classList.remove('show');
            }, 5000);

        } finally {
            newsletterForm.classList.remove('loading');
        }
    });

    // Search Functionality (Optional)
    function addSearchFunctionality() {
        const searchInput = document.createElement('input');
        searchInput.type = 'search';
        searchInput.placeholder = 'Search posts...';
        searchInput.classList.add('blog-search');
        
        document.querySelector('.category-filters').prepend(searchInput);

        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = e.target.value.toLowerCase();
                const posts = document.querySelectorAll('.blog-post');
                
                posts.forEach(post => {
                    const title = post.querySelector('h3').textContent.toLowerCase();
                    const content = post.querySelector('p').textContent.toLowerCase();
                    const matches = title.includes(searchTerm) || content.includes(searchTerm);
                    post.style.display = matches ? 'block' : 'none';
                });
                
                updatePagination();
            }, 300);
        });
    }

    // Initialize
    filterAndDisplayPosts();
    addSearchFunctionality();

    // Add loading animation for images
    document.querySelectorAll('.post-image img').forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
    });

    // 1. Reading Time Estimator
    function addReadingTimeEstimator() {
        document.querySelectorAll('.blog-post').forEach(post => {
            const content = post.querySelector('p').textContent;
            const wordCount = content.split(/\s+/).length;
            const readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words/minute
            
            const readingTimeElement = document.createElement('span');
            readingTimeElement.classList.add('reading-time');
            readingTimeElement.innerHTML = `<i class="far fa-clock"></i> ${readingTime} min read`;
            post.querySelector('.post-meta').appendChild(readingTimeElement);
        });
    }

    // 2. Share Functionality
    function addShareButtons() {
        document.querySelectorAll('.blog-post').forEach(post => {
            const shareContainer = document.createElement('div');
            shareContainer.classList.add('share-buttons');
            
            const title = encodeURIComponent(post.querySelector('h3').textContent);
            const url = encodeURIComponent(window.location.href);
            
            shareContainer.innerHTML = `
                <button onclick="window.open('https://twitter.com/intent/tweet?text=${title}&url=${url}')" aria-label="Share on Twitter">
                    <i class="fab fa-twitter"></i>
                </button>
                <button onclick="window.open('https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}')" aria-label="Share on LinkedIn">
                    <i class="fab fa-linkedin"></i>
                </button>
                <button class="copy-link" data-url="${url}" aria-label="Copy link">
                    <i class="fas fa-link"></i>
                </button>
            `;
            
            post.querySelector('.post-content').appendChild(shareContainer);
        });

        // Copy Link Functionality
        document.querySelectorAll('.copy-link').forEach(button => {
            button.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(decodeURIComponent(button.dataset.url));
                    showToast('Link copied to clipboard!');
                } catch (err) {
                    showToast('Failed to copy link', 'error');
                }
            });
        });
    }

    // 3. Toast Notifications
    function createToastContainer() {
        const container = document.createElement('div');
        container.classList.add('toast-container');
        document.body.appendChild(container);
        return container;
    }

    function showToast(message, type = 'success') {
        const container = document.querySelector('.toast-container') || createToastContainer();
        const toast = document.createElement('div');
        toast.classList.add('toast', type);
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }, 100);
    }

    // 4. Save for Later Functionality
    function addSaveForLater() {
        const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]');

        document.querySelectorAll('.blog-post').forEach(post => {
            const saveButton = document.createElement('button');
            saveButton.classList.add('save-button');
            const postId = post.querySelector('a').getAttribute('href');
            const isSaved = savedPosts.includes(postId);
            
            saveButton.innerHTML = `
                <i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i>
                <span>${isSaved ? 'Saved' : 'Save for later'}</span>
            `;
            
            saveButton.addEventListener('click', () => {
                const index = savedPosts.indexOf(postId);
                if (index === -1) {
                    savedPosts.push(postId);
                    saveButton.innerHTML = '<i class="fas fa-bookmark"></i><span>Saved</span>';
                    showToast('Post saved for later');
                } else {
                    savedPosts.splice(index, 1);
                    saveButton.innerHTML = '<i class="far fa-bookmark"></i><span>Save for later</span>';
                    showToast('Post removed from saved items');
                }
                localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
            });
            
            post.querySelector('.post-content').appendChild(saveButton);
        });
    }

    // 5. Theme Switcher
    function addThemeSwitcher() {
        const themes = ['cyberpunk-blue', 'cyberpunk-red', 'cyberpunk-green'];
        const currentTheme = localStorage.getItem('theme') || themes[0];
        document.body.setAttribute('data-theme', currentTheme);

        const switcher = document.createElement('div');
        switcher.classList.add('theme-switcher');
        switcher.innerHTML = `
            <button class="theme-toggle">
                <i class="fas fa-palette"></i>
            </button>
            <div class="theme-options">
                ${themes.map(theme => `
                    <button class="theme-option ${theme}" data-theme="${theme}"></button>
                `).join('')}
            </div>
        `;

        document.body.appendChild(switcher);

        document.querySelector('.theme-toggle').addEventListener('click', () => {
            switcher.classList.toggle('active');
        });

        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                document.body.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
                showToast(`Theme changed to ${theme.replace('-', ' ')}`);
            });
        });
    }

    // Initialize new features
    addReadingTimeEstimator();
    addShareButtons();
    addSaveForLater();
    addThemeSwitcher();
}); 