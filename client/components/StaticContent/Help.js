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


  if (lang === 'Italian' || lang === 'it') {
     return (
            <div className="cont auto">
              <Segment>
                <b>Funzione di Revita:</b>
                <ul>
                  <li>
                    Revita ti aiuta ad imparare una nuova lingua facendoti esercitare sulle storie di cui sei interessato
                  </li>
                </ul>

                <b>Come:</b>
                <ul>
                  <li>
                    Puoi esercitarti con qualsiasi testo di tua scelta, che dovrai caricare, o esercitandoti da alcuni testi campione che abbiamo caricato noi per tutti.
                  </li>
                </ul>

                <hr />
                <b>Tutorial di Introduzione:</b>

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
                <b>Aggiungi i tuoi testi:</b>
                <ul>
                  <li>
                    Puoi aggiungere un testo -- qualsiasi testo -- nel sistema nei seguenti modi:
                    <ul>
                      <li>dato un link ad una pagina web di cui sei interessato</li>
                      <li>
                        dato un file di testo &mdash; <tt>.txt</tt> or <tt>.docx</tt>
                      </li>
                      <li>copiando e incollando del testo nella sezione apposita</li>
                    </ul>
                  </li>

                  <li>
                    Carica i testi che più di interessano -- testi con i quali pensi di imparare piacevolmente.
                  </li>

                  <li>
                    Revita genera automaticamente esercizi basati sulla storia scelta da te.
                  </li>
                </ul>

                <b>Revita crea esercizi basati sulla tua storia:</b>
                <ul>
                  <li>
                    Puoi scegliere di iniziare leggendo la storia o di esercitarti cliccando direttamente su <i>Esercitati</i>.
                  </li>

                  <li>
                    Revita nasconde alcune parole nella storia e ti fornisce alcuni indizi su queste parole
                    &mdash; i fornisce la forma &quot;base&quot; (che si trova solitamente nei dizionari).

                  </li>

                  <li>
                    L’obiettivo dello studente è quello di inserire la forma corretta della parola, basandola sul
                    <i> contesto</i> della storia.
                  </li>

                  <li>
                    Dopo aver risposto agli esericizi, il sistema fornisce <i> feedback immediati</i> &mdash; quali risposte
                    sono corrette e quali sono errate.
                    <br />
                    Per ogni risposta corretta viene assegnato un <i>punteggio</i> basta sul "Elo rating system", per ogni risposta errata,
                    il punteggio diminuirà.
                    <br />
                    <i>Elo rating system</i> (Idea di Base): Il punteggio finale dipende dal tuo livello e dalla difficoltà dell'esercizio.
                    Se il livello dell'esercizio è più difficile del tuo livello guadagnerai più punti per ogni risposta corretta e perderai meno punti per ogni risposta errata.
                  </li>

                  <li>
                    Clicca su qualsiasi <i>parola che non conosci</i> &mdash; per vedere la sua definizione nel dizionario.
                  </li>

                  <li>
                    Per alcune lingue, Revita potrà <i>pronunciare</i> la parola. (Clicca sul simbolo dello speaker
                    nella sezione del dizionario.)
                  </li>

                  <li>
                    Tutte le parole sconosciute verranno aggiunte al tuo mazzo di  <i>flashcards</i>.
                    <br />
                    Allenati sulle tue flashcards &mdash; per migliorare il tuo vocabolario.
                  </li>

                  <li>
                    Puoi allenarti sulla stessa storia diverse volte: ogni volta gli esercizi saranno nuovi e diversi &mdash; questi vengono creati ogni volta automaticamente.
                  </li>

                  <li>
                  Il sistema tiene traccia delle tue risposte agli esercizi, flashcards, ecc.. &mdash; Dalle tue risposte,
                    il sistema impara ad offrirti gli esercizi che meglio si adattano al tuo livello &mdash; Revita cerca di evitare esercizi su concetti
                     che hai imparato correttamente, o che sono troppo difficili per il tuo livello attuale.
                  </li>

                  <li>
                    Più ti alleni, più impari &mdash; e meglio Revita può adattarsi al tuo livello, creando esercizi che meglio si addicono al tuo livello.
                  </li>
                </ul>

                <b>Registrazione:</b>
                <ul>
                  <li>
                    Revita può essere utilizzato in modalità "Ospite", senza alcuna registrazione. Un ospite può utilizzare
                     qualsiasi lingua, accedere a tutte le storie pubbliche, e fare esercizi.
                  </li>

                  <li>
                    La registrazione &mdash; che è assolutamente gratuita &mdash; ti permette di utilizzare funzionalità aggiuntive:
                    <ul>
                      <li>
                        <b>I tuoi contenuti</b>: tu puoi caricare le tue storie preferite nella tua raccolta personale.
                        <br />
                        Le storie private non sono visibili dagli altri utenti &mdash; ma puoi condividere le tue storie con i tuoi
                        <i> amici</i>
                      </li>

                      <li>
                        <b>Personalizzazione</b>: Le risposte dello studente aiutano il sistema ad offrire i gli esercizi
                        che meglio si adattano al livello dello studente.
                      </li>
                    </ul>
                  </li>
                </ul>

                <b>Interazioni:</b>
                <ul>
                  <li>Un insegnante può condividere storie con un gruppo di studenti.</li>
                </ul>

                <h4>Informazioni Tecniche</h4>
                <p>
                  Raccomandiamo l'utilizzo le ultime versioni dei seguenti browsers: Firefox, Chrome/Chromium, Safari.
                  (Internet Explorer non è al momento supportato.)
                  <br />
                  Devono inoltre essere abilitati JavaScript e cookies nel tuo browser.
                </p>
              </Segment>
            </div>
          )
        }

  else {
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
                The student has to produce the correct form of the word, based on its <i> context </i> in the story.

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
}
export default Help
