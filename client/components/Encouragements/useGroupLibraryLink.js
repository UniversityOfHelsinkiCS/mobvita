import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'
import { updateLibrarySelect } from 'Utilities/redux/userReducer'

// Whether the group library tab is open, and a callback opening it on /library (tabs keep the URL).
const useGroupLibraryLink = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const savedLibrary = useSelector(({ user }) => user.data?.user?.last_selected_library)

  const inGroupLibrary = pathname.startsWith('/library') && savedLibrary === 'group'

  // LibraryView reads the tab from router state; saving it keeps the selection after a reload.
  const openGroupLibrary = () => {
    dispatch(updateLibrarySelect('group'))
    navigate('/library', { state: { library: 'group' } })
  }

  return { inGroupLibrary, openGroupLibrary }
}

export default useGroupLibraryLink
