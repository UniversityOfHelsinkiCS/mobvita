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

### Encouragement refactoring

The encouragement/recommendation system was refactored in the code base. More thorough documentation can be found in the documentation folder: [Refactored recommendation system](https://github.com/UniversityOfHelsinkiCS/mobvita/blob/master/documentation/NewRecommendationSystem.md).

### Profile page

Some of the components that make up the profile page have been reused from other parts of the app.
However, there are some functionalities that are only available on the profile page.
These are:
 - the medals
 - xp bar
 - following and blocking users

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
Upon leveling up the user is notified via a pop-up toaster.

### Charts

A chart for displaying the user's total xp has been added. 
This component is displayed both on the progress page as well as the groups page.

### Cypress tests 

There are problems with the tests, mainly due to the timeout. 
We tried to fix the problem by making changes to action.yaml. 
However, we didn't come up with a solution where the tests would pass every time on the first try.
