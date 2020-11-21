import React from 'react'
import { useSelector } from 'react-redux'
import Banner from './Banner'

const Banners = () => {
  const banners = useSelector(({ metadata }) => metadata.banners)

  if (!banners) return null

  const bannerComponents = banners.map(banner => (
    <Banner key={banner.message} message={banner.message} open={banner.open} />
  ))

  return <>{bannerComponents}</>
}

export default Banners
