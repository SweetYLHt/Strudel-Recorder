// ==UserScript==
// @name         Strudel Recorder
// @namespace    https://github.com/SweetYLHt/Strudel-Recorder
// @version      1.0.0
// @description  Record and save audio/code from Strudel.cc live coding sessions
// @author       SweetYLHt
// @match        https://strudel.cc/*
// @match        https://*.strudel.cc/*
// @grant        none
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/SweetYLHt/Strudel-Recorder/main/strudel-recorder.user.js
// @updateURL    https://raw.githubusercontent.com/SweetYLHt/Strudel-Recorder/main/strudel-recorder.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Audio Recording State
    let mediaRecorder = null;
    let audioChunks = [];
    let isRecording = false;
    let audioContext = null;
    let audioDestination = null;

    // UI Elements
    let recorderPanel = null;
    let recordButton = null;
    let statusText = null;
    let titleElement = null;
    let buttonsContainer = null;
    let minimizeBtn = null;

    // Initialize the recorder
    function init() {
        console.log('[Strudel Recorder] Initializing...');
        createUI();
        hookAudioContext();
    }

    // Create the UI panel
    function createUI() {
        // Create main panel
        recorderPanel = document.createElement('div');
        recorderPanel.id = 'strudel-recorder-panel';
        recorderPanel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: 2px solid #fff;
            border-radius: 12px;
            padding: 15px;
            z-index: 999999;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            min-width: 200px;
        `;

        // Create title
        titleElement = document.createElement('div');
        titleElement.id = 'strudel-recorder-title';
        titleElement.textContent = '🎵 Strudel Recorder';
        titleElement.style.cssText = `
            color: white;
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 14px;
            text-align: center;
        `;
        recorderPanel.appendChild(titleElement);

        // Create buttons container
        buttonsContainer = document.createElement('div');
        buttonsContainer.id = 'strudel-recorder-buttons';
        buttonsContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 8px;
        `;

        // Create record button
        recordButton = document.createElement('button');
        recordButton.textContent = '⏺ Start Recording';
        recordButton.style.cssText = `
            background: #fff;
            border: none;
            border-radius: 6px;
            padding: 10px;
            cursor: pointer;
            font-weight: 600;
            font-size: 13px;
            transition: all 0.3s ease;
            color: #667eea;
        `;
        recordButton.onmouseover = () => {
            if (!isRecording) {
                recordButton.style.background = '#f0f0f0';
            }
        };
        recordButton.onmouseout = () => {
            if (!isRecording) {
                recordButton.style.background = '#fff';
            }
        };
        recordButton.onclick = toggleRecording;
        buttonsContainer.appendChild(recordButton);

        // Create save code button
        const saveCodeButton = document.createElement('button');
        saveCodeButton.textContent = '💾 Save Code';
        saveCodeButton.style.cssText = `
            background: #fff;
            border: none;
            border-radius: 6px;
            padding: 10px;
            cursor: pointer;
            font-weight: 600;
            font-size: 13px;
            transition: all 0.3s ease;
            color: #667eea;
        `;
        saveCodeButton.onmouseover = () => {
            saveCodeButton.style.background = '#f0f0f0';
        };
        saveCodeButton.onmouseout = () => {
            saveCodeButton.style.background = '#fff';
        };
        saveCodeButton.onclick = saveCode;
        buttonsContainer.appendChild(saveCodeButton);

        // Create status text
        statusText = document.createElement('div');
        statusText.textContent = 'Ready';
        statusText.style.cssText = `
            color: #fff;
            font-size: 12px;
            text-align: center;
            margin-top: 8px;
            padding: 5px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 4px;
        `;

        recorderPanel.appendChild(buttonsContainer);
        recorderPanel.appendChild(statusText);

        // Add minimize button
        minimizeBtn = document.createElement('button');
        minimizeBtn.id = 'strudel-recorder-minimize-btn';
        minimizeBtn.textContent = '−';
        minimizeBtn.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background: rgba(255, 255, 255, 0.3);
            border: none;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            cursor: pointer;
            color: white;
            font-weight: bold;
            font-size: 14px;
            line-height: 1;
        `;
        minimizeBtn.onclick = toggleMinimize;
        recorderPanel.appendChild(minimizeBtn);

        document.body.appendChild(recorderPanel);
        console.log('[Strudel Recorder] UI created');
    }

    // Toggle minimize/maximize panel
    let isMinimized = false;
    function toggleMinimize() {
        isMinimized = !isMinimized;

        if (isMinimized) {
            titleElement.style.display = 'none';
            buttonsContainer.style.display = 'none';
            statusText.style.display = 'none';
            recorderPanel.style.minWidth = '50px';
            minimizeBtn.textContent = '+';
        } else {
            titleElement.style.display = 'block';
            buttonsContainer.style.display = 'flex';
            statusText.style.display = 'block';
            recorderPanel.style.minWidth = '200px';
            minimizeBtn.textContent = '−';
        }
    }

    // Hook into AudioContext to capture audio
    function hookAudioContext() {
        const OriginalAudioContext = window.AudioContext || window.webkitAudioContext;
        if (!OriginalAudioContext) {
            console.warn('[Strudel Recorder] AudioContext not supported');
            return;
        }

        // Store reference to detect when Strudel creates its AudioContext
        const originalConstructor = OriginalAudioContext;
        window.AudioContext = function(...args) {
            const ctx = new originalConstructor(...args);
            console.log('[Strudel Recorder] AudioContext detected');
            audioContext = ctx;
            return ctx;
        };

        // Preserve original AudioContext properties
        window.AudioContext.prototype = originalConstructor.prototype;
    }

    // Toggle recording
    async function toggleRecording() {
        if (isRecording) {
            stopRecording();
        } else {
            await startRecording();
        }
    }

    // Start recording audio
    async function startRecording() {
        try {
            // Get the audio context from Strudel
            if (!audioContext) {
                // Try to find existing AudioContext
                const audioElems = document.querySelectorAll('audio');
                if (audioElems.length > 0) {
                    console.log('[Strudel Recorder] Found audio elements');
                }
            }

            // Create a MediaStreamDestination from the AudioContext if available
            let stream;
            if (audioContext) {
                audioDestination = audioContext.createMediaStreamDestination();
                
                // Try to connect to the destination
                // Note: This requires that Strudel's audio routing is accessible
                stream = audioDestination.stream;
            } else {
                // Fallback: capture from the default audio output (requires user permission)
                stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            }

            // Create MediaRecorder
            const options = { mimeType: 'audio/webm;codecs=opus' };
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                options.mimeType = 'audio/webm';
            }

            mediaRecorder = new MediaRecorder(stream, options);
            audioChunks = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                downloadAudio(audioBlob);
                audioChunks = [];
            };

            mediaRecorder.start();
            isRecording = true;

            // Update UI
            recordButton.textContent = '⏹ Stop Recording';
            recordButton.style.background = '#ff4444';
            recordButton.style.color = '#fff';
            statusText.textContent = '🔴 Recording...';

            console.log('[Strudel Recorder] Recording started');
        } catch (error) {
            console.error('[Strudel Recorder] Error starting recording:', error);
            statusText.textContent = `Error: ${error.message}`;
            alert('Unable to start recording. Please ensure you have granted microphone permissions or try the "Save Code" feature instead.');
        }
    }

    // Stop recording audio
    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            isRecording = false;

            // Update UI
            recordButton.textContent = '⏺ Start Recording';
            recordButton.style.background = '#fff';
            recordButton.style.color = '#667eea';
            statusText.textContent = 'Recording saved!';

            console.log('[Strudel Recorder] Recording stopped');

            // Reset status after 3 seconds
            setTimeout(() => {
                statusText.textContent = 'Ready';
            }, 3000);
        }
    }

    // Download audio file
    function downloadAudio(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        a.download = `strudel-recording-${timestamp}.webm`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        console.log('[Strudel Recorder] Audio downloaded');
    }

    // Save code from the editor
    function saveCode() {
        try {
            // Try to find the code editor content
            // Strudel uses CodeMirror or similar editor
            let code = '';

            // Method 1: Try to find CodeMirror instance
            if (window.CodeMirror && window.CodeMirror.instances) {
                const instances = window.CodeMirror.instances;
                if (instances && instances.length > 0) {
                    code = instances[0].getValue();
                }
            }

            // Method 2: Try to find textarea or editable content
            if (!code) {
                const textareas = document.querySelectorAll('textarea');
                if (textareas.length > 0) {
                    code = textareas[0].value;
                }
            }

            // Method 3: Try to find contenteditable elements
            if (!code) {
                const editables = document.querySelectorAll('[contenteditable="true"]');
                if (editables.length > 0) {
                    code = editables[0].textContent;
                }
            }

            // Method 4: Try to find common editor class names
            if (!code) {
                const editorSelectors = [
                    '.cm-content',
                    '.CodeMirror-code',
                    '.monaco-editor',
                    '[role="textbox"]',
                    '.editor'
                ];

                for (const selector of editorSelectors) {
                    const elem = document.querySelector(selector);
                    if (elem) {
                        code = elem.textContent || elem.innerText;
                        if (code) break;
                    }
                }
            }

            if (!code) {
                statusText.textContent = 'No code found';
                alert('Could not find code editor content. Please copy your code manually.');
                return;
            }

            // Create and download the code file
            const blob = new Blob([code], { type: 'text/javascript' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            a.download = `strudel-code-${timestamp}.js`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);

            statusText.textContent = 'Code saved!';
            console.log('[Strudel Recorder] Code saved');

            // Reset status after 3 seconds
            setTimeout(() => {
                statusText.textContent = 'Ready';
            }, 3000);
        } catch (error) {
            console.error('[Strudel Recorder] Error saving code:', error);
            statusText.textContent = `Error: ${error.message}`;
        }
    }

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('[Strudel Recorder] Script loaded');
})();
