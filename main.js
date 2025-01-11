document.addEventListener('DOMContentLoaded', () => {
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
        const code = editor.getValue();
        const stats = {
            lines: code.split('\n').length,
            characters: code.length,
            words: code.trim().split(/\s+/).length
        };
        lineCountElement.textContent = `Lines: ${stats.lines}`;
        charCountElement.textContent = `Chars: ${stats.characters}`;
    };

    const handleExampleClick = (exampleKey) => {
        if (examples[exampleKey]) {
            consoleOutput.innerHTML = '';
            editor.setValue(examples[exampleKey]);
            localStorage.setItem('pylearn-code', editor.getValue());
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

    editor.on('change', () => {
        localStorage.setItem('pylearn-code', editor.getValue());
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
        editor.setValue('');
        localStorage.setItem('pylearn-code', '');
        updateCodeStats();
    });

    saveFile.addEventListener('click', () => {
        const filename = prompt('Enter filename to save:', 'script.py');
        if (filename) {
            fileManager.saveToStorage(filename, editor.getValue());
            consoleOutput.innerHTML += `<div class="output-success">File "${filename}" saved successfully!</div>`;
        }
    });

    exportFile.addEventListener('click', () => {
        const filename = prompt('Enter filename to export:', 'script.py');
        if (filename) {
            fileManager.exportToFile(filename, editor.getValue());
            consoleOutput.innerHTML += `<div class="output-success">File "${filename}" exported successfully!</div>`;
        }
    });

    if (localStorage.getItem('pylearn-theme') === 'dark') {
        document.body.classList.add('dark-theme');
        toggleTheme.innerHTML = '<i class="fas fa-sun"></i>';
    }

    const savedCode = localStorage.getItem('pylearn-code');
    if (savedCode) {
        editor.setValue(savedCode);
    }
    updateCodeStats();
});

// Add after existing initialization code
const visualizer = new CodeVisualizer();

// Add visualization toggle handlers
document.getElementById('toggleFlowEditor').addEventListener('click', () => {
    visualizer.updateFlowDiagram(editor.getValue());
    document.querySelector('.visualization-panel').classList.toggle('active');
});

document.getElementById('toggleDataView').addEventListener('click', () => {
    visualizer.updateDataView(editor.getValue());
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