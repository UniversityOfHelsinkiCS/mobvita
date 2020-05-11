import React from 'react'
import { useSelector } from 'react-redux'
import { Segment } from 'semantic-ui-react'

const Help = () => {
  const locale = useSelector(({ locale }) => locale)

  const videoUrl = locale === 'it'
    ? 'https://player.vimeo.com/video/417173105'
    : 'https://player.vimeo.com/video/417168581'

  return (
    <div className="component-container">
      <Segment>
        <b>What?</b>
        <ul>
          <li>
            Revita helps you learn the language of your choice by doing exercises with stories that
            interest you.
          </li>
        </ul>

        <b>How?</b>
        <ul>
          <li>
            You can exercise with any text of your own choice, which you upload yourself, or with
            the library of sample texts that we have uploaded for everyone to use
          </li>
        </ul>

        <hr />
        <div className="iframe-container">
          <iframe
            title="Introductory tutorial"
            className="iframe"
            src={videoUrl}
            webkitallowfullscreen
            mozallowfullscreen
            allowFullScreen
          />
        </div>
        <hr />


        <hr />
        <b>Adding your own content:</b>
        <ul>
          <li>You can upload a text&mdash;any text&mdash;into the system.
            <ul>
              <li>in text format&mdash;.txt;</li>
              <li>or copy/paste into the text box;</li>
              <li>or give a Web link that contains the text you are interested in.</li>
            </ul>
          </li>
          <li>
            Please upload texts that you are interested in&mdash;texts
            with which you will enjoy working.
          </li>
          <li>
            Revita goes through the story, and automatically generates
            exercises&mdash;puzzles&mdash;based on your chosen text.
          </li>
        </ul>

        <b>Revita creates exercises based on your story:</b>
        <ul>
          <li>
            You may begin by reading the story, or go directly to the
            exercises.
          </li>
          <li>
            Exercises: Revita hides some of the words in the story, and gives you a hint for the
            hidden word&mdash;its &quot;base&quot; form (how it appears in a dictionary).
          </li>
          <li>
            he student has to produce the correct form of the word, which suits the
            context of the story.
          </li>
          <li>
            After you answer a puzzle, the system provides immediate
            feedback&mdash;which answers were correct or incorrect.  For every
            correct answer you get one point (an apple), for each incorrect one,
            you lose a point.
          </li>
          <li>
            You can click on any unfamiliar word&mdash;Revita tries to provide
            its dictionary definition.
          </li>
          <li>
            For some languages, Revita also tries to pronounce the word.  (By
            clickig the speaker icon in the dictionary.)
          </li>
          <li>Unfamiliar words are stored into your own deck of flashcards.</li>
          <li>
            You can review your collected flashcards&mdash;this is another exercise, to test
            your vocabulary.
          </li>
          <li>
            You can return to the same story many times, and every time the
            exercises will be new, different&mdash;they are created automatically.
          </li>
          <li>
            The system will keep track of your answers to all exercises, flashcards,
            etc.&mdash;and use them to offer you exercises that better suit your level&mdash;it
            tries to avoid asking questions, which you have mastered, or which would be
            too difficult for you at present.
          </li>
          <li>
            The more time you spend practicing, the more you learn the
            language, and the better Revita can adapt to your level and produce exercises
            better suited for you.
          </li>
        </ul>

        <b>The same story may be practiced many times:</b>
        <ul>
          <li>
            The exercises will be different each time, since they are created randomly
          </li>
          <li>This is done to make the practice more varied and interesting.</li>
        </ul>

        <b>Interaction with other users:</b>
        <ul>
          <li>A teacher can share a story with an entire group of students.</li>
        </ul>


      </Segment>
    </div>
  )
}

export default Help
