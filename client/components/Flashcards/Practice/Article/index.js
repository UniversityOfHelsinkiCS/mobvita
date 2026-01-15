import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import ReactCardFlip from 'react-card-flip'
import { Button } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import Flashcard from '../Flashcard'
import { set } from 'lodash'

const Article = ({ card, cardNumbering, answerCard }) => {
  const [flipped, setFlipped] = useState(false)
  const [answerChecked, setAnswerChecked] = useState(false)
  const [answerCorrect, setAnswerCorrect] = useState(null)

  const { flashcardArticles } = useSelector(({ metadata }) => metadata)

  const iconRef = useRef()

  const { lemma, _id: id, stage, gender, article, lan_in } = card

  useEffect(() => {
    setFlipped(false)
    setAnswerChecked(false)
    setAnswerCorrect(null)
  }, [id])

  const flipCard = () => {
    setFlipped(!flipped)
    setAnswerChecked(true)
  }

  // flip card when icon has rendered
  useEffect(() => {
    if (!iconRef.current) return
    if (!flipped) {
      flipCard()
    }
  }, [iconRef.current])

  const checkAnswer = answer => {
    const correct = answer === article
    answerCard(answer, correct, 'article')
    setAnswerCorrect(correct)
    flipCard()
  }

  const cardProps = {
    cardNumbering,
    stage,
    id,
    flipCard,
  }

  const articleButtons = flashcardArticles.map(article => (
    <Button key={`${article}-${id}`} onClick={() => checkAnswer(article)}>
      {article}
    </Button>
  ))

  const rightAnswer = `${article} ${lemma}`

  const fontClass = lemma.length > 12 ? 'header-4' : 'header-2'
  const resultIconName = answerCorrect ? 'thumbs up outline' : 'thumbs down outline'

  return (
    <ReactCardFlip isFlipped={flipped}>
      <Flashcard {...cardProps}>
        <div className="flex align-center grow">
          {!answerChecked && <div className="flex-col gap-row-nm">{articleButtons}</div>}
          <span className={`${fontClass} auto`}>{lemma}</span>
        </div>
      </Flashcard>
      <Flashcard {...cardProps}>
        <div className="flex-col space-evenly align-center grow">
          <span className="header-2">{rightAnswer}</span>
          {answerCorrect !== null && (
            <Icon
              ref={iconRef}
              style={{ marginLeft: 'auto', marginRight: 'auto' }}
              name={resultIconName}
              size="huge"
            />
          )}
        </div>
      </Flashcard>
    </ReactCardFlip>
  )
}

export default Article
