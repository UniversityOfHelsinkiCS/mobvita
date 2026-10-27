// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/en-gb'
import { styled } from '@mui/material/styles'
import { useForkRef } from '@mui/material/utils'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import {
  usePickerContext,
  usePickerTranslations,
  useSplitFieldProps,
} from '@mui/x-date-pickers/hooks'
import { colors } from 'Assets/mui_theme/designTokens'

/**
 * AppDatePicker — the design-system date picker (MUI X DatePicker, dayjs). The field is a button
 * showing the date; it opens a Monday-first calendar in a white card with a hairline day grid.
 *
 *   value    : Date | null.
 *   onChange : called with a Date (or null).
 *   onClose  : called after the calendar closes, once the picked date has rendered, so a handler
 *              that reads the date from React state sees the new one.
 *   format   : dayjs format of the field text (default 'YYYY/MM/DD').
 *   popperOffset : px between the field and the calendar (default 0), e.g. to clear a pill border.
 *
 * The field carries the `app-date-picker-field` class so a feature can restyle it (e.g. the
 * borderless field inside the analytics date pills). Other props are forwarded to MUI's DatePicker.
 */

const GRID_LINE = `1px solid ${colors.cardBorder}`
const CELL = 40

const FieldButton = styled('button')({
  width: 120,
  padding: '1px 0 1px 0.5em',
  border: '1px solid rgba(34, 36, 38, 0.15)',
  borderRadius: '0.25em',
  background: '#ffffff',
  font: 'inherit',
  color: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
  '&:disabled': { cursor: 'default', opacity: 0.6 },
})

// The field: a button with the formatted date that toggles the calendar.
const DateButtonField = props => {
  const { forwardedProps } = useSplitFieldProps(props, 'date')
  const picker = usePickerContext()
  const ref = useForkRef(picker.triggerRef, picker.rootRef)
  const text = picker.value?.isValid() ? picker.value.format(picker.fieldFormat) : ''

  return (
    <FieldButton
      type="button"
      ref={ref}
      id={forwardedProps.id}
      data-cy={forwardedProps['data-cy']}
      className={['app-date-picker-field', picker.rootClassName].filter(Boolean).join(' ')}
      sx={picker.rootSx}
      disabled={picker.disabled}
      aria-haspopup="dialog"
      aria-expanded={picker.open}
      onClick={() => picker.setOpen(open => !open)}
    >
      {text}
    </FieldButton>
  )
}

const Header = styled('div')({
  position: 'relative',
  padding: '12px 40px',
  textAlign: 'center',
  fontSize: 15,
  lineHeight: '16px',
  fontWeight: 600,
  color: colors.ink,
})

const NavButton = styled('button')({
  position: 'absolute',
  top: 6,
  width: 28,
  height: 28,
  padding: 0,
  border: 0,
  background: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& span': {
    width: 7,
    height: 7,
    borderStyle: 'solid',
    borderColor: colors.muted,
    borderWidth: '2px 2px 0 0',
  },
  '&:hover span': { borderColor: colors.ink },
})

// Month title between previous/next arrows; there is no month or year view to switch to.
const CalendarHeader = ({ currentMonth, onMonthChange }) => {
  const translations = usePickerTranslations()
  return (
    <Header>
      <NavButton
        type="button"
        aria-label={translations.previousMonth}
        onClick={() => onMonthChange(currentMonth.subtract(1, 'month'))}
        sx={{ left: 6 }}
      >
        <span style={{ transform: 'translateX(5px) rotate(225deg)' }} />
      </NavButton>
      {currentMonth.format('MMMM YYYY')}
      <NavButton
        type="button"
        aria-label={translations.nextMonth}
        onClick={() => onMonthChange(currentMonth.add(1, 'month'))}
        sx={{ right: 6 }}
      >
        <span style={{ transform: 'translateX(-6px) rotate(45deg)' }} />
      </NavButton>
    </Header>
  )
}

// The white card around the calendar, for both the desktop popper and the mobile dialog.
const paperSx = {
  border: `2px solid ${colors.cardBorder}`,
  borderRadius: '15px',
  backgroundColor: '#ffffff',
  boxShadow: '0 8px 24px rgba(45, 44, 42, 0.12)',
  overflow: 'hidden',
}

