/* eslint-disable no-unused-vars */
import React from 'react'
import HomeTour from './HomeTour'
import LibraryTour from './LibraryTour'
import ProgressTour from './ProgressTour'
import AnonymousProgressTour from './AnonymousProgressTour'
import PracticeTour from './PracticeTour'
import LessonsTour from './LessonsTour'

// Root tour dispatcher mounted once near the app root. Each per-tour
// component renders null when not active, so the active tour is chosen
// entirely through `state.tour.name`.
const Tour = () => (
  <>
    <HomeTour />
    <LibraryTour />
    <ProgressTour />
    <AnonymousProgressTour />
    <PracticeTour />
    <LessonsTour />
  </>
)

export default Tour