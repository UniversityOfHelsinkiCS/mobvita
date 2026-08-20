// eslint-disable-next-line no-unused-vars
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Box } from '@mui/material'
import AppButton from 'Components/AppButton'
import { colors } from 'Assets/mui_theme/designTokens'
import { useCurrentUser } from 'Utilities/common'
import { useNavigate } from 'react-router-dom'
import GroupActionModal from './GroupActionModal'

const NoGroupsView = ({ role }) => {
  const user = useCurrentUser()
  const isAnonymousUser = user.email === 'anonymous_email'
  const navigate = useNavigate()

  return (
    <div className="group-container nogroups" data-cy="no-groups-view">
      <Box
        sx={{
          backgroundColor: colors.card,
          color: colors.ink,
          border: `1px solid ${colors.border}`,
          borderRadius: '20px',
          p: { xs: '20px', sm: '32px' },
        }}
      >
        <h2 id="title">
          <FormattedMessage
            id={role === 'student' ? 'Groups-for-students' : 'Groups-for-teachers'}
          />
        </h2>

        {isAnonymousUser ? (
          <span className="additional-info">
            <FormattedMessage id="groups-for-only-registered-users" />
            <div>
              <AppButton
                className="mt-nm"
                variant="primary"
                size="lg"
                style={{ float: 'right' }}
                onClick={() => navigate('/register')}
              >
                <FormattedMessage id="Register" />
              </AppButton>
            </div>
          </span>
        ) : (
          <>
            <GroupActionModal
              role={role}
              trigger={
                <div>
                  <AppButton
                    variant="primary"
                    size="lg"
                    data-cy={role === 'student' ? 'join-group-button' : 'create-group-button'}
                    style={{ float: 'right' }}
                  >
                    <FormattedMessage
                      id={role === 'student' ? 'join-a-group' : 'create-new-group'}
                    />
                  </AppButton>
                </div>
              }
            />
            <br />
            <span className="additional-info">
              <FormattedMessage
                id={role === 'student' ? 'join-group-message' : 'create-group-message'}
              />
              <br />
              <br />
              <FormattedMessage id="cant-find-group" />
            </span>
          </>
        )}
      </Box>
    </div>
  )
}

export default NoGroupsView
