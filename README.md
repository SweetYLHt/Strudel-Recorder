# Strudel Recorder

Tampermonkey 油猴脚本，在 [strudel.cc](https://strudel.cc) 页面注入录音面板，直接录制并导出你的 live coding 音乐。

## 功能

- **音频拦截** — 在 `document-start` 阶段 hook `AudioNode.prototype.connect`，零延迟捕获所有输出到 `AudioDestinationNode` 的音频
- **手动录制** — REC / STOP 按钮控制，实时计时、波形显示、数据统计
- **Auto REC** — 开启后自动跟随 strudel.cc 的播放/停止联动录制，无需手动操作
- **三种导出格式** — WebM（原生）、WAV（内联编码）、MP3（CDN lamejs 320kbps）
- **波形可视化** — 小型 Canvas 实时波形，播放时青色、录制时红色
- **浮动面板** — 右下角暗色半透明面板，支持拖拽移动和最小化折叠

## 安装

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 浏览器扩展
2. 在 Tampermonkey 中新建脚本，将 `strudel-recorder.user.js` 的全部内容粘贴进去，保存
3. 打开 https://strudel.cc ，右下角出现 **Strudel Recorder** 面板即安装成功

## 使用

### 手动录制

1. 在 strudel.cc 编写代码并播放（`Ctrl+Enter`）
2. 面板波形出现动态显示，说明音频已捕获
3. 点击 **REC** 开始录制，计时器启动、波形变红
4. 点击 **STOP** 停止录制
5. 选择格式（WebM / WAV / MP3），点击 **Export** 导出文件

### Auto REC 模式

1. 点击面板中的 **AUTO** 按钮（高亮紫色表示已开启）
2. 按 `Ctrl+Enter` 播放 — 自动开始录制
3. 按 `Ctrl+.` 停止 — 自动停止录制
4. 选择格式导出

Auto REC 通过两种机制检测播放状态：

| 机制 | 触发场景 |
|------|----------|
| 键盘快捷键拦截（capture 阶段） | `Ctrl+Enter` 播放、`Ctrl+.` 停止 |
| AudioContext `statechange` 监听 | 点击页面 Play 按钮等非键盘操作 |

### 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl + Enter` | 播放代码（strudel.cc 原生） |
| `Ctrl + .` | 停止播放（strudel.cc 原生） |

这两个快捷键也显示在面板的控制按钮下方作为提示。

## 导出格式

| 格式 | 实现 | 依赖 | 说明 |
|------|------|------|------|
| WebM | 直接拼接 `recordedChunks` | 无 | 浏览器原生，文件最小 |
| WAV | 解码 WebM -> PCM -> WAV 文件头编码 | 无（内联） | 无损，文件较大 |
| MP3 | 解码 WebM -> PCM -> lamejs 编码 | CDN lamejs 1.2.1 | 320kbps，兼容性好 |

## 面板布局

```
+-------------------------------+
| Strudel Recorder           [_]|  <- 标题 + 最小化
+-------------------------------+
| +---------------------------+ |
| |   ~~~波形显示~~~           | |  <- Canvas 实时波形
| +---------------------------+ |
|                               |
| * REC  # STOP  00:00.0 [AUTO]|  <- 控制按钮 + Auto 开关
|   Ctrl+Enter Play  Ctrl+. Stop  <- 快捷键提示
|                               |
| Chunks: 0       Size: 0 KB   |  <- 录制统计
|                               |
| Format: [WebM v]    [Export]  |  <- 格式选择 + 导出
|                               |
| Status: Ready                 |  <- 状态文字
+-------------------------------+
```

面板支持拖拽标题栏移动位置，点击 `[_]` 最小化/展开。

## 技术细节

### 运行时机

脚本使用 `@run-at document-start`，在页面 JS 执行前完成以下 hook：

1. `AudioNode.prototype.connect` — 拦截所有到 `AudioDestinationNode` 的连接，同时路由到 `MediaStreamDestination`（录制）和 `AnalyserNode`（波形）
2. `window.AudioContext` — 通过 `Proxy` 包装构造函数，在新建的 AudioContext 上注册 `statechange` 监听（用于 Auto REC）

### 脚本元信息

```
// @name         Strudel Recorder
// @version      1.1
// @match        https://strudel.cc/*
// @grant        none
// @run-at       document-start
```

`@grant none` 使脚本与页面同源运行，可直接访问 `AudioContext`、`MediaRecorder` 等 Web API。

## 浏览器兼容性

| 浏览器 | 支持 |
|--------|------|
| Chrome 76+ | 支持 |
| Edge 79+ | 支持 |
| Firefox 76+ | 支持 |
| Safari | 不建议（MediaRecorder 支持不完整） |

## 依赖

| 库 | 版本 | 用途 | 加载方式 |
|----|------|------|----------|
| [lamejs](https://github.com/zhuker/lamejs) | 1.2.1 | MP3 编码 | 导出 MP3 时从 unpkg/jsDelivr CDN 动态加载 |

WebM 和 WAV 导出无外部依赖。

## 许可证

MIT
