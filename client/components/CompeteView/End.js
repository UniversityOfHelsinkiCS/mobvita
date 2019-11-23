import React from 'react'
import { useSelector } from 'react-redux'

const End = () => {
  const { compete } = useSelector(({ compete }) => ({ compete }))

  const { wrong, total, totalTime, startTime, opponentPercent } = compete
  const timeNow = (new Date()).getTime()
  const yourTime = ((timeNow - startTime) / 1000).toFixed(0)
  const right = total - wrong
  return (
    <div>
      <div>
        You scored {right} / {total}.
        In {yourTime}s.
      </div>
      <div>
        Opponent scored {(total * opponentPercent).toFixed(0)} / {total}.
        In {totalTime}s.
      </div>
    </div>
  )
}

export default End
