import React, { useEffect, useMemo, useRef } from 'react'
import { debounce } from 'lodash'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import AppTextField from './AppTextField'
import { colors } from 'Assets/mui_theme/designTokens'
import { images } from 'Utilities/common'

/**
 * AppSearchField — the app-wide search input: a pill AppTextField with the search glyph at the
 * start and a clear (×) button that appears once there is something to clear.
 *
 * Controlled: `value` + `onChange(nextValue)` (a string, like ChatInput/AppSelect — not the raw
 * event). The component owns only input concerns; the caller owns what searching means:
 *
 *   - filter-as-you-type: read `value` and filter, no `onSearch` needed.
 *   - explicit/expensive search: pass `onSearch(query)`, fired on Enter and (if `debounceMs` > 0)
 *     after the user pauses typing. Enter flushes the pending debounce rather than racing it.
 *   - `onClear` runs after the value is cleared, for callers with teardown beyond the text itself.
 */
const SearchIcon = (
  <img
    src={images.searchTextfield}
    alt=""
    width={20}
    height={20}
    style={{ display: 'block', flexShrink: 0 }}
  />
)

const AppSearchField = ({
  value,
  onChange,
  onSearch,
  onClear,
  debounceMs = 0,
  showClear = true,
  ...rest
}) => {
  const onSearchRef = useRef(onSearch)
  useEffect(() => {
    onSearchRef.current = onSearch
  }, [onSearch])

  const debouncedSearch = useMemo(
    () => (debounceMs > 0 ? debounce(query => onSearchRef.current?.(query), debounceMs) : null),
    [debounceMs],
  )

  useEffect(() => () => debouncedSearch?.cancel(), [debouncedSearch])

  const handleChange = event => {
    const nextValue = event.target.value
    onChange?.(nextValue)
    debouncedSearch?.(nextValue)
  }

  const handleKeyDown = event => {
    if (event.key !== 'Enter') return
    debouncedSearch?.cancel()
    onSearch?.(value)
  }

  const handleClear = () => {
    debouncedSearch?.cancel()
    onChange?.('')
    onClear?.()
  }

  const clearButton =
    showClear && value ? (
      <IconButton
        onClick={handleClear}
        edge="end"
        size="small"
        aria-label="Clear search"
        sx={{ color: colors.muted }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    ) : null

  return (
    <AppTextField
      type="search"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      startIcon={SearchIcon}
      endIcon={clearButton}
      // type="search" for the semantics, minus WebKit's own clear button — ours is the one that
      // also runs onClear.
      sx={{ '& input::-webkit-search-cancel-button': { display: 'none' } }}
      {...rest}
    />
  )
}

export default AppSearchField
