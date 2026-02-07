# Example Strudel Patterns

This directory contains example Strudel code patterns that you can use with the Strudel Recorder.

## Getting Started

1. Visit [strudel.cc](https://strudel.cc)
2. Copy one of the example patterns below
3. Paste it into the Strudel editor
4. Press "Play" to hear the music
5. Use Strudel Recorder to save your modifications!

## Example 1: Simple Beat

```javascript
// Basic drum pattern
sound("bd sd bd sd")
  .bank("RolandTR909")
```

## Example 2: Melodic Pattern

```javascript
// Simple melody with notes
note("c3 e3 g3 e3")
  .s("piano")
  .slow(2)
```

## Example 3: Algorithmic Rhythm

```javascript
// Euclidean rhythm pattern
sound("bd(<3 5 7>, 8)")
  .bank("RolandTR909")
```

## Example 4: Layered Composition

```javascript
// Multiple layers
stack(
  sound("bd*2, ~ sd, [~ hh]*2"),
  note("c2 e2 g2 a2").s("sawtooth").lpf(800)
).slow(2)
```

## Example 5: Effects Chain

```javascript
// Pattern with effects
sound("arpy arpy:1 arpy:2 arpy:3")
  .speed("1 1.5 2 1.5")
  .room(0.5)
  .delay(0.3)
  .slow(1.5)
```

## Usage Tips

- Modify these patterns and save them using "💾 Save Code"
- Record your live coding performance with "⏺ Start Recording"
- Combine patterns to create unique compositions
- Experiment with different parameters and effects

## More Resources

- [Strudel Tutorial](https://strudel.cc/learn/getting-started/)
- [Pattern Reference](https://strudel.cc/learn/mini-notation/)
- [Strudel Community](https://discord.com/invite/aPU9rsW8sN)

## Contributing Examples

Have a cool pattern? Share it!
1. Fork this repository
2. Add your pattern to this file
3. Submit a pull request

Make sure your pattern:
- Is well-commented
- Demonstrates a specific technique
- Runs without errors on strudel.cc
