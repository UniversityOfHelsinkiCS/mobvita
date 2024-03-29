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
      onCalendarClose={props.onCalendarClose}
      {...props}
    />
  )
}

export default ResponsiveDatePicker
