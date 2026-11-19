// Reads one raw (undecoded) value from an email link's query string; '' when it is missing.
// Values end at '&', '?' or '#', since some mail links append a second '?…' part after the token.
export const getEmailLinkParam = (queryParams = '', name) =>
  queryParams.match(new RegExp(`[?&]${name}=([^&?#]*)`))?.[1] || ''
