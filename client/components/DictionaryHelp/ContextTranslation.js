import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl';
import AddIcon from '@mui/icons-material/Add'
import AppButton from 'Components/AppButton'
import CustomTooltip from 'Components/CustomTooltip'
import { lemmatizer } from 'lemmatizer'
import {
  useDictionaryLanguage,
  useLearningLanguage,
  useMTAvailableLanguage,
  learningLanguageLocaleCodes
} from 'Utilities/common'
import { getContextTranslation } from 'Utilities/redux/contextTranslationReducer'
import Spinner from 'Components/Spinner'

const ContextTranslation = ({surfaceWord, wordTranslated}) => {
    const glossCheckLanguage = ['English']

    const dispatch = useDispatch()
    const learningLanguage = useLearningLanguage()
    const dictionaryLanguage = useDictionaryLanguage()
    const mtLanguages = useMTAvailableLanguage()
    const { data, pending, lastTrans } = useSelector(({ contextTranslation }) => contextTranslation)
    const [translatable, setTranslatable] = useState(mtLanguages.includes([learningLanguage, dictionaryLanguage].join('-'))) 
    const [show, setShow] = useState(false)

    const translated_glosses =  wordTranslated ? wordTranslated.map(
        translated=>translated.glosses).flat().map(gloss=>gloss.toLowerCase()) : []
    const glosses = glossCheckLanguage.includes(dictionaryLanguage) ? [
        ...translated_glosses,
        ...translated_glosses.map(
            gloss=>gloss.includes(' ') && [gloss, ...gloss.split(' '), ...gloss.split(' ').map(g=>lemmatizer(g))] || [lemmatizer(gloss)]).flat(),
    ] : [
        ...translated_glosses,
        ...translated_glosses.filter(gloss=>gloss.includes(' ')).map(gloss=>gloss.split(' ')).flat()
    ]

    useEffect(() => {
        const updatedTranslatable = mtLanguages.includes([learningLanguage, dictionaryLanguage].join('-'))
        setTranslatable(updatedTranslatable)
        if (updatedTranslatable && lastTrans){
            dispatch(getContextTranslation(lastTrans,
                learningLanguageLocaleCodes[learningLanguage],
                learningLanguageLocaleCodes[dictionaryLanguage]))
        }
    }, [dictionaryLanguage])
    useEffect(() => {
        setShow(false)
    }, [wordTranslated])

    const glossCheck = (p) => (
        !glossCheckLanguage.includes(dictionaryLanguage) ||
        glosses.includes(p.trim().toLowerCase()) || glosses.includes(lemmatizer(p.trim().toLowerCase()))
    )

    const highlightTarget = (translation) => {
        const targetSents = []
        const targetSentIds = new Set()
        for (let sentId in translation['source-segments']) {
            const sourceIds = []
            let target = ''
            let p = ''
            let q = []
            
            for(let s in translation['source-segments'][sentId]){
                const segment = translation['source-segments'][sentId][s]
                if (segment[0] === '▁' || segment[0].toLowerCase() === segment[0].toUpperCase()) {
                    if (p.length && p === surfaceWord)
                        sourceIds.push(...q)
                    p = segment.replace('▁', '')
                    q = [s]
                }
                else {
                    p += segment
                    q.push(s)
                }
            }
            if (p.length && p === surfaceWord)
                sourceIds.push(...q)

            const targetIds = sourceIds.map(s=>translation['alignment'][sentId][s]).flat()
            
            p = ''
            q = []
            for(let s in translation['target-segments'][sentId]){
                const segment = translation['target-segments'][sentId][s]
                if (segment[0] === '▁' || segment[0].toLowerCase() === segment[0].toUpperCase()) {
                    if (p.trim().length && targetIds.filter(x=> q.includes(x)).length && glossCheck(p)){
                        target += '<b>' + p + '</b>'
                        targetSentIds.add(sentId)
                    } else
                        target += p
                    p = segment.replace('▁', ' ')
                    q = [s]
                }
                else {
                    p += segment
                    q.push(s)
                }
            }
            
            if (p.length && targetIds.filter(x=> q.includes(x)).length && glossCheck(p)){
                target += '<b>' + p + '</b>'
                targetSentIds.add(sentId)
            } 
            else
                target += p
            targetSents.push(target.trim())
        }
        if (targetSentIds.size){
            return [...targetSentIds].sort().map(sentId=>targetSents[sentId]).join(' ')
        }
        
        return targetSents.join(' ')
    }
    

    if (!translatable || !pending && !data) return null
    if (!show && translatable) return (
        <CustomTooltip
            placement="top"
            keyId="dictionaryhelp-show-context-translation"
            permanent
        >
            <span style={{ float: 'right', display: 'inline-flex' }}>
                <AppButton
                    variant="primary"
                    style={{ padding: '1em' }}
                    sx={{ minWidth: 0, borderRadius: '50%' }}
                    onClick={() => setShow(true)}
                    data-cy="context-translation-show-button"
                >
                    <AddIcon fontSize="small" sx={{ margin: 0 }} />
                </AppButton>
            </span>
        </CustomTooltip>
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
                    backgroundColor: 'rgb(126 222 249 / 30%)'
                    }}
                    data-cy="context-translation-text"
                    dangerouslySetInnerHTML={{__html: highlightTarget(data)}}
                />
            ): (
                <div>
                    <span>
                        <FormattedMessage id="dictionaryhelp-loading-please-wait" />
                        ...{' '}
                    </span>
                    <Spinner inline />
                </div>
            )}
            </div>
        </div>
    )

}

export default ContextTranslation
