# Contributing to PyLearn IDE

First off, thank you for considering contributing to PyLearn IDE! It's people like you that make PyLearn IDE such a great tool for learning Python.

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for PyLearn IDE.

#### Before Submitting A Bug Report

- Check the [issues](https://github.com/pylearnide/pylearnide/issues) for a list of current known issues.
- Perform a [search](https://github.com/pylearnide/pylearnide/issues) to see if the problem has already been reported.

#### How Do I Submit A Good Bug Report?

Bugs are tracked as [GitHub issues](https://github.com/pylearnide/pylearnide/issues).

Explain the problem and include additional details to help maintainers reproduce the problem:

- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the exact steps which reproduce the problem** in as many details as possible.
- **Provide specific examples to demonstrate the steps**.
- **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
- **Explain which behavior you expected to see instead and why.**
- **Include screenshots or animated GIFs** which show you following the described steps and clearly demonstrate the problem.
- **If the problem wasn't triggered by a specific action**, describe what you were doing before the problem happened.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for PyLearn IDE, including completely new features and minor improvements to existing functionality.

#### Before Submitting An Enhancement Suggestion

- Check if the enhancement has already been [suggested](https://github.com/pylearnide/pylearnide/issues).
- Determine which repository the enhancement should be suggested in.

#### How Do I Submit A Good Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://github.com/pylearnide/pylearnide/issues). Create an issue and provide the following information:

- **Use a clear and descriptive title** for the issue to identify the suggestion.
- **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
- **Provide specific examples to demonstrate the steps** or point out the part of PyLearn IDE which the suggestion is related to.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
- **Explain why this enhancement would be useful** to most PyLearn IDE users.
- **List some other text editors or applications where this enhancement exists.**

### Pull Requests

The process described here has several goals:

- Maintain PyLearn IDE's quality
- Fix problems that are important to users
- Engage the community in working toward the best possible PyLearn IDE
- Enable a sustainable system for PyLearn IDE's maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. Follow all instructions in [the template](PULL_REQUEST_TEMPLATE.md)
2. Follow the [styleguides](#styleguides)
3. After you submit your pull request, verify that all [status checks](https://help.github.com/articles/about-status-checks/) are passing

#### What if the status checks are failing?

If a status check is failing, and you believe that the failure is unrelated to your change, please leave a comment on the pull request explaining why you believe the failure is unrelated.

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Consider starting the commit message with an applicable emoji:
  - 🎨 `:art:` when improving the format/structure of the code
  - 🐎 `:racehorse:` when improving performance
  - 📝 `:memo:` when writing docs
  - 🐛 `:bug:` when fixing a bug
  - 🔥 `:fire:` when removing code or files
  - 💚 `:green_heart:` when fixing the CI build
  - ✅ `:white_check_mark:` when adding tests
  - 🔒 `:lock:` when dealing with security
  - ⬆️ `:arrow_up:` when upgrading dependencies
  - ⬇️ `:arrow_down:` when downgrading dependencies

### JavaScript Styleguide

- Use 4 spaces for indentation
- Use semicolons `;`
- Use camelCase for variables and functions
- Use PascalCase for classes
- Use UPPERCASE for constants
- Always use `===` instead of `==`

### CSS/SCSS Styleguide

- Use 4 spaces for indentation
- Use kebab-case for class names
- Group related properties together
- Add comments for complex selectors

### Python Styleguide

- Follow PEP 8
- Use docstrings for all functions, classes, and modules
- Keep lines to a maximum of 79 characters
- Use snake_case for variables and functions
- Use PascalCase for classes

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

[GitHub search](https://help.github.com/articles/searching-issues/) makes it easy to use labels for finding groups of issues or pull requests you're interested in.

#### Type of Issue and Issue State

| Label name                | Description                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------ |
| `enhancement`             | Feature requests                                                                                 |
| `bug`                     | Confirmed bugs or reports that are very likely to be bugs                                        |
| `question`                | Questions more than bug reports or feature requests                                              |
| `feedback`                | General feedback more than bug reports or feature requests                                       |
| `help-wanted`             | The PyLearn IDE team would appreciate help from the community in resolving these issues          |
| `beginner`                | Less complex issues which would be good first issues to work on for users who want to contribute |
| `more-information-needed` | More information needs to be collected about these problems or feature requests                  |
| `needs-reproduction`      | Likely bugs, but haven't been reliably reproduced                                                |
| `blocked`                 | Issues blocked on other issues                                                                   |
| `duplicate`               | Issues which are duplicates of other issues                                                      |
| `wontfix`                 | The PyLearn IDE team has decided not to fix these issues for now                                 |
| `invalid`                 | Issues which aren't valid (e.g., user errors)                                                    |

## Attribution

This Contributing guide is adapted from the [Atom Contributing guide](https://github.com/atom/atom/blob/master/CONTRIBUTING.md) and the [Ruby on Rails Contributing guide](https://github.com/rails/rails/blob/master/CONTRIBUTING.md).
