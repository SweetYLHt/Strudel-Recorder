# Strudel-Recorder / Strudel录音器

[English](#english) | [中文](#中文)

---

## English

A Tampermonkey userscript for recording audio and saving code from [Strudel.cc](https://strudel.cc) live coding sessions.

### Features

- 🎵 **Audio Recording**: Capture your live coding music sessions
- 💾 **Code Saving**: Export your code patterns with a single click
- 🎨 **Beautiful UI**: Minimalist, non-intrusive floating panel
- 🚀 **Easy to Use**: One-click recording and saving
- 🔒 **Privacy First**: All processing happens locally in your browser

### Installation

1. **Install Tampermonkey**
   - [Chrome/Edge](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Safari](https://apps.apple.com/us/app/tampermonkey/id1482490089)

2. **Install Strudel Recorder**
   - Click [here](https://raw.githubusercontent.com/SweetYLHt/Strudel-Recorder/main/strudel-recorder.user.js) to install
   - Or manually create a new script in Tampermonkey and paste the contents of `strudel-recorder.user.js`

3. **Visit Strudel.cc**
   - Navigate to [strudel.cc](https://strudel.cc)
   - You should see the Strudel Recorder panel in the bottom-right corner

### Usage

#### Recording Audio
1. Click the **"⏺ Start Recording"** button to begin recording
2. Create your music with Strudel
3. Click **"⏹ Stop Recording"** when finished
4. The audio file will be automatically downloaded as `.webm` format

**Note:** For audio recording, you may need to grant microphone permissions. The recorder will attempt to capture system audio, but browser limitations may require microphone access.

#### Saving Code
1. Write your Strudel code patterns
2. Click the **"💾 Save Code"** button
3. Your code will be downloaded as a `.js` file with a timestamp

### Features & Limitations

**What Works:**
- ✅ Code pattern export
- ✅ Audio recording (with microphone permission)
- ✅ Timestamped file names
- ✅ Works on all Strudel.cc pages

**Limitations:**
- ⚠️ Audio recording captures microphone input (due to browser security restrictions)
- ⚠️ For best audio quality, use system audio capture tools alongside this script
- ⚠️ Code detection works with standard Strudel editors

### Development

To modify or contribute to this userscript:

1. Clone this repository
2. Edit `strudel-recorder.user.js`
3. Test in Tampermonkey's editor
4. Submit a pull request

### License

MIT License - see [LICENSE](LICENSE) file for details

### Support

If you encounter issues:
- Check browser console for error messages
- Ensure you have granted necessary permissions
- Open an issue on [GitHub](https://github.com/SweetYLHt/Strudel-Recorder/issues)

---

## 中文

一个用于从 [Strudel.cc](https://strudel.cc) 现场编程会话中录制音频和保存代码的油猴脚本。

### 功能特性

- 🎵 **音频录制**：捕获您的现场编程音乐会话
- 💾 **代码保存**：一键导出您的代码模式
- 🎨 **精美界面**：简约、不干扰的悬浮面板
- 🚀 **易于使用**：一键录制和保存
- 🔒 **隐私优先**：所有处理都在浏览器本地进行

### 安装方法

1. **安装油猴（Tampermonkey）**
   - [Chrome/Edge 浏览器](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox 浏览器](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Safari 浏览器](https://apps.apple.com/us/app/tampermonkey/id1482490089)

2. **安装 Strudel 录音器**
   - 点击[这里](https://raw.githubusercontent.com/SweetYLHt/Strudel-Recorder/main/strudel-recorder.user.js)安装
   - 或在油猴中手动创建新脚本，粘贴 `strudel-recorder.user.js` 的内容

3. **访问 Strudel.cc**
   - 打开 [strudel.cc](https://strudel.cc)
   - 您应该能在右下角看到 Strudel 录音器面板

### 使用说明

#### 录制音频
1. 点击 **"⏺ Start Recording"** 按钮开始录制
2. 使用 Strudel 创作您的音乐
3. 完成后点击 **"⏹ Stop Recording"**
4. 音频文件将自动下载为 `.webm` 格式

**注意：**录制音频时可能需要授予麦克风权限。录音器会尝试捕获系统音频，但由于浏览器限制可能需要麦克风访问权限。

#### 保存代码
1. 编写您的 Strudel 代码模式
2. 点击 **"💾 Save Code"** 按钮
3. 您的代码将下载为带时间戳的 `.js` 文件

### 功能与限制

**可用功能：**
- ✅ 代码模式导出
- ✅ 音频录制（需要麦克风权限）
- ✅ 带时间戳的文件名
- ✅ 在所有 Strudel.cc 页面上工作

**限制：**
- ⚠️ 音频录制捕获麦克风输入（由于浏览器安全限制）
- ⚠️ 为获得最佳音质，建议配合系统音频捕获工具使用
- ⚠️ 代码检测适用于标准 Strudel 编辑器

### 开发

要修改或为此用户脚本做出贡献：

1. 克隆此仓库
2. 编辑 `strudel-recorder.user.js`
3. 在油猴编辑器中测试
4. 提交拉取请求

### 许可证

MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

### 支持

如果遇到问题：
- 检查浏览器控制台的错误消息
- 确保已授予必要的权限
- 在 [GitHub](https://github.com/SweetYLHt/Strudel-Recorder/issues) 上提交问题