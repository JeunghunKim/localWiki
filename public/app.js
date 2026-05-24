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
    setupSocket();
    loadPageList();
    
    // Search input event listener
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            loadPageList(e.target.value);
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
