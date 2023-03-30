import React from 'react'
import ProgressStats from '../Progress/ProgressStats'
import moment from 'moment'
import { useSelector } from 'react-redux'

const ProgressStatistics = () => {

  const exerciseHistory = useSelector(({ user }) => user.data.user.exercise_history)

  const endDate = moment().toDate()

  const startDate =
    moment(exerciseHistory[0]?.date).toDate()
  
  return (
    <ProgressStats startDate={startDate} endDate={endDate} />
  )
} 

export default ProgressStatistics