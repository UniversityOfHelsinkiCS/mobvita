import React from 'react'
import { useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'


export default function RecommendedSites() {
  const suggestedSites = useSelector(({ metadata }) => metadata.suggestedSites)

  const icons = {
    3: <div><Icon name="star outline" style={{ color: 'red' }} /><Icon name="star outline" style={{ color: 'red' }} /><Icon name="star outline" style={{ color: 'red' }} /></div>,
    2: <div><Icon name="star outline" style={{ color: 'steelblue' }} /><Icon name="star outline" style={{ color: 'steelblue' }} /></div>,
    1: <div><Icon name="star outline" style={{ color: 'forestgreen' }} /></div>,
    0: <div><Icon name="star outline" style={{ color: 'black' }} /></div>,
  }

  const createRow = (site) => {
    const { difficulty, name, url } = site

    return (
      <div className="suggestedSources-row" key={url}>
        <Button variant="link" href={url} target="_blank">
          {name}
        </Button>
        {difficulty >= 1 && difficulty <= 3 ? icons[difficulty] : icons[0]}
      </div>
    )
  }

  const sitesList = suggestedSites.map(site => createRow(site))

  return (
    <div className="suggestedSources-container">
      {sitesList}
    </div>
  )
}
