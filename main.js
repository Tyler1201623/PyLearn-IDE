/**
 * PyLearn IDE Main Application
 * Integrates all components and manages the application state
 */

class PyLearnApp {
    constructor() {
        this.initialized = false;
        this.editor = null;
        this.currentTheme = 'dark';
        this.settings = {
            fontSize: 14,
            tabSize: 4,
            autoComplete: true,
            liveExecution: false,
            theme: 'dark'
        };
        
        // Create assets directory reference
        this.assets = {
            logo: 'assets/logo.png',
            favicon: 'assets/favicon.ico'
        };
    }
    
    /**
     * Initialize the application
     */
    initialize() {
        if (this.initialized) return;
        
        // Initialize editor
        this.initializeEditor();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load settings from localStorage
        this.loadSettings();
        
        // Initialize plugins
        this.initializePlugins();
        
        this.initialized = true;
        console.log('PyLearn IDE initialized');
        
        // Show welcome message
        this.showWelcomeMessage();
    }
    
    /**
     * Initialize the code editor
     */
    initializeEditor() {
        const editorElement = document.getElementById('codeEditor');
        
        // Create editor instance
        this.editor = CodeMirror(editorElement, {
            mode: 'python',
            theme: 'monokai',
            lineNumbers: true,
            autoCloseBrackets: true,
            matchBrackets: true,
            indentUnit: 4,
            tabSize: 4,
            indentWithTabs: false,
            extraKeys: {
                "Tab": (cm) => {
                    if (cm.somethingSelected()) {
                        cm.indentSelection("add");
                    } else {
                        cm.replaceSelection("    ", "end", "+input");
                    }
                }
            }
        });
        
        // Set initial code
        this.editor.setValue(`# Welcome to PyLearn IDE
# Let's create some variables to visualize

# A simple variable
message = "Hello, Python!"

# A list for data visualization
numbers = [5, 10, 15, 20, 25]

# A dictionary
person = {
    "name": "Alex",
    "age": 28,
    "languages": ["Python", "JavaScript", "Go"]
}

# Print some output
print(f"Message: {message}")
print(f"Numbers: {numbers}")
print(f"Person: {person}")

# Create a calculation
total = sum(numbers)
average = total / len(numbers)
print(f"Total: {total}, Average: {average}")
`);
        
        // Editor change event
        this.editor.on('change', (cm) => {
            const code = cm.getValue();
            
            // Update visualizations in real-time if enabled
            if (this.settings.liveExecution && window.pyLearnVisualizer) {
                window.pyLearnVisualizer.updateFlowView(code);
            }
            
            // Auto-save code to localStorage
            this.saveCodeToLocalStorage(code);
        });
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Run button
        document.getElementById('runButton').addEventListener('click', () => {
            this.runCode();
        });
        
        // Load examples
        document.querySelectorAll('.dropdown-content a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const example = link.getAttribute('data-example');
                this.loadExample(example);
            });
        });
        
        // Toggle visualization panel
        document.getElementById('visualizeToggle').addEventListener('click', () => {
            this.toggleVisualizationPanel();
        });
        
        // Console toggle
        document.getElementById('consoleToggle').addEventListener('click', () => {
            this.toggleConsole();
        });
        
        // Clear console
        document.getElementById('clearConsole').addEventListener('click', () => {
            this.clearConsole();
        });
        
        // Format code
        document.getElementById('formatCode').addEventListener('click', () => {
            this.formatCode();
        });
        
        // Auto-complete
        document.getElementById('autocomplete').addEventListener('click', () => {
            this.triggerAutoComplete();
        });
        
        // Settings button
        document.getElementById('settingsButton').addEventListener('click', () => {
            this.showSettings();
        });
        
        // Help button
        document.getElementById('helpButton').addEventListener('click', () => {
            if (window.resourceManager) {
                window.resourceManager.showCategory('basics');
            }
        });
        
        // Console resize handle
        const resizeHandle = document.getElementById('consoleResizeHandle');
        let isResizing = false;
        
        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', () => {
                isResizing = false;
                document.removeEventListener('mousemove', handleMouseMove);
            });
        });
        
        const handleMouseMove = (e) => {
            if (!isResizing) return;
            
            const consoleContainer = document.getElementById('consoleContainer');
            const consoleRect = consoleContainer.getBoundingClientRect();
            const mainContent = document.querySelector('.main-content');
            const mainRect = mainContent.getBoundingClientRect();
            
            // Calculate new height based on mouse position
            const newHeight = Math.max(100, Math.min(500, mainRect.bottom - e.clientY));
            consoleContainer.style.height = `${newHeight}px`;
        };
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+Enter or Cmd+Enter to run code
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.runCode();
            }
            
            // Ctrl+S or Cmd+S to save code
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveCodeToFile();
            }
            
            // Ctrl+/ or Cmd+/ to toggle comment
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                this.toggleComment();
            }
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.editor.refresh();
        });
    }
    
    /**
     * Initialize plugins and integrations
     */
    initializePlugins() {
        // Initialize the visualizer if available
        if (window.pyLearnVisualizer) {
            window.pyLearnVisualizer.initialize();
        }
        
        // Initialize resource manager if available
        if (window.resourceManager) {
            window.resourceManager.initialize();
        }
    }
    
    /**
     * Run the current code
     */
    runCode() {
        const code = this.editor.getValue();
        
        // Show console if collapsed
        const consoleContainer = document.getElementById('consoleContainer');
        if (consoleContainer.classList.contains('collapsed')) {
            this.toggleConsole();
        }
        
        // Show visualization panel
        document.getElementById('visualizationContainer').classList.add('visible');
        
        // Run the code using Brython
        if (window.pyRunCode) {
            window.pyRunCode(code);
        } else {
            this.showToast('Python runtime is not available', 'error');
        }
    }
    
    /**
     * Load an example into the editor
     */
    loadExample(exampleName) {
        const examples = {
            basic: `# Basic Python Example
name = "Python Learner"
age = 25

# String operations
greeting = f"Hello, {name}!"
print(greeting)

# Conditional statements
if age >= 18:
    print("You are an adult")
else:
    print("You are a minor")

# Lists and loops
languages = ["Python", "JavaScript", "Go", "Rust"]
print("\\nProgramming languages:")
for i, lang in enumerate(languages):
    print(f"{i+1}. {lang}")
`,

            functions: `# Functions Example
def calculate_area(shape, *dimensions):
    """Calculate area of different shapes.
    Supported shapes: circle, rectangle, triangle
    """
    if shape == "circle":
        # Area of circle = π * r^2
        return 3.14159 * dimensions[0] ** 2
    elif shape == "rectangle":
        # Area of rectangle = length * width
        return dimensions[0] * dimensions[1]
    elif shape == "triangle":
        # Area of triangle = 0.5 * base * height
        return 0.5 * dimensions[0] * dimensions[1]
    else:
        return "Shape not supported"

# Test the function
print(f"Circle area: {calculate_area('circle', 5)}")
print(f"Rectangle area: {calculate_area('rectangle', 4, 6)}")
print(f"Triangle area: {calculate_area('triangle', 3, 8)}")

# Function with default parameters
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print("\\nGreetings:")
print(greet("Alice"))
print(greet("Bob", "Hi"))
print(greet("Charlie", "Welcome"))
`,

            classes: `# Classes and Objects Example
class Student:
    """A class representing a student."""
    
    # Class variable
    school = "Python Programming School"
    
    def __init__(self, name, student_id, grades=None):
        # Instance variables
        self.name = name
        self.student_id = student_id
        self.grades = grades or []
    
    def add_grade(self, grade):
        """Add a grade to the student's record."""
        if 0 <= grade <= 100:
            self.grades.append(grade)
            return True
        return False
    
    def get_average(self):
        """Calculate the average grade."""
        if not self.grades:
            return 0
        return sum(self.grades) / len(self.grades)
    
    def __str__(self):
        """String representation of the student."""
        return f"Student(name={self.name}, id={self.student_id})"

# Create student objects
alice = Student("Alice Smith", "A12345")
bob = Student("Bob Johnson", "B67890", [85, 90, 78])

# Add grades for Alice
alice.add_grade(92)
alice.add_grade(88)
alice.add_grade(95)

# Print student information
print(f"School: {Student.school}\\n")
print(f"Student 1: {alice}")
print(f"Grades: {alice.grades}")
print(f"Average: {alice.get_average():.1f}\\n")

print(f"Student 2: {bob}")
print(f"Grades: {bob.grades}")
print(f"Average: {bob.get_average():.1f}")
`,

            data: `# Data Visualization Example
import random

# Create some data for visualization
months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
temperatures = [random.randint(50, 90) for _ in range(6)]
rainfall = [random.randint(0, 100) for _ in range(6)]

# Create a dictionary with weather data
weather_data = {
    "months": months,
    "temperatures": temperatures,
    "rainfall": rainfall
}

# Print the data
print("Weather Data:")
for i in range(len(months)):
    print(f"{months[i]}: {temperatures[i]}°F, {rainfall[i]}mm rain")

# Calculate some statistics
avg_temp = sum(temperatures) / len(temperatures)
max_temp = max(temperatures)
min_temp = min(temperatures)
total_rain = sum(rainfall)

print("\\nStatistics:")
print(f"Average temperature: {avg_temp:.1f}°F")
print(f"Maximum temperature: {max_temp}°F")
print(f"Minimum temperature: {min_temp}°F")
print(f"Total rainfall: {total_rain}mm")

# Additional data for visualization
cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"]
populations = [8.4, 3.9, 2.7, 2.3, 1.6]  # In millions

print("\\nCity Populations (millions):")
for i in range(len(cities)):
    print(f"{cities[i]}: {populations[i]}")
`,

            algorithms: `# Algorithm Example - Sorting and Searching
def bubble_sort(arr):
    """Sort array using bubble sort algorithm."""
    n = len(arr)
    for i in range(n):
        # Last i elements are already sorted
        for j in range(0, n - i - 1):
            # Swap if the element found is greater than the next element
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

def binary_search(arr, target):
    """Search for target using binary search algorithm."""
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid  # Target found
        elif arr[mid] < target:
            left = mid + 1  # Look in right half
        else:
            right = mid - 1  # Look in left half
    
    return -1  # Target not found

# Test the algorithms
numbers = [64, 34, 25, 12, 22, 11, 90]
print(f"Original array: {numbers}")

sorted_numbers = bubble_sort(numbers.copy())
print(f"Sorted array: {sorted_numbers}")

# Search for a value
target = 22
index = binary_search(sorted_numbers, target)
if index != -1:
    print(f"Found {target} at index {index}")
else:
    print(f"{target} not found in the array")

# Test with another value
target = 50
index = binary_search(sorted_numbers, target)
if index != -1:
    print(f"Found {target} at index {index}")
else:
    print(f"{target} not found in the array")
`
        };
        
        if (examples[exampleName]) {
            this.editor.setValue(examples[exampleName]);
            this.showToast(`Loaded ${exampleName} example`, 'success');
        } else {
            this.showToast(`Example '${exampleName}' not found`, 'error');
        }
    }
    
    /**
     * Toggle visualization panel
     */
    toggleVisualizationPanel() {
        const panel = document.getElementById('visualizationContainer');
        panel.classList.toggle('visible');
        
        // Update button text
        const button = document.getElementById('visualizeToggle');
        button.innerHTML = panel.classList.contains('visible') ? 
            '<i class="fas fa-chart-bar"></i> Hide Viz' : 
            '<i class="fas fa-chart-bar"></i> Visualize';
    }
    
    /**
     * Toggle console visibility
     */
    toggleConsole() {
        const container = document.getElementById('consoleContainer');
        container.classList.toggle('collapsed');
        
        // Update icon
        const button = document.getElementById('consoleToggle');
        const icon = button.querySelector('i');
        
        if (container.classList.contains('collapsed')) {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        } else {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        }
    }
    
    /**
     * Clear console output
     */
    clearConsole() {
        document.getElementById('consoleOutput').innerHTML = `
            <div class="console-empty-message">
                Console output cleared
            </div>
        `;
    }
    
    /**
     * Format code in the editor
     */
    formatCode() {
        // Simple indentation formatter
        const code = this.editor.getValue();
        const lines = code.split('\n');
        let formattedCode = '';
        let indentLevel = 0;
        
        for (let line of lines) {
            const trimmedLine = line.trim();
            
            // Skip empty lines
            if (trimmedLine === '') {
                formattedCode += '\n';
                continue;
            }
            
            // Reduce indent for lines ending a block
            if (trimmedLine.startsWith('}') || 
                trimmedLine.startsWith(']') || 
                trimmedLine.startsWith(')') ||
                trimmedLine === 'else:' ||
                trimmedLine === 'elif:' ||
                trimmedLine.startsWith('except:')) {
                indentLevel = Math.max(0, indentLevel - 1);
            }
            
            // Add proper indentation
            formattedCode += ' '.repeat(indentLevel * 4) + trimmedLine + '\n';
            
            // Increase indent for lines starting a new block
            if (trimmedLine.endsWith(':') || 
                trimmedLine.endsWith('{') || 
                trimmedLine.endsWith('[') || 
                trimmedLine.endsWith('(')) {
                indentLevel++;
            }
        }
        
        this.editor.setValue(formattedCode.trim());
        this.showToast('Code formatted', 'success');
    }
    
    /**
     * Trigger auto-complete in the editor
     */
    triggerAutoComplete() {
        // This is a simplified auto-complete implementation
        const cursor = this.editor.getCursor();
        const line = this.editor.getLine(cursor.line);
        const token = this.getTokenBeforeCursor(line, cursor.ch);
        
        // Simple auto-complete suggestions
        const suggestions = {
            'pr': 'print(',
            'if': 'if ',
            'for': 'for ',
            'def': 'def ',
            'cla': 'class ',
            'imp': 'import ',
            'ret': 'return ',
            'whi': 'while ',
            'try': 'try:\n    ',
            'exc': 'except ',
            'fin': 'finally:\n    ',
            'els': 'else:\n    '
        };
        
        // Check if token matches a suggestion
        for (const [prefix, completion] of Object.entries(suggestions)) {
            if (token.startsWith(prefix)) {
                // Remove the partial token
                this.editor.replaceRange('', 
                    {line: cursor.line, ch: cursor.ch - token.length}, 
                    {line: cursor.line, ch: cursor.ch}
                );
                
                // Insert the completion
                this.editor.replaceRange(completion, cursor);
                
                this.showToast('Code auto-completed', 'success');
                return;
            }
        }
        
        this.showToast('No auto-complete suggestions found', 'info');
    }
    
    /**
     * Get the token before the cursor
     */
    getTokenBeforeCursor(line, cursorPos) {
        let start = cursorPos;
        while (start > 0 && /[\w_]/.test(line.charAt(start - 1))) {
            start--;
        }
        return line.substring(start, cursorPos);
    }
    
    /**
     * Toggle comment for the current selection
     */
    toggleComment() {
        const selections = this.editor.listSelections();
        let isComment = true;
        
        // Check if all selected lines are comments
        for (const selection of selections) {
            const startLine = Math.min(selection.anchor.line, selection.head.line);
            const endLine = Math.max(selection.anchor.line, selection.head.line);
            
            for (let i = startLine; i <= endLine; i++) {
                const line = this.editor.getLine(i).trimStart();
                if (!line.startsWith('#')) {
                    isComment = false;
                    break;
                }
            }
            
            if (!isComment) break;
        }
        
        // Toggle comments based on the state
        for (const selection of selections) {
            const startLine = Math.min(selection.anchor.line, selection.head.line);
            const endLine = Math.max(selection.anchor.line, selection.head.line);
            
            for (let i = startLine; i <= endLine; i++) {
                if (isComment) {
                    // Remove comment
                    const line = this.editor.getLine(i);
                    const commentIndex = line.indexOf('#');
                    if (commentIndex !== -1) {
                        // Remove the # and a space if it exists
                        const afterComment = commentIndex + 1 < line.length && line[commentIndex + 1] === ' ' ? 2 : 1;
                        this.editor.replaceRange('', 
                            {line: i, ch: commentIndex}, 
                            {line: i, ch: commentIndex + afterComment}
                        );
                    }
                } else {
                    // Add comment
                    this.editor.replaceRange('# ', {line: i, ch: 0});
                }
            }
        }
    }
    
    /**
     * Save code to a file
     */
    saveCodeToFile() {
        const code = this.editor.getValue();
        const blob = new Blob([code], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'python_code.py';
        a.click();
        
        URL.revokeObjectURL(url);
        this.showToast('Code saved to file', 'success');
    }
    
    /**
     * Save code to localStorage
     */
    saveCodeToLocalStorage(code) {
        try {
            localStorage.setItem('pylearn_code', code);
        } catch (error) {
            console.error('Error saving code to localStorage:', error);
        }
    }
    
    /**
     * Load code from localStorage
     */
    loadCodeFromLocalStorage() {
        try {
            const code = localStorage.getItem('pylearn_code');
            if (code) {
                this.editor.setValue(code);
                return true;
            }
        } catch (error) {
            console.error('Error loading code from localStorage:', error);
        }
        return false;
    }
    
    /**
     * Save settings to localStorage
     */
    saveSettings() {
        try {
            localStorage.setItem('pylearn_settings', JSON.stringify(this.settings));
        } catch (error) {
            console.error('Error saving settings to localStorage:', error);
        }
    }
    
    /**
     * Load settings from localStorage
     */
    loadSettings() {
        try {
            const settings = localStorage.getItem('pylearn_settings');
            if (settings) {
                this.settings = {...this.settings, ...JSON.parse(settings)};
                this.applySettings();
            }
        } catch (error) {
            console.error('Error loading settings from localStorage:', error);
        }
    }
    
    /**
     * Apply current settings to the editor
     */
    applySettings() {
        // Apply font size
        document.documentElement.style.setProperty('--editor-font-size', `${this.settings.fontSize}px`);
        
        // Apply tab size
        this.editor.setOption('tabSize', this.settings.tabSize);
        this.editor.setOption('indentUnit', this.settings.tabSize);
        
        // Apply theme
        this.setTheme(this.settings.theme);
    }
    
    /**
     * Set theme (dark/light)
     */
    setTheme(theme) {
        this.currentTheme = theme;
        this.settings.theme = theme;
        
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
            this.editor.setOption('theme', 'monokai');
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
            this.editor.setOption('theme', 'default');
        }
        
        this.saveSettings();
    }
    
    /**
     * Show settings modal
     */
    showSettings() {
        // Create modal if it doesn't exist
        let modal = document.getElementById('settingsModal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'settingsModal';
            modal.className = 'modal';
            
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Settings</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="settings-group">
                            <label for="fontSizeInput">Font Size:</label>
                            <input type="range" id="fontSizeInput" min="10" max="24" value="${this.settings.fontSize}">
                            <span id="fontSizeValue">${this.settings.fontSize}px</span>
                        </div>
                        
                        <div class="settings-group">
                            <label for="tabSizeInput">Tab Size:</label>
                            <input type="range" id="tabSizeInput" min="2" max="8" step="2" value="${this.settings.tabSize}">
                            <span id="tabSizeValue">${this.settings.tabSize} spaces</span>
                        </div>
                        
                        <div class="settings-group">
                            <label for="themeSelect">Theme:</label>
                            <select id="themeSelect">
                                <option value="dark" ${this.settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
                                <option value="light" ${this.settings.theme === 'light' ? 'selected' : ''}>Light</option>
                            </select>
                        </div>
                        
                        <div class="settings-group checkbox">
                            <label>
                                <input type="checkbox" id="autoCompleteCheck" ${this.settings.autoComplete ? 'checked' : ''}>
                                Enable Auto-Complete
                            </label>
                        </div>
                        
                        <div class="settings-group checkbox">
                            <label>
                                <input type="checkbox" id="liveExecutionCheck" ${this.settings.liveExecution ? 'checked' : ''}>
                                Enable Live Execution
                            </label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button id="saveSettingsBtn" class="btn-primary">Save</button>
                        <button id="cancelSettingsBtn" class="btn-secondary">Cancel</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Add event listeners to the new modal
            modal.querySelector('.modal-close').addEventListener('click', () => {
                modal.style.display = 'none';
            });
            
            modal.querySelector('#cancelSettingsBtn').addEventListener('click', () => {
                modal.style.display = 'none';
            });
            
            modal.querySelector('#saveSettingsBtn').addEventListener('click', () => {
                // Save settings
                this.settings.fontSize = parseInt(document.getElementById('fontSizeInput').value);
                this.settings.tabSize = parseInt(document.getElementById('tabSizeInput').value);
                this.settings.theme = document.getElementById('themeSelect').value;
                this.settings.autoComplete = document.getElementById('autoCompleteCheck').checked;
                this.settings.liveExecution = document.getElementById('liveExecutionCheck').checked;
                
                this.applySettings();
                this.saveSettings();
                
                modal.style.display = 'none';
                this.showToast('Settings saved', 'success');
            });
            
            // Update font size label
            document.getElementById('fontSizeInput').addEventListener('input', (e) => {
                document.getElementById('fontSizeValue').textContent = `${e.target.value}px`;
            });
            
            // Update tab size label
            document.getElementById('tabSizeInput').addEventListener('input', (e) => {
                document.getElementById('tabSizeValue').textContent = `${e.target.value} spaces`;
            });
        }
        
        // Update modal with current settings
        modal.querySelector('#fontSizeInput').value = this.settings.fontSize;
        modal.querySelector('#fontSizeValue').textContent = `${this.settings.fontSize}px`;
        modal.querySelector('#tabSizeInput').value = this.settings.tabSize;
        modal.querySelector('#tabSizeValue').textContent = `${this.settings.tabSize} spaces`;
        modal.querySelector('#themeSelect').value = this.settings.theme;
        modal.querySelector('#autoCompleteCheck').checked = this.settings.autoComplete;
        modal.querySelector('#liveExecutionCheck').checked = this.settings.liveExecution;
        
        // Show the modal
        modal.style.display = 'block';
    }
    
    /**
     * Show welcome message
     */
    showWelcomeMessage() {
        // Check if we should show welcome message (first time)
        if (!localStorage.getItem('pylearn_welcomed')) {
            this.showToast('Welcome to PyLearn IDE! Press Run to execute the code.', 'info', 5000);
            localStorage.setItem('pylearn_welcomed', 'true');
        }
    }
    
    /**
     * Show toast notification
     */
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add to container
        document.getElementById('toastContainer').appendChild(toast);
        
        // Add close functionality
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.classList.add('toast-fade-out');
            setTimeout(() => toast.remove(), 300);
        });
        
        // Auto remove after duration
        setTimeout(() => {
            if (document.body.contains(toast)) {
                toast.classList.add('toast-fade-out');
                setTimeout(() => {
                    if (document.body.contains(toast)) {
                        toast.remove();
                    }
                }, 300);
            }
        }, duration);
    }
}

// Initialize the app
const pyLearnApp = new PyLearnApp();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    pyLearnApp.initialize();
    
    // Auto-run on first load
    setTimeout(() => {
        pyLearnApp.runCode();
    }, 1000);
});

// Export to window object
window.pyLearnApp = pyLearnApp;
