/**
 * Design tokens for the 2026 redesign (starting with the Login / auth screens).
 *
 * Single source of truth for the new look. Values come from the Figma "Revita 2026" auth mockups.
 * As the redesign spreads across the app, promote the shared ones into the MUI theme
 * (`muiTheme.js`) so global MUI components pick them up automatically; for now the auth components
 * import these directly so we can redesign in isolation without recolouring not-yet-touched pages.
 *
 * Values marked "derived" were not supplied in Figma Dev Mode — refine them on /design.
 */

export const colors = {
  panel: '#C1DCE6', // brand panel background (blue)
  card: '#FAF8ED', // form card background (cream)
  green: '#B1D3C2', // primary button
  greenHover: '#9CC6B2', // derived — Figma hover not provided
  ink: '#2D2C2A', // body text / button text
  muted: '#9D9B92', // labels / secondary text
  border: '#B1D3C2', // input border (same as green)
  focus: '#8FBBA6', // derived — focus border not provided
  error: '#D64545', // derived — error red not provided
  pageBg: '#EDEBE2', // derived — neutral behind the split card
}

export const font = {
  family: "'Geologica', sans-serif",
  brand: 76, // "Revita" wordmark
  title: 28, // derived — card title ("Login"/"Sign Up"), not supplied
  label: 12,
  input: 16,
  button: 16,
}

export const shape = {
  inputRadius: 999, // Figma "360px" ⇒ pill
  buttonRadius: 999, // pill
  cardRadius: 30,
  inputHeight: 36,
  fieldGap: 30,
  cardPadding: '40px 60px', // Figma "40,60" — assumed vertical/horizontal; confirm
}
