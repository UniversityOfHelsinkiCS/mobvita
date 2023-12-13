import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, FormattedHTMLMessage, useIntl } from 'react-intl'
import { Button, Icon, Popup } from 'semantic-ui-react'
import { Spinner } from 'react-bootstrap'
import {
  useDictionaryLanguage,
  useLearningLanguage,
  mtLanguages,
  learningLanguageLocaleCodes
} from 'Utilities/common'
import { clearContextTranslation, getContextTranslation } from 'Utilities/redux/contextTranslationReducer'

const ContextTranslation = ({wordTranslated}) => {
    const dispatch = useDispatch()
    const learningLanguage = useLearningLanguage()
    const dictionaryLanguage = useDictionaryLanguage()
    const { data, pending } = useSelector(({ contextTranslation }) => contextTranslation)
    const translatable = mtLanguages.includes([learningLanguage, dictionaryLanguage].join('-'))
    const [show, setShow] = useState(false)

    useEffect(() => {
        if (translatable && data){
            dispatch(getContextTranslation(data.sentence,
                learningLanguageLocaleCodes[learningLanguage],
                learningLanguageLocaleCodes[dictionaryLanguage]))
        }
    }, [learningLanguage, dictionaryLanguage])
    useEffect(() => {
        setShow(false)
        if (!wordTranslated) dispatch(clearContextTranslation())
    }, [wordTranslated])

    if (!translatable || !wordTranslated || !pending && !data) return null
    if (!show && translatable) return (
        <Popup
            position="top center"
            content={<FormattedHTMLMessage id="dictionaryhelp-show-context-translation" />}
            trigger={
                <Button 
                    primary
                    circular
                    style={{ float: 'right', padding: '1em' }}
                    onClick={() => setShow(true)}
                >
                    <Icon name="plus" style={{ margin: 0, fontSize: 'small' }} />
                </Button>
            }
        />
    )

    return (
        <div className="flex space-between">
            <div className="flex">
            { !pending ? (
                <p style={{
                    color: '#555555',
                    marginBottom: '1em',
                    padding: '1em',
                    borderRadius: '15px',
                    backgroundColor: '#9e9e9e4d'
                }}>
                    {data.translation}
                </p>
            ): (
                <div>
                    <span>
                        <FormattedMessage id="dictionaryhelp-loading-please-wait" />
                        ...{' '}
                    </span>
                    <Spinner animation="border" />
                </div>
            )}
            </div>
        </div>
    )

}

export default ContextTranslation