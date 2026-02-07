// Euclidean rhythm demonstration
// Creates interesting polyrhythmic patterns

stack(
  sound("bd(<3 5>, 8)").bank("RolandTR909"),
  sound("~ sd(<5 3>, 8)").bank("RolandTR909"),
  sound("hh(<7 11>, 16)").bank("RolandTR909").gain(0.6)
)
