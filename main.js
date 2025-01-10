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

    const examples = {
        hello: 'print("Hello, World!")',
        variables: 'name = "Python"\nage = 30\nprint(f"Name: {name}, Age: {age}")',
        operators: 'a = 10\nb = 5\nprint(f"Sum: {a + b}")\nprint(f"Product: {a * b}")',
        conditionals: 'age = 18\nif age >= 18:\n    print("Adult")\nelse:\n    print("Minor")',
        loops: 'for i in range(5):\n    print(f"Count: {i}")',
        functions: 'def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("Python Learner"))',
        lists: 'fruits = ["apple", "banana", "orange"]\nfor fruit in fruits:\n    print(fruit)',
        dictionaries: 'person = {\n    "name": "John",\n    "age": 30\n}\nprint(person["name"])'
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

    const shortcuts = {
        'Control+s': () => {
            versionControl.saveVersion(codeEditor.value);
            updateCodeStats();
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
            shortcuts[key]();
        }
    });

    // Enhanced examples with better click handling
    const handleExampleClick = (exampleKey) => {
        if (examples[exampleKey]) {
            codeEditor.value = examples[exampleKey];
            localStorage.setItem('pylearn-code', codeEditor.value);
            updateCodeStats();
            // Add visual feedback
            const selectedElement = document.querySelector(`[data-example="${exampleKey}"]`);
            selectedElement.classList.add('selected');
            setTimeout(() => selectedElement.classList.remove('selected'), 500);
        }
    };

    // Add click listeners to both dropdown and sidebar examples
    document.querySelectorAll('[data-example]').forEach(element => {
        element.addEventListener('click', () => {
            const exampleKey = element.getAttribute('data-example');
            handleExampleClick(exampleKey);
        });
    });

    // Handle dropdown changes
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

    codeExamples.addEventListener('change', () => {
        if (examples[codeExamples.value]) {
            codeEditor.value = examples[codeExamples.value];
            localStorage.setItem('pylearn-code', codeEditor.value);
            updateCodeStats();
        }
    });

    clearConsole.addEventListener('click', () => {
        consoleOutput.innerHTML = '';
    });

    clearCode.addEventListener('click', () => {
        codeEditor.value = '';
        localStorage.setItem('pylearn-code', '');
        updateCodeStats();
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
