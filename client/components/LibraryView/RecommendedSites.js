import React from 'react'
import { useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
import DifficultyStars from 'Components/DifficultyStars'

export default function RecommendedSites() {
  const favouriteSites = useSelector(({ user }) => user.data.user.favourite_sites)

  const createRow = site => {
    const { difficulty, name, url } = site

    return (
      <div className="suggestedSources-row" key={url}>
        <Button variant="link" href={url} target="_blank">
          {name || url}
        </Button>
        <DifficultyStars difficulty={difficulty} />
      </div>
    )
  }

  const sitesList = favouriteSites.map(site => createRow(site))

  return <div className="suggestedSources-container">{sitesList}</div>
}
