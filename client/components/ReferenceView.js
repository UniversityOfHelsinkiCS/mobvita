import React from 'react'
import { List, ListItem } from '@mui/material'
import Footer from './Footer'

const ReferenceView = () => {
  return (
    <div className="cont-tall flex-col space-between pt-lg">
      <div className="justify-center">
        <div
          style={{
            width: '100%',
            maxWidth: '1000px',
            fontSize: '1.5rem'
          }}
        >
          <h1>References</h1>
          <List sx={{ listStyleType: 'disc', pl: '1.5em', py: 0 }}>
            <ListItem sx={{ display: 'list-item', px: 0, py: '.21428571em' }}>A reference</ListItem>
            <ListItem sx={{ display: 'list-item', px: 0, py: '.21428571em' }}>A reference</ListItem>
            <ListItem sx={{ display: 'list-item', px: 0, py: '.21428571em' }}>
            A reference
              <List sx={{ listStyleType: 'disc', pl: '1.5em', py: 0 }}>
                <ListItem sx={{ display: 'list-item', px: 0, py: '.21428571em' }}>
                  <a href='#' data-cy="reference-view-sub-link">A sub reference with link</a>
                </ListItem>
                <ListItem sx={{ display: 'list-item', px: 0, py: '.21428571em' }}>A sub reference</ListItem>
                <ListItem sx={{ display: 'list-item', px: 0, py: '.21428571em' }}>A sub reference</ListItem>
              </List>
          </ListItem>
        </List>
        </div>
      </div>
    <Footer />
    </div>
  )
}

export default ReferenceView
