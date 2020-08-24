import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal } from 'semantic-ui-react'
import { clearReferences } from 'Utilities/redux/practiceReducer'

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

  const dispatch = useDispatch()

  const referenceList =
    references &&
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

  return (
    <Modal
      open={!!references}
      onClose={() => dispatch(clearReferences())}
      size="tiny"
      dimmer="blurred"
      closeIcon
    >
      <Modal.Header>References</Modal.Header>
      <Modal.Content>
        <ul>{referenceList}</ul>
      </Modal.Content>
    </Modal>
  )
}

export default ReferenceModal
