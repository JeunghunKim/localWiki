async function loadPageList(filter = '') {
    try {
        const response = await fetch('/api/pages');
        const tree = await response.json();
        const sidebar = document.getElementById('sidebar');
        sidebar.innerHTML = '';

        const filterLower = filter.toLowerCase();

        function renderNodes(nodes, container) {
            nodes.forEach(node => {
                if (filter && node.type === 'file' && !node.title.toLowerCase().includes(filterLower)) {
                    // In a real search, we might want to keep parent folders if children match.
                    // For simplicity, we'll just filter the leaf nodes.
                    return;
                }

                const div = document.createElement('div');
                div.className = 'tree-node-container';

                const link = document.createElement('a');
                link.className = `block px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors ${node.type === 'dir' ? 'font-medium' : ''}`;
                
                if (node.type === 'dir') {
                    link.innerHTML = `<span class="folder-icon"></span> ${node.name}`;
                    const childrenDiv = document.createElement('div');
                    childrenDiv.className = 'tree-children';
                    
                    link.onclick = (e) => {
                        e.preventDefault();
                        childrenDiv.classList.toggle('open');
                        link.querySelector('.folder-icon').classList.toggle('open');
                    };
                    
                    renderNodes(node.children, childrenDiv);
                    div.appendChild(link);
                    div.appendChild(childrenDiv);
                } else {
                    link.innerHTML = `<span class="file-icon"></span> ${node.title}`;
                    link.onclick = (e) => {
                        e.preventDefault();
                        loadPageContent(node.path);
                        updateActiveLink(link);
                        if (window.innerWidth < 1024 && window.toggleWikiSidebar) {
                            window.toggleWikiSidebar();
                        }
                    };
                    div.appendChild(link);
                }
                
                container.appendChild(div);
            });
        }

        renderNodes(tree, sidebar);

        if (sidebar.innerHTML === '') {
            sidebar.innerHTML = '<div class="text-sm text-gray-500 italic">No pages found.</div>';
        }
    } catch (error) {
        console.error('Error loading page list:', error);
        document.getElementById('sidebar').innerHTML = '<div class="text-red-500 text-sm">페이지를 불러오지 못했습니다.</div>';
    }
}

async function searchContent(query) {
    if (!query) return;
    
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '<div class="flex justify-center mt-20"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>';
    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const results = await response.json();

        if (results.length === 0) {
            contentDiv.innerHTML = `
                <div class="text-center text-gray-500 mt-20">
                    <p class="text-lg">"${query}"에 대한 검색 결과가 없습니다.</p>
                </div>`;
            return;
        }

        let html = `<h2 class="text-2xl font-bold mb-6">🔍 "${query}" 검색 결과 (${results.length})</h2>`;
        html += `<div class="space-y-6">`;
        
        results.forEach(res => {
            const highlightedSnippet = res.snippet
                ? res.snippet.replace(new RegExp(`(${escapeRegex(query)})`, 'gi'), '<mark class="bg-yellow-200 px-0.5 rounded">$1</mark>')
                : '';
            html += `
                <div class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <a href="#${res.path}" class="text-blue-600 font-semibold text-lg hover:underline" 
                       onclick="event.preventDefault(); loadPageContent('${res.path}'); updateActiveLink(event.target)">
                       ${res.title}
                    </a>
                    <p class="text-gray-600 text-sm mt-2 italic">... ${highlightedSnippet} ...</p>
                    <div class="text-xs text-gray-400 mt-1">${res.path}</div>
                </div>`;
        });
        
        html += `</div>`;
        contentDiv.innerHTML = html;
    } catch (error) {
        console.error('Search error:', error);
        contentDiv.innerHTML = '<div class="text-center text-red-500 mt-20">검색 중 오류가 발생했습니다.</div>';
    }
}

async function loadPageContent(name) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '<div class="text-center text-gray-500 mt-20">로딩 중...</div>';

    try {
        const response = await fetch(`/api/pages/${name}`);
        const data = await response.json();
        
        if (data.error) {
            contentDiv.innerHTML = `<div class="text-center text-red-500 mt-20">${data.error}</div>`;
            return;
        }

        // Configure marked with highlight.js
        marked.setOptions({
            highlight: function(code, lang) {
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                return hljs.highlight(code, { language }).value;
            },
            langPrefix: 'hljs language-'
        });

        // Render Markdown
        const htmlContent = marked.parse(data.content);
        contentDiv.innerHTML = htmlContent;

        // Handle LaTeX math expressions ($...$ and $$...$$)
        renderLatex(contentDiv);
        
        // Handle Wiki-links [[PageName]]
        handleWikiLinks();
        
        // Trigger highlight.js for any newly added code blocks
        contentDiv.querySelectorAll('pre code').forEach((el) => {
            hljs.highlightElement(el);
        });
    } catch (error) {
        console.error('Error loading page content:', error);
        contentDiv.innerHTML = '<div class="text-center text-red-500 mt-20">콘텐츠를 불러오는 중 오류가 발생했습니다.</div>';
    }
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Search History (localStorage) */
function saveSearchHistory(query) {
    const history = JSON.parse(localStorage.getItem('wikiSearchHistory') || '[]');
    const filtered = history.filter((h) => h !== query);
    filtered.unshift(query);
    localStorage.setItem('wikiSearchHistory', JSON.stringify(filtered.slice(0, 10)));
}

