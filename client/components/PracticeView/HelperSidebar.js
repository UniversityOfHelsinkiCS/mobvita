import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import { toggleHelperSidebar } from 'Utilities/redux/helperSidebarReducer'
import './HelperSidebar.scss'

const HelperSidebar = ({ children }) => {
  const dispatch = useDispatch()
  
  const isOpen = useSelector(state => state.helperSidebar?.isOpen ?? false)

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
      >
        <Icon name={isOpen ? 'angle right' : 'angle left'} />
      </button>
      
      <div className="sidebar-content">
        {children}
      </div>
    </aside>
  )
}

export default HelperSidebar