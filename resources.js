class ResourceManager {
    constructor() {
        this.resourcesPanel = document.querySelector('.resources-panel');
        this.resourcesContent = document.querySelector('.resources-content');
        this.initializeResources();
        this.setupEventListeners();
    }

    initializeResources() {
        this.resources = {
            documentation: {
                title: 'Python Documentation',
                items: [
                    { name: 'Official Python Docs', url: 'https://docs.python.org/3/' },
                    { name: 'Python Tutorial', url: 'https://docs.python.org/3/tutorial/' },
                    { name: 'Language Reference', url: 'https://docs.python.org/3/reference/' }
                ]
            },
            tutorials: {
                title: 'Interactive Tutorials',
                items: [
                    { name: 'Basic Syntax', content: 'Learn Python syntax basics' },
                    { name: 'Data Structures', content: 'Master Python data structures' },
                    { name: 'Functions & Classes', content: 'Object-oriented programming' }
                ]
            },
            exercises: {
                title: 'Practice Exercises',
                items: [
                    { name: 'Beginner Challenges', difficulty: 'Easy' },
                    { name: 'Intermediate Problems', difficulty: 'Medium' },
                    { name: 'Advanced Projects', difficulty: 'Hard' }
                ]
            }
        };
    }

    setupEventListeners() {
        document.getElementById('toggleResources').addEventListener('click', () => {
            this.toggleResourcesPanel();
        });

        this.renderResources();
    }

    toggleResourcesPanel() {
        this.resourcesPanel.classList.toggle('active');
        if (this.resourcesPanel.classList.contains('active')) {
            this.loadResourceContent();
        }
    }

    renderResources() {
        Object.entries(this.resources).forEach(([category, data]) => {
            const section = this.createResourceSection(data.title, data.items);
            this.resourcesContent.appendChild(section);
        });
    }

    createResourceSection(title, items) {
        const section = document.createElement('div');
        section.className = 'resource-section';
        
        const header = document.createElement('h4');
        header.textContent = title;
        section.appendChild(header);

        const list = document.createElement('ul');
        items.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-book-reader"></i> ${item.name}`;
            li.addEventListener('click', () => this.handleResourceClick(item));
            list.appendChild(li);
        });

        section.appendChild(list);
        return section;
    }

    handleResourceClick(resource) {
        if (resource.url) {
            window.open(resource.url, '_blank');
        } else if (resource.content) {
            this.showResourceContent(resource);
        }
    }

    showResourceContent(resource) {
        const contentDisplay = document.createElement('div');
        contentDisplay.className = 'resource-content-display';
        contentDisplay.innerHTML = `
            <h3>${resource.name}</h3>
            <div class="content">${resource.content}</div>
        `;
        
        this.resourcesContent.appendChild(contentDisplay);
    }

    loadResourceContent() {
        // Dynamic content loading logic here
        console.log('Loading additional resources...');
    }
}

// Initialize ResourceManager when document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.resourceManager = new ResourceManager();
});
