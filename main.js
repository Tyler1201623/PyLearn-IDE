document.addEventListener('DOMContentLoaded', () => {
    const codeEditor = document.getElementById('codeEditor');
    const consoleOutput = document.getElementById('consoleOutput');
    const toggleTheme = document.getElementById('toggleTheme');
    const toggleResources = document.getElementById('toggleResources');
    const resourcesPanel = document.querySelector('.resources-panel');
    const closeResources = document.getElementById('closeResources');
    const codeExamples = document.getElementById('codeExamples');
    const clearConsole = document.getElementById('clearConsole');
    const clearCode = document.getElementById('clearCode');
    const saveFile = document.getElementById('saveFile');
    const exportFile = document.getElementById('exportFile');

    const examples = {
        hello: 'print("Hello, World!")',
        variables: `# Input and display user information
name = input("Enter your name: ")
age = input("Enter your age: ")
print(f"Name: {name}, Age: {age}")`,
        operators: `# Basic arithmetic operations
a = int(input("Enter first number: "))
b = int(input("Enter second number: "))
print(f"Sum: {a + b}")
print(f"Product: {a * b}")`,
        conditionals: `# Age verification program
age = int(input("Enter your age: "))
if age >= 18:
    print("You are an Adult")
else:
    print("You are a Minor")`,
        loops: 'for i in range(5):\n    print(f"Count: {i}")',
        functions: `def greet(name):
    return f"Hello, {name}!"

user_name = input("Enter your name: ")
print(greet(user_name))`,
        lists: 'fruits = ["apple", "banana", "orange"]\nfor fruit in fruits:\n    print(fruit)',
        dictionaries: `person = {
    "name": input("Enter name: "),
    "age": input("Enter age: ")
}
print(f"Person's name: {person['name']}")
print(f"Person's age: {person['age']}")`
    };

    const statsContainer = document.createElement('div');
    statsContainer.className = 'code-stats';
    const lineCountElement = document.createElement('span');
    lineCountElement.id = 'lineCount';
    const charCountElement = document.createElement('span');
    charCountElement.id = 'charCount';
    statsContainer.appendChild(lineCountElement);
    statsContainer.appendChild(charCountElement);
    document.querySelector('.editor-header').appendChild(statsContainer);

    const updateCodeStats = () => {
        const code = codeEditor.value;
        const stats = {
            lines: code.split('\n').length,
            characters: code.length,
            words: code.trim().split(/\s+/).length
        };
        lineCountElement.textContent = `Lines: ${stats.lines}`;
        charCountElement.textContent = `Chars: ${stats.characters}`;
    };

    class VersionControl {
        constructor() {
            this.versions = [];
            this.currentVersion = -1;
        }

        saveVersion(code) {
            this.versions = this.versions.slice(0, this.currentVersion + 1);
            this.versions.push({
                code: code,
                timestamp: new Date().toISOString()
            });
            this.currentVersion++;
            this.saveToLocalStorage();
        }

        undo() {
            if (this.currentVersion > 0) {
                this.currentVersion--;
                return this.versions[this.currentVersion].code;
            }
            return null;
        }

        redo() {
            if (this.currentVersion < this.versions.length - 1) {
                this.currentVersion++;
                return this.versions[this.currentVersion].code;
            }
            return null;
        }

        saveToLocalStorage() {
            localStorage.setItem('code-versions', JSON.stringify({
                versions: this.versions,
                currentVersion: this.currentVersion
            }));
        }

        loadFromLocalStorage() {
            const saved = JSON.parse(localStorage.getItem('code-versions'));
            if (saved) {
                this.versions = saved.versions;
                this.currentVersion = saved.currentVersion;
            }
        }
    }

    const versionControl = new VersionControl();
    versionControl.loadFromLocalStorage();

    setInterval(() => {
        if (codeEditor.value) {
            versionControl.saveVersion(codeEditor.value);
            updateCodeStats();
        }
    }, 30000);

    const formatCode = () => {
        const lines = codeEditor.value.split('\n');
        let indentLevel = 0;
        const formattedLines = lines.map(line => {
            const trimmedLine = line.trim();
            if (trimmedLine.endsWith(':')) {
                const formatted = '    '.repeat(indentLevel) + trimmedLine;
                indentLevel++;
                return formatted;
            } else if (trimmedLine === '') {
                return '';
            }
            return '    '.repeat(indentLevel) + trimmedLine;
        });
        codeEditor.value = formattedLines.join('\n');
        updateCodeStats();
    };

    const fileManager = {
        saveToStorage(filename, content) {
            const files = JSON.parse(localStorage.getItem('pylearn-files') || '{}');
            files[filename] = {
                content: content,
                lastModified: new Date().toISOString()
            };
            localStorage.setItem('pylearn-files', JSON.stringify(files));
        },

        exportToFile(filename, content) {
            const blob = new Blob([content], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename.endsWith('.py') ? filename : `${filename}.py`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
    };

    const shortcuts = {
        'Control+s': (e) => {
            e.preventDefault();
            saveFile.click();
        },
        'Control+z': () => {
            const code = versionControl.undo();
            if (code) {
                codeEditor.value = code;
                updateCodeStats();
            }
        },
        'Control+y': () => {
            const code = versionControl.redo();
            if (code) {
                codeEditor.value = code;
                updateCodeStats();
            }
        },
        'Control+Enter': () => document.getElementById('runCode').click(),
        'Control+l': () => clearConsole.click(),
        'Control+Shift+f': formatCode
    };

    document.addEventListener('keydown', (e) => {
        const key = `${e.ctrlKey ? 'Control+' : ''}${e.shiftKey ? 'Shift+' : ''}${e.key}`;
        if (shortcuts[key]) {
            e.preventDefault();
            shortcuts[key](e);
        }
    });

    const handleExampleClick = (exampleKey) => {
        if (examples[exampleKey]) {
            codeEditor.value = examples[exampleKey];
            localStorage.setItem('pylearn-code', codeEditor.value);
            updateCodeStats();
            const selectedElement = document.querySelector(`[data-example="${exampleKey}"]`);
            if (selectedElement) {
                selectedElement.classList.add('selected');
                setTimeout(() => selectedElement.classList.remove('selected'), 500);
            }
        }
    };

    document.querySelectorAll('[data-example]').forEach(element => {
        element.addEventListener('click', () => {
            const exampleKey = element.getAttribute('data-example');
            handleExampleClick(exampleKey);
        });
    });

    codeExamples.addEventListener('change', () => {
        handleExampleClick(codeExamples.value);
    });

    codeEditor.addEventListener('input', () => {
        versionControl.saveVersion(codeEditor.value);
        updateCodeStats();
    });

    toggleTheme.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        toggleTheme.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('pylearn-theme', isDark ? 'dark' : 'light');
    });

    toggleResources.addEventListener('click', () => {
        resourcesPanel.classList.toggle('active');
    });

    closeResources.addEventListener('click', () => {
        resourcesPanel.classList.remove('active');
    });

    clearConsole.addEventListener('click', () => {
        consoleOutput.innerHTML = '';
    });

    clearCode.addEventListener('click', () => {
        codeEditor.value = '';
        localStorage.setItem('pylearn-code', '');
        updateCodeStats();
    });

    saveFile.addEventListener('click', () => {
        const filename = prompt('Enter filename to save:', 'script.py');
        if (filename) {
            fileManager.saveToStorage(filename, codeEditor.value);
            consoleOutput.innerHTML += `<div class="output-success">File "${filename}" saved successfully!</div>`;
        }
    });

    exportFile.addEventListener('click', () => {
        const filename = prompt('Enter filename to export:', 'script.py');
        if (filename) {
            fileManager.exportToFile(filename, codeEditor.value);
            consoleOutput.innerHTML += `<div class="output-success">File "${filename}" exported successfully!</div>`;
        }
    });

    if (localStorage.getItem('pylearn-theme') === 'dark') {
        document.body.classList.add('dark-theme');
        toggleTheme.innerHTML = '<i class="fas fa-sun"></i>';
    }

    const savedCode = localStorage.getItem('pylearn-code');
    if (savedCode) {
        codeEditor.value = savedCode;
        updateCodeStats();
    } else {
        updateCodeStats();
    }
});

// Add after existing initialization code
const visualizer = new CodeVisualizer();

// Add visualization toggle handlers
document.getElementById('toggleFlowEditor').addEventListener('click', () => {
    visualizer.updateFlowDiagram(codeEditor.value);
    document.querySelector('.visualization-panel').classList.toggle('active');
});

document.getElementById('toggleDataView').addEventListener('click', () => {
    visualizer.updateDataView(codeEditor.value);
    document.querySelector('.visualization-panel').classList.toggle('active');
});

document.getElementById('togglePlotView').addEventListener('click', () => {
    // Example plot data
    const plotData = {
        labels: ['January', 'February', 'March'],
        datasets: [{
            label: 'Sample Data',
            data: [65, 59, 80],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };
    visualizer.updatePlotView(plotData);
    document.querySelector('.visualization-panel').classList.toggle('active');
});
