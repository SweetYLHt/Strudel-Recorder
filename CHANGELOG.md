# Changelog

All notable changes to Strudel Recorder will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-07

### Added
- Initial release of Strudel Recorder
- Audio recording functionality with MediaRecorder API
- Code saving functionality with multiple detection methods
- Beautiful gradient UI panel
- Minimize/maximize panel control
- Automatic file naming with timestamps
- Support for WebM audio format
- Multi-method code editor detection:
  - CodeMirror instances
  - Textarea elements
  - Content-editable elements
  - Common editor selectors
- Bilingual documentation (English/Chinese)
- Installation guide
- Usage guide
- MIT License

### Security
- All processing happens locally in the browser
- No data is sent to external servers
- Uses browser's native MediaRecorder API
- Respects user privacy

## [Unreleased]

### Planned Features
- Keyboard shortcuts for recording
- Drag-and-drop panel positioning
- Audio format selection (WebM, MP3, WAV)
- Recording time display
- Audio level indicator
- Multiple code snippet saving
- Session history/playlist
- Export session metadata
- Cloud sync option (optional)
- Themes/customization options

### Known Issues
- Audio recording requires microphone permission (browser limitation)
- Cannot directly capture system audio without browser extensions
- Code detection may not work with custom/modified Strudel editors

## How to Report Issues

If you find a bug or have a feature request:
1. Check [existing issues](https://github.com/SweetYLHt/Strudel-Recorder/issues)
2. Create a new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser and version
   - Screenshots if applicable

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.
