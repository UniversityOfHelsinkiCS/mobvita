const sliderColors = [
  'green3-slider',
  'green2-slider',
  'green1-slider',
  'yellowgreen-slider',
  'yellow-slider',
  'yellowred-slider',
  'red1-slider',
  'red2-slider',
  'red3-slider',
]

// Maps value to evenly distributed color bands, regardless of slider range.
export const getSliderThumbColor = (value, min = 0, max = 100) => {
  if (max <= min) return 'yellow-slider'

  const percent = ((value - min) / (max - min)) * 100
  const rawIndex = Math.floor((percent / 100) * sliderColors.length)
  const index = Math.max(0, Math.min(sliderColors.length - 1, rawIndex))

  return sliderColors[index]
}