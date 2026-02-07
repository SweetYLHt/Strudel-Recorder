// Effects chain example
// Shows various audio effects in action

sound("arpy arpy:1 arpy:2 arpy:3")
  .speed("1 1.5 2 1.5")
  .room(0.5)       // Reverb
  .delay(0.3)      // Delay effect
  .lpf(2000)       // Low-pass filter
  .vowel("<a e i o u>")  // Vowel filter
  .slow(1.5)
