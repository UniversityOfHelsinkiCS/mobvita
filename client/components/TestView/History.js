import React from 'react'
import { useSelector } from 'react-redux'

const History = () => {
  const { concepts } = useSelector(({ metadata }) => metadata)
  const { history } = useSelector(({ tests }) => tests)

  return (
    <div>
      {history && concepts && history.map(test => (
        <>
          <h3>{test.date}</h3>
          <div>
            {Object.entries(test.section_counts).map(([id, result]) => {
              const concept = concepts.find(c => c.concept_id === id)
              return (
                <div>
                  {concept ? concept.name : id}: {result.correct} / {result.total}
                </div>
              )
            })}
          </div>
        </>
      ))}
    </div>
  )
}

export default History
