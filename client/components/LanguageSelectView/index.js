import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Header, Button, Segment } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { capitalize, supportedLearningLanguages } from 'Utilities/common'

const LanguageSelectView = () => {
  return (
    <Container textAlign="center">
      <Header as="h2">
        <FormattedMessage id="CHOOSE_LANG" />
      </Header>
      <Segment style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '40em', margin: 'auto', justifyContent: 'center', backgroundColor: 'azure' }}>
        {supportedLearningLanguages.map(lang => (
          <Link key={lang} to={`/stories/${lang}#home`}>
            <Button color="teal" style={{ display: 'flex', flexDirection: 'column', margin: '1em', alignItems: 'center' }}>
              {capitalize(lang)}
            </Button>
          </Link>
        ))}
      </Segment>
    </Container>
  )
}
export default LanguageSelectView
