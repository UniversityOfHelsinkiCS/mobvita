import React, { useState } from 'react'
import { Accordion, Menu } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'
import { useCurrentUser } from 'Utilities/common'
import UploadFromWeb from './UploadFromWeb'
import UploadFromFile from './UploadFromFile'
import UploadPastedText from './UploadPastedText'
import RecommendedSites from './RecommendedSites'

const AddStoryAccordion = ({ closeModal }) => {
  const [accordionState, setAccordionState] = useState(0)
  const smallWindow = useWindowDimensions().width < 500
  const user = useCurrentUser()
  const userIsAnonymous = user.email === 'anonymous_email'

  const handleClick = (e, props) => {
    const { index } = props
    const newIndex = accordionState === index ? -1 : index
    setAccordionState(newIndex)
  }

  const getAccordionItemTitleClass = (accordionState, index) => {
    return accordionState === index
      ? 'add-story-accordion-item-title-focused'
      : 'add-story-accordion-item-title'
  }

  return (
    <Accordion as={Menu} fluid vertical>
      <div
        className="header-2"
        style={{ marginTop: '1.5rem', marginLeft: '2rem', marginBottom: '1.5rem', fontWeight: 500 }}
      >
        <FormattedMessage id="add-your-stories" />
      </div>
      {userIsAnonymous && (
        <div style={{ color: 'red', marginLeft: '2rem' }}>
          <FormattedMessage id="warning-for-anonymous-users" />
        </div>
      )}
      <Menu.Item className="add-story-accordion-item">
        <Accordion.Title
          active={accordionState === 0}
          content={
            <span className={getAccordionItemTitleClass(accordionState, 0)}>
              <FormattedMessage id="upload-from-web" />
            </span>
          }
          index={0}
          onClick={handleClick}
        />
        <Accordion.Content
          className="add-story-accordion-item-content"
          active={accordionState === 0}
          content={<UploadFromWeb closeModal={closeModal} />}
        />
      </Menu.Item>

      {!smallWindow && (
        <Menu.Item className="add-story-accordion-item">
          <Accordion.Title
            active={accordionState === 1}
            content={
              <span className={getAccordionItemTitleClass(accordionState, 1)}>
                <FormattedMessage id="upload-stories" />
              </span>
            }
            index={1}
            onClick={handleClick}
          />
          <Accordion.Content
            className="add-story-accordion-item-content"
            active={accordionState === 1}
            content={<UploadFromFile closeModal={closeModal} />}
          />
        </Menu.Item>
      )}

      <Menu.Item className="add-story-accordion-item">
        <Accordion.Title
          active={accordionState === 2}
          content={
            <span className={getAccordionItemTitleClass(accordionState, 2)}>
              <FormattedMessage id="paste-a-text" />
            </span>
          }
          index={2}
          onClick={handleClick}
        />
        <Accordion.Content
          className="add-story-accordion-item-content"
          active={accordionState === 2}
          content={<UploadPastedText closeModal={closeModal} />}
        />
      </Menu.Item>

      <Menu.Item className="add-story-accordion-item">
        <Accordion.Title
          active={accordionState === 3}
          content={
            <span className={getAccordionItemTitleClass(accordionState, 3)}>
              <FormattedMessage id="generate-a-story" />
            </span>
          }
          index={3}
          onClick={handleClick}
        />
        <Accordion.Content
          className="add-story-accordion-item-content"
          active={accordionState === 3}
          content={
            <div>
              <br />
              <span className="pb-sm upload-instructions">
                <FormattedHTMLMessage id="generate-story-instruction" />
              </span>
              <br />
              <Link  to={'/story-generation'}  className="space-evenly pt-lg">
                <Button style={{ marginTop: '1em' }}>
                  <span>
                    <FormattedMessage id="go-generating" />
                  </span>
                </Button>
              </Link>
            </div>
          }
        />
      </Menu.Item>

      <Menu.Item className="add-story-accordion-item">
        <Accordion.Title
          active={accordionState === 3}
          content={
            <span className={getAccordionItemTitleClass(accordionState, 3)}>
              <i>
                <FormattedMessage id="recommended-sites" />
              </i>
            </span>
          }
          index={3}
          onClick={handleClick}
        />
        <Accordion.Content
          className="add-story-accordion-item-content"
          active={accordionState === 3}
          content={<RecommendedSites />}
        />
      </Menu.Item>
    </Accordion>
  )
}

export default AddStoryAccordion
