import { useSelector } from 'react-redux'
import useWindowDimensions from 'Utilities/windowDimensions'

// Shared tour-runtime state used by every per-tour component.
const useTourRuntime = expectedName => {
  const { name, run, stepIndex, key, continuous } = useSelector(({ tour }) => tour)
  const { teacherView, user } = useSelector(({ user: u }) => u.data)
  const bigScreen = useWindowDimensions().width >= 700
  return {
    isActive: name === expectedName,
    run,
    stepIndex,
    tourKey: key,
    continuous,
    teacherView,
    user,
    bigScreen,
  }
}

export default useTourRuntime
