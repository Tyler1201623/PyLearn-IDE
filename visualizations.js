class CodeVisualizer {
    constructor() {
        this.network = null;
        this.dataGrid = null;
        this.plotChart = null;
        this.initializeVisualizers();
        this.setupEventListeners();
    }

    initializeVisualizers() {
        // Flow Editor
        const container = document.getElementById('flowEditor');
        const data = {
            nodes: new vis.DataSet([]),
            edges: new vis.DataSet([])
        };
        const options = {
            manipulation: true,
            height: '100%',
            physics: {
                enabled: true,
                hierarchicalRepulsion: {
                    nodeDistance: 150
                }
            },
            layout: {
                hierarchical: {
                    direction: 'UD',
                    sortMethod: 'directed',
                    levelSeparation: 150
                }
            }
        };
        this.network = new vis.Network(container, data, options);

        // Data Viewer initialization with Grid.js
        const dataContainer = document.getElementById('dataViewer');
        this.dataGrid = new gridjs.Grid({
            columns: ['Name', 'Value'],
            data: [],
            search: true,
            sort: true,
            pagination: true
        }).render(dataContainer);

        // Plot Viewer with Chart.js
        const ctx = document.createElement('canvas');
        document.getElementById('plotViewer').appendChild(ctx);
        this.plotChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: true,
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    setupEventListeners() {
        const codeEditor = document.getElementById('codeEditor');
        codeEditor.addEventListener('input', () => {
            this.updateFlowDiagram(codeEditor.value);
            this.detectAndVisualizeData(codeEditor.value);
        });
    }

    detectAndVisualizeData(code) {
        // Detect data structures
        if (code.includes('plt.')) {
            this.generatePlotPreview(code);
        }
        if (code.includes('pandas') || code.includes('csv') || code.includes('json')) {
            this.visualizeDataStructures(code);
        }
    }

    generatePlotPreview(code) {
        // Sample plot data based on code content
        const plotData = {
            labels: ['A', 'B', 'C', 'D'],
            datasets: [{
                label: 'Code Output',
                data: [12, 19, 3, 5],
                borderColor: '#3498db',
                tension: 0.4
            }]
        };
        this.updatePlotView(plotData);
    }

    visualizeDataStructures(code) {
        const sampleData = [
            { id: 1, name: 'Data 1', value: 100 },
            { id: 2, name: 'Data 2', value: 200 },
            { id: 3, name: 'Data 3', value: 300 }
        ];
        this.updateDataView(sampleData);
    }

    updateFlowDiagram(pythonCode) {
        const nodes = new vis.DataSet();
        const edges = new vis.DataSet();
        
        const lines = pythonCode.split('\n');
        let nodeId = 0;
        let prevNodeId = null;
        
        lines.forEach(line => {
            if (line.trim()) {
                const node = {
                    id: nodeId,
                    label: line.trim(),
                    shape: this.getNodeShape(line),
                    color: this.getNodeColor(line),
                    font: { color: '#ecf0f1' }
                };
                nodes.add(node);
                
                if (prevNodeId !== null) {
                    edges.add({
                        from: prevNodeId,
                        to: nodeId,
                        arrows: 'to',
                        color: { color: '#3498db' }
                    });
                }
                
                prevNodeId = nodeId;
                nodeId++;
            }
        });

        const container = document.getElementById('flowEditor');
        const data = { nodes, edges };
        const options = {
            physics: {
                enabled: true,
                hierarchicalRepulsion: {
                    nodeDistance: 150
                }
            },
            layout: {
                hierarchical: {
                    direction: 'UD',
                    sortMethod: 'directed'
                }
            }
        };

        if (!this.network) {
            this.network = new vis.Network(container, data, options);
        } else {
            this.network.setData(data);
        }
    }

    updateDataView(data) {
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch {
                data = this.parseCSV(data);
            }
        }
        this.dataGrid.updateConfig({ data }).forceRender();
    }

    updatePlotView(plotData) {
        this.plotChart.data = plotData;
        this.plotChart.update();
    }

    getNodeColor(line) {
        if (line.includes('if') || line.includes('else')) return '#e74c3c';
        if (line.includes('for') || line.includes('while')) return '#2ecc71';
        if (line.includes('def')) return '#f1c40f';
        if (line.includes('class')) return '#9b59b6';
        return '#3498db';
    }

    getNodeShape(line) {
        if (line.includes('if') || line.includes('else')) return 'diamond';
        if (line.includes('for') || line.includes('while')) return 'box';
        if (line.includes('def')) return 'ellipse';
        if (line.includes('class')) return 'hexagon';
        return 'box';
    }

    parseCSV(csvString) {
        return csvString.split('\n')
            .map(row => row.split(','))
            .filter(row => row.length > 0);
    }
}

// Initialize visualizer when document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.codeVisualizer = new CodeVisualizer();
});