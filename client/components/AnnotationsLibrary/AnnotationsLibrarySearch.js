import React, { useState, useEffect } from 'react'
import { Dropdown, Popup, Icon, Input } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'

const AnnotationsLibrarySearch = ({
  category,
  setCategory,
  annotationsList,
  setAnnotationsList,
  allAnnotations,
}) => {
  const intl = useIntl()
  const [searchString, setSearchString] = useState('')
  const [lastQuery, setLastQuery] = useState(false)
  const bigScreen = useWindowDimensions().width >= 700

  useEffect(() => {
    if (category === 'All') {
      setAnnotationsList(
        allAnnotations.filter(annotation =>
          annotation.annotated_text.toLowerCase().includes(searchString.toLowerCase())
        )
      )
    } else {
      setAnnotationsList(
        allAnnotations.filter(
          annotation =>
            annotation.category === category &&
            annotation.annotated_text.toLowerCase().includes(searchString.toLowerCase())
        )
      )
    }
  }, [category])

  const dropDownMenuText = category ? (
    <FormattedMessage id={`notes-${category}`} />
  ) : (
    <FormattedMessage id="notes-All" />
  )

  const cancelSearch = () => {
    setLastQuery(false)
    setSearchString('')

    if (category === 'All') {
      setAnnotationsList(allAnnotations)
    } else {
      setAnnotationsList(allAnnotations.filter(annotation => annotation.category === category))
    }
  }

  const handleAnnotationsSearch = () => {
    setAnnotationsList(
      annotationsList.filter(annotation =>
        annotation.annotated_text.toLowerCase().includes(searchString.toLowerCase())
      )
    )
    setLastQuery(true)
  }

  const categoryOptions = [
    {
      key: '0',
      text: <FormattedMessage id="notes-All" />,
      value: 'All',
    },
    {
      key: '1',
      text: <FormattedMessage id="notes-Grammar" />,
      value: 'Grammar',
    },
    {
      key: '2',
      text: <FormattedMessage id="notes-Phrases" />,
      value: 'Phrases',
    },
    {
      key: '3',
      text: <FormattedMessage id="notes-Vocabulary" />,
      value: 'Vocabulary',
    },
  ]

  return (
    <div className="flex space-between" style={{ marginRight: '.5em', marginLeft: '.5em' }}>
      <div className="row-flex" style={{ alignItems: 'center' }}>
        {bigScreen && (
          <span style={{ marginRight: '.5em' }}>
            <FormattedMessage id="search-by-category" />
          </span>
        )}
        <Dropdown
          style={{ width: '150px' }}
          text={dropDownMenuText}
          selection
          fluid
          options={categoryOptions}
          onChange={(_, { value }) => setCategory(value)}
        />
      </div>
      <div style={{ position: 'relative' }}>
        {bigScreen && (
          <Popup
            content={<FormattedMessage id="annotations-search-by-text" />}
            trigger={<Icon style={{ paddingRight: '0.5em' }} name="info circle" color="grey" />}
          />
        )}
        <Input
          action={{ icon: 'search', onClick: handleAnnotationsSearch, color: 'grey' }}
          placeholder={intl.formatMessage({ id: 'search-input-placeholder' })}
          onChange={e => setSearchString(e.target.value)}
          value={searchString}
        />
        {lastQuery && (
          <Icon
            className="library-search-cancel"
            onClick={cancelSearch}
            size="large"
            color="grey"
            name="times"
          />
        )}
      </div>
    </div>
  )
}

export default AnnotationsLibrarySearch
