# Testing Guide

This document outlines how to test the Strudel Recorder userscript.

## Prerequisites

- Tampermonkey installed
- Access to strudel.cc
- Modern web browser (Chrome, Firefox, Safari, or Edge)

## Installation Testing

### Test 1: Script Installation
- [ ] Install Tampermonkey
- [ ] Click install link for Strudel Recorder
- [ ] Verify script appears in Tampermonkey dashboard
- [ ] Verify script is enabled

### Test 2: Script Loading
- [ ] Visit https://strudel.cc
- [ ] Check browser console for "[Strudel Recorder] Initializing..."
- [ ] Verify panel appears in bottom-right corner
- [ ] Verify panel has purple gradient background

## UI Testing

### Test 3: Panel Visibility
- [ ] Panel visible on page load
- [ ] Panel positioned in bottom-right
- [ ] Panel contains title "🎵 Strudel Recorder"
- [ ] Panel contains two buttons
- [ ] Panel contains status text "Ready"

### Test 4: Minimize/Maximize
- [ ] Click minimize button (−)
- [ ] Panel shrinks to small size
- [ ] Button changes to (+)
- [ ] Click maximize button (+)
- [ ] Panel expands to full size
- [ ] Button changes to (−)

### Test 5: Button Hover Effects
- [ ] Hover over "Start Recording" button
- [ ] Background changes to lighter color
- [ ] Mouse out returns to original color
- [ ] Hover over "Save Code" button
- [ ] Same hover effect applies

## Functionality Testing

### Test 6: Code Saving
- [ ] Open strudel.cc
- [ ] Enter code in editor: `sound("bd sd")`
- [ ] Click "💾 Save Code" button
- [ ] Status shows "Code saved!"
- [ ] File downloads with name pattern `strudel-code-*.js`
- [ ] Open file in text editor
- [ ] Verify code matches what you entered

### Test 7: Code Detection Methods
Test with different editor states:
- [ ] Fresh page load
- [ ] After editing code
- [ ] After running code
- [ ] With complex multi-line code
- [ ] With empty editor (should show "No code found")

### Test 8: Audio Recording (Basic)
- [ ] Click "⏺ Start Recording"
- [ ] Browser requests microphone permission
- [ ] Grant permission
- [ ] Button changes to "⏹ Stop Recording"
- [ ] Button turns red
- [ ] Status shows "🔴 Recording..."

### Test 9: Audio Recording (Stopping)
- [ ] While recording, click "⏹ Stop Recording"
- [ ] Button returns to "⏺ Start Recording"
- [ ] Button returns to white background
- [ ] Status shows "Recording saved!"
- [ ] File downloads with name pattern `strudel-recording-*.webm`
- [ ] Status returns to "Ready" after 3 seconds

### Test 10: Audio File Verification
- [ ] Locate downloaded .webm file
- [ ] Open in media player (VLC, Chrome, Firefox)
- [ ] Verify file plays audio
- [ ] Check duration matches recording time

## Cross-Browser Testing

### Test 11: Chrome/Edge
- [ ] Install and test all features
- [ ] Check console for errors
- [ ] Verify download behavior

### Test 12: Firefox
- [ ] Install and test all features
- [ ] Check console for errors
- [ ] Verify download behavior

### Test 13: Safari (if available)
- [ ] Install and test all features
- [ ] Check console for errors
- [ ] Verify download behavior

## Error Handling Testing

### Test 14: Permission Denied
- [ ] Start recording
- [ ] Deny microphone permission
- [ ] Verify error message appears
- [ ] Verify alert shows helpful message

### Test 15: No Code in Editor
- [ ] Clear all code from editor
- [ ] Click "Save Code"
- [ ] Verify appropriate error message
- [ ] Verify alert appears

### Test 16: Multiple Recordings
- [ ] Start and stop recording
- [ ] Wait for download
- [ ] Start another recording
- [ ] Stop and download
- [ ] Verify both files exist with different timestamps

## Performance Testing

### Test 17: Long Recording
- [ ] Start recording
- [ ] Wait for 5+ minutes
- [ ] Stop recording
- [ ] Verify file downloads
- [ ] Verify file size is reasonable
- [ ] Verify file plays correctly

### Test 18: Rapid Operations
- [ ] Quickly click Save Code multiple times
- [ ] Verify multiple files download
- [ ] Verify all files have content
- [ ] Verify timestamps are unique

### Test 19: Memory Leaks
- [ ] Open browser dev tools
- [ ] Monitor memory usage
- [ ] Perform multiple recordings
- [ ] Save code multiple times
- [ ] Minimize/maximize panel repeatedly
- [ ] Check for memory growth

## Compatibility Testing

### Test 20: Strudel Versions
Test on different Strudel pages:
- [ ] Main page: https://strudel.cc
- [ ] REPL: https://strudel.cc/repl
- [ ] Workshop: https://strudel.cc/workshop
- [ ] Any other strudel.cc subdomain

### Test 21: With Other Userscripts
- [ ] Install another popular userscript
- [ ] Verify no conflicts
- [ ] Both scripts work independently

## Documentation Testing

### Test 22: README Accuracy
- [ ] Follow installation steps in README
- [ ] Verify all steps work as described
- [ ] Check all links work

### Test 23: Examples
- [ ] Copy each example from examples/
- [ ] Paste into Strudel
- [ ] Verify they run without errors
- [ ] Save each example
- [ ] Verify saved files are correct

## Regression Testing

After any code changes, rerun:
- Test 6: Code Saving
- Test 8-9: Audio Recording
- Test 14-15: Error Handling

## Test Results Template

```
Date: ____________________
Browser: _________________
Version: _________________
OS: ______________________

Tests Passed: _____ / 23
Tests Failed: _____
Critical Issues: _____
Minor Issues: _____

Notes:
_________________________
_________________________
_________________________
```

## Reporting Issues

If tests fail:
1. Note which test failed
2. Record steps to reproduce
3. Capture console errors
4. Take screenshots if applicable
5. Report at: https://github.com/SweetYLHt/Strudel-Recorder/issues

## Automated Testing

Currently, all tests are manual. Future versions may include:
- Automated browser tests with Selenium
- Unit tests for core functions
- Integration tests with Strudel

## Success Criteria

For release, minimum requirements:
- ✅ All UI tests pass
- ✅ Code saving works reliably
- ✅ Audio recording starts/stops correctly
- ✅ No console errors
- ✅ Works on Chrome and Firefox
- ✅ Files download with correct names
- ✅ Examples all work

---

Last Updated: 2026-02-07
Version: 1.0.0