// The day grid: 40px cells with their hairlines drawn inside, so the calendar is 280px wide and
// each row 40px high.
const calendarSx = {
  minWidth: 0,
  '& .MuiPickersLayout-contentWrapper': { minWidth: 0 },
  '& .MuiDateCalendar-root': {
    width: CELL * 7,
    height: 'auto',
    maxHeight: 'none',
    margin: 0,
    color: colors.ink,
  },
  '& .MuiDayCalendar-weekDayLabel': {
    boxSizing: 'border-box',
    width: CELL,
    height: CELL,
    margin: 0,
    borderTop: GRID_LINE,
    borderBottom: GRID_LINE,
    borderRight: GRID_LINE,
    color: colors.muted,
    fontSize: 13,
    fontWeight: 500,
    '&:last-of-type': { borderRight: 0 },
  },
  '& .MuiDayCalendar-slideTransition': { minHeight: 0 },
  '& .MuiDayCalendar-monthContainer': { position: 'relative' },
  '& .MuiDayCalendar-weekContainer': { margin: 0 },
  '& .MuiPickerDay-root': {
    '--PickerDay-size': `${CELL}px`,
    '--PickerDay-horizontalMargin': '0px',
    boxSizing: 'border-box',
    width: CELL,
    height: CELL,
    margin: 0,
    border: 0,
    borderRight: GRID_LINE,
    borderBottom: GRID_LINE,
    borderRadius: 0,
    fontSize: 14,
    color: colors.ink,
    '&:hover, &:focus-visible': { backgroundColor: colors.calendarHover },
    '&.MuiPickerDay-today': {
      fontWeight: 700,
      border: 0,
      borderRight: GRID_LINE,
      borderBottom: GRID_LINE,
    },
    '&.MuiPickerDay-dayOutsideMonth': { color: colors.calendarOutsideDay },
    '&.Mui-selected, &.Mui-selected:hover, &.Mui-selected:focus': {
      backgroundColor: colors.calendarSelected,
      color: '#ffffff',
      fontWeight: 400,
    },
    '&.Mui-selected.MuiPickerDay-today': { fontWeight: 700 },
    '&.Mui-disabled': { color: colors.calendarOutsideDay },
    '&:last-of-type': { borderRight: 0 },
  },
  '& .MuiDayCalendar-weekContainer:last-of-type .MuiPickerDay-root': { borderBottom: 0 },
}

// Date picker primitive; see the block comment above for its props.
const AppDatePicker = ({
  value,
  onChange,
  onClose,
  format = 'YYYY/MM/DD',
  popperOffset = 0,
  slotProps,
  ...rest
}) => {
  const [closeCount, setCloseCount] = useState(0)

  useEffect(() => {
    if (closeCount > 0) onClose?.()
  }, [closeCount])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
      <DatePicker
        value={value ? dayjs(value) : null}
        onChange={next => onChange?.(next?.isValid() ? next.toDate() : null)}
        onClose={() => setCloseCount(count => count + 1)}
        format={format}
        views={['day']}
        showDaysOutsideCurrentMonth
        reduceAnimations
        closeOnSelect
        desktopModeMediaQuery="@media (min-width: 600px)"
        dayOfWeekFormatter={day => day.format('dd')}
        slots={{ field: DateButtonField, calendarHeader: CalendarHeader }}
        slotProps={{
          popper: {
            placement: 'bottom',
            modifiers: [{ name: 'offset', options: { offset: [0, popperOffset] } }],
          },
          desktopPaper: { sx: paperSx },
          mobilePaper: { sx: paperSx },
          // The phone dialog sets its paper to at least 320px; let it hug the 280px calendar.
          dialog: { sx: { '& .MuiDialog-paper': { minWidth: 0 } } },
          layout: { sx: calendarSx },
          toolbar: { hidden: true },
          actionBar: { actions: [] },
          ...slotProps,
        }}
        {...rest}
      />
    </LocalizationProvider>
  )
}

export default AppDatePicker
