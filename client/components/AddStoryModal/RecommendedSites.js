import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import { updateFavouriteSites } from 'Utilities/redux/userReducer'
import DifficultyStars from 'Components/DifficultyStars'

export default function RecommendedSites() {
  const favouriteSites = useSelector(({ user }) => user.data.user.favourite_sites)

  const dispatch = useDispatch()

  const handleSiteDelete = url => {
    dispatch(updateFavouriteSites(favouriteSites.filter(site => site.url !== url)))
  }

  const createRow = site => {
    const { difficulty, name, url } = site

    return (
      <div className="suggestedSources-row" key={url}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Icon
            name="close"
            color="grey"
            style={{ cursor: 'pointer' }}
            onClick={() => handleSiteDelete(url)}
          />
          <Button variant="link" style={{ padding: 0 }} href={url} target="_blank">
            {name || url}
          </Button>
        </div>
        <DifficultyStars difficulty={difficulty} />
      </div>
    )
  }

  const sitesList = favouriteSites.map(site => createRow(site))

  return <div className="suggestedSources-container">{sitesList}</div>
}
