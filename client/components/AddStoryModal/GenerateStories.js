import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, FormattedHTMLMessage, useIntl } from 'react-intl'
import { Button, Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Spinner from 'Components/Spinner'

const GenerateStories = ({ closeModal }) => {

  const intl = useIntl()
  

  const { pending, storyId, progress } = useSelector(({ uploadProgress }) => uploadProgress)



  return (
    <div>
        <br />
        <span className="pb-sm upload-instructions">
        <FormattedHTMLMessage id="generate-story-instruction" />
        </span>
        <br />
        <Link  to={'/story-generation'} disabled={pending}  className="space-evenly pt-lg">
        <Button style={{ marginTop: '1em' }}>
            {pending || storyId ? (
                <Spinner inline variant='dark' size='lg' />
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
