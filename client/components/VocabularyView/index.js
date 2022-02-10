import React, { useState, useEffect } from 'react'
import userReducer, { getVocabularyData } from 'Utilities/redux/userReducer'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Checkbox } from 'semantic-ui-react'
import VocabularyGraph from './VocabularyGraph'
// import { Popup } from 'semantic-ui-react'

const VocabularyView = () => {
  const dispatch = useDispatch()
  const vocabularyData = useSelector(({ user }) => user.vocabularyData)

  useEffect(() => {
    dispatch(getVocabularyData())
  }, [])

  return (
    // <div className="cont-tall pt-sm justify-center">
    <div
      className="auto justify-center pt-lg"
      style={{
        width: '100%',
        maxWidth: '1000px',
      }}
    >
      <div>
        <div style={{ width: '1000px' }}>
          <VocabularyGraph vocabularyData={vocabularyData} />
        </div>
      </div>
    </div>
  )
}

export default VocabularyView
