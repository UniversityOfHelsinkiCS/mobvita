import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Button } from 'semantic-ui-react'

const HomeView = ({ stories }) => {
  const [randomStoryIndex, setRandom] = useState(0)
  const [language, setLanguage] = useState('')

  useEffect(() => {
    const currentLanguage = window.location.pathname.split('/')[2]
    setLanguage(currentLanguage)
    if (stories.length > 0) {
      const random = Math.ceil(Math.random() * stories.length) - 1
      setRandom(random)
    }
  }, [stories])
  if (!stories[randomStoryIndex]) return <div>no stories</div>

  return (
    <Link to={`/stories/${language}/${stories[randomStoryIndex]._id}/snippet`}>
      <Button fluid>
        <FormattedMessage id="PRACTICE_NOW" />
      </Button>
    </Link>
  )
}

const mapStateToProps = ({ stories }) => ({
  stories: stories.data,
})

export default connect(mapStateToProps, null)(HomeView)