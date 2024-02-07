
import React, { useState, useEffect } from 'react'
import { addExercise, removeExercise } from 'Utilities/redux/controlledPracticeReducer'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

const BatchExerciseControl = () => {
  const dispatch = useDispatch()
  const {snippets} = useSelector(({ controlledPractice }) => controlledPractice)
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

  const formatClozeExercise = (word, concept_id, topic) => {
    const { choices: removedProperty, audio: removedAudio, audio_wids: removedWids, ...wordRest } = word

    return {
      ...wordRest,
      id: word.candidate_id,
      base: getWordBase(word),
      concept: `concept_id: ${concept_id}`,
      topic,
    }

  }

  const formatMCExercise = (word, choicesSet, concept_id, topic) => {
    const { audio: removedAudio, audio_wids: removedWids, ...wordRest } = word
    const generatedID = `custom_${storyId}_${word.ID}`

    return {
        ...wordRest,
        surface: word.surface,
        id: word.candidate_id || word.id || generatedID,
        base: getWordBase(word),
        choices: choicesSet,
        concept: `concept_id: ${concept_id}`,
        topic,
    }
  }



  const addExerciseByTopic = (topic) => {
    if (!pending){
      for (let i = 0; i < story?.paragraph.length; i++) {
        for (let j = 0; j < story?.paragraph[i].length; j++) {
          const word = story?.paragraph[i][j]
          if (word.concepts?.map(x=>x.topic).includes(topic)) {
            const concept = word.concepts?.find(x=>x.topic === topic).concept
            const choiceSet = word.choices && word.choices[concept] || []
            if (snippets[word.snippet_id]?.find(x=>x.ID === word.ID)?.topic !== topic)
              dispatch(removeExercise(word))
            if (choiceSet?.length > 1) {
              dispatch(addExercise(formatMCExercise(word, choiceSet, concept, topic)))
            } else {
              dispatch(addExercise(formatClozeExercise(word, concept, topic)))
            }
          }
        }
      }
    }
  }

  const removeExerciseByTopic = (topic) => {
    if (!pending){
      for (let i = 0; i < story?.paragraph.length; i++) {
        for (let j = 0; j < story?.paragraph[i].length; j++) {
          const word = story?.paragraph[i][j]
          if (word.concepts?.map(x=>x.topic).includes(topic) && exerciseTokens.includes(word.ID)) {
            dispatch(removeExercise(word))
          }
        }
      }
    }
  }

  const countExerciseTopics = () => {
    const candidate_id = new Set()
    const exerciseTopics = {}
    for (let i = 0; i < story?.paragraph.length; i++) {
      for (let j = 0; j < story?.paragraph[i].length; j++) {
        const word = story?.paragraph[i][j]
        if (word.concepts && exerciseTokens.includes(word.ID) && !candidate_id.has(word.candidate_id)) {
          candidate_id.add(word.candidate_id || word.id || `custom_${storyId}_${word.ID}`)
          for (let k = 0; k < word.concepts?.length; k++) {
            const topic = word.concepts[k].topic
            if (exerciseTopics[topic]) {
              exerciseTopics[topic] += 1
            } else {
              exerciseTopics[topic] = 1
            }
          }
        }
      }
    }
    return exerciseTopics
  }
  const exerciseTopicsCount = countExerciseTopics()

  return {addExerciseByTopic, removeExerciseByTopic, exerciseTopicsCount}
}

export default BatchExerciseControl