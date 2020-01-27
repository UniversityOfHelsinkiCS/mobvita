import React from 'react'
import { Modal, Container, Button, Image, Header } from 'semantic-ui-react'

export default function AboutUs({ trigger }) {
  return (
    <Modal
      dimmer="inverted"
      closeIcon
      trigger={trigger}
    >
      <Modal.Header>About us</Modal.Header>
      <Modal.Content>
        <p>
          <b><i>Revita</i></b> provides tools for language learning, and for supporting endangered languages.
          <br />
          <b><i>Revita</i></b> stimulates the student to practice in <b>actively producing</b> language, rather than <b>passively absorbing</b> rules.
        </p>

        <h4>Main features</h4>
        <ul>
          <li><b><i>Revita</i></b> offers many <b>exercise modes:</b></li>
          <ul>
            <li>fill-in-the-blank quizzes,</li>
            <li>multiple-choice quizzes,</li>
            <li>vocabulary practice (flashcards),</li>
            <li>listening comprehension quizzes,</li>
            <li>crosswords,</li>
            <li>competition&mdash;to complete exercises faster than an opponent,</li>
            <li>... and more.</li>
          </ul>
          <li>
            <b>
              <i>Revita</i>
            </b> is suitable for students at the <b>intermediate to advanced</b> levels&mdash;i.e., not for absolute beginners.
          </li>

          <li>The system
            <b>tracks the progress</b>
            of the student, and aims to adapt to the student's present level of competence.
            The student's past answers help the system to offers exercises that are best suited for the <b>student's level</b>.
          </li>
        </ul>

        <p>
          <b><i>Revita</i></b> can be used in "guest" mode, without registration. A guest can use
          any language, view public stories and do exercises.

          <br />
          Registering&mdash;which is free&mdash;enables these main features:

          <ul>
            <li>
              <b>Own content</b>: you can upload any story you like, and work on it in your own
              private library. Private stories are not visible to other users&mdash;but you can
              share stories with <i>friends</i>!
              Stories can be uploaded from any web page, or from a text file.
            </li>

            <li>
              <b>Personalization</b>: the results from your exercises are analyzed to adapt to
              your level of competence and offer exercises appropriate for your level.
            </li>
          </ul>
        </p>


        <h4>Stories</h4>

        <p>
          <b><i>Revita</i></b> helps students <i>learn languages from stories</i>. The story can be <b>any</b>
    text, which the students choose themselves. For each story:

          <ul>
            <li>
              <b><i>Revita </i></b>
              selects some words from the story to <b>create exercises </b>&mdash;e.g., fill-in-the-blank <i>quizzes</i>&mdash; ("cloze" exercises)
            </li>

            <li>the student receives <i>hints</i> for each quiz&mdash;the hint is the "basic" form of the word</li>

            <li>the student fills in the word in the correct form as it
        should appear in the context of the story
            </li>

            <li> <b><i>Revita</i></b> provides instant <b>feedback</b> to the student about
        whether the answers match what was in the text
            </li>

            <li>If you return to practice the same story again, the exercises will be <b>new</b>,
        since they are chosen randomly every time you practice.
            </li>

            <li><b><i>Revita</i></b> tracks the student's answers, monitors the student's
        progress, and assesses the the student's level of competence
            </li>
          </ul>

          <b><i>Revita</i></b> offers a sample "public library" of stories in your chosen
          language. The public stories cover various topics, and at various levels of difficulty.
        </p>


        <h4>Languages</h4>

        <p>
    The language is chosen from the menu on the top-right.

    Endangered languages currently available:

          <ul>
            <li> Uralic:</li>
            <ul>
              <li> Erzya</li>
              <li> Komi-Zyrian</li>
              <li> Meadow Mari</li>
              <li> North Saami</li>
              <li> Udmurt</li>
            </ul>
            <li> Turkic:</li>
            <ul>
              <li> Sakha (Yakut)</li>
            </ul>
          </ul>

        </p>


        <h4>Credits and Acknowledgements</h4>

        <b><i>Revita</i></b> builds upon many tools, which are developed and kindly made available
by other projects and international colleagues:
        <ul>
          <li> <a href="http://giellatekno.uit.no/index.eng.html">GiellaTekno</a>&mdash;a
    platform for many Uralic languages.
          </li>

          <li> CrosslatorTagger for Russian,
    by <a href="https://www.hse.ru/en/staff/klyshinsky">Eduard
        Klyshinskiy
       </a>; CrosslatorTagger is used
    to detect code-switching to Russian in Uralic and Turkic texts.
          </li>

          <li> <a href="https://code.google.com/archive/p/morphisto/">Morphisto
          </a>&mdash;a German analyzer.
          </li>

          <li> <a href="https://glosbe.com">Glosbe</a>&mdash;an on-line
    multi-lingual dictionary
          </li>

          <li> <a href="https://sakhatyla.ru">SakhaTyla.Ru</a>&mdash;portal
    for the Sakha language (Yakut), providing analyzers and dictionaries
          </li>

          <li> <a href="https://www.apertium.org/index.eng.html">Apertium</a>&mdash;platform
    for some Uralic and some Turkic languages.
          </li>

          <li>Many content providers, who have granted permission to use their
    text materials&mdash;named next to the corresponding stories.
          </li>

          <li>Some icons by <a href="http://www.flaticon.com/packs/essential-collection">Madebyoliver</a> from Flaticons and
            <a href="https://thenounproject.com/term/flash-cards/4767/">Rohan Gupta</a> from the Noun Project.
          </li>

          <li>
            <a href="//responsivevoice.org/" target="_blank" title="ResponsiveVoice Text To Speech">ResponsiveVoice</a>
          used under
            <a
              rel="license"
              href="http://creativecommons.org/licenses/by-nc-nd/4.0/"
              title="Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License"
              target="_blank"
            >Non-Commercial License
            </a>
          </li>

          <li> The Revita Project is supported by the Academy of Finland.</li>

        </ul>


        <h4>Technical</h4>


        <p>
    We recommend the newest versions of: Firefox,
    Chrome/Chromium, Safari, and Internet Explorer.

          <br />

    JavaScript and cookies should be enabled in your browser.
        </p>
      </Modal.Content>
    </Modal>
  )
}
