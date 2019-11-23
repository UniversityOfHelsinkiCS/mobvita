import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Button } from 'semantic-ui-react'
import { images } from 'Utilities/common'

const HomeView = () => {
  const [randomStoryIndex, setRandom] = useState(0)
  const [language, setLanguage] = useState('')
  const { stories, pending } = useSelector(({ stories }) => ({ stories: stories.data, pending: stories.pending }))
  useEffect(() => {
    const currentLanguage = window.location.pathname.split('/')[2]
    setLanguage(currentLanguage)
    if (stories.length > 0) {
      const random = Math.ceil(Math.random() * stories.length) - 1
      setRandom(random)
    }
  }, [stories])

  if (pending) return null

  if (!stories[randomStoryIndex]) return <FormattedMessage id="NO_STORIES" />

  const buttonLink = `/stories/${language}/${stories[randomStoryIndex]._id}/practice`
  return (
    <Link to={buttonLink} disabled={!buttonLink}>
      <Button
        fluid
        color="black"
        inverted
        style={{
          backgroundImage: `url(${images.practiceNow})`,
          height: '13em',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <FormattedMessage id="PRACTICE_NOW" />
      </Button>
    </Link>
  )
}

export default HomeView
