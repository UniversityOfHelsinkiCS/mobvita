import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal } from 'semantic-ui-react'
import { clearReferences } from 'Utilities/redux/practiceReducer'

const BookReference = ({ reference }) => (
  <li>
    {`${reference.author}, ${reference.title}, p. ${reference.page}, para. ${reference.paragraph}`}
  </li>
)

const UrlReference = ({ reference }) => (
  <li>
    <a href={reference.url} target="_blank" rel="noopener noreferrer">
      {reference.title}
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
          <UrlReference reference={reference} />
        ) : (
          <BookReference reference={reference} />
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
