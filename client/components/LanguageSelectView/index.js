import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Header, Button } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'

const LanguageSelectView = () => {
  return (
    <div>
      <Container textAlign="center">
        <Header as="h2">
          <FormattedMessage id="CHOOSE_LANG" />
        </Header>
        <Link to="/stories/finnish"><Button primary>Finnish</Button></Link>
        <Link to="/stories/german"><Button primary>German</Button></Link>
        <Link to="/stories/russian"><Button primary>Russian</Button></Link>
      </Container>
    </div>
  )
}
export default LanguageSelectView
