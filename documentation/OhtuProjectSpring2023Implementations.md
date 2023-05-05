## Ohtu project spring 2023 implementations

The implementations made during the course Ohjelmistotuotantoprojekti (Software development project) of University of Helsinki are listed here. 
The student group of seven were working with the Revita frontend from Januray to May in 2023.

### Tours

Home page contained a tour explaining shortly actions in the home page and around the platform. Besides improving the home page tour some new tours were implemented in several pages:
- Library
- Lessons
- Practice
- Progress

When a new user enters a page with an implemented tour for the first time, the tour is shown automatically. 
Later on the tours can be revisited from a direction icon in the navigation bar.

#### Undone practice tour tasks

There were two tasks related to the practice tour that we were not able to implement. First was to modify the step pointing to the translation box in the preview page - in a way that the translation box would have a translation for some word from the text. This would have required a simulation of clicking a word. The problem with this was that we didn’t have any way of finding a word with guaranteed translation from the text. For example, choosing the first word from the text would not always work because the word might be a proper noun. Also, because the tour works in any text and any language, we couldn’t choose the word beforehand.  

The other task that was left undone was about the practice mode tour step that points to an exercise and tells that by clicking the exercise, user can see a hint. The wish was to get the hint box showing in the tour step. To activate the hint box, it needs information about the word so just clicking the first exercise box would not work without knowing first which word is in it. Because the tour can be asked in any story and the exercises are generated differently each time, we did not find any way we could determine which word the tour should click. 

We thought about an option for these steps, so that the tour would ask the user to click a word or an exercise and after clicking and seeing the translation or the hint box, the tour would continue. We then thought this would be too different from the usual style the tours work, so we ditched this idea.  

Currently the tour just points the first exercise box in practice and the step tells that by clicking this you can see a hint box and in preview mode the tour point to the translation box and tells that by clicking any word you can see its translation here. 

### Encouragement refactoring

The encouragement/recommendation system was refactored in the code base. More thorough documentation can be found in the documentation folder: [Refactored recommendation system](https://github.com/UniversityOfHelsinkiCS/mobvita/blob/master/documentation/NewRecommendationSystem.md).

### Profile page

This page is used to communicate information about the user to themselves.
Since there is a lot of infomation disaplyed in this view, a lot of it should be conveyed concisely to avoid further cluttering.

Some of the components that make up the profile page have been reused from other parts of the app.
However, there are some functionalities that are only available on the profile page.
These are:
 - the medals
 - xp bar
 - following and blocking users

Two components have been migrated here from other views:
1. The component for displaying medals
2. The component for social interaction, like following and blocking users

### Daily streak

An information system for daily streak was implemented in the frontend. User can maintain their daily streak by doing 10 story snippets or 20 flashcards. After finishing the required tasks, a toaster telling about accomplished streak appears. The state of user's streak can be found in several places:
- Elo chart in the home page (a flame symbol and number of streaked days)
- Encouragement pop up in the home page
- Profile page

Profile page and encouragement pop up also contain information of how to continue or start streaking.

### XP and levels

An information system for user's experience points (XP) and level was implementend in the frontend. 
User can gain XP from doing exercises in the app and leveling up after gaining enough XP. 
User's current level and how much XP is needed for the next level are visible in the profile page. 
Upon leveling up the user should be notified via a pop-up toaster, though this is not dunctional at the moment.
The toaster should pop up when the server responds with a level_up field where the value is true.
However, the level_up field never returns a true-value and therefore the toaster never activates.

The complete xp required for each level is :

Level = floor((25+sqrt(625+100*XP)) / 50), so that

Level 1 @ 0 points

Level 2 @ 50 points

Level 3 @ 150 points etc.

and therefore XP required for next level is:

XpToNextLevel = (((currentLevel + 1) * 50 - 25) ** 2 - 625) / 100

### Charts

We added two charts to the progress page on the timeline page. Both of them are displayed on the progress page for users own page and their teachers can also see these charts in the groups analytics page.

A chart for displaying the user's total XP as a timeline has been added. 

Also a chart displaying student's hours spent in a week has been added to the same page. The chart shows the hours spent in a week, even though the calendar is limited by days. There were many problems with implimenting it, but right now it shows the week number and the year like 52/2023, because when it was only weeks the chart didn't work when the timeline included more than one years.

Both of these charts are done by React Highcharts.


### Cypress tests 

There are problems with the tests, mainly due to the timeout. 
We tried to fix the problem by making changes to action.yaml. 
However, we didn't come up with a solution where the tests would pass every time on the first try.
