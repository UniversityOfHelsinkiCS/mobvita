import { useSelector } from 'react-redux'
import useWindowDimensions from 'Utilities/windowDimensions'

// Shared runtime state every per-tour component needs: whether this tour is
// the one currently active in Redux, plus the Joyride control flags, the
// user role, and a desktop/mobile flag. Each Redux value is selected
// individually so unrelated state changes don't re-render the consumer.
const useTourRuntime = expectedName => {
  const name = useSelector(state => state.tour.name)
  const run = useSelector(state => state.tour.run)
  const stepIndex = useSelector(state => state.tour.stepIndex)
  const tourKey = useSelector(state => state.tour.key)
  const continuous = useSelector(state => state.tour.continuous)
  const teacherView = useSelector(state => state.user.data.teacherView)
  const user = useSelector(state => state.user.data.user)
  const bigScreen = useWindowDimensions().width >= 700
  return {
    isActive: name === expectedName,
    run,
    stepIndex,
    tourKey,
    continuous,
    teacherView,
    user,
    bigScreen,
  }
}

export default useTourRuntime
