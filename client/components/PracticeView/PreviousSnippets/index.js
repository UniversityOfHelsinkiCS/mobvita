import React from 'react'
import { hiddenFeatures } from 'Utilities/common'
import PreviousSnippetsNew from './PreviousSnippetsNew'
import PreviousSnippetsOld from './PreviousSnippetsOld'

const PreviousSnippets = (props) => {
  if (hiddenFeatures) return <PreviousSnippetsNew {...props} />
  return <PreviousSnippetsOld {...props} />
}

export default PreviousSnippets