function showSearchHistory() {
    const history = JSON.parse(localStorage.getItem('wikiSearchHistory') || '[]');
    if (history.length === 0) return;
    
    let container = document.getElementById('search-history');
    if (!container) {
        container = document.createElement('div');
        container.id = 'search-history';
        container.className = 'absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1';
        document.getElementById('search').parentElement.style.position = 'relative';
        document.getElementById('search').parentElement.appendChild(container);
    }
    
    container.innerHTML = history.map((h) => 
        `<div class="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              onclick="document.getElementById('search').value='${h.replace(/'/g, "\\'")}'; searchContent('${h.replace(/'/g, "\\'")}'); hideSearchHistory();">
            <span class="text-gray-400">\uD83D\uDD0D</span>
            <span>${h}</span>
        </div>`
    ).join('');
}

function hideSearchHistory() {
    const container = document.getElementById('search-history');
    if (container) container.innerHTML = '';
}

function renderLatex(container) {
    // KaTeX가 로드되지 않았으면 스킵
    if (typeof katex === 'undefined') return;
    
    // Display math: $$...$$
    let html = container.innerHTML;
    html = html.replace(/\$\$([^\$]+)\$\$/g, (match, formula) => {
        try {
            return katex.renderToString(formula.trim(), { displayMode: true, throwOnError: false });
        } catch (e) {
            return match;
        }
    });
    
    // Inline math: $...$ (only single $ not adjacent to another $)
    // Skip if the content between $ signs looks like a number (e.g., $5.99)
    html = html.replace(/(?<!\$)\$([^\$]+?)\$(?!\$)/g, (match, formula) => {
        const trimmed = formula.trim();
        // Skip if it looks like a plain number or currency (e.g., $5.99, $100)
        if (/^[\d.,]+$/.test(trimmed)) return match;
        try {
            return katex.renderToString(trimmed, { displayMode: false, throwOnError: false });
        } catch (e) {
            return match;
        }
    });
    
    container.innerHTML = html;
}

function handleWikiLinks() {
    const contentDiv = document.getElementById('content');
    const links = contentDiv.querySelectorAll('a'); // marked might convert some things to links
    
    // Specifically handle [[PageName]] syntax which marked might not catch by default
    // Since marked doesn't natively support [[ ]] as links, we need to manually replace them 
    // or use a custom renderer. Let's use a simple regex replacement on the innerHTML.
    
    const regex = /\[\[([^\]]+)\]\]/g;
    let html = contentDiv.innerHTML;
    if (regex.test(html)) {
        html = html.replace(regex, (match, pageName) => {
            return `<a href="#${pageName}.md" class="wiki-link" onclick="event.preventDefault(); loadPageContent('${pageName}.md'); updateActiveLink(event.target)">${pageName}</a>`;
        });
        contentDiv.innerHTML = html;
    }
}

function updateActiveLink(activeElement) {
    const links = document.querySelectorAll('#sidebar a');
    links.forEach(link => {
        link.classList.remove('bg-blue-100', 'text-blue-700', 'font-medium');
        link.classList.add('text-gray-700');
    });
    activeElement.classList.remove('text-gray-700');
    activeElement.classList.add('bg-blue-100', 'text-blue-700', 'font-medium');
}

// Initial Load
window.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setupSocket();
    loadPageList();
    
    // Search input event listener
    const searchInput = document.getElementById('search');
    if (searchInput) {
        let searchTimeout;
        
        // Show search history on focus
        searchInput.addEventListener('focus', showSearchHistory);
        
        // Hide search history on blur (with delay for click)
        searchInput.addEventListener('blur', () => {
            setTimeout(hideSearchHistory, 200);
        });
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            loadPageList(query);
            
            // Debounced full-text search
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (query.length >= 2) {
                    searchContent(query);
                    saveSearchHistory(query);
                }
            }, 300);
        });
        
        // Search on Enter key
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && searchInput.value.length >= 2) {
                searchContent(searchInput.value);
                saveSearchHistory(searchInput.value);
                searchInput.blur();
            }
        });
    }
    
    // Handle initial page if hash exists
    const hash = window.location.hash.substring(1);
    if (hash) {
        loadPageContent(hash);
    } else {
        loadPageContent('index.md');
    }
});

function setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const closeMenu = document.getElementById('close-menu');
    const sidebar = document.getElementById('sidebar-container');
    const overlay = document.getElementById('sidebar-overlay');
    const refreshBtn = document.getElementById('refresh-btn');

    function toggleSidebar() {
        sidebar.classList.toggle('-translate-x-[calc(100%+1px)]');
        overlay.classList.toggle('hidden');
    }

    if (menuToggle) menuToggle.onclick = toggleSidebar;
    if (closeMenu) closeMenu.onclick = toggleSidebar;
    if (overlay) overlay.onclick = toggleSidebar;
    
    if (refreshBtn) {
        refreshBtn.onclick = () => {
            loadPageList();
            // Optional: add a small animation or notification that it's refreshing
        };
    }

    // Make toggleSidebar available to other functions
    window.toggleWikiSidebar = toggleSidebar;
}

function setupSocket() {
    const socket = io();

    socket.on('file-changed', (data) => {
        console.log('File changed notification received:', data);
        
        // If the changed file is the one currently being viewed, reload content
        const currentHash = window.location.hash.substring(1);
        if (currentHash === data.fileName) {
            loadPageContent(data.fileName);
        }
        
        // Always reload page list to reflect new/deleted files
        loadPageList();
    });
}

// Handle browser back/forward
window.addEventListener('popstate', () => {
    const hash = window.location.hash.substring(1);
    if (hash) loadPageContent(hash);
});
