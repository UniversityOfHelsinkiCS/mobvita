import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Divider } from 'semantic-ui-react'
import { clearReferences, clearExplanation } from 'Utilities/redux/practiceReducer'
import { FormattedMessage } from 'react-intl'
import { capitalize_first_char_only } from 'Utilities/common'

const BookReference = ({ reference }) => (
  <li>
    {reference.url ? (
      <a href={reference.url}>
        {reference.title && `${reference.title}, `}
        {reference.author && `${reference.author}, `}
        {reference.topic && `${reference.topic}, `}
        {reference.chapter && `${reference.chapter}`}
        {reference.paragraph && `, §. ${reference.paragraph}`}
        {reference.page && `, p. ${reference.page}`}
      </a>
    ) : (
      <span>
        {reference.title && `${reference.title}, `}
        {reference.author && `${reference.author}, `}
        {reference.topic && `${reference.topic}, `}
        {reference.chapter && `${reference.chapter}`}
        {reference.paragraph && `, §. ${reference.paragraph}`}
        {reference.page && `, p. ${reference.page}`}
      </span>
    )}
  </li>
);


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
              {capitalize_first_char_only(title)}
              <Divider style={{ width: '50%' }} />
            </div>
            <ul>
              {
                explanation[title].map((explanation, index) => (
                  <li key={index} dangerouslySetInnerHTML={explanation} />
                ))
              }
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
        </div>
        <div className="mb-lg">
          {Object.keys(references).map(referenceKey => {
            return (
              <div key={referenceKey}>
                <Divider style={{ width: '70%' }} />
                <div style={{ marginBottom: '.5em', fontWeight: '600' }}>
                  {capitalize_first_char_only(referenceKey)}:
                </div>
                {references[referenceKey].map(ref => {
                  return (
                    <ul key={ref.title}>
                      {ref.url ? (
                        <UrlReference key={`${ref.url}-${ref.title}`} reference={ref} />
                      ) : (
                        <BookReference
                          key={`${ref.author}-${ref.title}-${ref.page}-${ref.paragraph}`}
                          reference={ref}
                        />
                      )}
                    </ul>
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
