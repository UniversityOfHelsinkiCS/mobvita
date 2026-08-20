/**
 * Design tokens for the 2026 redesign, from the Figma "Revita 2026" auth mockups.
 * Promote shared values into the MUI theme (`muiTheme.js`) as the redesign spreads.
 * Values marked "derived" were not supplied in Figma — refine them on /design.
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
  menuHover: '#ECE3BE', // hover used for menus, folders, etc.
  progressBarTrack: '#E5EDE4', // derived — progress bar track
  progressBarFill: '#A6CDB4', // derived — progress bar fill
  opponent: '#FF5900', // derived — opponent bar fill
}

// Typefaces fetched from Google Fonts. `name` drives both the stylesheet URL injected into
// index.html (`fontLinkPlugin` in vite.config.mjs) and the CSS stack below. Each weight is served
// as a separate static face, so a weight that is not on this ladder will not render.
const typefaces = {
  ui: { name: 'Geologica', weights: [300, 400, 500, 600, 700], fallback: 'sans-serif' },

  content: { name: 'Rubik', weights: [300, 400, 500, 600, 700], fallback: 'sans-serif' },
}

// Quote the family name, then append the fallback, so CSS and JS consumers cannot disagree.
const stack = t => `'${t.name}', ${t.fallback}`

// Typefaces the app ships itself rather than fetching. `name` is the `@font-face` family alias,
// which vite also injects into SCSS as `$font-syriac`, so the alias is written exactly once.
const bundledTypefaces = {
  syriac: { name: 'NotoSansSyriacEastern', fallback: 'sans-serif' },
}

// Consumed only by vite.config.mjs, to build the Google Fonts <link> and the SCSS variables.
export const typography = typefaces
export const bundledTypography = bundledTypefaces

// The three font axes: `family` for chrome, `content` for reading surfaces, and `languageContent`
// / `perLanguage` for learning languages whose script `content` cannot draw.
export const font = {
  // UI / chrome font, applied globally via the MUI theme and the `--font-ui` CSS variable.
  family: stack(typefaces.ui),

  // Reading font, also published as the `--font-content` CSS variable by custom.scss.
  content: stack(typefaces.content),

  // Reading font that follows the learner's script. Use this instead of `content` on surfaces that
  // paint learning-language text outside a `getTextStyle()` container; it swaps only the family.
  languageContent: `var(--font-language, ${stack(typefaces.content)})`,

  // Faces for scripts `content` cannot draw. `getTextStyle()` spreads the style keys into an inline
  // `style` — that inline origin beats class rules and MUI `sx`, so they must not move into a
  // class. `href` is not a style key: it is the on-demand stylesheet `useLanguageFont()` injects.
  perLanguage: {
    Syriac: { fontFamily: stack(bundledTypefaces.syriac), fontSize: '1.7rem' },

    Chinese: {
      fontFamily: "'Noto Sans SC', sans-serif",
      href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap',
    },
  },

  // Base size for reading surfaces, in rem against the `html { font-size: 14px }` in base.scss.
  contentSize: '1.15rem',

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
  inputPaddingX: 10, // Figma search field "padding-left/right: 10" — pill padding when adorned
  inputIconGap: 8, // derived — Figma gives no icon↔text gap
  fieldGap: 30,
  cardPadding: '40px 60px', // Figma "40,60" — assumed vertical/horizontal; confirm
}
