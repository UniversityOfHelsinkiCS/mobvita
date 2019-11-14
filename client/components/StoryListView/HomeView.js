import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button } from 'semantic-ui-react'

const HomeView = ({ stories }) => {
  const [randomStoryIndex, setRandom] = useState(0)
  useEffect(() => {
    if (stories.length > 0) {
      const random = Math.ceil(Math.random() * stories.length) - 1
      setRandom(random)
    }
  }, [stories])

  return <Link to={`/stories/${stories[randomStoryIndex]._id}/snippet`}><Button fluid>practice now</Button></Link>
}

const mapStateToProps = ({ stories }) => ({
  stories: stories.data,
})

export default connect(mapStateToProps, null)(HomeView)