// ==UserScript==
// @name         Strudel Recorder
// @namespace    strudel-recorder
// @version      1.1
// @description  Record audio from strudel.cc with WebM/WAV/MP3 export, Auto REC support
// @match        https://strudel.cc/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    // ========================================
    // 1. Audio Interception (runs at document-start)
    // ========================================

    const originalConnect = AudioNode.prototype.connect;
    let audioCtx = null;
    let mediaStreamDest = null;
    let analyserNode = null;
    let intercepted = false;

    AudioNode.prototype.connect = function (dest, ...args) {
        // First time we see a connection to AudioDestinationNode, capture the context
        if (dest instanceof AudioDestinationNode && !audioCtx) {
            audioCtx = dest.context;
            mediaStreamDest = audioCtx.createMediaStreamDestination();
            analyserNode = audioCtx.createAnalyser();
            analyserNode.fftSize = 2048;
            analyserNode.smoothingTimeConstant = 0.8;
            intercepted = true;
            console.log('[Strudel Recorder] AudioContext captured, recording nodes ready');

            // Notify UI if it's already created
            if (window.__strudelRecorderUI) {
                window.__strudelRecorderUI.onAudioReady();
            }
        }

        // Route audio to our recording and analyser nodes too
        if (dest instanceof AudioDestinationNode && mediaStreamDest) {
            try {
                originalConnect.call(this, mediaStreamDest);
                originalConnect.call(this, analyserNode);
            } catch (e) {
                // Ignore duplicate connection errors
            }
        }

        return originalConnect.call(this, dest, ...args);
    };

    // ========================================
    // 1b. AudioContext interception for Auto REC
    // ========================================

    let autoRecEnabled = false;

    const OrigAudioContext = window.AudioContext || window.webkitAudioContext;

    if (OrigAudioContext) {
        const PatchedAudioContext = new Proxy(OrigAudioContext, {
            construct(target, args) {
                const ctx = new target(...args);
                ctx.addEventListener('statechange', () => {
                    if (autoRecEnabled && ctx.state === 'running' &&
                        window.__strudelRecorderUI && !window.__strudelRecorderUI.isRecording) {
                        setTimeout(() => {
                            if (window.__strudelRecorderUI && !window.__strudelRecorderUI.isRecording) {
                                console.log('[Strudel Recorder] Auto REC: AudioContext running, starting recording');
                                window.__strudelRecorderUI.startRecording();
                            }
                        }, 150);
                    }
                });
                return ctx;
            }
        });
        window.AudioContext = PatchedAudioContext;
        if (window.webkitAudioContext) {
            window.webkitAudioContext = PatchedAudioContext;
        }
    }

    // ========================================
    // 2. Wait for DOM, then inject UI
    // ========================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUI);
    } else {
        initUI();
    }

    function initUI() {
        // Small delay to let strudel.cc finish its initial rendering
        setTimeout(() => {
            const recorder = new StrudelRecorderUI();
            window.__strudelRecorderUI = recorder;
            recorder.init();
        }, 1000);
    }

    // ========================================
    // 3. StrudelRecorderUI class
    // ========================================

    class StrudelRecorderUI {
        constructor() {
            this.isRecording = false;
            this.autoRecEnabled = false;
            this.recordedChunks = [];
            this.mediaRecorder = null;
            this.recordingStartTime = 0;
            this.timerId = null;
            this.animationId = null;
            this.isMinimized = false;
            this.isDragging = false;
            this.dragOffset = { x: 0, y: 0 };
            this.panel = null;
            this.canvas = null;
            this.canvasCtx = null;
            this.dataArray = null;
            this.elements = {};
        }

        init() {
            this.createPanel();
            this.bindEvents();
            this.startWaveformLoop();

            if (intercepted) {
                this.onAudioReady();
            }

            console.log('[Strudel Recorder] UI initialized');
        }

        onAudioReady() {
            this.setStatus('Ready - play music then hit REC');
            if (this.elements.recBtn) {
                this.elements.recBtn.disabled = false;
            }
        }

        // ========================================
        // 3a. Create the floating panel
        // ========================================

        createPanel() {
            const panel = document.createElement('div');
            panel.id = 'strudel-recorder-panel';
            panel.innerHTML = `
                <div class="sr-header" id="sr-header">
                    <span class="sr-title">Strudel Recorder</span>
                    <div class="sr-header-btns">
                        <button class="sr-btn-min" id="sr-btn-min" title="Minimize">_</button>
                    </div>
                </div>
                <div class="sr-body" id="sr-body">
                    <div class="sr-waveform-wrap">
                        <canvas id="sr-waveform" width="250" height="60"></canvas>
                    </div>

                    <div class="sr-controls">
                        <button class="sr-btn sr-rec-btn" id="sr-rec-btn" disabled>
                            <span class="sr-rec-dot"></span> REC
                        </button>
                        <button class="sr-btn sr-stop-btn" id="sr-stop-btn" disabled>
                            <span class="sr-stop-icon"></span> STOP
                        </button>
                        <span class="sr-timer" id="sr-timer">00:00.0</span>
                        <button class="sr-btn sr-auto-btn" id="sr-auto-btn" title="Auto REC: auto-start/stop recording with Play/Stop">AUTO</button>
                    </div>

                    <div class="sr-shortcuts">
                        <kbd>Ctrl+Enter</kbd> Play &nbsp; <kbd>Ctrl+.</kbd> Stop
                    </div>

                    <div class="sr-stats" id="sr-stats">
                        <span>Chunks: <b id="sr-stat-chunks">0</b></span>
                        <span>Size: <b id="sr-stat-size">0 KB</b></span>
                    </div>

                    <div class="sr-export-row">
                        <select class="sr-select" id="sr-format">
                            <option value="webm">WebM</option>
                            <option value="wav">WAV</option>
                            <option value="mp3">MP3</option>
                        </select>
                        <button class="sr-btn sr-export-btn" id="sr-export-btn" disabled>Export</button>
                    </div>

                    <div class="sr-progress-wrap" id="sr-progress-wrap" style="display:none">
                        <div class="sr-progress-bar" id="sr-progress-bar"></div>
                    </div>

                    <div class="sr-status" id="sr-status">Waiting for audio...</div>
                </div>
            `;

            // Inject styles
            const style = document.createElement('style');
            style.textContent = this.getStyles();
            document.head.appendChild(style);

            document.body.appendChild(panel);
            this.panel = panel;

            // Cache element refs
            this.elements = {
                header: panel.querySelector('#sr-header'),
                body: panel.querySelector('#sr-body'),
                btnMin: panel.querySelector('#sr-btn-min'),
                recBtn: panel.querySelector('#sr-rec-btn'),
                stopBtn: panel.querySelector('#sr-stop-btn'),
                autoBtn: panel.querySelector('#sr-auto-btn'),
                timer: panel.querySelector('#sr-timer'),
                statChunks: panel.querySelector('#sr-stat-chunks'),
                statSize: panel.querySelector('#sr-stat-size'),
                format: panel.querySelector('#sr-format'),
                exportBtn: panel.querySelector('#sr-export-btn'),
                progressWrap: panel.querySelector('#sr-progress-wrap'),
                progressBar: panel.querySelector('#sr-progress-bar'),
                status: panel.querySelector('#sr-status'),
            };

            this.canvas = panel.querySelector('#sr-waveform');
            this.canvasCtx = this.canvas.getContext('2d');
        }

        getStyles() {
            return `
                #strudel-recorder-panel {
                    position: fixed;
                    right: 20px;
                    bottom: 20px;
                    width: 280px;
                    background: rgba(18, 18, 30, 0.95);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(0, 255, 255, 0.25);
                    border-radius: 12px;
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 255, 255, 0.15);
                    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
                    font-size: 12px;
                    color: #c0c8d8;
                    z-index: 999999;
                    user-select: none;
                    overflow: hidden;
                    transition: height 0.3s ease, opacity 0.3s ease;
                }
                #strudel-recorder-panel.sr-minimized {
                    height: 40px !important;
                }
                #strudel-recorder-panel.sr-minimized .sr-body {
                    display: none;
                }

                .sr-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 14px;
                    background: rgba(0, 0, 0, 0.4);
                    border-bottom: 1px solid rgba(0, 255, 255, 0.15);
                    cursor: move;
                }
                .sr-title {
                    font-size: 13px;
                    font-weight: 700;
                    color: #00e5ff;
                    letter-spacing: 0.5px;
                    text-shadow: 0 0 8px rgba(0, 229, 255, 0.4);
                }
                .sr-header-btns {
                    display: flex;
                    gap: 4px;
                }
                .sr-btn-min {
                    width: 22px;
                    height: 22px;
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 4px;
                    background: rgba(255, 255, 255, 0.05);
                    color: #8899aa;
                    font-size: 12px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    line-height: 1;
                }
                .sr-btn-min:hover { background: rgba(255, 255, 255, 0.12); color: #fff; }

                .sr-body { padding: 10px 14px 14px; }

                .sr-waveform-wrap {
                    border: 1px solid rgba(0, 255, 255, 0.12);
                    border-radius: 6px;
                    overflow: hidden;
                    margin-bottom: 10px;
                    background: #0a0a18;
                }
                #sr-waveform {
                    display: block;
                    width: 100%;
                    height: 60px;
                }

                .sr-controls {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                }
                .sr-btn {
                    padding: 5px 14px;
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 6px;
                    background: rgba(255, 255, 255, 0.06);
                    color: #c0c8d8;
                    font-family: inherit;
                    font-size: 11px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    letter-spacing: 0.3px;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                .sr-btn:hover:not(:disabled) {
                    background: rgba(255, 255, 255, 0.12);
                    border-color: rgba(255, 255, 255, 0.3);
                }
                .sr-btn:disabled {
                    opacity: 0.35;
                    cursor: not-allowed;
                }

                .sr-rec-btn {
                    border-color: rgba(255, 50, 80, 0.4);
                    color: #ff5566;
                }
                .sr-rec-btn:hover:not(:disabled) {
                    background: rgba(255, 50, 80, 0.15);
                    border-color: rgba(255, 50, 80, 0.6);
                    box-shadow: 0 0 10px rgba(255, 50, 80, 0.2);
                }
                .sr-rec-btn.recording {
                    background: rgba(255, 50, 80, 0.25);
                    border-color: #ff3355;
                    box-shadow: 0 0 15px rgba(255, 50, 80, 0.35);
                    animation: sr-pulse 1.5s ease-in-out infinite;
                }
                .sr-rec-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: currentColor;
                    display: inline-block;
                }
                .sr-stop-icon {
                    width: 8px;
                    height: 8px;
                    background: currentColor;
                    display: inline-block;
                    border-radius: 1px;
                }

                .sr-timer {
                    font-size: 13px;
                    color: #667788;
                    margin-left: auto;
                    font-variant-numeric: tabular-nums;
                }
                .sr-timer.recording {
                    color: #ff5566;
                    text-shadow: 0 0 6px rgba(255, 50, 80, 0.4);
                }

                .sr-auto-btn {
                    padding: 3px 8px;
                    font-size: 9px;
                    letter-spacing: 0.5px;
                    border-color: rgba(150, 150, 150, 0.3);
                    color: #667;
                    margin-left: 2px;
                    flex-shrink: 0;
                }
                .sr-auto-btn:hover {
                    border-color: rgba(180, 100, 255, 0.5);
                    color: #b464ff;
                }
                .sr-auto-btn.active {
                    background: rgba(180, 100, 255, 0.2);
                    border-color: rgba(180, 100, 255, 0.6);
                    color: #c88aff;
                    box-shadow: 0 0 10px rgba(180, 100, 255, 0.25);
                    text-shadow: 0 0 6px rgba(180, 100, 255, 0.4);
                }

                .sr-shortcuts {
                    font-size: 9px;
                    color: #4a5568;
                    text-align: center;
                    margin-bottom: 6px;
                    letter-spacing: 0.3px;
                }
                .sr-shortcuts kbd {
                    display: inline-block;
                    padding: 1px 4px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                    background: rgba(255, 255, 255, 0.04);
                    font-family: inherit;
                    font-size: 9px;
                    color: #6b7a8d;
                }

                .sr-stats {
                    display: flex;
                    justify-content: space-between;
                    font-size: 10px;
                    color: #556677;
                    margin-bottom: 10px;
                    padding: 4px 0;
                    border-top: 1px solid rgba(255, 255, 255, 0.06);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
                }
                .sr-stats b { color: #8899aa; font-weight: 600; }

                .sr-export-row {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 8px;
                }
                .sr-select {
                    flex: 1;
                    padding: 5px 8px;
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 6px;
                    background: rgba(0, 0, 0, 0.4);
                    color: #c0c8d8;
                    font-family: inherit;
                    font-size: 11px;
                    cursor: pointer;
                    outline: none;
                }
                .sr-select:focus { border-color: rgba(0, 255, 255, 0.4); }
                .sr-select option { background: #12121e; }

                .sr-export-btn {
                    border-color: rgba(0, 255, 136, 0.4);
                    color: #00ff88;
                }
                .sr-export-btn:hover:not(:disabled) {
                    background: rgba(0, 255, 136, 0.12);
                    border-color: rgba(0, 255, 136, 0.6);
                    box-shadow: 0 0 10px rgba(0, 255, 136, 0.2);
                }

                .sr-progress-wrap {
                    height: 3px;
                    background: rgba(255, 255, 255, 0.06);
                    border-radius: 2px;
                    margin-bottom: 8px;
                    overflow: hidden;
                }
                .sr-progress-bar {
                    height: 100%;
                    width: 0%;
                    background: linear-gradient(90deg, #00e5ff, #00ff88);
                    border-radius: 2px;
                    transition: width 0.15s ease;
                }

                .sr-status {
                    font-size: 10px;
                    color: #556677;
                    text-align: center;
                    letter-spacing: 0.3px;
                    min-height: 14px;
                }

                @keyframes sr-pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
            `;
        }

        // ========================================
        // 3b. Bind events
        // ========================================

        bindEvents() {
            // Minimize toggle
            this.elements.btnMin.addEventListener('click', () => {
                this.isMinimized = !this.isMinimized;
                this.panel.classList.toggle('sr-minimized', this.isMinimized);
                this.elements.btnMin.textContent = this.isMinimized ? '+' : '_';
            });

            // Drag to move
            this.elements.header.addEventListener('mousedown', (e) => {
                if (e.target.closest('.sr-header-btns')) return;
                this.isDragging = true;
                const rect = this.panel.getBoundingClientRect();
                this.dragOffset.x = e.clientX - rect.left;
                this.dragOffset.y = e.clientY - rect.top;
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (!this.isDragging) return;
                const x = e.clientX - this.dragOffset.x;
                const y = e.clientY - this.dragOffset.y;
                this.panel.style.left = Math.max(0, x) + 'px';
                this.panel.style.top = Math.max(0, y) + 'px';
                this.panel.style.right = 'auto';
                this.panel.style.bottom = 'auto';
            });

            document.addEventListener('mouseup', () => {
                this.isDragging = false;
            });

            // REC
            this.elements.recBtn.addEventListener('click', () => this.startRecording());

            // STOP
            this.elements.stopBtn.addEventListener('click', () => this.stopRecording());

            // Export
            this.elements.exportBtn.addEventListener('click', () => this.exportAudio());

            // Auto REC toggle
            this.elements.autoBtn.addEventListener('click', () => {
                this.autoRecEnabled = !this.autoRecEnabled;
                autoRecEnabled = this.autoRecEnabled; // sync with outer scope for AudioContext hook
                this.elements.autoBtn.classList.toggle('active', this.autoRecEnabled);
                if (this.autoRecEnabled) {
                    this.setStatus('Auto REC ON - will record on Play');
                } else {
                    this.setStatus('Auto REC OFF');
                }
                console.log('[Strudel Recorder] Auto REC:', this.autoRecEnabled);
            });

            // Auto REC: keyboard shortcut interception (capture phase)
            document.addEventListener('keydown', (e) => {
                if (!this.autoRecEnabled) return;
                // Ctrl+Enter = Play in strudel.cc
                if (e.ctrlKey && e.key === 'Enter') {
                    setTimeout(() => {
                        if (!this.isRecording && mediaStreamDest) {
                            console.log('[Strudel Recorder] Auto REC: Ctrl+Enter detected, starting recording');
                            this.startRecording();
                        }
                    }, 150);
                }
                // Ctrl+. = Stop in strudel.cc
                else if (e.ctrlKey && e.key === '.') {
                    setTimeout(() => {
                        if (this.isRecording) {
                            console.log('[Strudel Recorder] Auto REC: Ctrl+. detected, stopping recording');
                            this.stopRecording();
                        }
                    }, 150);
                }
            }, true); // capture phase - fires before strudel.cc's handlers
        }

        // ========================================
        // 4. Recording logic
        // ========================================

        startRecording() {
            if (!mediaStreamDest) {
                this.setStatus('No audio detected yet - play something first');
                return;
            }

            // Ensure AudioContext is running
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            let mimeType = 'audio/webm;codecs=opus';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                mimeType = 'audio/webm';
            }

            this.mediaRecorder = new MediaRecorder(mediaStreamDest.stream, {
                mimeType,
                audioBitsPerSecond: 320000,
            });

            this.recordedChunks = [];

            this.mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    this.recordedChunks.push(e.data);
                    this.updateStats();
                }
            };

            this.mediaRecorder.onstop = () => {
                console.log(`[Strudel Recorder] Recording done, ${this.recordedChunks.length} chunks`);
            };

            this.mediaRecorder.start(100);
            this.isRecording = true;
            this.recordingStartTime = Date.now();

            // UI updates
            this.elements.recBtn.classList.add('recording');
            this.elements.recBtn.disabled = true;
            this.elements.stopBtn.disabled = false;
            this.elements.exportBtn.disabled = true;
            this.elements.timer.classList.add('recording');

            this.startTimer();
            this.setStatus('Recording...');
        }

        stopRecording() {
            if (!this.isRecording) return;

            this.isRecording = false;
            this.stopTimer();

            if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
                this.mediaRecorder.stop();
            }

            // UI updates
            this.elements.recBtn.classList.remove('recording');
            this.elements.recBtn.disabled = false;
            this.elements.stopBtn.disabled = true;
            this.elements.exportBtn.disabled = this.recordedChunks.length === 0;
            this.elements.timer.classList.remove('recording');

            const duration = ((Date.now() - this.recordingStartTime) / 1000).toFixed(1);
            this.setStatus(`Recorded ${duration}s - ready to export`);
        }

        startTimer() {
            this.timerId = setInterval(() => {
                const elapsed = (Date.now() - this.recordingStartTime) / 1000;
                const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
                const secs = Math.floor(elapsed % 60).toString().padStart(2, '0');
                const tenths = Math.floor((elapsed * 10) % 10);
                this.elements.timer.textContent = `${mins}:${secs}.${tenths}`;
            }, 100);
        }

        stopTimer() {
            if (this.timerId) {
                clearInterval(this.timerId);
                this.timerId = null;
            }
        }

        updateStats() {
            const chunks = this.recordedChunks.length;
            const totalSize = this.recordedChunks.reduce((sum, c) => sum + c.size, 0);
            this.elements.statChunks.textContent = chunks;

            if (totalSize > 1024 * 1024) {
                this.elements.statSize.textContent = (totalSize / 1024 / 1024).toFixed(2) + ' MB';
            } else {
                this.elements.statSize.textContent = (totalSize / 1024).toFixed(1) + ' KB';
            }
        }

        // ========================================
        // 5. Export logic (WebM / WAV / MP3)
        // ========================================

        async exportAudio() {
            if (!this.recordedChunks.length) {
                this.setStatus('No recorded data');
                return;
            }

            const format = this.elements.format.value;

            try {
                this.setStatus(`Exporting ${format.toUpperCase()}...`);
                this.elements.exportBtn.disabled = true;
                this.showProgress(0);

                const webmBlob = new Blob(this.recordedChunks, { type: 'audio/webm' });
                let blob, filename;
                const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

                if (format === 'webm') {
                    blob = webmBlob;
                    filename = `strudel-${ts}.webm`;
                    this.showProgress(100);
                } else {
                    // Decode WebM to PCM
                    this.setStatus(`Decoding audio...`);
                    const arrayBuffer = await webmBlob.arrayBuffer();
                    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

                    const audioData = {
                        left: audioBuffer.getChannelData(0),
                        right: audioBuffer.numberOfChannels > 1
                            ? audioBuffer.getChannelData(1)
                            : audioBuffer.getChannelData(0),
                        sampleRate: audioBuffer.sampleRate,
                    };

                    if (format === 'wav') {
                        blob = this.encodeWav(audioData);
                        filename = `strudel-${ts}.wav`;
                        this.showProgress(100);
                    } else if (format === 'mp3') {
                        this.setStatus('Loading MP3 encoder...');
                        await this.loadLameJs();
                        this.setStatus('Encoding MP3...');
                        blob = await this.encodeMp3(audioData, (p) => this.showProgress(p));
                        filename = `strudel-${ts}.mp3`;
                    }
                }

                // Download
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);

                const sizeStr = blob.size > 1024 * 1024
                    ? (blob.size / 1024 / 1024).toFixed(2) + ' MB'
                    : (blob.size / 1024).toFixed(1) + ' KB';

                this.setStatus(`Exported: ${filename} (${sizeStr})`);
            } catch (error) {
                console.error('[Strudel Recorder] Export failed:', error);
                this.setStatus('Export failed: ' + error.message);
            } finally {
                this.elements.exportBtn.disabled = this.recordedChunks.length === 0;
                setTimeout(() => this.hideProgress(), 1500);
            }
        }

        showProgress(pct) {
            this.elements.progressWrap.style.display = 'block';
            this.elements.progressBar.style.width = pct + '%';
        }

        hideProgress() {
            this.elements.progressWrap.style.display = 'none';
            this.elements.progressBar.style.width = '0%';
        }

        // --- WAV encoder (inline) ---

        encodeWav(audioData) {
            const { left, right, sampleRate } = audioData;
            const numChannels = 2;
            const bitsPerSample = 16;
            const bytesPerSample = bitsPerSample / 8;
            const blockAlign = numChannels * bytesPerSample;
            const byteRate = sampleRate * blockAlign;
            const dataSize = left.length * blockAlign;
            const bufferSize = 44 + dataSize;

            const buffer = new ArrayBuffer(bufferSize);
            const view = new DataView(buffer);

            // RIFF header
            this._writeStr(view, 0, 'RIFF');
            view.setUint32(4, bufferSize - 8, true);
            this._writeStr(view, 8, 'WAVE');
            this._writeStr(view, 12, 'fmt ');
            view.setUint32(16, 16, true);
            view.setUint16(20, 1, true);   // PCM
            view.setUint16(22, numChannels, true);
            view.setUint32(24, sampleRate, true);
            view.setUint32(28, byteRate, true);
            view.setUint16(32, blockAlign, true);
            view.setUint16(34, bitsPerSample, true);
            this._writeStr(view, 36, 'data');
            view.setUint32(40, dataSize, true);

            // Interleaved stereo samples
            let offset = 44;
            for (let i = 0; i < left.length; i++) {
                const l = Math.max(-1, Math.min(1, left[i]));
                const r = Math.max(-1, Math.min(1, right[i]));
                view.setInt16(offset, l < 0 ? l * 0x8000 : l * 0x7FFF, true);
                offset += 2;
                view.setInt16(offset, r < 0 ? r * 0x8000 : r * 0x7FFF, true);
                offset += 2;
            }

            return new Blob([buffer], { type: 'audio/wav' });
        }

        _writeStr(view, offset, str) {
            for (let i = 0; i < str.length; i++) {
                view.setUint8(offset + i, str.charCodeAt(i));
            }
        }

        // --- MP3 encoder (uses lamejs from CDN) ---

        async loadLameJs() {
            if (window.lamejs) return;

            const urls = [
                'https://unpkg.com/lamejs@1.2.1/lame.min.js',
                'https://cdn.jsdelivr.net/npm/lamejs@1.2.1/lame.min.js',
            ];

            for (const url of urls) {
                try {
                    await new Promise((resolve, reject) => {
                        const s = document.createElement('script');
                        s.src = url;
                        s.onload = resolve;
                        s.onerror = reject;
                        document.head.appendChild(s);
                    });
                    if (window.lamejs) {
                        console.log('[Strudel Recorder] lamejs loaded from', url);
                        return;
                    }
                } catch (e) {
                    console.warn('[Strudel Recorder] lamejs load failed:', url);
                }
            }

            throw new Error('Failed to load lamejs - check network connection');
        }

        _floatTo16Bit(floatArr) {
            const out = new Int16Array(floatArr.length);
            for (let i = 0; i < floatArr.length; i++) {
                const s = Math.max(-1, Math.min(1, floatArr[i]));
                out[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
            }
            return out;
        }

        async encodeMp3(audioData, onProgress) {
            const { left, right, sampleRate } = audioData;
            const mp3encoder = new lamejs.Mp3Encoder(2, sampleRate, 320);

            const leftInt16 = this._floatTo16Bit(left);
            const rightInt16 = this._floatTo16Bit(right);

            const mp3Data = [];
            const blockSize = 1152;

            for (let i = 0; i < left.length; i += blockSize) {
                const lc = leftInt16.subarray(i, i + blockSize);
                const rc = rightInt16.subarray(i, i + blockSize);
                const buf = mp3encoder.encodeBuffer(lc, rc);
                if (buf.length > 0) mp3Data.push(buf);

                if (onProgress && i % (blockSize * 50) === 0) {
                    onProgress(Math.round((i / left.length) * 100));
                    // Yield to UI thread
                    await new Promise((r) => setTimeout(r, 0));
                }
            }

            const tail = mp3encoder.flush();
            if (tail.length > 0) mp3Data.push(tail);

            if (onProgress) onProgress(100);

            return new Blob(mp3Data, { type: 'audio/mp3' });
        }

        // ========================================
        // 6. Waveform visualization
        // ========================================

        startWaveformLoop() {
            const W = this.canvas.width;
            const H = this.canvas.height;
            this.dataArray = new Uint8Array(1024);

            const draw = () => {
                this.animationId = requestAnimationFrame(draw);

                const ctx = this.canvasCtx;

                // Clear
                ctx.fillStyle = '#0a0a18';
                ctx.fillRect(0, 0, W, H);

                if (!analyserNode) {
                    // Draw flat line
                    ctx.strokeStyle = '#1a2a3a';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(0, H / 2);
                    ctx.lineTo(W, H / 2);
                    ctx.stroke();
                    return;
                }

                analyserNode.getByteTimeDomainData(this.dataArray);

                const color = this.isRecording ? '#ff4455' : '#00e5ff';
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = color;
                ctx.beginPath();

                const sliceW = W / this.dataArray.length;
                let x = 0;

                for (let i = 0; i < this.dataArray.length; i++) {
                    const v = this.dataArray[i] / 128.0;
                    const y = (v * H) / 2;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                    x += sliceW;
                }

                ctx.lineTo(W, H / 2);
                ctx.stroke();
            };

            draw();
        }

        // ========================================
        // 7. Utility
        // ========================================

        setStatus(text) {
            if (this.elements.status) {
                this.elements.status.textContent = text;
            }
        }
    }
})();
