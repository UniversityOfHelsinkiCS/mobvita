import React from 'react'
import { useSelector } from 'react-redux'
import Banner from './Banner'

const Banners = () => {
  const { bannerMessages } = useSelector(({ metadata }) => metadata)

  if (!bannerMessages) return null

  const banners = bannerMessages.map(message => <Banner key={message} message={message} />)

  return (
    <div className="banner-container">
      {banners}
    </div>
  )
}

export default Banners
