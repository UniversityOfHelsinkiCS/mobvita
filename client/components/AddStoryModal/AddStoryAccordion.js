import React, { useState } from 'react'
import { Accordion, Menu } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'
import UploadFromWeb from './UploadFromWeb'
import UploadFromFile from './UploadFromFile'
import UploadPastedText from './UploadPastedText'
import RecommendedSites from './RecommendedSites'

const AddStoryAccordion = ({ closeModal }) => {
  const [accordionState, setAccordionState] = useState(0)
  const smallWindow = useWindowDimensions().width < 500

  const handleClick = (e, props) => {
    const { index } = props
    const newIndex = accordionState === index ? -1 : index
    setAccordionState(newIndex)
  }

  const getAccordionItemClass = (accordionState, index) => {
    return accordionState === index
      ? 'add-story-accordion-focused-item'
      : 'add-story-accordion-item'
  }

  return (
    <Accordion as={Menu} fluid vertical>
      <h2 style={{ marginTop: '1.5rem', marginLeft: '2rem', marginBottom: '1.5rem' }}>
        <FormattedMessage id="add-your-stories" />
      </h2>
      <Menu.Item style={{ margin: '1rem' }}>
        <Accordion.Title
          active={accordionState === 0}
          content={
            <span className={getAccordionItemClass(accordionState, 0)}>
              <FormattedMessage id="upload-from-web" />
            </span>
          }
          index={0}
          onClick={handleClick}
        />
        <Accordion.Content
          active={accordionState === 0}
          content={<UploadFromWeb closeModal={closeModal} />}
        />
      </Menu.Item>

      {!smallWindow && (
        <>
          <Menu.Item style={{ margin: '1rem' }}>
            <Accordion.Title
              active={accordionState === 1}
              content={
                <span className={getAccordionItemClass(accordionState, 1)}>
                  <FormattedMessage id="upload-stories" />
                </span>
              }
              index={1}
              onClick={handleClick}
            />
            <Accordion.Content
              active={accordionState === 1}
              content={<UploadFromFile closeModal={closeModal} />}
            />
          </Menu.Item>

          <Menu.Item style={{ margin: '1rem' }}>
            <Accordion.Title
              active={accordionState === 2}
              content={
                <span className={getAccordionItemClass(accordionState, 2)}>
                  <FormattedMessage id="paste-a-text" />
                </span>
              }
              index={2}
              onClick={handleClick}
            />
            <Accordion.Content
              active={accordionState === 2}
              content={<UploadPastedText closeModal={closeModal} />}
            />
          </Menu.Item>
        </>
      )}

      <Menu.Item style={{ margin: '1rem' }}>
        <Accordion.Title
          active={accordionState === 3}
          content={
            <span className={getAccordionItemClass(accordionState, 3)}>
              <i>
                <FormattedMessage id="recommended-sites" />
              </i>
            </span>
          }
          index={3}
          onClick={handleClick}
        />
        <Accordion.Content active={accordionState === 3} content={<RecommendedSites />} />
      </Menu.Item>
    </Accordion>
  )
}

export default AddStoryAccordion
