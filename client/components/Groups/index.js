import React, { useState } from 'react'

const GroupView = () => {
  const [text] = useState('')

  return (
    <div>{text}</div>
  )
}

export default GroupView
