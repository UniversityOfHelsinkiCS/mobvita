import React from 'react'
import { useSelector } from 'react-redux'
import { FormattedMessage, FormattedHTMLMessage, useIntl } from 'react-intl'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Popup, Icon } from 'semantic-ui-react'
import Spinner from 'Components/Spinner'

const GenerateStories = ({ closeModal }) => {
  const { pending, storyId, progress } = useSelector(({ uploadProgress }) => uploadProgress)

  return (
    <div>
      <Popup
        content={<FormattedHTMLMessage id="generate-story-instruction" />}
        trigger={<Icon name="info circle" style={{ marginLeft: '4px' }} />}
      />
      <div     style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
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
    </div>
  )
}

export default GenerateStories
