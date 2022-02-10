import React, { useEffect } from 'react'
import userReducer, { getVocabularyData } from 'Utilities/redux/userReducer'
import { useDispatch, useSelector } from 'react-redux'
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
      className="auto justify-center"
      style={{
        width: '100%',
        maxWidth: '1600px',
      }}
    >
      <div style={{ width: '1000px' }}>
        <VocabularyGraph vocabularyData={vocabularyData} />
      </div>
    </div>
  )
}

export default VocabularyView
