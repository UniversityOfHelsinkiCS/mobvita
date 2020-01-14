import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Header, Segment } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { images, capitalize, supportedLearningLanguages } from 'Utilities/common'
import { updateLearningLanguage } from 'Utilities/redux/userReducer'
import { useDispatch } from 'react-redux'

const LanguageSelectView = () => {
  const dispatch = useDispatch()

  return (
    <Container textAlign="center">
      <Header as="h2">
        <FormattedMessage id="CHOOSE_LANG" />
      </Header>
      <Segment style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        {supportedLearningLanguages.map(lang => (
          <Link key={lang} onClick={() => dispatch(updateLearningLanguage(lang))} to="/home" style={{ width: '7em', display: 'flex', flexDirection: 'column', margin: '1.5em', alignItems: 'center' }}>
            <img src={images[`flag${capitalize(lang.split('-').join(''))}`]} style={{ height: '3em', border: '1px solid whitesmoke' }} alt={lang} />
            <span style={{ color: 'black' }}>{capitalize(lang)}</span>
          </Link>
        ))}
      </Segment>
    </Container>
  )
}
export default LanguageSelectView
