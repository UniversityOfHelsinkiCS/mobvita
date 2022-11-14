import React, { useEffect } from 'react'
import { Button } from 'react-bootstrap'

const LessonExerciseActions = () => {

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Button variant="primary">
          Submit answers
        </Button>
      </div>
    </div>
  )
}

export default LessonExerciseActions