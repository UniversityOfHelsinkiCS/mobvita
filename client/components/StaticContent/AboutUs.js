import React from 'react'
import { Modal, Container, Button } from 'semantic-ui-react'

export default function AboutUs({ trigger }) {
  return (
    <Modal
      dimmer="inverted"
      closeIcon
      trigger={trigger}
    >
      <Modal.Header>About us</Modal.Header>
      <Modal.Content className="practiceModal">

        <Container text>
          <p>Revita provides tools for language learning, and for supporting endangered languages.
             Revita stimulates the student to practice in actively producing language, rather than passively absorbing rules.
          </p>
          <h3>Main features</h3>
          <p>Revita offers many exercise modes:
            fill-in-the-blank quizzes,
            multiple-choice quizzes,
            vocabulary practice (flashcards),
            listening comprehension quizzes,
            crosswords,
            competition—to complete exercises faster than an opponent,
            ... and more.
            Revita is suitable for students at the intermediate to advanced levels—i.e., not for absolute beginners.
            The system tracks the progress of the student, and aims to adapt to the student's present level of competence. The student's past answers help the system to offers exercises that are best suited for the student's level.
          </p>
          ...
        </Container>


      </Modal.Content>
    </Modal>
  )
}
