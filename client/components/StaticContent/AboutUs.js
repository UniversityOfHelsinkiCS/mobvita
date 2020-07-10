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
      <Modal.Content data-cy="about-content">
        <p>
          <b><i>Revita</i></b> provides tools for language learning and for supporting endangered languages.<br/>
          <b><i>Revita</i></b> stimulates the student to practice <b>actively producing</b> language, rather than <b>passively absorbing</b> rules.
        </p>

        <h4>Main features</h4>
        <ul>
          <li>Students practice with arbitrary authentic content, through a variety of <b>exercise modes:</b></li>
          <ul>
          <li>fill-in-the-blank quizzes</li>
          <li>multiple-choice quizzes</li>
          <li>flashcards: vocabulary practice</li>
          <li>listening comprehension quizzes</li>
          <li>and more...</li>
          </ul>
          <li>
            <b><i>Revita</i></b> is for students at the <b>intermediate to advanced</b> levels
          &mdash;i.e., it is not for absolute beginners, just starting to learn a language.
          </li>
          <li>
            The system <b>tracks the progress</b> of the student, and tries to adapt to the student's present skills.<br/>
            The student's previous answers help the system to offer exercises that are best suited for the <b>student's level</b>.
          </li>
        </ul>
          <b><i>Revita</i></b> helps students by <i>learning from stories</i>.
          The story can be <b>any</b> text, which the students choose themselves.<br/>
          <b><i>Revita</i></b> offers a small "public library" of stories in your chosen language, 
          which cover various topics at various levels of difficulty.<br/>
          <b><i>Revita</i></b> can be used in "guest" mode, without registration. 
          A guest can use any language, view public stories, and do exercises.<br/>
        Registering&mdash;which is free&mdash;enables additional important features:
        <ul>
          <li>
            <b>Own content</b>: you can upload any story you like to in your own
            private library.<br/>
            Your private stories are not visible to other users&mdash;but you can
            share your stories with <i>friends</i>!<br/>
            Stories can be uploaded from any web page, or from a text file.
          </li>
          <li>
            <b>Personalization</b>: the system analyzes the results from your past exercises
            to better adapt future exercises to your skills.
          </li>
        </ul>
        <h4>Collaborators and Credits</h4>
        <b><i>Revita</i></b> builds upon many tools and resources developed by other projects and international colleagues:

        <ul>
          <li>
            Collaboration with the TOSKA Software Engineering and Web Development Team, led by Dr <a href="https://www.helsinki.fi/fi/ihmiset/henkilohaku/matti-luukkainen-9021313">Matti Luukkainen</a>, University of Helsinki: Gert Adamson, Atte Haarni, Marko Koskinen, Jami Kousa, Tero Tapio. 
          </li>
         
          <li>
            Collaboration with the research group at the University of Milan led by Dr <a href="https://www.unimi.it/it/ugov/person/nataliya-stoyanova">Nataliya Stoyanova</a>, and the research group at the University of Helsinki led by Dr <a href="https://www.helsinki.fi/fi/ihmiset/henkilohaku/mikhail-kopotev-9066584">Mihail Kopotev</a>, to develop components dedicated to supporting language learning generally, and for Russian specifically.<br/>
            The goal is to <i>assess the skills</i> of learners quickly and accurately, based on patterns of mistakes, 
            and to relate them to a <i>natural order</i> of acquisition of skills, written and oral, based on significant numbers of L2 learners&mdash;thousands of university students.
          <br/>
            For oral skills, the research unit is developing new modules to automatically analyze the students' ability to process spontaneous L1 speech.
            This will allow us to test hypotheses about the mechanisms for processing of audio input by learners, and to create a system of exercises to train this ability by following a personalized path for each student.
          </li>

          <li>
          Dr <a href="https://www.helsinki.fi/en/people/people-finder/lari-kotilainen-9011714">Lari Kotilainen</a>, University of Helsinki: development of learning support for Finnish.
          </li>

          <li>The <a href="http://giellatekno.uit.no/index.eng.html">GiellaTekno</a> platform: language technology for the Uralic languages, and endangered languages from other language families.
          </li>

          <li>
            The <a href="https://www.apertium.org/index.eng.html">Apertium</a> platform for languages from the Uralic, Turkic and other language families.
          </li>

          <li>
          <a href="https://code.google.com/archive/p/morphisto/">Morphisto
          </a>&mdash;the German morphological analyzer.
          </li>

          <li>
            CrosslatorTagger for Russian, by Professor <a href="https://www.hse.ru/en/staff/klyshinsky">Eduard Klyshinskiy
      </a>, Higher School of Economics, Moscow.
          <br/>
            For Uralic and Turkic languages, CrosslatorTagger is used to detect code-switching to Russian in authentic texts.
          </li>

          <li> <a href="https://sakhatyla.ru">SakhaTyla.Ru</a>&mdash;portal for the Sakha (Yakut) language, providing analyzers and dictionaries.
          </li>

          <li>
            Content providers, who have granted us permission to use their materials&mdash;information attached to the respective stories.
          </li>

          <li>
            <a href="//responsivevoice.org/" target="_blank" title="ResponsiveVoice Text To Speech">ResponsiveVoice</a> used under <a
              rel="license"
              href="http://creativecommons.org/licenses/by-nc-nd/4.0/"
              title="Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License"
              target="_blank"
            >Non-Commercial License</a>.
          </li>

          <li>
            <a href="https://github.com/reynoldsnlp/udar">Stress libraries (Rus) </a>
            by Rob Reynolds, Assistant Research Professor, Brigham Young University, Utah.
          </li>

          <li>
            Icons by <a href="http://www.flaticon.com/packs/essential-collection">Madebyoliver</a> from Flaticons and <a href="https://thenounproject.com/term/flash-cards/4767/">Rohan Gupta</a> from the Noun Project.
          </li>

          <li>
            Revita Team: Javad Nouri, Kim Salmi, Jue Hou, José María Hoya Quecedo, Anisia Katinskaia, Max Koppatz, Sardana Ivanova, Giacomo Furlan, Vu Duc-Ahn,
            led by Associate Professor <a href="https://www.helsinki.fi/en/ineq-helsinki-inequality-initiative/people#section-77365">Roman Yangarber</a>.
            <br/>
            The Revita Project is supported by the Academy of Finland. 
          </li>

        </ul>

      And many other collaborators.

      </Modal.Content>
    </Modal>
  )
}
