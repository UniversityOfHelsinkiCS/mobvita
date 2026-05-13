/* eslint-disable no-unused-vars */
import React from 'react'
import HomeTour from './HomeTour'
import LibraryTour from './LibraryTour'
import ProgressTour from './ProgressTour'
import AnonymousProgressTour from './AnonymousProgressTour'
import PracticeTour from './PracticeTour'
import LessonsTour from './LessonsTour'

// Each tour is self-contained and renders nothing when its name is not active,
// so we mount them all and let the redux discriminator decide.
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