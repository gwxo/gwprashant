//<![CDATA[
    /**
     * 1. FIREBASE CONFIGURATION
     */
    
    /**
     * 2. SPA VIEW TEMPLATES (Your Original UI)
     */
    const views = {
        '#/': () => `
            <section class="container mx-auto px-6">
                <div class="grid lg:grid-cols-2 gap-16 hero-container">
                    <div class="order-2 lg:order-1">
                        <span class="bg-black text-white px-3 py-1 font-black brutal-border mb-6 inline-block uppercase">System Status: Online</span>
                        <h1 class="text-6xl md:text-[7rem] font-black uppercase leading-[0.85] mb-8 tracking-tighter">
                            BUILDING<br/>IDEAS TO<br/><span class="text-[#C8A97E] italic">REALITY.</span>
                        </h1>
                        <div class="bg-white brutal-border p-6 brutal-shadow mb-10">
                            <p class="text-xl font-bold text-gray-800 leading-relaxed italic">
                                "I am GWPRASHANT, a Full Stack Developer specializing in high-speed web architecture and bold Neo-Brutalist UI."
                            </p>
                        </div>
                        <div class="flex flex-wrap gap-6">
                            <a href="#/projects" class="brutal-btn">Explore Projects</a>
                            <a href="#/contact" class="brutal-btn bg-white text-black">Get In Touch</a>
                        </div>
                    </div>
                    <div class="order-1 lg:order-2 flex justify-center lg:justify-end">
                        <div class="hero-image-box">
                            <img src="https://via.placeholder.com/450x550/000/C8A97E?text=GW+PRASHANT" class="w-full max-w-sm brutal-border grayscale" alt="GWPRASHANT"/>
                        </div>
                    </div>
                </div>

                <div class="mt-40">
                    <div class="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                        <h2 class="text-5xl font-black uppercase italic border-b-[8px] border-black">Latest Intel</h2>
                        <a href="#/projects" class="font-black border-b-4 border-[#C8A97E] uppercase">Archive List →</a>
                    </div>
                    <div id="project-feed" class="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div class="skeleton h-72 brutal-border"></div>
                        <div class="skeleton h-72 brutal-border"></div>
                    </div>
                </div>
            </section>
        `,
        '#/projects': () => `
            <section class="container mx-auto px-6">
                <h2 class="text-7xl font-black uppercase mb-16 tracking-tighter italic border-b-[12px] border-black inline-block">Project Archive</h2>
                <div id="full-archive" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <div class="skeleton h-72 brutal-border"></div>
                    <div class="skeleton h-72 brutal-border"></div>
                </div>
            </section>
        `,
        '#/skills': () => `
            <section class="container mx-auto px-6">
                <h2 class="text-7xl font-black uppercase mb-20 text-center">Arsenal</h2>
                <div class="grid md:grid-cols-3 gap-8">
                    ${['Frontend', 'Backend', 'Tools'].map(cat => `
                        <div class="bg-white brutal-border p-10 brutal-shadow">
                            <h3 class="text-3xl font-black uppercase border-b-8 border-[#C8A97E] mb-8 italic">${cat}</h3>
                            <ul class="space-y-4 font-black text-xl italic text-gray-700">
                                <li>- JAVASCRIPT ES6+</li>
                                <li>- FIREBASE ARCHITECTURE</li>
                                <li>- TAILWIND CSS</li>
                                <li>- UI SYSTEM DESIGN</li>
                            </ul>
                        </div>
                    `).join('')}
                </div>
            </section>
        `,
        '#/about': () => `
            <section class="container mx-auto px-6 max-w-5xl">
                <div class="bg-white brutal-border p-10 md:p-20 brutal-shadow">
                    <h2 class="text-6xl font-black uppercase mb-10 italic">Creator Profile</h2>
                    <p class="text-2xl font-bold leading-relaxed mb-8 border-l-8 border-[#C8A97E] pl-8 italic">
                        "Visual clarity meets technical performance."
                    </p>
                    <p class="text-xl font-medium text-gray-600 mb-12">
                        I build Single Page Applications that load instantly and leave a lasting impression.
                    </p>
                </div>
            </section>
        `,
        '#/contact': () => `
            <section class="container mx-auto px-6 max-w-4xl">
                <div class="bg-white brutal-border p-10 md:p-16 brutal-shadow">
                    <h2 class="text-6xl font-black uppercase mb-10 italic text-center">Send Signal</h2>
                    <form id="contactForm" class="space-y-8">
                        <input class="w-full p-5 brutal-border font-bold uppercase" id="name" placeholder="Name" required type="text"/>
                        <input class="w-full p-5 brutal-border font-bold uppercase" id="email" placeholder="Email" required type="email"/>
                        <textarea class="w-full p-5 brutal-border font-bold uppercase" id="message" placeholder="Project Details" required rows="5"></textarea>
                        <button class="w-full brutal-btn py-6 text-2xl" type="submit">Establish Connection</button>
                    </form>
                </div>
            </section>
        `
    };

    /**
     * 3. THE MASTER ROUTER
     * Ensures browser back-button works and UI is synced
     */
    async function router() {
        const hash = window.location.hash || '#/';
        const app = document.getElementById('app');
        const modal = document.getElementById('modal');

        // Reset UI Overlays
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('searchOverlay').style.display = 'none';

        // 1. CHECK IF ROUTE IS A PROJECT POST
        if (hash.startsWith('#/project/')) {
            const projectId = hash.replace('#/project/', '');
            renderFullPost(projectId);
            return; // Stop further execution
        }

        // 2. IF NOT A PROJECT, HIDE FULL-PAGE MODAL
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Enable scrolling
        }

        // 3. RENDER NORMAL PAGE
        app.style.opacity = '0';
        setTimeout(() => {
            app.innerHTML = (views[hash] || views['#/'])();
            app.style.opacity = '1';
            window.scrollTo(0, 0);

            // SEO: Base Title
            document.title = "GWPRASHANT | Creative Developer";

            // Trigger Data Fetches
            if (hash === '#/') fetchItems('project-feed', 2);
            if (hash === '#/projects') fetchItems('full-archive', 50);
            if (hash === '#/contact') initContactForm();
        }, 200);
    }

    /**
     * 4. DATABASE FETCHER
     */
    async function fetchItems(containerId, limit) {
        const container = document.getElementById(containerId);
        if (!container) return;

        try {
            const snap = await db.collection('projects').orderBy('createdAt', 'desc').limit(limit).get();
            let html = '';
            snap.forEach(doc => {
                const p = doc.data();
                html += `
                    <div class="bg-white brutal-border p-8 brutal-shadow transition-all hover:translate-x-2 hover:translate-y-2 hover:shadow-none cursor-pointer" 
                         onclick="window.location.hash = '#/project/${doc.id}'">
                        <h4 class="text-3xl font-black uppercase mb-4 italic">${p.title}</h4>
                        <p class="font-bold text-gray-500 line-clamp-3 mb-8">${p.description}</p>
                        <span class="font-black border-b-4 border-[#C8A97E] uppercase text-sm">Full Intel →</span>
                    </div>
                `;
            });
            container.innerHTML = html || '<p class="font-black">DATABASE EMPTY</p>';
        } catch (e) {
            container.innerHTML = '<p class="font-black">CONNECTION FAILED</p>';
        }
    }

    /**
     * 5. FULL PAGE POST RENDERER (Neo-Brutalist Layout)
     */
    async function renderFullPost(id) {
        const modal = document.getElementById('modal');
        const content = document.getElementById('modalContent');

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Stop background scroll
        content.innerHTML = '<div class="skeleton h-screen w-full brutal-border"></div>';

        try {
            const doc = await db.collection('projects').doc(id).get();
            if (!doc.exists) { window.location.hash = '#/'; return; }
            const p = doc.data();

            // SEO: DYNAMIC PAGE TITLE
            document.title = `${p.title} | GWPRASHANT`;

            content.innerHTML = `
                <div class="animate-in fade-in slide-in-from-bottom-5 duration-500">
                    <header class="mb-12">
                        <span class="bg-black text-white px-4 py-1 font-black uppercase text-xs mb-4 inline-block tracking-[0.3em]">Project_Instance_${id.substring(0,5)}</span>
                        <h1 class="text-5xl md:text-[7rem] font-black uppercase leading-[0.85] tracking-tighter mb-4">${p.title}</h1>
                    </header>

                    ${p.imageURL ? `
                        <div class="border-[6px] border-black shadow-[15px_15px_0px_#000] mb-16 overflow-hidden">
                            <img src="${p.imageURL}" class="w-full h-auto block grayscale hover:grayscale-0 transition-all duration-1000" alt="${p.title}"/>
                        </div>
                    ` : ''}

                    <div class="grid lg:grid-cols-3 gap-12 mt-10">
                        <div class="lg:col-span-2">
                            <h3 class="text-3xl font-black uppercase mb-6 italic underline">The Intelligence</h3>
                            <div class="text-2xl font-bold leading-relaxed text-gray-800 space-y-6">
                                ${p.description}
                            </div>
                        </div>
                        <div>
                            <div class="bg-white brutal-border p-8 brutal-shadow sticky top-32">
                                <h4 class="font-black text-xl uppercase mb-4 italic border-b-2 border-black pb-2">Launch Protocol</h4>
                                ${p.externalLink ? `
                                    <a href="${p.externalLink}" target="_blank" class="brutal-btn w-full block text-center py-5">VISIT LIVE SITE</a>
                                ` : '<p class="font-black text-red-500 uppercase">INTERNAL_ONLY</p>'}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } catch (e) {
            content.innerHTML = '<h2 class="text-4xl font-black">404_DATA_NOT_FOUND</h2>';
        }
    }

    /**
     * 6. UI EVENT LISTENERS
     */
    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        form.onsubmit = async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            btn.innerText = 'TRANSMITTING...';
            try {
                await db.collection('contactMessages').add({
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    message: document.getElementById('message').value,
                    createdAt: new Date()
                });
                alert('SIGNAL RECEIVED.');
                e.target.reset();
            } catch (e) { alert('SIGNAL INTERRUPTED.'); }
            finally { btn.innerText = 'Establish Connection'; }
        };
    }

    // Modal "Back" Logic (Syncs with Browser History)
    document.getElementById('closeModal').onclick = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.hash = '#/projects';
        }
    };

    // Navigation Toggles
    document.getElementById('menuToggle').onclick = () => document.getElementById('sidebar').classList.add('open');
    document.getElementById('closeMenu').onclick = () => document.getElementById('sidebar').classList.remove('open');
    document.getElementById('searchBtn').onclick = () => document.getElementById('searchOverlay').style.display = 'block';
    document.getElementById('closeSearch').onclick = () => document.getElementById('searchOverlay').style.display = 'none';

    // Search Input Logic
    document.getElementById('searchInput').oninput = async (e) => {
        const term = e.target.value.toUpperCase();
        const results = document.getElementById('searchResults');
        if(term.length < 2) { results.innerHTML = ''; return; }
        
        const snap = await db.collection('projects').get();
        let html = '';
        snap.forEach(doc => {
            const p = doc.data();
            if(p.title.toUpperCase().includes(term)) {
                html += `<div class="bg-black text-white p-6 brutal-border cursor-pointer font-black uppercase italic shadow-brutal hover:bg-[#C8A97E] hover:text-black transition-all" onclick="window.location.hash='#/project/${doc.id}'">${p.title}</div>`;
            }
        });
        results.innerHTML = html || '<p class="font-black uppercase">Zero Matches Found</p>';
    };

    // START THE APP
    window.addEventListener('hashchange', router);
    window.addEventListener('load', router);
//]]>
