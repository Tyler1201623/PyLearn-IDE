/**
 * PyLearn IDE Visualizations Module
 * 
 * Provides advanced visualization tools for Python code execution:
 * - Data Structure Visualization
 * - Code Flow Visualization
 * - Graph Plotting
 */

class PyLearnVisualizer {
    constructor() {
        this.initialized = false;
        this.currentCode = '';
        this.dataVariables = {};
        this.vizElements = {
            dataView: document.getElementById('dataView'),
            graphView: document.getElementById('graphView'),
            flowView: document.getElementById('flowView')
        };
    }

    initialize() {
        if (this.initialized) return;
        
        // Initialize visualization tabs
        const tabs = document.querySelectorAll('.visualization-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                this.activateTab(tabId);
            });
        });
        
        this.initialized = true;
    }
    
    activateTab(tabId) {
        // Remove active class from all tabs and contents
        document.querySelectorAll('.visualization-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        document.querySelectorAll('.viz-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Add active class to selected tab and content
        document.querySelector(`.visualization-tab[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(tabId).classList.add('active');
    }
    
    /**
     * Updates the data visualization view with Python variables
     * @param {string} dataJson - JSON string of Python variables
     */
    updateDataView(dataJson) {
        try {
            const data = JSON.parse(dataJson);
            const dataView = this.vizElements.dataView;
            
            // Remove empty state if present
            this.removeEmptyState(dataView);
            
            // Clear previous content
            dataView.innerHTML = '';
            
            // Create container for data visualization
            const container = document.createElement('div');
            container.className = 'data-visualization-container';
            dataView.appendChild(container);
            
            // Check if we have data to display
            if (Object.keys(data).length === 0) {
                this.showEmptyState(dataView, 'No variables to display');
                return;
            }
            
            // Store data for potential download
            this.dataVariables = data;
            
            // Process special objects for custom visualization
            for (const [varName, value] of Object.entries(data)) {
                const varContainer = document.createElement('div');
                varContainer.className = 'variable-container';
                
                if (Array.isArray(value)) {
                    // Visualize array/list
                    varContainer.innerHTML = `
                        <div class="variable-header">
                            <span class="variable-name">${varName}</span>
                            <span class="variable-type">List (${value.length} items)</span>
                        </div>
                    `;
                    
                    const listViz = this.createListVisualization(value);
                    varContainer.appendChild(listViz);
                } else if (typeof value === 'object' && value !== null) {
                    // Visualize dictionary
                    varContainer.innerHTML = `
                        <div class="variable-header">
                            <span class="variable-name">${varName}</span>
                            <span class="variable-type">Dictionary (${Object.keys(value).length} items)</span>
                        </div>
                    `;
                    
                    const dictViz = this.createDictVisualization(value);
                    varContainer.appendChild(dictViz);
                } else {
                    // Simple scalar value
                    varContainer.innerHTML = `
                        <div class="variable-header">
                            <span class="variable-name">${varName}</span>
                            <span class="variable-type">${typeof value}</span>
                        </div>
                        <div class="variable-value">${this.formatValue(value)}</div>
                    `;
                }
                
                container.appendChild(varContainer);
            }
            
        } catch (error) {
            console.error('Error updating data view:', error);
            this.showEmptyState(this.vizElements.dataView, 'Error visualizing data');
        }
    }
    
    /**
     * Updates the graph visualization view
     * @param {string} graphJson - JSON string with graph data
     */
    updateGraphView(graphJson) {
        try {
            const data = JSON.parse(graphJson);
            const graphView = this.vizElements.graphView;
            
            // Remove empty state if present
            this.removeEmptyState(graphView);
            
            // Clear previous content
            graphView.innerHTML = '';
            
            // Create canvas for chart
            const canvas = document.createElement('canvas');
            canvas.id = 'visualization-chart';
            graphView.appendChild(canvas);
            
            // Create a sample chart with numeric variables found in global scope
            const numericVariables = {};
            for (const [key, value] of Object.entries(this.dataVariables)) {
                if (typeof value === 'number') {
                    numericVariables[key] = value;
                } else if (Array.isArray(value) && value.every(item => typeof item === 'number')) {
                    numericVariables[key] = value;
                }
            }
            
            if (Object.keys(numericVariables).length === 0) {
                // If no numeric data, create a sample chart
                this.createSampleChart(canvas);
            } else {
                // Create chart from available data
                this.createDataChart(canvas, numericVariables);
            }
            
        } catch (error) {
            console.error('Error updating graph view:', error);
            this.showEmptyState(this.vizElements.graphView, 'Error creating graph');
        }
    }
    
    /**
     * Updates the code flow visualization
     * @param {string} code - Python code to visualize
     */
    updateFlowView(code) {
        try {
            const flowView = this.vizElements.flowView;
            this.currentCode = code;
            
            // Remove empty state if present
            this.removeEmptyState(flowView);
            
            // Clear previous content
            flowView.innerHTML = '';
            
            // Create container for flow visualization
            const container = document.createElement('div');
            container.id = 'flow-diagram';
            container.style.width = '100%';
            container.style.height = '100%';
            flowView.appendChild(container);
            
            // Parse code and create nodes
            const codeLines = code.trim().split('\n');
            if (codeLines.length === 0 || (codeLines.length === 1 && codeLines[0].trim() === '')) {
                this.showEmptyState(flowView, 'No code to visualize');
                return;
            }
            
            // Create network visualization
            this.createFlowDiagram(container, codeLines);
            
        } catch (error) {
            console.error('Error updating flow view:', error);
            this.showEmptyState(this.vizElements.flowView, 'Error visualizing code flow');
        }
    }
    
    /**
     * Creates a visualization for Python lists
     */
    createListVisualization(list) {
        const container = document.createElement('div');
        container.className = 'list-visualization';
        
        // Create visual representation of list
        const listItems = document.createElement('div');
        listItems.className = 'list-items';
        
        list.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'list-item';
            itemElement.innerHTML = `
                <div class="list-index">${index}</div>
                <div class="list-value">${this.formatValue(item)}</div>
            `;
            listItems.appendChild(itemElement);
        });
        
        container.appendChild(listItems);
        return container;
    }
    
    /**
     * Creates a visualization for Python dictionaries
     */
    createDictVisualization(dict) {
        const container = document.createElement('div');
        container.className = 'dict-visualization';
        
        // Create visual representation of dictionary
        const dictItems = document.createElement('div');
        dictItems.className = 'dict-items';
        
        for (const [key, value] of Object.entries(dict)) {
            const itemElement = document.createElement('div');
            itemElement.className = 'dict-item';
            itemElement.innerHTML = `
                <div class="dict-key">${key}</div>
                <div class="dict-arrow"><i class="fas fa-arrow-right"></i></div>
                <div class="dict-value">${this.formatValue(value)}</div>
            `;
            dictItems.appendChild(itemElement);
        }
        
        container.appendChild(dictItems);
        return container;
    }
    
    /**
     * Creates a sample chart when no numeric data is available
     */
    createSampleChart(canvas) {
        const ctx = canvas.getContext('2d');
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['A', 'B', 'C', 'D', 'E'],
                datasets: [{
                    label: 'Sample Data',
                    data: [12, 19, 3, 5, 2],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Sample Chart (No numeric data in code)',
                        color: '#f0f0f0',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        labels: {
                            color: '#f0f0f0'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#f0f0f0'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#f0f0f0'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }
    
    /**
     * Creates a chart from available numeric data
     */
    createDataChart(canvas, data) {
        const ctx = canvas.getContext('2d');
        
        // Get arrays and numeric values
        const arrays = {};
        const values = {};
        
        for (const [key, value] of Object.entries(data)) {
            if (Array.isArray(value)) {
                arrays[key] = value;
            } else {
                values[key] = value;
            }
        }
        
        // Create chart based on available data
        if (Object.keys(arrays).length > 0) {
            // We have at least one array, use it for a chart
            const firstArrayKey = Object.keys(arrays)[0];
            const firstArray = arrays[firstArrayKey];
            
            // Generate dataset
            const datasets = [];
            let useIndices = true;
            
            // Check if we have other arrays with the same length
            for (const [key, array] of Object.entries(arrays)) {
                if (array.length === firstArray.length) {
                    datasets.push({
                        label: key,
                        data: array,
                        borderColor: this.getRandomColor(),
                        backgroundColor: this.getRandomColor(0.2),
                        tension: 0.4
                    });
                }
            }
            
            // If we have only one array, create a special dataset
            if (datasets.length === 0) {
                datasets.push({
                    label: firstArrayKey,
                    data: firstArray,
                    borderColor: this.getRandomColor(),
                    backgroundColor: this.getRandomColor(0.2),
                    tension: 0.4
                });
            }
            
            // Create labels (indices or values of another array)
            const labels = Array.from({length: firstArray.length}, (_, i) => i);
            
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Data Visualization',
                            color: '#f0f0f0',
                            font: {
                                size: 16
                            }
                        },
                        legend: {
                            labels: {
                                color: '#f0f0f0'
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: '#f0f0f0'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        },
                        y: {
                            ticks: {
                                color: '#f0f0f0'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        }
                    }
                }
            });
        } else if (Object.keys(values).length > 0) {
            // Create a bar chart with the numeric values
            const labels = Object.keys(values);
            const dataValues = Object.values(values);
            
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Variable Values',
                        data: dataValues,
                        backgroundColor: labels.map(() => this.getRandomColor(0.7)),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Numeric Variables',
                            color: '#f0f0f0',
                            font: {
                                size: 16
                            }
                        },
                        legend: {
                            labels: {
                                color: '#f0f0f0'
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: '#f0f0f0'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        },
                        y: {
                            ticks: {
                                color: '#f0f0f0'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });
        } else {
            // Fallback to sample chart
            this.createSampleChart(canvas);
        }
    }
    
    /**
     * Creates a flow diagram for code visualization
     */
    createFlowDiagram(container, codeLines) {
        // Create nodes for each line of code
        const nodes = new vis.DataSet();
        const edges = new vis.DataSet();
        
        let nodeId = 0;
        let prevNodeId = null;
        let indentationLevels = []; // Track indentation level stacks
        
        codeLines.forEach((line, lineIndex) => {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith('#')) {
                const indentation = line.search(/\S|$/);
                const currentLevel = indentation / 4; // Assuming 4 spaces per indentation level
                
                // Create node for this line
                const node = {
                    id: nodeId,
                    label: `${lineIndex + 1}: ${trimmedLine}`,
                    level: currentLevel,
                    lineNumber: lineIndex + 1,
                    shape: this.getNodeShape(trimmedLine),
                    color: this.getNodeColor(trimmedLine),
                    font: { color: '#f0f0f0' }
                };
                nodes.add(node);
                
                // Handle indentation for proper edge creation
                while (indentationLevels.length > 0 && indentationLevels[indentationLevels.length - 1].level >= currentLevel) {
                    // Close blocks with higher indentation
                    indentationLevels.pop();
                }
                
                // Connect to previous node at same or higher level
                if (prevNodeId !== null) {
                    if (indentationLevels.length > 0 && currentLevel > indentationLevels[indentationLevels.length - 1].level) {
                        // Connect to parent block node
                        edges.add({
                            from: indentationLevels[indentationLevels.length - 1].nodeId,
                            to: nodeId,
                            arrows: 'to',
                            color: { color: '#3498db' },
                            width: 2
                        });
                    } else {
                        // Connect to previous node
                        edges.add({
                            from: prevNodeId,
                            to: nodeId,
                            arrows: 'to',
                            color: { color: '#3498db' },
                            width: 2
                        });
                    }
                }
                
                // Track block start for control structures
                if (trimmedLine.endsWith(':')) {
                    indentationLevels.push({
                        level: currentLevel,
                        nodeId: nodeId
                    });
                }
                
                prevNodeId = nodeId;
                nodeId++;
            }
        });
        
        // Create network
        const data = { nodes, edges };
        const options = {
            layout: {
                hierarchical: {
                    direction: 'UD',
                    sortMethod: 'directed',
                    levelSeparation: 50,
                    nodeSpacing: 150
                }
            },
            physics: {
                enabled: false
            },
            interaction: {
                navigationButtons: true,
                keyboard: true,
                tooltipDelay: 200
            },
            nodes: {
                margin: 10,
                borderWidth: 1,
                borderWidthSelected: 2,
                shadow: true,
                shape: 'box'
            },
            edges: {
                smooth: {
                    type: 'curvedCW',
                    roundness: 0.2
                }
            }
        };
        
        new vis.Network(container, data, options);
    }
    
    /**
     * Get node shape based on line content
     */
    getNodeShape(line) {
        if (line.includes('if') || line.includes('elif') || line.includes('else')) return 'diamond';
        if (line.includes('for') || line.includes('while')) return 'box';
        if (line.includes('def ')) return 'ellipse';
        if (line.includes('class ')) return 'hexagon';
        if (line.includes('print(')) return 'dot';
        if (line.includes('return ')) return 'star';
        return 'box';
    }
    
    /**
     * Get node color based on line content
     */
    getNodeColor(line) {
        if (line.includes('if') || line.includes('elif') || line.includes('else')) return { background: '#e74c3c', border: '#c0392b' };
        if (line.includes('for') || line.includes('while')) return { background: '#2ecc71', border: '#27ae60' };
        if (line.includes('def ')) return { background: '#f1c40f', border: '#f39c12' };
        if (line.includes('class ')) return { background: '#9b59b6', border: '#8e44ad' };
        if (line.includes('print(')) return { background: '#3498db', border: '#2980b9' };
        if (line.includes('return ')) return { background: '#e67e22', border: '#d35400' };
        return { background: '#7f8c8d', border: '#2c3e50' };
    }
    
    /**
     * Generate a random color
     */
    getRandomColor(alpha = 1) {
        const colors = [
            `rgba(52, 152, 219, ${alpha})`,  // Blue
            `rgba(46, 204, 113, ${alpha})`,  // Green
            `rgba(155, 89, 182, ${alpha})`,  // Purple
            `rgba(241, 196, 15, ${alpha})`,  // Yellow
            `rgba(230, 126, 34, ${alpha})`,  // Orange
            `rgba(231, 76, 60, ${alpha})`,   // Red
            `rgba(26, 188, 156, ${alpha})`,  // Turquoise
            `rgba(236, 240, 241, ${alpha})`  // Light Gray
        ];
        
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    /**
     * Format values for display
     */
    formatValue(value) {
        if (typeof value === 'string') {
            return `"${value}"`;
        } else if (Array.isArray(value)) {
            return `[Array with ${value.length} items]`;
        } else if (typeof value === 'object' && value !== null) {
            return `{Object with ${Object.keys(value).length} keys}`;
        } else {
            return String(value);
        }
    }
    
    /**
     * Show empty state message
     */
    showEmptyState(element, message) {
        element.innerHTML = `
            <div class="empty-state-message">
                <i class="fas fa-info-circle"></i>
                <p>${message}</p>
            </div>
        `;
    }
    
    /**
     * Remove empty state message
     */
    removeEmptyState(element) {
        const emptyState = element.querySelector('.empty-state-message');
        if (emptyState) {
            emptyState.remove();
        }
    }
    
    /**
     * Download the current visualization
     */
    downloadVisualization(type) {
        if (type === 'data') {
            // Download data as JSON
            const jsonStr = JSON.stringify(this.dataVariables, null, 2);
            this.downloadFile(jsonStr, 'python-data.json', 'application/json');
        } else if (type === 'graph') {
            // Download chart as image
            const canvas = document.getElementById('visualization-chart');
            if (canvas) {
                const dataUrl = canvas.toDataURL('image/png');
                this.downloadFile(dataUrl, 'python-chart.png', 'image/png', true);
            }
        } else if (type === 'flow') {
            // Download code as text
            this.downloadFile(this.currentCode, 'python-code.py', 'text/plain');
        }
    }
    
    /**
     * Helper method to download a file
     */
    downloadFile(content, filename, contentType, isDataUrl = false) {
        const a = document.createElement('a');
        
        if (isDataUrl) {
            a.href = content;
        } else {
            const blob = new Blob([content], { type: contentType });
            const url = URL.createObjectURL(blob);
            a.href = url;
        }
        
        a.download = filename;
        a.click();
    }
}

// Initialize the visualizer
const visualizer = new PyLearnVisualizer();

// Export to window object
window.pyLearnVisualizer = visualizer;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    visualizer.initialize();
    
    // Add download button functionality
    document.getElementById('downloadViz').addEventListener('click', () => {
        const activeTab = document.querySelector('.visualization-tab.active');
        if (!activeTab) return;
        
        const tabId = activeTab.getAttribute('data-tab');
        if (tabId === 'dataView') {
            visualizer.downloadVisualization('data');
        } else if (tabId === 'graphView') {
            visualizer.downloadVisualization('graph');
        } else if (tabId === 'flowView') {
            visualizer.downloadVisualization('flow');
        }
    });
});

// Add custom CSS for visualizations
const style = document.createElement('style');
style.textContent = `
.variable-container {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    margin-bottom: 1rem;
    overflow: hidden;
}

.variable-header {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    background-color: rgba(0, 0, 0, 0.3);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.variable-name {
    font-weight: bold;
    color: var(--accent-color);
}

.variable-type {
    color: var(--text-secondary);
    font-size: 0.9em;
}

.variable-value {
    padding: 0.5rem 1rem;
    font-family: var(--font-code);
}

.list-visualization, .dict-visualization {
    max-height: 300px;
    overflow-y: auto;
    padding: 0.5rem;
}

.list-items, .dict-items {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.list-item, .dict-item {
    display: flex;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    overflow: hidden;
}

.list-index, .dict-key {
    background-color: rgba(52, 152, 219, 0.3);
    padding: 0.5rem;
    min-width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: var(--accent-color);
}

.dict-arrow {
    display: flex;
    align-items: center;
    padding: 0 0.5rem;
    color: var(--text-secondary);
}

.list-value, .dict-value {
    padding: 0.5rem;
    flex: 1;
    font-family: var(--font-code);
}

#flow-diagram {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 6px;
}

.empty-state-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-secondary);
    padding: 2rem;
    text-align: center;
}

.empty-state-message i {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: var(--accent-color);
}

.data-visualization-container {
    padding: 1rem;
    height: 100%;
    overflow-y: auto;
}

.visualization-table {
    background-color: var(--secondary-background) !important;
    color: var(--text-color) !important;
    border-radius: var(--border-radius) !important;
    overflow: hidden !important;
    width: 100% !important;
}

.visualization-table th {
    background-color: rgba(0, 0, 0, 0.3) !important;
    color: var(--accent-color) !important;
    font-weight: bold !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.visualization-table td {
    padding: 0.5rem 1rem !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.visualization-table tr:hover td {
    background-color: rgba(255, 255, 255, 0.05) !important;
}

.viz-tab-content {
    height: 100%;
    overflow: hidden;
    display: none;
}

.viz-tab-content.active {
    display: block;
}

`;

document.head.appendChild(style);