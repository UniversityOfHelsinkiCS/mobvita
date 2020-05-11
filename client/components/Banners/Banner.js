import React from 'react'
import { useDispatch } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import { closeBanner } from 'Utilities/redux/metadataReducer'

const Banner = ({ message, open }) => {
  const dispatch = useDispatch()

  if (!open) return null

  return (
    <div className="banner">
      <div dangerouslySetInnerHTML={{ __html: message }} />
      <Icon
        name="close"
        onClick={() => dispatch(closeBanner(message))}
        style={{ color: '#004085', cursor: 'pointer' }}
      />
    </div>
  )
}

export default Banner
