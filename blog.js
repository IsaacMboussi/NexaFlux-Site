class BlogManager {
    constructor() {
        this.currentPage = 1;
        this.postsPerPage = 9;
        this.currentCategory = 'all';
        this.posts = [];
        this.filteredPosts = [];
        
        this.init();
    }

    async init() {
        await this.fetchPosts();
        this.setupEventListeners();
        this.renderPosts();
    }

    async fetchPosts() {
        try {
            const response = await fetch('/api/posts.json');
            this.posts = await response.json();
            this.filteredPosts = [...this.posts];
            this.updatePagination();
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }

    setupEventListeners() {
        // Category filters
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => this.filterByCategory(btn.dataset.category));
        });

        // Pagination
        document.querySelector('.pagination-btn.prev').addEventListener('click', () => this.changePage('prev'));
        document.querySelector('.pagination-btn.next').addEventListener('click', () => this.changePage('next'));
    }

    filterByCategory(category) {
        this.currentCategory = category;
        this.currentPage = 1;
        
        this.filteredPosts = category === 'all' 
            ? [...this.posts]
            : this.posts.filter(post => post.category === category);

        this.updatePagination();
        this.renderPosts();
        this.updateCategoryButtons();
    }

    changePage(direction) {
        if (direction === 'prev' && this.currentPage > 1) {
            this.currentPage--;
        } else if (direction === 'next' && this.currentPage < this.getTotalPages()) {
            this.currentPage++;
        }
        
        this.renderPosts();
        this.updatePagination();
    }

    getTotalPages() {
        return Math.ceil(this.filteredPosts.length / this.postsPerPage);
    }

    updatePagination() {
        const prevBtn = document.querySelector('.pagination-btn.prev');
        const nextBtn = document.querySelector('.pagination-btn.next');
        const currentPageEl = document.querySelector('.current-page');
        const totalPagesEl = document.querySelector('.total-pages');

        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === this.getTotalPages();
        
        currentPageEl.textContent = this.currentPage;
        totalPagesEl.textContent = this.getTotalPages();
    }

    renderPosts() {
        const container = document.getElementById('posts-container');
        const startIndex = (this.currentPage - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        const postsToShow = this.filteredPosts.slice(startIndex, endIndex);

        container.innerHTML = postsToShow.map(post => this.createPostHTML(post)).join('');
    }

    createPostHTML(post) {
        return `
            <article class="blog-post" data-category="${post.category}">
                <div class="post-image">
                    <img src="${post.image}" alt="${post.title}">
                </div>
                <div class="post-content">
                    <div class="post-meta">
                        <span class="post-category">${post.category}</span>
                        <span class="post-date">${post.date}</span>
                    </div>
                    <h2>${post.title}</h2>
                    <p>${post.excerpt}</p>
                    <a href="/blog/${post.slug}" class="read-more">Read More</a>
                </div>
            </article>
        `;
    }

    updateCategoryButtons() {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === this.currentCategory);
        });
    }
}

// Initialize blog manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BlogManager();
}); 