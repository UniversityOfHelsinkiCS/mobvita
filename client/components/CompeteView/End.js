import React from 'react'
import { useSelector } from 'react-redux'

const End = () => {
  const { compete } = useSelector(({ compete }) => ({ compete }))

  const { wrong, total, totalTime, startTime, opponentPercent } = compete
  const timeNow = new Date().getTime()
  const yourTime = ((timeNow - startTime) / 1000).toFixed(0)
  const right = total - wrong
  const opponentRight = (total * opponentPercent).toFixed(0)
  let resultText = ''
  if (totalTime < yourTime) {
    if (opponentRight > right) {
      resultText += 'You were slower and you had less correct!'
    } else {
      resultText += 'You were slower but atleast you got more right!'
    }
  } else if (opponentRight > right) {
    resultText += 'You were faster but your opponent got more right!'
  } else {
    resultText += 'You were faster and you got more right!'
  }
  return (
    <div>
      <div>
        You scored {right} out of {total} tried. In {yourTime}s.
      </div>
      <div>
        Opponent scored {opponentRight} out of {total} tried. In {totalTime}s.
      </div>
      <h1>{resultText}</h1>
    </div>
  )
}

export default End
