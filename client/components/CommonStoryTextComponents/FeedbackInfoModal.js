import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Divider } from 'semantic-ui-react'
import { clearReferences, clearExplanation } from 'Utilities/redux/practiceReducer'
import { FormattedMessage } from 'react-intl'
import { capitalize } from 'Utilities/common'

const BookReference = ({ reference }) => (
  <li>
    {reference.author && `${reference.author}`}
    {reference.title && `, ${reference.title}`}
    {reference.paragraph && `, §. ${reference.paragraph}`}
    {reference.page && `, p. ${reference.page}`}
  </li>
)

const UrlReference = ({ reference }) => (
  <li>
    <a href={reference.url} target="_blank" rel="noopener noreferrer">
      {reference.title || reference.title}
    </a>
  </li>
)

const FeedbackInfoModal = () => {
  const references = useSelector(state => state.practice.references)
  const explanation = useSelector(state => state.practice.explanation)
  const dispatch = useDispatch()

  const ExplanationList = ({ explanation }) => {
    return (
      <>
        {Object.keys(explanation).map(title => (
          <div className="mb-lg" key={title}>
            <div className="bold header-3">
              {capitalize(title)}
              <Divider style={{ width: '50%' }} />
            </div>
            <ul>
              <li>{explanation[title]}</li>
            </ul>
          </div>
        ))}
      </>
    )
  }

  const ReferenceList = ({ references }) => {
    return (
      <>
        <div className="bold header-3 mx-lg">
          <FormattedMessage id="references" />
          <Divider style={{ width: '50%' }} />
        </div>
        <div className="mb-lg">
          {Object.keys(references).map(referenceKey => {
            return (
              <div key={referenceKey}>
                <div style={{ marginBottom: '.5em', fontWeight: '600' }}>
                  {capitalize(referenceKey)}:
                </div>
                {references[referenceKey].map(ref => {
                  return (
                    <div key={ref.title}>
                      {ref.url ? (
                        <UrlReference key={`${ref.url}-${ref.title}`} reference={ref} />
                      ) : (
                        <BookReference
                          key={`${ref.author}-${ref.title}-${ref.page}-${ref.paragraph}`}
                          reference={ref}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </>
    )
  }

  const handleModalClose = () => {
    dispatch(clearReferences())
    dispatch(clearExplanation())
  }

  return (
    <Modal
      open={!!references || !!explanation}
      onClose={handleModalClose}
      size="tiny"
      dimmer="inverted"
      closeIcon={{ style: { top: '1rem', right: '2rem' }, color: 'black', name: 'close' }}
    >
      <Modal.Content>
        {explanation && <ExplanationList explanation={explanation} />}
        {explanation && references && <Divider />}
        {references && <ReferenceList references={references} />}
      </Modal.Content>
    </Modal>
  )
}

export default FeedbackInfoModal
