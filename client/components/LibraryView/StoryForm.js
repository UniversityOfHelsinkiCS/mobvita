import React, { useEffect, useState } from 'react'
import { Form, Input, Card, Accordion, Icon } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { postStory } from 'Utilities/redux/uploadProgressReducer'
import { capitalize, learningLanguageSelector } from 'Utilities/common'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button } from 'react-bootstrap'
import useWindowDimensions from 'Utilities/windowDimensions'
import AddStoryModal from './AddStoryModal'
import RecommendedSites from './RecommendedSites'
import StoryFileModal from './StoryFileModal'

const StoryForm = ({ setLibraries }) => {
  const [storyUrl, setStoryUrl] = useState('')
  const [showRecommendedSites, setShowRecommendedSites] = useState(false)
  const [formOpen, setFormOpen] = useState(false)

  const dispatch = useDispatch()
  const intl = useIntl()

  const learningLanguage = useSelector(learningLanguageSelector)

  const tourState = useSelector(({ tour }) => tour)

  useEffect(() => {
    if (tourState.stepIndex === 6) {
      setFormOpen(true)
    }
  }, [tourState])

  const handleStorySubmit = event => {
    event.preventDefault()

    const newStory = {
      language: capitalize(learningLanguage),
      url: storyUrl,
    }

    if (storyUrl) {
      dispatch(postStory(newStory))
      setStoryUrl('')
      setFormOpen(false)
      setLibraries({
        public: false,
        group: false,
        private: true,
      })
    }
  }

  const handleAccordionClick = () => setFormOpen(!formOpen)

  const smallWindow = useWindowDimensions().width < 500

  return (
    <Card
      fluid
      key="storyform"
      style={{
        marginBottom: '10px',
        marginTop: '10px',
        height: 'max-content',
        backgroundColor: 'whitesmoke',
        padding: '0.5em 1em',
      }}
    >
      <Accordion className="tour-add-new-stories">
        <Accordion.Title active={formOpen} onClick={handleAccordionClick}>
          <div
            data-cy="expand-story-form"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}
          >
            <h5 style={{ color: 'rgba(0,0,0,.4)', fontSize: '16px' }}>
              <Icon name={formOpen ? 'caret down' : 'caret right'} />
              <FormattedMessage id="add-your-stories" />
            </h5>
          </div>
        </Accordion.Title>
        <Accordion.Content active={formOpen} data-cy="story-form-content">
          <div style={{ display: 'flex', alignItems: 'baseline', paddingBottom: '0.5em' }}>
            <div style={{ flexBasis: '100%' }}>
              <Form id="url-upload" onSubmit={handleStorySubmit}>
                <Input
                  fluid
                  placeholder={intl.formatMessage({ id: 'enter-web-address' })}
                  value={storyUrl}
                  onChange={event => setStoryUrl(event.target.value)}
                  data-cy="new-story-input"
                />
              </Form>
              <div className="pt-sm space-between wrap">
                <div className="flex pb-sm">
                  <Button form="url-upload" variant="primary" type="submit" data-cy="submit-story">
                    {intl.formatMessage({ id: 'upload-from-web' })}
                  </Button>
                  {!smallWindow && (
                    <div className="gap-col-sm pl-sm">
                      <StoryFileModal
                        trigger={
                          <Button variant="secondary">
                            {intl.formatMessage({ id: 'upload-stories' })}
                          </Button>
                        }
                      />
                      <AddStoryModal
                        trigger={
                          <Button variant="secondary">
                            {intl.formatMessage({ id: 'or-paste-a-text' })}
                          </Button>
                        }
                      />
                    </div>
                  )}
                </div>
                <Button
                  style={{ marginBottom: '0.5em' }}
                  variant="link"
                  onClick={() => setShowRecommendedSites(!showRecommendedSites)}
                >
                  {showRecommendedSites
                    ? intl.formatMessage({ id: 'hide-recommended-sites' })
                    : intl.formatMessage({ id: 'show-recommended-sites' })}
                </Button>
              </div>
              {showRecommendedSites && <RecommendedSites />}
            </div>
          </div>
        </Accordion.Content>
      </Accordion>
    </Card>
  )
}

export default StoryForm
