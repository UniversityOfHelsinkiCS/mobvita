import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Header, Button } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { capitalize, supportedLearningLanguages } from 'Utilities/common'

const LanguageSelectView = () => {
  return (
    <Container textAlign="center">
      <Header as="h2">
        <FormattedMessage id="CHOOSE_LANG" />
      </Header>

      {supportedLearningLanguages.map(lang => (
        <Link key={lang} to={`/stories/${lang}`}>
          <Button style={{ minWidth: '8em', margin: '0.5em' }} primary>{capitalize(lang)}</Button>
        </Link>
      ))}
    </Container>
  )
}
export default LanguageSelectView
