# Contributing to Strudel Recorder

Thank you for your interest in contributing! 🎉

## How to Contribute

### Reporting Bugs

1. **Search existing issues** first to avoid duplicates
2. **Create a new issue** with:
   - Clear, descriptive title
   - Steps to reproduce the bug
   - Expected behavior
   - Actual behavior
   - Browser and version
   - Tampermonkey version
   - Screenshots or error messages

### Suggesting Features

1. **Check existing issues** for similar suggestions
2. **Create a feature request** with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach (optional)

### Submitting Code

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Test thoroughly
4. **Commit your changes**
   ```bash
   git commit -m "Add: description of your changes"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a Pull Request**

## Development Guidelines

### Code Style

- Use clear, descriptive variable names
- Add comments for non-obvious code
- Keep functions focused and small
- Use consistent indentation (4 spaces)
- Follow JavaScript best practices

### Testing

Before submitting:
1. Test on multiple browsers (Chrome, Firefox, Safari)
2. Test on Strudel.cc main site
3. Check console for errors
4. Verify all features work:
   - Audio recording
   - Code saving
   - UI interactions
   - Panel minimize/maximize

### Userscript Metadata

When updating the script, remember to update:
- `@version` - Follow semver (1.0.0, 1.1.0, etc.)
- `@description` - If functionality changes
- `@match` - If supporting new URLs

### Documentation

Update documentation when:
- Adding new features
- Changing existing behavior
- Fixing bugs that affect user experience

Files to update:
- `README.md` - Main documentation
- `USAGE.md` - User guide
- `CHANGELOG.md` - Version history

## Pull Request Guidelines

### Good Pull Requests

- ✅ Focused on a single feature/fix
- ✅ Include clear description
- ✅ Reference related issues
- ✅ Update documentation
- ✅ Test on multiple browsers
- ✅ Follow code style

### Avoid

- ❌ Multiple unrelated changes
- ❌ Breaking existing functionality
- ❌ Incomplete implementations
- ❌ Undocumented changes

## Feature Development Ideas

### Easy (Good for first contributions)

- Add more code editor detection methods
- Improve error messages
- Add more UI themes
- Translate to more languages
- Add keyboard shortcuts

### Medium

- Add audio format conversion
- Implement recording timer
- Add audio level visualization
- Create settings panel
- Add session history

### Advanced

- Implement direct system audio capture (with permissions)
- Add cloud storage integration
- Create pattern library/sharing
- Add audio effects/processing
- Implement collaborative features

## Code of Conduct

### Be Respectful

- Use welcoming and inclusive language
- Respect differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community

### Be Professional

- Provide constructive feedback
- Stay on topic
- Help others learn and grow
- Credit others' work

## Questions?

- Open a [Discussion](https://github.com/SweetYLHt/Strudel-Recorder/discussions)
- Comment on relevant issues
- Check existing documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for making Strudel Recorder better! 🎵
