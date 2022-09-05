import React from 'react'

const StudentCEFRLevel = ({ currentStudent }) => {
  console.log('curr ', currentStudent)
  if (currentStudent) {
    return (
      <div className="dictionary-and-annotations-cont">
        <div className="story-topics-box" style={{ padding: '1em' }}>
          <div style={{ backgroundColor: '#FFFFFF' }}>
            Current CEFR level: 
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default StudentCEFRLevel
