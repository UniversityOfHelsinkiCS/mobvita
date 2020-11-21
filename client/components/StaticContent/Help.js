import React from 'react'
import { useSelector } from 'react-redux'
import { Segment } from 'semantic-ui-react'

const Help = () => {
  const interfaceLanguage = useSelector(({ user }) => user.data && user.data.user.interfaceLanguage)
  const locale = useSelector(({ locale }) => locale)

  const lang = interfaceLanguage || locale

  const videoUrl =
    lang === 'Italian' || lang === 'it'
      ? 'https://player.vimeo.com/video/417173105'
      : 'https://player.vimeo.com/video/417168581'

  return (
    <div className="cont auto">
      <Segment>
        <b>What:</b>
        <ul>
          <li>
            Revita helps you learn languages by doing exercises based on stories that interest you.
          </li>
        </ul>

        <b>How:</b>
        <ul>
          <li>
            You can exercise with any text of your choice, which you upload yourself, or from a
            library of sample texts that we have uploaded for everyone.
          </li>
        </ul>

        <hr />
        <b>Tutorial introduction:</b>

        <br />
        <br />

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
        <b>Add your own content:</b>
        <ul>
          <li>
            You can upload a text &mdash; any text &mdash; into the system.
            <ul>
              <li>give a link to a Web page you are interested in</li>
              <li>
                or in a text file &mdash; <tt>.txt</tt> or <tt>.docx</tt>
              </li>
              <li>or copy/paste into the text box</li>
            </ul>
          </li>

          <li>
            Upload texts that interest you &mdash; texts with which you will enjoy practicing.
          </li>

          <li>
            Revita automatically generates exercises &mdash; quizzes and puzzles &mdash; based on
            your chosen story.
          </li>
        </ul>

        <b>Revita creates exercises based on your story:</b>
        <ul>
          <li>
            You can begin by reading the story, or go directly to <i>practice</i>.
          </li>

          <li>
            Revita hides some of the words in the story, and gives you hints about the hidden words
            &mdash; the &quot;base&quot; form (as in a dictionary).
          </li>

          <li>
            The student has to produce the correct form of the word, based on its
            <i>context</i> in the story.
          </li>

          <li>
            After you answer the exercises, the system gives <i>immediate feedback</i> &mdash; which
            answers were correct or incorrect.
            <br />
            For every correct answer you get <i>points</i> on the Elo system, for each incorrect
            answer, you lose points.
          </li>

          <li>
            Click on any <i>unfamiliar word</i> &mdash; to see its definition in a dictionary.
          </li>

          <li>
            For many languages, Revita also tries to <i>pronounce</i> the words. (Click the speaker
            icon in the dictionary.)
          </li>

          <li>
            All unfamiliar words are stored into your deck of <i>flashcards</i>.
            <br />
            Practice with your flashcards &mdash; to improve your vocabulary.
          </li>

          <li>
            You can practice with a story many times: every time the exercises will be new and
            different &mdash; they are created automatically.
          </li>

          <li>
            The system keeps track of your answers to exercises, flashcards, etc. &mdash; from your
            answers it learns to offer you exercises that better suit your level &mdash; it tries to
            avoid questions that you have mastered, or which would be too difficult for you at
            present.
          </li>

          <li>
            The more you practice, the more you learn &mdash; and the better Revita can adapt to
            your level, and create exercises better suited for you.
          </li>
        </ul>

        <b>Registration:</b>
        <ul>
          <li>
            Revita can be used in "guest" mode, without registration. A guest can use any language,
            view public stories, and do exercises.
          </li>

          <li>
            Registering &mdash; which is free &mdash; enables additional features:
            <ul>
              <li>
                <b>Own content</b>: you can upload stories you like to your own private library.
                <br />
                Private stories are not visible to other users &mdash; but you can share your
                stories with <i>friends</i>
              </li>

              <li>
                <b>Personalization</b>: The student's previous answers help the system to offer
                exercises that are best suited for the student's level.
              </li>
            </ul>
          </li>
        </ul>

        <b>Interaction:</b>
        <ul>
          <li>A teacher can share stories with a group of students.</li>
        </ul>

        <h4>Technical</h4>
        <p>
          We recommend the newest versions of these browsers: Firefox, Chrome/Chromium, Safari.
          (Internet Explorer not supported.)
          <br />
          JavaScript and cookies should be enabled in your browser.
        </p>
      </Segment>
    </div>
  )
}

export default Help
