## Refactored recommendation system

Commited by Ohjelmistotuotanto production team of spring 2023, <br>
written 27.4.2023

### Why?
The customer wanted us to simplify the usage of recommendations/encouragements and make it easier for future developers to understand and modify the system.

### What is the recommendation system?
The recommendation system is meant to encourage the user after completing certain tasks, such as completing a story, and to recommend
activities for the user to minimize the possibility of the user not knowing 
what to do next. It is a system meant to keep the user active and motivated. The actions that trigger the recommender 
to popup and its desired contents can be found in the [user state machine](https://docs.google.com/spreadsheets/d/12AvciG1IezEs_mTqYZ6iJmJl_MEebG0IV-aP5DjfJrY/edit#gid=1314736469). 

In the user state machine the column "New state" states what the user has just done. The "Condition" column
states the conditions that must be met in order different recommendations to appear. The column after that labeled
"message JSON key" states what recommendations to show if their conditions are met. This column
has the JSON key which states what the recommendation should say. Message counterparts for keys can be
found in the [localization table](https://docs.google.com/spreadsheets/d/1OVtLSEpLA6gmwS1LSRGQ1P6MwmhU1xAxOe6fsetCRZk/edit#gid=0).
The "next state" column states where the user should find themselves after clicking on the recommendation.

### What have we done?
The old encouragement system relied on six different modals called draggables, biggest of them being the 
default activity modal. These modals contained a list structure which was filled with encouragements by checking 
multiple "if" statements inside the modal. After filling the list it was pushed inside the draggable
and the draggable was returned by the component. This approach was a bit clunky. The programmer had 
to know which modal/component to call inside other components and because the recommendations inside these modals
were not components themselves, modifying them was not as simple and re-using these items required
a lot of copypaste.

The new system is much more structured. Only one component needs to be called inside other components when 
recommendations are wanted. This component, called recommender, checks with "if" statements, what is the
state of the user and returns a single draggable filled with encouragement components. The encouragement components 
themselves check if they need to render or not with "if" statements. There is a reducer in encouragementsReducer.js 
that modifies booleans called open and fcopen that keep track if the recommender
should be rendered on the screen or not. 

### Example of use
When the user has just logged in they are redirected to the welcome page. This is one of the events that should
trigger encouragements according to the user state machine, so inside Router.js (which handles page changes)
the reducer function openEncouragement() is called. In the return statement of the component that handles the rendering of
the home/welcome page needs to have the Recommender component in it. The openEncouragement() function will change the boolean "open" to true and that triggers the Recommender to
actually render in. The recommender will try to render all possible recommendation components for this event 
inside it that have been stated in the user state machine. These components will check themselves if they
meet the requirements for them to be shown to the user, if not, they will return null and will not be rendered.

### Structure
The new system is found in mobvita/client/components/newEncouragements. Inside this directory lies the main 
component Recommender.js and a directory called SubComponents. Inside SubComponents there are 
4 directories called FlashcardView, HomeView, MultiPurpose and PracticeView. Flashcard-, Home-, and PracticeView 
directories contain the recommendation components only related to those sites/views. MultiPurpose
directory contains components that are used in many views.

### Nice to know
Till this date the production version still uses the old system and the new system is hidden behind boolean flags
named TESTING_NEW_ENCOURAGEMENT in different files. Changing these to true activates the new 
system and disables the old one. In the file common.js there is also a boolean called showAllEncouragements.
This boolean is meant for development purposes and will render every recommendation
component inside the recommender, even if they dont meet their requirements to be rendered in.
In the future it could be beneficial to try to get rid of the boolean "fcopen" for clarity. It is now
used to differentiate flashcard related recommendations from the others.