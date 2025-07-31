# Contributing to Route Optimization Request Retriever

Thank you for your interest in contributing to this project! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18.0 or higher
- npm or yarn
- Git

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/ro-retriever.git
   cd ro-retriever
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.local.example` to `.env.local`
   - Configure your Google Cloud credentials

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📝 Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing code style and formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Commit Messages

Use conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(ui): add download JSON functionality
fix(api): handle missing request ID error
docs(readme): update setup instructions
```

### Testing

- Test your changes locally before submitting
- Ensure all existing tests pass
- Add tests for new functionality when appropriate
- Test error scenarios and edge cases

## 🔄 Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, well-documented code
   - Follow the project's coding standards
   - Test your changes thoroughly

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Use the provided PR template
   - Describe your changes clearly
   - Include screenshots if UI changes
   - Link any related issues

## 🐛 Reporting Issues

When reporting bugs, please include:

- **Clear description** of the problem
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Environment details** (OS, browser, Node.js version)
- **Screenshots** if applicable
- **Console errors** or logs

## 💡 Feature Requests

When suggesting features:

- **Describe the problem** you're trying to solve
- **Explain your proposed solution**
- **Provide use cases** and examples
- **Consider alternatives** you've explored

## 🔒 Security

- Never commit sensitive information (API keys, credentials)
- Report security vulnerabilities privately
- Follow security best practices in your code

## 📚 Documentation

- Update documentation for any API changes
- Add comments for complex code
- Keep README and SETUP files current
- Include examples for new features

## 🎯 Areas for Contribution

- **Bug fixes**: Check the issues page for known bugs
- **UI improvements**: Enhance user experience
- **Performance**: Optimize loading times and efficiency
- **Testing**: Add unit and integration tests
- **Documentation**: Improve guides and examples
- **Accessibility**: Make the app more accessible

## 🤝 Code Review

All contributions require review before merging:

- Be responsive to review comments
- Address feedback promptly
- Keep discussions constructive
- Be open to suggestions and improvements

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## 🆘 Getting Help

If you need help with contributing:

- Check the [SETUP.md](./SETUP.md) for configuration issues
- Review existing issues and discussions
- Ask questions in issues or discussions
- Reach out to maintainers for guidance

Thank you for contributing to Route Optimization Request Retriever! 🎉 