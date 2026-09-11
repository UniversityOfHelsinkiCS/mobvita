import React from 'react'
import DatePicker from 'react-datepicker'
import useWindowDimensions from 'Utilities/windowDimensions'
import 'react-datepicker/dist/react-datepicker.css'

const ResponsiveDatePicker = props => {
  const { width } = useWindowDimensions()
  const showPortalVersion = width < 600

  return (
    <DatePicker
      dateFormat="yyyy/MM/dd"
      withPortal={showPortalVersion}
      // The calendar is themed under `.app-datepicker` in custom.scss rather than globally, so the
      // vendor stylesheet still applies to anything that renders react-datepicker on its own.
      calendarClassName="app-datepicker"
      calendarStartDay={1}
      showPopperArrow={false}
      onCalendarClose={props.onCalendarClose}
      {...props}
    />
  )
}

export default ResponsiveDatePicker
