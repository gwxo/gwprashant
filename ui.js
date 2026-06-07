
//<![CDATA[

    // 1. FIREBASE CONFIGURATION
    // Replace these placeholders with your actual Firebase project details
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT_ID.appspot.com",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    // 2. SPA ROUTER SYSTEM
    const routes = {
        '/': 'home-view',
        '/projects': 'projects-view',
        '/contact': 'contact-view',
        '/admin': 'admin-view'
    };

    function router() {
        const hash = location.hash.slice(1) || '/';
        const views = document.querySelectorAll('.route-view');
        
        // Hide all views
        views.forEach(v => { v.style.display = 'none'; });
        
        // Identify target view
        const targetId = routes[hash] || 'home-view';
        const targetView = document.getElementById(targetId);
        
        if (targetView) {
            targetView.style.display = 'block';
            window.scrollTo(0, 0);
            
            // Trigger specific logic based on route
            if (hash === '/projects') {
                fetchBloggerPosts();
            }
        }
    }

    // 3. BLOGGER FEED & PROJECT SYSTEM
    let allPosts = [];
    let currentPage = 1;
    const postsPerPage = 4;

    async function fetchBloggerPosts() {
        const container = document.getElementById('projects-container');
        container.innerHTML = '<div class="loading">Loading Portfolio...</div>';
        
        const blogUrl = window.location.origin;
        // Constructing URL with escaped ampersand
        const feedUrl = blogUrl + '/feeds/posts/default?alt=json&max-results=50';

        try {
            const response = await fetch(feedUrl);
            const data = await response.json();
            allPosts = data.feed.entry || [];
            renderProjects();
        } catch (e) {
            container.innerHTML = '<p>Error loading projects. Please check your feed settings.</p>';
        }
    }

    function renderProjects() {
        const container = document.getElementById('projects-container');
        const paginator = document.getElementById('pagination');
        container.innerHTML = '';
        
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const paginatedItems = allPosts.slice(startIndex, endIndex);

        if (paginatedItems.length === 0) {
            container.innerHTML = '<p>No projects published yet.</p>';
            return;
        }

        paginatedItems.forEach(post => {
            const title = post.title.$t;
            const content = post.content.$t;
            // Get high-res thumbnail if available
            const img = post.media$thumbnail ? post.media$thumbnail.url.replace('s72-c', 's1600') : null;
            
            const card = document.createElement('div');
            card.className = 'glass-card project-card';
            card.setAttribute('data-aos', 'fade-up');
            
            card.onclick = () => openPost(title, content, img);
            
            card.innerHTML = `
                ${img ? `<img src="${img}" class="project-thumb" alt="${title}" loading="lazy"/>` : ''}
                <div class="card-content">
                    <h3 class="post-title">${title}</h3>
                    <p class="post-summary">${post.summary ? post.summary.$t.substring(0, 90) : 'View project details...'}...</p>
                    <span class="btn-outline" style="padding: 5px 15px; font-size: 0.8rem; display: inline-block; margin-top: 10px;">Read More</span>
                </div>
            `;
            container.appendChild(card);
        });

        renderPagination();
    }

    function renderPagination() {
        const paginator = document.getElementById('pagination');
        paginator.innerHTML = '';
        const totalPages = Math.ceil(allPosts.length / postsPerPage);

        if (totalPages <= 1) return;

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.innerText = i;
            btn.className = (i === currentPage) ? 'btn btn-primary' : 'btn btn-outline';
            btn.style.margin = '0 5px';
            btn.onclick = () => {
                currentPage = i;
                renderProjects();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };
            paginator.appendChild(btn);
        }
    }

    // 4. POST VIEWER (SPA MODAL)
    function openPost(title, content, img) {
        const viewer = document.getElementById('post-viewer');
        const inner = document.getElementById('post-viewer-content');
        
        inner.innerHTML = `
            <div class="post-full-content" data-aos="fade-in">
                <h1 style="font-size: clamp(2rem, 5vw, 3.5rem); margin-bottom: 2rem; color: var(--primary);">${title}</h1>
                ${img ? `<img src="${img}" style="width:100%; max-height: 500px; object-fit: cover; border-radius:20px; margin-bottom:2rem; box-shadow: 0 20px 40px rgba(0,0,0,0.3);"/>` : ''}
                <div class="entry-content" style="font-size: 1.1rem; line-height: 1.8; color: #cbd5e1;">${content}</div>
            </div>
        `;
        
        viewer.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeViewer() {
        document.getElementById('post-viewer').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // 5. SEARCH SYSTEM
    function toggleSearch() {
        const s = document.getElementById('search-overlay');
        const isVisible = s.style.display === 'flex';
        s.style.display = isVisible ? 'none' : 'flex';
        if (!isVisible) document.getElementById('search-input').focus();
    }

    function doSearch(query) {
        const results = document.getElementById('search-results');
        if (!query || query.length < 2) { results.innerHTML = ''; return; }
        
        const filtered = allPosts.filter(p => 
            p.title.$t.toLowerCase().includes(query.toLowerCase())
        );

        results.innerHTML = filtered.map(p => `
            <div class="glass-card project-card" style="padding: 15px;" onclick="closeSearchAndOpen('${p.title.$t}')">
                <h4 style="margin:0">${p.title.$t}</h4>
            </div>
        `).join('');
    }

    function closeSearchAndOpen(title) {
        toggleSearch();
        const post = allPosts.find(p => p.title.$t === title);
        if (post) openPost(post.title.$t, post.content.$t, post.media$thumbnail ? post.media$thumbnail.url : null);
    }

    // 6. ADMIN AUTHENTICATION
    async function handleLogin() {
        const email = document.getElementById('admin-email').value;
        const pass = document.getElementById('admin-pass').value;
        try {
            await auth.signInWithEmailAndPassword(email, pass);
            checkAuth();
        } catch (e) {
            alert("Auth Error: " + e.message);
        }
    }

    function handleLogout() {
        auth.signOut().then(() => {
            location.hash = '#/';
            location.reload();
        });
    }

    function checkAuth() {
        auth.onAuthStateChanged(user => {
            const dashboard = document.getElementById('admin-dashboard');
            const loginForm = document.getElementById('admin-auth');
            if (user) {
                if (loginForm) loginForm.style.display = 'none';
                if (dashboard) {
                    dashboard.style.display = 'block';
                    document.getElementById('admin-posts-list').innerHTML = `<p>Welcome back, ${user.email}. Analytics and Media Manager are ready.</p>`;
                }
            } else {
                if (loginForm) loginForm.style.display = 'block';
                if (dashboard) dashboard.style.display = 'none';
            }
        });
    }

    // EVENT LISTENERS
    window.addEventListener('hashchange', router);
    window.addEventListener('load', () => {
        AOS.init({ duration: 800, once: true });
        router();
        checkAuth();
    });

//]]>
