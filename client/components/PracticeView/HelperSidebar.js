import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { toggleHelperSidebar } from 'Utilities/redux/helperSidebarReducer'
import './HelperSidebar.scss'

const HelperSidebar = ({ children, accentColor }) => {
  const dispatch = useDispatch()

  const isOpen = useSelector(state => state.helperSidebar?.isOpen ?? true)

  const handleToggle = () => {
    dispatch(toggleHelperSidebar())
  }

  return (
    <aside
      className={`helper-sidebar ${isOpen ? 'open' : 'collapsed'}`}
      aria-label="Helper Sidebar"
    >
      <button
        className="sidebar-toggle"
        onClick={handleToggle}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        aria-expanded={isOpen}
        type="button"
        data-cy="helper-sidebar-toggle"
      >
        {isOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </button>

      <div
        className="helper-sidebar-content"
        style={accentColor ? { background: accentColor } : undefined}
      >
        {children}
      </div>
    </aside>
  )
}

export default HelperSidebar
