// Advanced Python Runner Utilities
class PythonRunner {
    constructor() {
        this.consoleOutput = document.getElementById('consoleOutput');
        this.codeEditor = document.getElementById('codeEditor');
        this.initializeEventListeners();
        this.inputQueue = [];
        this.isWaitingForInput = false;
    }

    initializeEventListeners() {
        document.getElementById('clearConsole').addEventListener('click', () => this.clearConsole());
        document.getElementById('runCode').addEventListener('click', () => this.handleInput());
    }

    clearConsole() {
        this.consoleOutput.innerHTML = '';
        this.inputQueue = [];
        this.isWaitingForInput = false;
    }

    async handleInput() {
        if (this.isWaitingForInput) {
            const input = await this.promptInput("Input required:");
            if (input !== null) {
                this.inputQueue.push(input);
                this.processNextInput();
            }
        }
    }

    async promptInput(message) {
        return new Promise((resolve) => {
            const input = prompt(message);
            resolve(input);
        });
    }

    processNextInput() {
        if (this.inputQueue.length > 0) {
            const input = this.inputQueue.shift();
            this.handleOutput(`${input}\n`, 'input');
            this.isWaitingForInput = false;
        }
    }

    handleOutput(output, type = 'standard') {
        const timestamp = new Date().toLocaleTimeString();
        const outputElement = document.createElement('div');
        outputElement.className = `console-line ${type}`;
        
        if (type === 'input') {
            outputElement.innerHTML = `<span class="input-marker">>>> </span>${output}`;
        } else {
            outputElement.innerHTML = `<span class="timestamp">[${timestamp}]</span> ${output}`;
        }
        
        this.consoleOutput.appendChild(outputElement);
        this.scrollToBottom();
    }

    handleError(error) {
        const errorMap = {
            'SyntaxError': {
                'invalid syntax': this.checkSyntaxError,
                'EOL while scanning string literal': this.checkStringLiterals,
                'unexpected EOF': this.checkParentheses
            },
            'IndentationError': this.checkIndentation,
            'NameError': this.checkVariableDefinition,
            'TypeError': this.checkDataTypes
        };

        const errorType = error.name;
        const errorMessage = error.message;
        const lineNumber = this.extractLineNumber(error);
        
        let suggestion = this.getErrorSuggestion(errorType, errorMessage);
        let formattedError = `
            <div class="error-container">
                <div class="error-type">${errorType}</div>
                <div class="error-message">${errorMessage}</div>
                <div class="error-line">Line ${lineNumber}</div>
                <div class="error-suggestion">${suggestion}</div>
                <div class="error-code">${this.highlightErrorLine(lineNumber)}</div>
            </div>
        `;
        
        this.consoleOutput.innerHTML += formattedError;
    }

    checkSyntaxError(code, line) {
        const commonIssues = {
            'missing comma': /\[.*\s+.*\]/,
            'missing colon': /^(\s*)(if|while|for|def|class).*[^:]\s*$/,
            'invalid operator': /[^=!<>]=(?!=)/
        };
        return this.analyzeCode(code, line, commonIssues);
    }

    handleSuccess(output) {
        this.handleOutput(output, 'success');
    }

    handleWarning(message) {
        this.handleOutput(message, 'warning');
    }

    scrollToBottom() {
        this.consoleOutput.scrollTop = this.consoleOutput.scrollHeight;
    }

    highlightErrorLine(lineNumber) {
        const lines = this.codeEditor.value.split('\n');
        if (lineNumber > 0 && lineNumber <= lines.length) {
            return `<pre class="error-line">${lines[lineNumber - 1]}</pre>`;
        }
        return '';
    }

    extractLineNumber(error) {
        const match = error.toString().match(/line (\d+)/);
        return match ? parseInt(match[1]) : 0;
    }

    getErrorSuggestion(errorType, errorMessage) {
        const suggestions = {
            'SyntaxError': 'Check your syntax for missing colons, parentheses, or quotes',
            'IndentationError': 'Make sure your code is properly indented',
            'NameError': 'Verify that all variables are defined before use',
            'TypeError': 'Check that you\'re using compatible data types'
        };
        return suggestions[errorType] || 'Review your code for potential issues';
    }

    formatPythonOutput(output) {
        return output.replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;');
    }
}

// Initialize the Python Runner
const pythonRunner = new PythonRunner();

// Export utilities for global use
window.pythonRunner = pythonRunner;
window.clearConsoleOutput = () => pythonRunner.clearConsole();
window.handleError = (error) => pythonRunner.handleError(error);
window.handleSuccess = (output) => pythonRunner.handleSuccess(output);
window.handleWarning = (message) => pythonRunner.handleWarning(message);
