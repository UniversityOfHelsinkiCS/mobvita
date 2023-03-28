import callBuilder from 'Utilities/apiConnection'
import moment from 'moment'

const initialState = {
  exerciseHistory: [],
  flashcardHistory: [],
  testHistory: [],
}

export const getStreakInformation = (startDate, endDate) => {
  const route = `/user/practice_history?start_time=${moment(startDate).format(
    'YYYY-MM-DD'
  )}&end_time=${moment(endDate).format('YYYY-MM-DD')}`
  const prefix = 'GET_STREAK_INFORMATION'
  return callBuilder(route, prefix, 'get')
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_STREAK_INFORMATION_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_STREAK_INFORMATION_SUCCESS':
      return {
        ...state,
        streakToday: action.response.is_today_streaked,
        daysStreaked: action.response.num_streaked_days,
        exerciseHistory: action.response.excercise_history,
        pending: false,
        error: false,
      }
    case 'GET_STREAK_INFORMATION_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    default:
      return state
  }
}

/*
- streak: false, mutta tehty eilen → ilmoita, miten jatkaa → eli if num_streaked_days > 0 && is_today_streaked === false
→ ilmoitetaan recommendation popupissa etusivulla
- streak: true mutta
→ ilmoitetaan recommendation popupissa etusivulla

- streak: false, katkennut → streakBroken
case → num_streaked_days === 0 && is_today_streaked === false && exercise_history.length > 0
→ ilmoitetaan recommendation popupissa etusivulla miten aloittaa
case → num_streaked_days === 0 && is_today_streaked === false && exercise_history.length === 0
→ ilmoitetaan recommendation popupissa etusivulla miten jatkaa


- streak false→ true
→ ilmoitetaan heti kun false-→true


let alussa = streakToday (false)

!alussa === streakToday {
	hurraa
	alussa === true
}*/