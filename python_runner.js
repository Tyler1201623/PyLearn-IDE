// Advanced Python Runner Utilities
class PythonRunner {
    constructor() {
        this.consoleOutput = document.getElementById('consoleOutput');
        this.codeEditor = document.getElementById('codeEditor');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('clearConsole').addEventListener('click', () => this.clearConsole());
    }

    clearConsole() {
        this.consoleOutput.innerHTML = '';
    }

    handleOutput(output, type = 'standard') {
        const timestamp = new Date().toLocaleTimeString();
        const outputElement = document.createElement('div');
        outputElement.className = `console-line ${type}`;
        outputElement.innerHTML = `<span class="timestamp">[${timestamp}]</span> ${output}`;
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

    highlightErrorLine(error) {
        // Extract line number from Python error message
        const lineMatch = error.match(/line (\d+)/);
        if (lineMatch) {
            const lineNumber = parseInt(lineMatch[1]);
            this.markErrorLine(lineNumber);
        }
    }

    markErrorLine(lineNumber) {
        const lines = this.codeEditor.value.split('\n');
        const errorLine = lines[lineNumber - 1];
        this.handleOutput(`Error occurred at: "${errorLine.trim()}"`, 'error-location');
    }

    formatPythonOutput(output) {
        return output.replace(/\n/g, '<br>')
                    .replace(/\s/g, ' ');
    }

    saveExecution(code, output) {
        const execution = {
            timestamp: new Date().toISOString(),
            code: code,
            output: output
        };
        
        let history = JSON.parse(localStorage.getItem('execution-history') || '[]');
        history.push(execution);
        localStorage.setItem('execution-history', JSON.stringify(history.slice(-50))); // Keep last 50 executions
    }

    getExecutionHistory() {
        return JSON.parse(localStorage.getItem('execution-history') || '[]');
    }

    clearExecutionHistory() {
        localStorage.removeItem('execution-history');
    }

    static formatStackTrace(error) {
        const stackLines = error.split('\n');
        return stackLines.map(line => line.trim())
                        .filter(line => line.length > 0)
                        .join('\n');
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