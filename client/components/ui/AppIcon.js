// eslint-disable-next-line no-unused-vars
import React from 'react'
import { colors } from 'Assets/mui_theme/designTokens'

/**
 * AppIcon — an SVG asset painted in a token colour.
 *
 * `<img src={icon}>` renders the colours baked into the file, which CSS cannot reach — so an icon
 * needs a separate file per colour and can never follow a theme. Here the SVG is used as a mask
 * instead: it supplies the shape, `color` supplies the paint. Pass a token (or a CSS variable, once
 * a dark theme publishes one) and the same asset works on every surface.
 *
 *   src   – the imported SVG, e.g. `images.cardsIcon`
 *   size  – px, square (default 24)
 *   color – any CSS colour; defaults to the ink token
 *
 * Only for single-colour icons: a mask keeps the alpha and discards the artwork's own colours.
 */
const AppIcon = ({ src, size = 24, color = colors.ink, style, ...rest }) => {
  // The URL must be quoted: Vite inlines small SVGs as `data:image/svg+xml,...` containing literal
  // `'` characters, and a quote inside an unquoted url() is invalid CSS — the browser then drops the
  // whole mask declaration and the bare background colour shows as a solid block.
  const mask = `url("${src}") center / contain no-repeat`

  return (
    <span
      aria-hidden
      style={{
        display: 'inline-block',
        flexShrink: 0,
        width: size,
        height: size,
        backgroundColor: color,
        WebkitMask: mask, // Safari still needs the prefix
        mask,
        ...style,
      }}
      {...rest}
    />
  )
}

export default AppIcon
