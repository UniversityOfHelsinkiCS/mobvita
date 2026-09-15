import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import AppButton from 'Components/AppButton'
import CloseIcon from '@mui/icons-material/Close'
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
          <CloseIcon
            sx={{ color: 'grey', cursor: 'pointer' }}
            onClick={() => handleSiteDelete(url)}
            data-cy="recommended-site-delete-button"
          />
          <AppButton
            variant="link"
            style={{ padding: 0 }}
            href={url}
            target="_blank"
            data-cy="recommended-site-link"
          >
            {name || url}
          </AppButton>
        </div>
        <DifficultyStars difficulty={difficulty} />
      </div>
    )
  }

  const sitesList = favouriteSites.map(site => createRow(site))

  return <div className="suggestedSources-container">{sitesList}</div>
}
