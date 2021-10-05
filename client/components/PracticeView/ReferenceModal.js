import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal } from 'semantic-ui-react'
import { clearReferences, clearExplanation } from 'Utilities/redux/practiceReducer'
import { FormattedMessage } from 'react-intl'

const BookReference = ({ reference }) => (
  <li>
    {reference.author && `${reference.author}`}
    {reference.title && `, ${reference.title}`}
    {reference.page && `, p. ${reference.page}`}
    {reference.paragraph && `, para. ${reference.paragraph}`}
  </li>
)

const UrlReference = ({ reference }) => (
  <li>
    <a href={reference.url} target="_blank" rel="noopener noreferrer">
      {reference.title || reference.title}
    </a>
  </li>
)

const ReferenceModal = () => {
  const references = useSelector(state => state.practice.references)
  const explanation = useSelector(state => state.practice.explanation)

  const dispatch = useDispatch()

  const explanationString = explanation
    ? `${Object.keys(explanation)[0]}: ${explanation[Object.keys(explanation)[0]]}`
    : null

  const referenceList =
    !!references &&
    Object.values(references).map(grammaticalFeature =>
      grammaticalFeature.map(reference =>
        reference.url ? (
          <UrlReference key={`${reference.url}-${reference.title}`} reference={reference} />
        ) : (
          <BookReference
            key={`${reference.author}-${reference.title}-${reference.page}-${reference.paragraph}`}
            reference={reference}
          />
        )
      )
    )

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
      closeIcon
    >
      <Modal.Header>
        {references ? <FormattedMessage id="references" /> : <FormattedMessage id="explanations" />}
      </Modal.Header>
      <Modal.Content>
        <ul>{referenceList}</ul>
        {explanationString}
      </Modal.Content>
    </Modal>
  )
}

export default ReferenceModal
