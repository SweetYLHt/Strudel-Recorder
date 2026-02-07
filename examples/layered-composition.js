// Complex layered composition
// Demonstrates multiple sound layers with effects

stack(
  // Bass drum and snare
  sound("bd*2, ~ sd, [~ hh]*2")
    .bank("RolandTR909"),
  
  // Bassline
  note("c2 e2 g2 a2")
    .s("sawtooth")
    .lpf(800)
    .gain(0.6),
  
  // Melody
  note("<c4 e4 g4 b4>")
    .s("triangle")
    .room(0.5)
    .delay(0.2)
    .gain(0.4)
).slow(2)
