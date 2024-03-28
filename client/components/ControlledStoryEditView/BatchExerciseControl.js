
import React, { useState, useEffect } from 'react'
import { addExercise, removeExercise } from 'Utilities/redux/controlledPracticeReducer'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

const BatchExerciseControl = () => {
  const dispatch = useDispatch()
  const {snippets} = useSelector(({ controlledPractice }) => controlledPractice)
  const isMultiTokenExercise = token => (token.is_head && 
    (token.multi_mc && token.multi_mc_concept && token.multi_mc_concept === token.concept?.replace('concept_id: ', '') || token.multi_token))
  const exerciseTokens = Object.values(snippets).flat(1).map(token => token.ID)
  const { story, pending } = useSelector(({ stories, locale }) => ({
    story: stories.focused,
    pending: stories.focusedPending,
    locale,
  }))
  const { id: storyId } = useParams()

  

  const getWordBase = word => {
    const splitBases = word.bases.split('|')
    const splitConcatenations = splitBases[0].split('+')
    return splitConcatenations[0]
  }

  const formatClozeExercise = (word, concept_id) => {
    const { choices: removedProperty, audio: removedAudio, audio_wids: removedWids, ...wordRest } = word

    return {
      ...wordRest,
      id: word.candidate_id,
      base: getWordBase(word),
      concept: `concept_id: ${concept_id}`,
    }

  }

  const formatMCExercise = (word, choicesSet, concept_id) => {
    const { audio: removedAudio, audio_wids: removedWids, alter_correct, mc_correct , ...wordRest } = word
    const generatedID = `custom_${storyId}_${word.ID}`

    return {
        ...wordRest,
        surface: word.surface,
        id: word.candidate_id || word.id || generatedID,
        base: getWordBase(word),
        choices: choicesSet,
        concept: `concept_id: ${concept_id}`,
        alter_correct: alter_correct && alter_correct[concept_id],
        mc_correct: mc_correct && mc_correct[concept_id],
    }
  }


  const addExerciseByItem = (item) => {
    if (!pending){
      for (let i = 0; i < story?.paragraph.length; i++) {
        for (let j = 0; j < story?.paragraph[i].length; j++) {
          const word = story?.paragraph[i][j]
          if (word.concepts?.map(x=>x.concept).includes(item)) {
            const choiceSet = word.choices && word.choices[item] || []
            const thisToken = snippets[word.snippet_id]?.find(x=>x.ID === word.ID)
            const headToken = snippets[word.snippet_id]?.find(x=>x.cand_index?.includes(word.ID) && x.is_head)
            if (thisToken && thisToken.concept !== item)
              dispatch(removeExercise(thisToken))
            if (headToken && headToken.concept !== item && isMultiTokenExercise(headToken)){
              const toBeRemoved = headToken.cand_index?.length && headToken.cand_index || [headToken.ID]
              toBeRemoved.forEach(k => dispatch(removeExercise({ID: k, snippet_id: i})))
            }
            if (choiceSet?.length > 1) {
              dispatch(addExercise(formatMCExercise(word, choiceSet, item)))
            } else {
              dispatch(addExercise(formatClozeExercise(word, item)))
            }
          }
        }
      }
    }
  }

  const removeExerciseByItem = (item) => {
    if (!pending){
      for (let i = 0; i < story?.paragraph.length; i++) {
        for (let j = 0; j < story?.paragraph[i].length; j++) {
          const word = story?.paragraph[i][j]
          if (word.concepts?.map(x=>x.concept).includes(item) && exerciseTokens.includes(word.ID)) {
            dispatch(removeExercise(word))
          }
        }
      }
    }
  }

  const countExercise = () => {
    const candidate_id = new Set()
    const exerciseItems = {}
    const hiddenTokens = Object.values(snippets).flat(1).map(token => isMultiTokenExercise(token) && token.cand_index || []).flat(1)
    for (let i = 0; i < story?.paragraph.length; i++) {
      for (let j = 0; j < story?.paragraph[i].length; j++) {
        const word = story?.paragraph[i][j]
        if (word.concepts && exerciseTokens.includes(word.ID) && !candidate_id.has(word.candidate_id) || 
            hiddenTokens.includes(word.ID)) {
          candidate_id.add(word.candidate_id || word.id || `custom_${storyId}_${word.ID}`)
          for (let k = 0; k < word.concepts?.length; k++) {
            const item = word.concepts[k].concept
            if (exerciseItems[item]) {
              exerciseItems[item] += 1
            } else {
              exerciseItems[item] = 1
            }
          }
        }
      }
    }
    return exerciseItems
  }
  const exerciseCount = countExercise()

  return {addExerciseByItem, removeExerciseByItem, exerciseCount}
}

export default BatchExerciseControl