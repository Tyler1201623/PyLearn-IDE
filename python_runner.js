// Advanced Python Runner Utilities
class PythonRunner {
    constructor() {
        this.consoleOutput = document.getElementById('consoleOutput');
        this.codeEditor = document.getElementById('codeEditor');
        this.initializeEventListeners();
        this.inputQueue = [];
        this.isWaitingForInput = false;
        this.executionStartTime = 0;
        this.executionMetrics = {
            totalExecutions: 0,
            averageExecutionTime: 0,
            lastExecutionTime: 0,
            memoryUsage: 0
        };
        this.debugMode = false;
        this.traceExecution = false;
    }

    initializeEventListeners() {
        document.getElementById('clearConsole').addEventListener('click', () => this.clearConsole());
        document.getElementById('runCode').addEventListener('click', () => this.executeCode());
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                this.executeCode();
            }
        });
        
        // Add advanced debug options
        if (document.getElementById('toggleDebug')) {
            document.getElementById('toggleDebug').addEventListener('click', () => this.toggleDebugMode());
        }
        
        if (document.getElementById('toggleTrace')) {
            document.getElementById('toggleTrace').addEventListener('click', () => {
                this.traceExecution = !this.traceExecution;
                this.showNotification(`Execution tracing ${this.traceExecution ? 'enabled' : 'disabled'}`);
            });
        }
    }

    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        document.body.classList.toggle('debug-mode', this.debugMode);
        this.showNotification(`Debug mode ${this.debugMode ? 'enabled' : 'disabled'}`);
    }

    showNotification(message, type = 'info') {
        // Create toast notification
        const toastContainer = document.getElementById('toastContainer') || document.createElement('div');
        if (!document.getElementById('toastContainer')) {
            toastContainer.id = 'toastContainer';
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas ${this.getToastIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }
    
    getToastIcon(type) {
        switch(type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }

    clearConsole() {
        // Remove empty console message if it exists
        let emptyMessage = this.consoleOutput.querySelector('.empty-console-message');
        if (!emptyMessage) {
            // Add empty message
            this.consoleOutput.innerHTML = `
                <div class="empty-console-message">
                    <i class="fas fa-terminal"></i>
                    <p>Run your code to see output here</p>
                </div>
            `;
        } else {
            this.consoleOutput.innerHTML = '';
            // Add empty message
            this.consoleOutput.innerHTML = `
                <div class="empty-console-message">
                    <i class="fas fa-terminal"></i>
                    <p>Run your code to see output here</p>
                </div>
            `;
        }
        
        // Remove has-output class from console container
        const consoleContainer = document.querySelector('.console-container');
        if (consoleContainer) {
            consoleContainer.classList.remove('has-output');
        }
        
        this.inputQueue = [];
        this.isWaitingForInput = false;
    }

    async executeCode() {
        if (this.isWaitingForInput) {
            return; // Don't execute if waiting for input
        }
        
        const code = window.editor.getValue();
        if (!code.trim()) {
            this.showNotification('No code to execute', 'warning');
            return;
        }
        
        // Clear console and remove empty message
        const emptyMessage = this.consoleOutput.querySelector('.empty-console-message');
        if (emptyMessage) {
            emptyMessage.remove();
        } else {
            this.consoleOutput.innerHTML = '';
        }
        
        // Add has-output class to console container
        const consoleContainer = document.querySelector('.console-container');
        if (consoleContainer) {
            consoleContainer.classList.add('has-output');
            
            // Show console if it's collapsed
            if (consoleContainer.classList.contains('collapsed') && typeof window.toggleConsole === 'function') {
                window.toggleConsole('show');
            }
        }
        
        this.executionStartTime = performance.now();
        this.executionMetrics.totalExecutions++;
        
        try {
            // Log executed code in debug mode
            if (this.debugMode) {
                this.handleOutput('Executing code:', 'debug');
                this.handleOutput(code, 'code');
            }
            
            // Prepare the Python environment
            await this.prepareEnvironment();
            
            // Execute with tracing if enabled
            if (this.traceExecution) {
                await this.executeWithTracing(code);
            } else {
                // Regular execution through Brython
                try {
                    await this.runPythonCode(code);
                } catch (e) {
                    this.handlePythonError(e);
                }
            }
            
            // Record execution metrics
            this.recordExecutionMetrics();
            
        } catch (error) {
            this.handleError(error);
        }
    }
    
    async prepareEnvironment() {
        // This could include importing necessary modules or setting up the environment
        return Promise.resolve();
    }
    
    async runPythonCode(code) {
        // Use the existing Brython execution mechanism
        return new Promise((resolve, reject) => {
            try {
                // The actual execution happens through the Brython script in the HTML
                // This is just a wrapper to enable async/await pattern
                const runButton = document.getElementById('runCode');
                const event = new Event('brython_execute');
                runButton.dispatchEvent(event);
                
                // Store the code in a global variable for the Brython script to access
                window.__pythonCode = code;
                
                // This would normally be handled by the Brython script
                // Simulating execution here for the example
                window.__executeResult = true;
                
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }
    
    async executeWithTracing(code) {
        // Add line numbers to the code
        const lines = code.split('\n');
        const numberedLines = lines.map((line, index) => `#L${index + 1}: ${line}`).join('\n');
        
        this.handleOutput('Execution trace:', 'trace-header');
        
        // In a real implementation, this would use a more sophisticated tracing mechanism
        // For now, we'll simulate line-by-line execution with delays
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line && !line.startsWith('#')) {
                this.handleOutput(`Line ${i + 1}: ${line}`, 'trace');
                await this.delay(100); // Simulate execution time
            }
        }
        
        // Execute the actual code after tracing
        await this.runPythonCode(code);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    recordExecutionMetrics() {
        const executionTime = performance.now() - this.executionStartTime;
        this.executionMetrics.lastExecutionTime = executionTime;
        
        // Calculate running average
        const prevTotal = (this.executionMetrics.totalExecutions - 1) * this.executionMetrics.averageExecutionTime;
        this.executionMetrics.averageExecutionTime = (prevTotal + executionTime) / this.executionMetrics.totalExecutions;
        
        // Simulate memory usage (this would be replaced with actual metrics in a real implementation)
        this.executionMetrics.memoryUsage = Math.random() * 50 + 10; // Random MB between 10-60
        
        if (this.debugMode) {
            this.displayExecutionMetrics();
        }
    }
    
    displayExecutionMetrics() {
        const metrics = `
            <div class="metrics-container">
                <div class="metric">Execution time: ${this.executionMetrics.lastExecutionTime.toFixed(2)}ms</div>
                <div class="metric">Average time: ${this.executionMetrics.averageExecutionTime.toFixed(2)}ms</div>
                <div class="metric">Memory usage: ~${this.executionMetrics.memoryUsage.toFixed(1)}MB</div>
                <div class="metric">Total executions: ${this.executionMetrics.totalExecutions}</div>
            </div>
        `;
        this.handleOutput(metrics, 'metrics');
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
            // Create a custom input dialog instead of using the browser prompt
            const inputDialog = document.createElement('div');
            inputDialog.className = 'input-dialog';
            
            const inputForm = document.createElement('form');
            inputForm.innerHTML = `
                <div class="input-dialog-header">${message}</div>
                <input type="text" id="userInput" class="input-dialog-field" autofocus />
                <div class="input-dialog-buttons">
                    <button type="submit" class="input-dialog-submit">Submit</button>
                    <button type="button" class="input-dialog-cancel">Cancel</button>
                </div>
            `;
            
            inputDialog.appendChild(inputForm);
            document.body.appendChild(inputDialog);
            
            const inputField = inputDialog.querySelector('#userInput');
            inputField.focus();
            
            inputForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const value = inputField.value;
                document.body.removeChild(inputDialog);
                resolve(value);
            });
            
            inputDialog.querySelector('.input-dialog-cancel').addEventListener('click', () => {
                document.body.removeChild(inputDialog);
                resolve(null);
            });
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
        // Remove empty console message if it exists
        const emptyMessage = this.consoleOutput.querySelector('.empty-console-message');
        if (emptyMessage) {
            emptyMessage.remove();
        }
        
        // Add has-output class to console container
        const consoleContainer = document.querySelector('.console-container');
        if (consoleContainer) {
            consoleContainer.classList.add('has-output');
        }
        
        const timestamp = new Date().toLocaleTimeString();
        const outputElement = document.createElement('div');
        outputElement.className = `console-line ${type}`;
        
        if (type === 'input') {
            outputElement.innerHTML = `<span class="input-marker">>>> </span>${output}`;
        } else if (type === 'metrics' || type === 'code') {
            outputElement.innerHTML = output;
        } else {
            outputElement.innerHTML = `<span class="timestamp">[${timestamp}]</span> ${output}`;
        }
        
        this.consoleOutput.appendChild(outputElement);
        this.scrollToBottom();
    }

    handlePythonError(error) {
        const errorMap = {
            'SyntaxError': {
                'invalid syntax': this.checkSyntaxError,
                'EOL while scanning string literal': this.checkStringLiterals,
                'unexpected EOF': this.checkParentheses
            },
            'IndentationError': this.checkIndentation,
            'NameError': this.checkVariableDefinition,
            'TypeError': this.checkDataTypes,
            'ZeroDivisionError': this.suggestZeroDivisionFix,
            'IndexError': this.suggestIndexErrorFix,
            'KeyError': this.suggestKeyErrorFix,
            'ModuleNotFoundError': this.suggestModuleImport,
            'ImportError': this.explainImportError
        };

        const errorType = error.name || 'Error';
        const errorMessage = error.message || String(error);
        const lineNumber = this.extractLineNumber(error);
        
        const stackTrace = this.generateStackTrace(error);
        let suggestion = this.getErrorSuggestion(errorType, errorMessage);
        let aiAssistance = this.getAIAssistance(errorType, errorMessage, lineNumber);
        
        let formattedError = `
            <div class="error-container">
                <div class="error-header">
                    <span class="error-type">${errorType}</span>
                    <span class="error-location">Line ${lineNumber}</span>
                </div>
                <div class="error-message">${errorMessage}</div>
                <div class="error-code">${this.highlightErrorLine(lineNumber)}</div>
                <div class="error-suggestion">
                    <i class="fas fa-lightbulb"></i> ${suggestion}
                </div>
                ${aiAssistance ? `
                <div class="error-ai-suggestion">
                    <i class="fas fa-robot"></i> AI Assistant: ${aiAssistance}
                </div>
                ` : ''}
                ${this.debugMode ? `
                <div class="error-stack-trace">
                    <div class="error-stack-header">Stack Trace:</div>
                    <pre>${stackTrace}</pre>
                </div>
                ` : ''}
            </div>
        `;
        
        this.handleOutput(formattedError, 'error');
    }

    handleError(error) {
        if (error instanceof SyntaxError || error.name === 'SyntaxError') {
            this.handlePythonError(error);
        } else {
            this.handleOutput(`<span class="error-message">${error.toString()}</span>`, 'error');
            
            if (this.debugMode) {
                this.handleOutput(`<pre class="error-stack">${error.stack}</pre>`, 'error');
            }
        }
    }

    generateStackTrace(error) {
        if (error.stack) {
            return error.stack
                .split('\n')
                .slice(1) // Skip the error message line
                .map(line => this.formatStackTraceLine(line))
                .join('\n');
        }
        return 'No stack trace available';
    }

    formatStackTraceLine(line) {
        // Format stack trace lines for better readability
        return line.trim()
            .replace(/at\s+/g, '<span class="stack-at">at</span> ')
            .replace(/\((.+):(\d+):(\d+)\)/, '<span class="stack-location">($1:$2:$3)</span>');
    }

    getAIAssistance(errorType, errorMessage, lineNumber) {
        // In a real implementation, this would call an AI service
        // Here we'll just return some canned responses for common errors
        const aiResponses = {
            "SyntaxError": "It looks like you have a syntax error. Check for missing parentheses, quotes, or colons. Sometimes adding a print statement before this line helps identify the issue.",
            "NameError": "This variable might not be defined yet. Make sure you've declared it before using it, or check for typos in the variable name.",
            "TypeError": "The types of values you're using don't work together for this operation. Try checking the type of each variable with `print(type(variable_name))`.",
            "IndexError": "You're trying to access an element that doesn't exist in your list or string. Remember that indices start at 0, and make sure your index is within bounds.",
            "KeyError": "The key you're looking for doesn't exist in the dictionary. Consider using .get() method or checking if the key exists with `if key in dict:` before accessing it.",
            "ZeroDivisionError": "You can't divide by zero. Check the value of your divisor before division or add a condition to handle the case when it's zero."
        };
        
        return aiResponses[errorType] || null;
    }

    checkSyntaxError(code, line) {
        const commonIssues = {
            'missing comma': /\[.*\s+.*\]/,
            'missing colon': /^(\s*)(if|while|for|def|class).*[^:]\s*$/,
            'invalid operator': /[^=!<>]=(?!=)/
        };
        return this.analyzeCode(code, line, commonIssues);
    }

    suggestZeroDivisionFix() {
        return "Add a check to prevent division by zero, e.g., `if divisor != 0: result = dividend / divisor`";
    }
    
    suggestIndexErrorFix() {
        return "Check that your index is within the valid range for your list/array. Remember that indices start at 0.";
    }
    
    suggestKeyErrorFix() {
        return "The key doesn't exist in the dictionary. Use dict.get(key) or check with 'if key in dict:' before accessing.";
    }
    
    suggestModuleImport() {
        return "This module isn't installed or available. Check the spelling or install it with pip if needed.";
    }
    
    explainImportError() {
        return "There was a problem importing this module. Check that it's installed correctly and the name is spelled correctly.";
    }

    handleSuccess(output) {
        this.handleOutput(output, 'success');
    }

    handleWarning(message) {
        this.handleOutput(`<i class="fas fa-exclamation-triangle"></i> ${message}`, 'warning');
    }

    scrollToBottom() {
        this.consoleOutput.scrollTop = this.consoleOutput.scrollHeight;
    }

    highlightErrorLine(lineNumber) {
        const lines = window.editor.getValue().split('\n');
        if (lineNumber > 0 && lineNumber <= lines.length) {
            const line = lines[lineNumber - 1];
            // Syntax highlight the error line
            return `<pre class="error-line-code"><span class="line-number">${lineNumber}</span> ${this.syntaxHighlight(line)}</pre>`;
        }
        return '';
    }
    
    syntaxHighlight(code) {
        // Simple syntax highlighting for Python code
        return code
            .replace(/\b(if|else|elif|for|while|def|class|return|import|from|as|try|except|finally|with|in|not|and|or|True|False|None)\b/g, '<span class="keyword">$1</span>')
            .replace(/(".*?"|'.*?')/g, '<span class="string">$1</span>')
            .replace(/\b([0-9]+)\b/g, '<span class="number">$1</span>')
            .replace(/#.*/g, '<span class="comment">$&</span>');
    }

    extractLineNumber(error) {
        const match = String(error).match(/line\s+(\d+)/i);
        if (match) return parseInt(match[1]);
        
        // Try to get line number from stack trace if available
        if (error.stack) {
            const stackMatch = error.stack.match(/:(\d+):\d+/);
            if (stackMatch) return parseInt(stackMatch[1]);
        }
        
        return 0;
    }

    getErrorSuggestion(errorType, errorMessage) {
        const suggestions = {
            'SyntaxError': 'Check your syntax for missing colons, parentheses, or quotes.',
            'IndentationError': 'Make sure your code is properly indented. Python uses indentation to define code blocks.',
            'NameError': 'This variable or function name is not defined. Check for typos or declare it before using.',
            'TypeError': 'You\'re using incompatible data types. Check that you\'re using the right operations for these types.',
            'ZeroDivisionError': 'You cannot divide by zero. Add a check before division.',
            'IndexError': 'The index is out of range. Check the length of your list and ensure your index is valid.',
            'KeyError': 'This key does not exist in the dictionary. Check the key or use .get() method.',
            'ImportError': 'There was a problem importing the module. Check if it\'s installed or if the name is correct.',
            'ModuleNotFoundError': 'The module could not be found. You may need to install it or check the spelling.',
            'ValueError': 'Invalid value used for an operation. Check the input values.',
            'AttributeError': 'The object does not have this attribute or method. Check documentation or typos.',
            'FileNotFoundError': 'The file was not found. Check the path and filename.'
        };
        
        // Try to provide more specific suggestions based on error message patterns
        if (errorMessage.includes('unexpected EOF')) {
            return 'You might be missing a closing parenthesis, bracket, or quote.';
        }
        if (errorMessage.includes('invalid syntax')) {
            return 'Check for syntax errors like missing colons, incorrect indentation, or invalid characters.';
        }
        if (errorMessage.includes('expected an indented block')) {
            return 'After a colon in statements like if, for, while, def, you need to indent the next line.';
        }
        
        return suggestions[errorType] || 'Review your code for potential issues and refer to Python documentation.';
    }

    formatPythonOutput(output) {
        // Enhance output formatting with syntax highlighting for code-like output
        const formattedOutput = output
            .replace(/\n/g, '<br>')
            .replace(/\s/g, '&nbsp;')
            .replace(/(\[.*?\])/g, '<span class="output-list">$1</span>')
            .replace(/(\{.*?\})/g, '<span class="output-dict">$1</span>')
            .replace(/(\d+\.\d+)/g, '<span class="output-number">$1</span>');
            
        return formattedOutput;
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

// Add CSS for the enhanced console experience
document.addEventListener('DOMContentLoaded', () => {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .console-line { padding: 5px 10px; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .error-container { background: rgba(231, 76, 60, 0.1); padding: 10px; border-radius: 5px; margin: 10px 0; border-left: 3px solid #e74c3c; }
        .error-header { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .error-type { color: #e74c3c; font-weight: bold; }
        .error-location { color: #bdc3c7; }
        .error-message { color: #e74c3c; margin-bottom: 8px; }
        .error-code { background: rgba(0,0,0,0.2); padding: 8px; border-radius: 3px; margin-bottom: 8px; overflow-x: auto; }
        .error-line-code { margin: 0; padding: 0; white-space: pre; }
        .error-suggestion { color: #f1c40f; margin-top: 8px; }
        .error-ai-suggestion { color: #3498db; margin-top: 8px; padding: 8px; background: rgba(52, 152, 219, 0.1); border-radius: 3px; }
        .error-stack-trace { margin-top: 10px; font-size: 0.85em; color: #bdc3c7; }
        .error-stack-header { font-weight: bold; margin-bottom: 3px; }
        .console-line.success { color: #2ecc71; }
        .console-line.warning { color: #f1c40f; }
        .console-line.debug { color: #3498db; font-style: italic; }
        .console-line.trace { color: #9b59b6; font-family: monospace; padding-left: 20px; }
        .console-line.trace-header { color: #3498db; font-weight: bold; }
        .console-line.metrics { background: rgba(52, 152, 219, 0.1); padding: 10px; border-radius: 5px; }
        .metrics-container { display: flex; flex-wrap: wrap; gap: 10px; }
        .metric { background: rgba(0,0,0,0.2); padding: 5px 10px; border-radius: 3px; }
        .timestamp { color: #7f8c8d; font-size: 0.8em; margin-right: 5px; }
        .input-marker { color: #3498db; font-weight: bold; }
        .line-number { color: #7f8c8d; padding-right: 10px; user-select: none; }
        .notification { position: fixed; bottom: 20px; right: 20px; padding: 10px 20px; background: #2c3e50; color: white; border-radius: 5px; z-index: 1000; animation: slideIn 0.3s ease; }
        .notification.info { background: #3498db; }
        .notification.warning { background: #f1c40f; color: #2c3e50; }
        .notification.error { background: #e74c3c; }
        .notification.fade-out { animation: fadeOut 0.5s ease; }
        .input-dialog { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; }
        .input-dialog form { background: #2c3e50; padding: 20px; border-radius: 5px; width: 80%; max-width: 500px; }
        .input-dialog-header { margin-bottom: 15px; font-size: 1.1em; }
        .input-dialog-field { width: 100%; padding: 8px; background: #34495e; border: 1px solid #3498db; color: white; border-radius: 3px; margin-bottom: 15px; }
        .input-dialog-buttons { display: flex; justify-content: flex-end; gap: 10px; }
        .input-dialog-submit, .input-dialog-cancel { padding: 8px 15px; border: none; border-radius: 3px; cursor: pointer; }
        .input-dialog-submit { background: #3498db; color: white; }
        .input-dialog-cancel { background: #7f8c8d; color: white; }
        
        /* Syntax highlighting */
        .keyword { color: #9b59b6; }
        .string { color: #27ae60; }
        .number { color: #e67e22; }
        .comment { color: #7f8c8d; }
        .output-list { color: #e67e22; }
        .output-dict { color: #9b59b6; }
        .output-number { color: #e67e22; }
        
        /* Stack trace formatting */
        .stack-at { color: #7f8c8d; }
        .stack-location { color: #3498db; }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(styleEl);
});