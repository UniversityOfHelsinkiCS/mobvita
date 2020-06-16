import React from 'react'
import { DropdownButton, Dropdown } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { capitalize } from 'Utilities/common'

const FlashcardListSorter = (
  { sortBy, setSortBy, directionMultiplier, setDirectionMultiplier }
) => {
  const handleDirectionChange = () => {
    setDirectionMultiplier(directionMultiplier * -1)
  }

  return (
    <div>
      <label htmlFor="flashcard-sorter" style={{ margin: '0', fontSize: '12px' }}>
        <FormattedMessage id="sort-by" />
      </label>
      <div className="flex align-center">
        <DropdownButton
          id="flashcard-sorter"
          title={<FormattedMessage id={sortBy} />}
          variant="outline-secondary"
        >
          <Dropdown.Item onClick={() => setSortBy('Title')}>
            <FormattedMessage id="Title" />
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setSortBy('Difficulty')}>
            <FormattedMessage id="Difficulty" />
          </Dropdown.Item>
        </DropdownButton>
        <Icon
          name={directionMultiplier === 1 ? 'caret up' : 'caret down'}
          onClick={handleDirectionChange}
          size="big"
          style={{ cursor: 'pointer' }}
        />
      </div>
    </div>
  )
}

export default FlashcardListSorter
