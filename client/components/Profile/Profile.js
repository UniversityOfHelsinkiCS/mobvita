import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Box } from '@mui/material'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import InsightsIcon from '@mui/icons-material/Insights'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import AppTabs from 'Components/ui/AppTabs'
import { colors } from 'Assets/mui_theme/designTokens'
import Progress from 'Components/Profile/Progress'
import Main from './Main'
import Account from './Account'
import Settings from './Settings'
import Following from './Following'
import GeneralChatbot from 'Components/ChatBot/GeneralChatbot'
import HelperSidebar from 'Components/PracticeView/HelperSidebar'

export default function Profile({ location }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { teacherView } = useSelector(({ user }) => user.data)
  const isSidebarOpen = useSelector(state => state.helperSidebar?.isOpen ?? false)

  const path = location.pathname

  // All profile tabs. `teacherHidden` drops the tab in teacher view (no Progress for teachers).
  const allTabs = [
    {
      value: 'main',
      label: <FormattedMessage id="Profile" />,
      icon: <PersonOutlinedIcon />,
      path: '/profile/main',
      render: () => <Main teacherView={teacherView} />,
    },
    {
      value: 'progress',
      label: <FormattedMessage id="Progress" />,
      icon: <InsightsIcon />,
      path: '/profile/progress',
      render: () => <Progress />,
      teacherHidden: true,
    },
    {
      value: 'following',
      label: <FormattedMessage id="following-view-tab" />,
      icon: <GroupsOutlinedIcon />,
      path: '/profile/following',
      render: () => <Following />,
    },
    {
      value: 'account',
      label: <FormattedMessage id="Account" />,
      icon: <AccountCircleOutlinedIcon />,
      path: '/profile/account',
      render: () => <Account />,
    },
    {
      value: 'settings',
      label: <FormattedMessage id="Settings" />,
      icon: <SettingsOutlinedIcon />,
      path: '/profile/settings',
      render: () => <Settings teacherView={teacherView} />,
    },
  ]
  const tabDefs = allTabs.filter(tab => !(teacherView && tab.teacherHidden))

  // Which tab the current route maps to.
  let activeValue = 'progress'
  if (path.includes('/profile/main')) activeValue = 'main'
  else if (path.includes('/profile/following')) activeValue = 'following'
  else if (path.includes('/profile/account')) activeValue = 'account'
  else if (path.includes('/profile/settings')) activeValue = 'settings'
  else if (path.includes('/profile/progress')) activeValue = 'progress'
  if (teacherView && activeValue === 'progress') activeValue = 'main'

  // Progress sub-routes select which chart to show.
  useEffect(() => {
    if (path.includes('/profile/progress/flashcards')) dispatch({ type: 'SET_VOCABULARY_CHART' })
    else if (path.includes('/profile/progress/grammar')) dispatch({ type: 'SET_GRAMMAR_CHART' })
  }, [path, dispatch])

  const activeTab = tabDefs.find(tab => tab.value === activeValue) || tabDefs[0]

  const handleTabChange = value => {
    const tab = tabDefs.find(t => t.value === value)
    if (tab) navigate(tab.path)
  }

  return (
    <main className={`cont-tall cont pb-xl auto ${isSidebarOpen ? 'sidebar-pushed' : ''}`}>
      <div style={{ margin: '0 0 1.7em 0' }}>
        <AppTabs tabs={tabDefs} value={activeValue} onChange={handleTabChange} fullWidth />
      </div>

      <Box
        sx={{
          backgroundColor: colors.card,
          borderRadius: '30px',
          padding: { xs: '1.25em', sm: '1.75em' },
        }}
      >
        {activeTab.render()}
      </Box>

      <HelperSidebar>
        <GeneralChatbot />
      </HelperSidebar>
    </main>
  )
}
