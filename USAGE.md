# Usage Guide / 使用指南

## Overview (概述)

Strudel Recorder adds a floating panel to Strudel.cc that allows you to:
(Strudel 录音器在 Strudel.cc 上添加了一个悬浮面板，允许您：)

1. Record audio from your live coding sessions (录制您的现场编程会话音频)
2. Save your code patterns (保存您的代码模式)

## User Interface (用户界面)

The recorder panel appears in the bottom-right corner with:
(录音器面板出现在右下角，包含：)

```
┌─────────────────────┐
│ 🎵 Strudel Recorder │ 
├─────────────────────┤
│  ⏺ Start Recording  │
│  💾 Save Code       │
├─────────────────────┤
│     Ready           │
└─────────────────────┘
```

### Buttons (按钮)

- **⏺ Start Recording** - Begin/stop audio recording (开始/停止音频录制)
- **💾 Save Code** - Export your current code (导出当前代码)
- **−** (top-right) - Minimize/maximize panel (最小化/最大化面板)

## Recording Audio (录制音频)

### Steps (步骤):

1. **Prepare Your Session (准备会话)**
   - Open Strudel.cc
   - Write or load your code
   - Make sure your audio is working

2. **Start Recording (开始录制)**
   - Click "⏺ Start Recording"
   - Grant microphone permission if prompted
   - Button turns red and shows "⏹ Stop Recording"
   - Status shows "🔴 Recording..."

3. **Create Your Music (创作音乐)**
   - Live code as usual
   - The recorder captures all audio

4. **Stop Recording (停止录制)**
   - Click "⏹ Stop Recording"
   - Audio file downloads automatically
   - File format: `strudel-recording-YYYY-MM-DDTHH-MM-SS.webm`

### Audio Recording Notes (音频录制注意事项):

**Browser Limitations (浏览器限制):**
- Due to browser security, direct system audio capture is restricted
- The recorder may capture microphone input instead
- For best results, ensure your microphone can pick up system audio
  (由于浏览器安全限制，直接捕获系统音频受限)
  (录音器可能会捕获麦克风输入)
  (为获得最佳效果，请确保您的麦克风可以拾取系统音频)

**Tips for Better Quality (提高质量的技巧):**
1. Use headphones to avoid feedback (使用耳机避免反馈)
2. Position microphone close to speakers (将麦克风靠近扬声器)
3. Reduce background noise (减少背景噪音)
4. Consider using system audio capture software alongside this tool
   (考虑配合使用系统音频捕获软件)

## Saving Code (保存代码)

### Steps (步骤):

1. **Write Your Code (编写代码)**
   - Create your Strudel patterns in the editor
   - Test and refine your code

2. **Save (保存)**
   - Click "💾 Save Code" button
   - Code downloads immediately
   - File format: `strudel-code-YYYY-MM-DDTHH-MM-SS.js`

3. **Use Your Code (使用代码)**
   - Open the .js file in any text editor
   - Copy and paste back into Strudel
   - Share with others

### Code Detection (代码检测):

The script automatically detects code from:
(脚本自动从以下位置检测代码：)
- CodeMirror editors
- Standard textareas
- Content-editable elements
- Common editor components

## Panel Controls (面板控制)

### Minimize (最小化):
- Click the **"−"** button in top-right corner
- Panel shrinks to a small indicator
- Click **"+"** to restore

### Move (移动):
- Currently fixed to bottom-right
- Future versions may add drag-and-drop positioning

## File Formats (文件格式)

### Audio Files (音频文件):
- **Format**: WebM (`.webm`)
- **Codec**: Opus
- **Naming**: `strudel-recording-[timestamp].webm`
- **Playback**: VLC, Chrome, Firefox, modern media players
  (播放器：VLC、Chrome、Firefox、现代媒体播放器)

### Code Files (代码文件):
- **Format**: JavaScript (`.js`)
- **Encoding**: UTF-8
- **Naming**: `strudel-code-[timestamp].js`
- **Compatible with**: Any text editor, Strudel.cc
  (兼容：任何文本编辑器、Strudel.cc)

## Keyboard Shortcuts (键盘快捷键)

Currently no keyboard shortcuts. Click buttons to control.
(目前没有键盘快捷键。点击按钮进行控制。)

## Best Practices (最佳实践)

1. **Save Early, Save Often (经常保存)**
   - Save your code periodically
   - Don't lose your work!

2. **Test Before Recording (录制前测试)**
   - Make sure your code works
   - Check audio levels

3. **Organize Your Files (整理文件)**
   - Create folders for different sessions
   - Use descriptive names

4. **Backup Important Work (备份重要作品)**
   - Keep copies of your best patterns
   - Version control your code

## Advanced Usage (高级用法)

### Recording Long Sessions (录制长会话):
- Start recording at the beginning
- Stop only when completely finished
- Browser memory limitations may apply for very long recordings
  (浏览器内存限制可能适用于很长的录音)

### Batch Code Saving (批量保存代码):
- Save different versions as you iterate
- Each save creates a new timestamped file
- Compare versions later

### Integration with DAWs (与数字音频工作站集成):
1. Record with Strudel Recorder
2. Import .webm into your DAW (Ableton, FL Studio, etc.)
3. Further edit and produce
   (进一步编辑和制作)

## Common Issues (常见问题)

See [Troubleshooting in INSTALL.md](INSTALL.md#troubleshooting)
(参见 [INSTALL.md 中的故障排除](INSTALL.md#troubleshooting))
