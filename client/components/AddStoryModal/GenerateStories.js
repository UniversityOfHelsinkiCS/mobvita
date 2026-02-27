import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, FormattedHTMLMessage, useIntl } from 'react-intl'
import { Button, Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Popup } from 'semantic-ui-react'
import Spinner from 'Components/Spinner'

const GenerateStories = ({ closeModal }) => {
  const intl = useIntl()
  const { pending, storyId, progress } = useSelector(({ uploadProgress }) => uploadProgress)

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: '16px',
      }}
    >
      <Popup
        content={<FormattedHTMLMessage id="generate-story-instruction" />}
        trigger={<Icon name="info circle" style={{ marginLeft: '4px' }} />}
      />
      <Link to={'/story-generation'} disabled={pending}>
        <Button>
          {pending || storyId ? (
            <Spinner inline />
          ) : (
            <span>
              <FormattedMessage id="go-generating" />
            </span>
          )}
        </Button>
      </Link>
    </div>
  )
}

export default GenerateStories
