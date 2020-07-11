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
          <b><i>Revita</i></b> is a new approach to language learning:
          for learning a foreign language, and for supporting endangered languages.
        </p>


        <h3>Main features:</h3>

        <ul>
          <li>
            Revita is for students at the <b>intermediate to advanced</b> levels
            &mdash; i.e., not for absolute beginners just starting to learn a language.
          </li>

          <li>
            <b>Learning from stories:</b> Revita lets students learn from arbitrary content &mdash; <i>any</i> authentic text, which students choose themselves.

          <br/>
            Revita offers a small "public library" of sample stories in each language, 
            which cover various topics and levels of difficulty.
          </li>

          <li>
          <b>Active competency:</b> Revita stimulates the student to <i>actively produce</i> language, rather than passively absorb rules.

          <br/>
            Revita creates exercises for practice:
            <ul>
            <li>fill-in-the-blank quizzes</li>
            <li>multiple-choice quizzes</li>
            <li>listening comprehension quizzes</li>
            <li>flashcards: vocabulary practice</li>
            <li>and more...</li>
            </ul>
          </li>

          <li>
            <b>Personalization</b>: The system <i>tracks the progress</i> of the student, 
            analyzes the results from past exercises,
            and tries to <i>adapt</i> future exercises to the student's skills.
          </li>

        </ul>



        <h3>Collaborators and Credits:</h3>

        <b><i>Revita</i></b> builds upon many tools and resources developed by international colleagues and other projects:

        <ul>
          <li>
            Collaboration with the TOSKA Software Engineering and Web Development Team, led by Dr <a href="https://www.helsinki.fi/fi/ihmiset/henkilohaku/matti-luukkainen-9021313">Matti Luukkainen</a>, University of Helsinki: Gert Adamson, Atte Haarni, Marko Koskinen, Jami Kousa, Tero Tapio. 
          </li>
         
          <li>
            Collaboration with the research group at University of Milan led by Dr <a href="https://www.unimi.it/it/ugov/person/nataliya-stoyanova">Nataliya Stoyanova</a>, and the research group at University of Helsinki led by Dr <a href="https://www.helsinki.fi/fi/ihmiset/henkilohaku/mikhail-kopotev-9066584">Mihail Kopotev</a>.  Developing components for supporting language learning in general, and for Russian in particular.<br/>
            The goals are: to <i>assess</i> the written and oral skills of learners quickly and accurately, based on patterns of mistakes,
            and to relate them to a <i>natural order</i> of acquisition of skills, based on significant numbers of L2 learners&mdash;thousands of university students.
          <br/>
            For oral skills, the research unit is developing new modules to analyze the students' ability to process spontaneous speech.
            This will allow us to test hypotheses about the mechanisms for processing of audio input by learners, and to create a system to train this ability by following a personalized path for each student.
          </li>

          <li>
          Dr <a href="https://www.helsinki.fi/en/people/people-finder/lari-kotilainen-9011714">Lari Kotilainen</a>, University of Helsinki: development of learning support for Finnish.
          </li>

          <li>The <a href="http://giellatekno.uit.no/index.eng.html">GiellaTekno</a> platform: language technology for Uralic languages, and endangered languages from other language families.
          </li>

          <li>
            The <a href="https://wiki.apertium.org/wiki/Main_Page">Apertium</a> platform for languages from the Uralic, Turkic and other language families.
          </li>

          <li>
          <a href="https://code.google.com/archive/p/morphisto/">Morphisto
          </a>&mdash;the German morphological analyzer.
          </li>

          <li>
            CrosslatorTagger for Russian, by Professor <a href="https://www.hse.ru/en/staff/klyshinsky">Eduard Klyshinskiy
      </a>, Higher School of Economics, Moscow.
          <br/>
            For learning Uralic and Turkic languages, CrosslatorTagger is used to detect code-switching into Russian in authentic texts.
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
            <a href="https://github.com/reynoldsnlp/udar">Stress library</a> (Russian)
            by Rob Reynolds, Assistant Research Professor, Brigham Young University, Utah.
          </li>

          <li>
            Icons by <a href="http://www.flaticon.com/packs/essential-collection">Madebyoliver</a> from Flaticons and <a href="https://thenounproject.com/term/flash-cards/4767/">Rohan Gupta</a> from the Noun Project.
          </li>

          <li>
            Revita Team: Javad Nouri, Anisia Katinskaia, Kim Salmi, José María Hoya Quecedo, Jue Hou, Max Koppatz, Sardana Ivanova, Giacomo Furlan, Vu Duc-Ahn,
            led by Associate Professor <a href="https://www.helsinki.fi/en/ineq-helsinki-inequality-initiative/people#section-77365">Roman Yangarber</a>.
          </li>

        </ul>

        And many other collaborators.
        <br/>
        <br/>


        The <b><i>Revita Project</i></b> is supported by:
        <ul>
          <li>
            The Academy of Finland, Research Council for Culture and Society (Grant 267097)
          </li>

          <li>
            Opetushallitus: The Finnish National Agency for Education  
            (Grant OPH-1443-2020, TM-18-10846)
          </li>

          <li>
            CIMO: Center for International Mobility
            (Grant TM-16-10082)
          </li>

          <li>
            HIIT: Helsinki Institute for Information Technology
          </li>

          <li>
            University of Pisa, Italy: ErasmusPlus Programme of the European Commission
          </li>

          <li>
            Tulevaisuus Rahasto 2020: Future Development Fund, Faculty of Arts, University of Helsinki
          </li>
        </ul>


        <br/>

      </Modal.Content>
    </Modal>
  )
}
