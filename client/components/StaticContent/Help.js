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


    const HelpEnglish = (
        <div className="cont auto">
          <Segment>
            <b>Revita:</b>
            <ul>
              <li>
                Helps you learn languages by doing exercises based on stories that you find interesting.
              </li>
            </ul>

            <b>How:</b>
            <ul>
              <li>
                You can practice with <u>any text</u> of your choice &mdash;
                which you upload yourself, 
                or from a library of sample texts that we have made available for everyone.
              </li>
            </ul>

            <hr />
            <b>Short introduction:</b>

            <br />
            <br />

            <div className="iframe-container">
              <iframe
                title="Introduction Tutorial"
                className="iframe"
                src={videoUrl}
                webkitallowfullscreen
                mozallowfullscreen
                allowFullScreen
              />
            </div>
            <hr />

            <hr />
            <b>Add your own favorite content:</b>
            <ul>
              <li>
                You can upload a text &mdash; <u>any text</u> &mdash; into your library:
                <ul>
                  <li>give a link to a Web page with text you are interested in</li>
                  <li>
                    or in a text file &mdash; <tt>.txt</tt> or <tt>.docx</tt>
                  </li>
                  <li>or copy/paste into the text box.</li>
                </ul>
              </li>

              <li>
                Upload texts that interest you &mdash; with which you will enjoy practicing.
              </li>

              <li>
                <b>Revita</b> automatically generates many exercises based on
                your chosen story.
              </li>
            </ul>

            <b>Revita exercises based on your story:</b>
            <ul>
              <li>
                You can begin by reading the story, or by going directly to <i>practice</i>.
              </li>

              <li>
                While working with a story, you can click on any <b>unfamiliar word</b> &mdash; to see its definition in a dictionary.
              </li>

              <li>
                All unfamiliar words are added to your deck of <b>flashcards</b>.
                <br />
                You can practice with your flashcards &mdash; to improve your vocabulary.
              </li>

              <li>
                <b>Practice mode</b>: Revita hides some of the words in the story,
                and gives you hints about each hidden word
                &mdash; its &quot;base&quot; form (as in a dictionary).
              </li>

              <li>
                The student should <b>produce the correct form</b> of the word, based on the context in the story.
              </li>

              <li>
                After you answer each exercise, Revita gives <i>immediate feedback</i> 
                &mdash; it tells which answers were correct, 
               and gives <b>additional hints</b> for incorrect answers, so you can try again.
                <br />
                For every correct answer you receive <i>points</i> on your Elo score
                &mdash; for incorrect answers you lose points.
              </li>

              <li>
                For many languages, Revita also <i>pronounces</i> the words. 
                (Click the speaker icon in the Dictionary Box.)
              </li>

              <li>
                You can practice with each story many times: 
                every time the exercises will be new and different &mdash; 
                since they are created automatically.
              </li>

              <li>
                Revita keeps track of your answers to exercises, flashcards, etc. &mdash;
                from your answers it learns to offer you exercises that 
                better suit your level &mdash; 
                it tries to avoid asking questions that you have already mastered, 
                or which would be too difficult for you at present.
              </li>

              <li>
                The more you practice, the faster you advance &mdash; 
                and the better Revita can adapt to your level,
                and create exercises better suited for you.
              </li>
            </ul>


            <b>Registration:</b>
            <ul>
              <li>
                Revita can be used in "<i>guest</i>" mode, without registration. 
                A guest can use any language, view all public stories, and do exercises.
              </li>

              <li>
                Registering &mdash; which is free &mdash; enables additional features:
                <ul>
                  <li>
                    <b>Own content</b>: 
                    you can upload stories you like to your own private library.
                    <br />
                    Your private stories are not visible to any other users
                    (but you can share your stories with <i>friends</i>.)
                  </li>

                  <li>
                    <b>Progress tracking</b>:
                    You can review your performance and scores, 
                    to track how your skills improve over time.
                  </li>

                  <li>
                    <b>Personalization</b>:
                    The student's previous answers help the system to offer exercises
                    that are best suited for the student's current level.
                  </li>
                </ul>
              </li>
            </ul>

            <b>Support for Teachers:</b>
            <ul>
            <li>A teacher can create a group of students.</li>
            <li>The teacher can share stories with a group &mdash; in the group's library.</li>
            <li>The teacher can specify the learning settings for the entire group.</li>
            <li>The teacher can review the progress of the entire group, 
                  and of individual students in the group.</li>
            </ul>

            <b>Contact us:</b>
            <ul>
              <li>Please contact us with any questions or comments!! 
                  You can find the "Contact" button on the Sidebar.
              </li>
            </ul>


            <h4>Technical</h4>
            <p>
              We recommend the newest versions of these browsers: 
              <ul>
                 <li>Firefox,</li>
                 <li>Chrome/Chromium,</li>
                 <li>Safari.</li>
                 <li>(Internet Explorer not currently supported.)</li>
              </ul>
              <br />
              JavaScript and cookies should be <i>enabled</i> in your browser.
            </p>
          </Segment>
        </div>
      )


    const HelpItalian = (
             <div className="cont auto">
                     <Segment>
                       <b>Revita:</b>
                       <ul>
                         <li>
                           Revita ti aiuta ad imparare una nuova lingua facendoti esercitare sulle storie di cui sei interessato.
                         </li>
                       </ul>

                       <b>How:</b>
                       <ul>
                         <li>
                            Puoi esercitarti con <u>qualsiasi testo</u> di tua scelta &mdash; che dovrai caricare, o esercitandoti da alcuni testi campione che abbiamo caricato noi per tutti.
                         </li>
                       </ul>

                       <hr />
                       <b>Breve Introduzione:</b>

                       <br />
                       <br />

                       <div className="iframe-container">
                         <iframe
                           title="Introduction Tutorial"
                           className="iframe"
                           src={videoUrl}
                           webkitallowfullscreen
                           mozallowfullscreen
                           allowFullScreen
                         />
                       </div>
                       <hr />

                       <hr />
                       <b>Aggiungi i tuoi testi preferiti:</b>
                       <ul>
                         <li>
                           Puoi aggiungere un testo &mdash; <u>qualsiasi testo</u> &mdash; nella tua raccolta nei seguenti modi:
                           <ul>
                             <li>dato un link ad una pagina web di cui sei interessato</li>
                             <li>
                               dato un file di testo &mdash; <tt>.txt</tt> or <tt>.docx</tt>
                             </li>
                             <li>copiando e incollando del testo nella sezione apposita.</li>
                           </ul>
                         </li>

                         <li>
                           Carica i testi che più di interessano &mdash; testi con i quali pensi di imparare piacevolmente.
                         </li>

                         <li>
                          <b>Revita</b> genera automaticamente esercizi basati sulla storia scelta da te.
                         </li>
                       </ul>

                       <b>Revita crea esercizi basati sulla tua storia:</b>
                       <ul>
                         <li>
                           Puoi scegliere di iniziare leggendo la storia o di esercitarti cliccando direttamente su <i>Esercitati</i>.
                         </li>

                         <li>
                           Mentre ti stai esercitando su una storia, puoi cliccare su qualsiasi <b>parola sconosciuta</b> &mdash; per vedere la sua definizione nel dizionario.
                         </li>

                         <li>
                           Tutte le parole a te sconosciute verranno aggiunte al tuo mazzo di <b>flashcards</b>.
                           <br />
                           Puoi allenarti con le flashcards &mdash; per migliorare il tuo vocabolario.
                         </li>

                         <li>
                           <b>Modalità Esercitazione</b>: Revita nasconde alcune parole nella storia e ti fornisce alcuni indizi su queste parole
                                                                     &mdash; i fornisce la forma &quot;base&quot; (che si trova solitamente nei dizionari).
                         </li>

                         <li>
                           L’obiettivo dello studente è quello di inserire la <b> forma corretta </b> della parola, basandola sul
                                                                                                                                        <i> contesto</i> della storia.
                         </li>

                         <li>
                           Dopo aver risposto agli esericizi, il sistema fornisce <i> feedback immediati</i> &mdash; quali risposte
                                               sono corrette e fornisce dei <b>suggerimenti aggiuntivi</b> per quelle errate, permettendoti di ritentare.
                           <br />
                           Per ogni risposta corretta viene assegnato un <i>punteggio</i> basta sul "Elo rating system", per ogni risposta errata,
                                               il punteggio diminuirà.
                         </li>

                         <li>
                           er alcune lingue, Revita potrà <i>pronunciare</i> la parola. (Clicca sul simbolo dello speaker
                                               nella sezione del dizionario.)
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
                               Le storie private non sono visibili dagli altri utenti. ( ma puoi condividere le tue storie con i tuoi
                                                       <i> amici</i>)
                             </li>

                             <li>
                               <b>Tracciamento dei Progressi</b>:
                               Puoi osservare le tue performance e i tuoi punteggi,
                               per tenere traccia dei tuoi miglioramenti nel tempo.
                             </li>

                             <li>
                               <b>Personalizzazione</b>:
                               Le risposte dello studente aiutano il sistema ad offrire i gli esercizi
                                                       che meglio si adattano al livello dello studente.
                             </li>
                           </ul>
                         </li>
                       </ul>

                       <b>Supporto per gli Insegnanti:</b>
                       <ul>
                       <li>Un insegnante può creare un gruppo di studenti.</li>
                       <li>Un insegnante può condividere storie con un gruppo &mdash; nella Libreria del gruppo.</li>
                       <li>Un insegnante può specificare le impostazioni di apprendimento di un gruppo.</li>
                       <li>Un insegnante può controllare il progresso dell'intero gruppo,
                             e i progressi individuali di ogni studente nel gruppo.</li>
                       </ul>

                       <b>Contattaci:</b>
                       <ul>
                         <li>Per qualsiasi domanda o commento ti preghiamo di contattarci!
                             Puoiu trovare il pulsante "Contatti" nel menu a comparsa.
                         </li>
                       </ul>
                       <h4>Informazioni Tecniche</h4>
                       <p>
                         Raccomandiamo l'utilizzo le ultime versioni dei seguenti browsers:
                         <ul>
                            <li>Firefox,</li>
                            <li>Chrome/Chromium,</li>
                            <li>Safari.</li>
                            <li>(Internet Explorer non è al momento supportato.)</li>
                         </ul>
                         <br />
                          Devono inoltre essere<i> abilitati</i> JavaScript e cookies nel tuo browser.
                       </p>
                     </Segment>
                   </div>
          )

  if (lang === 'Italian' || lang === 'it') 
     {return HelpItalian}
  else 
     {return HelpEnglish}

}
export default Help
