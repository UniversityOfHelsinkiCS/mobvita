import React from 'react'
import { useDispatch } from 'react-redux'
import CloseIcon from '@mui/icons-material/Close'
import { closeBanner } from 'Utilities/redux/metadataReducer'

const Banner = ({ message, open }) => {
  const dispatch = useDispatch()

  if (!open) return null

  return (
    <div className="banner">
      <div dangerouslySetInnerHTML={{ __html: message }} />
      <CloseIcon
        onClick={() => dispatch(closeBanner(message))}
        style={{ color: '#004085', cursor: 'pointer' }}
        data-cy="banner-close-button"
      />
    </div>
  )
}

export default Banner
