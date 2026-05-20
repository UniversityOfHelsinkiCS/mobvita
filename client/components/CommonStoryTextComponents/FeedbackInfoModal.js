import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Divider, Modal } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { clearExplanation, clearReferences } from 'Utilities/redux/practiceReducer'
import { capitalize_first_char_only, formatGreenFeedbackText } from 'Utilities/common'

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

  // Keep modal stable even if parent re-renders frequently (timers, etc.)
  const [isOpen, setIsOpen] = useState(false)

  // Keep content visible during close transition (avoid empty modal shell).
  const [referencesSnapshot, setReferencesSnapshot] = useState(null)
  const [explanationSnapshot, setExplanationSnapshot] = useState(null)

  useEffect(() => {
    if (isOpen) return
    if (references || explanation) {
      setReferencesSnapshot(references)
      setExplanationSnapshot(explanation)
      setIsOpen(true)
    }
  }, [references, explanation, isOpen])

  const ExplanationList = ({ explanation }) => (
    <>
      {Object.keys(explanation).map(title => (
        <div className="mb-lg" key={title}>
          <div className="bold header-3">
            {capitalize_first_char_only(title)}
            <Divider style={{ width: '50%' }} />
          </div>
          <ul>
            {explanation[title].map((item, index) => (
              <li key={index} dangerouslySetInnerHTML={formatGreenFeedbackText(item)} />
            ))}
          </ul>
        </div>
      ))}
    </>
  )

  const ReferenceList = ({ references }) => (
    <>
      <div className="bold header-3 mx-lg">
        <FormattedMessage id="references" />
      </div>
      <div className="mb-lg">
        {Object.keys(references).map(referenceKey => (
          <div key={referenceKey}>
            <Divider style={{ width: '70%' }} />
            <div style={{ marginBottom: '.5em', fontWeight: '600' }}>
              {capitalize_first_char_only(referenceKey)}:
            </div>
            {references[referenceKey].map(ref => (
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
            ))}
          </div>
        ))}
      </div>
    </>
  )

  const handleModalClose = () => {
    // Close immediately and clear redux immediately so it can't reopen.
    setIsOpen(false)
    dispatch(clearReferences())
    dispatch(clearExplanation())
  }

  const handleModalClosed = () => {
    setReferencesSnapshot(null)
    setExplanationSnapshot(null)
  }

  return (
    <Modal
      open={isOpen}
      onClose={handleModalClose}
      onClosed={handleModalClosed}
      size="tiny"
      dimmer="inverted"
      closeOnDimmerClick={false}
      closeOnDocumentClick={false}
      closeIcon={{ style: { top: '1rem', right: '2rem' }, color: 'black', name: 'close' }}
    >
      <Modal.Content>
        {explanationSnapshot && <ExplanationList explanation={explanationSnapshot} />}
        {explanationSnapshot && referencesSnapshot && <Divider />}
        {referencesSnapshot && <ReferenceList references={referencesSnapshot} />}
      </Modal.Content>
    </Modal>
  )
}

export default React.memo(FeedbackInfoModal)

