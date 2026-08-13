import React, { useState, useEffect } from 'react'
import { Box, MenuItem, Select } from '@mui/material'
import AppButton from 'Components/AppButton'
import AppDialog from 'Components/ui/AppDialog'
import AppSelect from 'Components/ui/AppSelect'
import Draggable from 'react-draggable'
import { useDispatch } from 'react-redux'  // Import useDispatch
import { 
  ddlang_years,
  ddlang_obligatoryCourses,
  ddlang_optionalCourses,
  ddlang_grade
} from 'Utilities/redux/userReducer'

const DDLangTermsAndConditions = ({ openModal, setOpenModal }) => {
  const dispatch = useDispatch()  // Define dispatch
  
  const yearsOptions = [
    { key: '1', text: 'this is my first year / tämä on ensimmäinen vuoteni', value: 'first' },
    { key: '2', text: 'this is my second year / tämä on toinen vuoteni', value: 'second' },
    { key: '3', text: 'this is my third year / tämä on kolmas vuoteni', value: 'third' },
    { key: '4', text: 'this is my fourth (or more) year / tämä on neljäs (tai useampi) vuoteni', value: 'fourth' },
  ]

  const obligatoryCoursesOptions = [
    { key: 'ENA1', text: 'ENA1', value: 'ENA1' },
    { key: 'ENA2', text: 'ENA2', value: 'ENA2' },
    { key: 'ENA3', text: 'ENA3', value: 'ENA3' },
    { key: 'ENA4', text: 'ENA4', value: 'ENA4' },
    { key: 'ENA5', text: 'ENA5', value: 'ENA5' },
    { key: 'ENA6', text: 'ENA6', value: 'ENA6' },
  ]

  const optionalCoursesOptions = [
    { key: 'ENA7', text: 'ENA7', value: 'ENA7' },
    { key: 'ENA8', text: 'ENA8', value: 'ENA8' },
  ]

  const gradesOptions = [
    { key: '10', text: '10', value: '10' },
    { key: '9', text: '9', value: '9' },
    { key: '8', text: '8', value: '8' },
    { key: '7', text: '7', value: '7' },
    { key: '6', text: '6', value: '6' },
    { key: '5', text: '5', value: '5' },
    { key: '4', text: '4', value: '4' },
  ]

  const [formData, setFormData] = useState({
    selectedYear: '',
    selectedObligatoryCourses: [],
    selectedOptionalCourses: [],
    selectedGrade: ''
  })

  const isFormValid = () => {
    return (
      formData.selectedYear !== '' &&
      formData.selectedObligatoryCourses.length > 0 &&
      formData.selectedOptionalCourses.length > 0 &&
      formData.selectedGrade !== ''
    )
  }

  const handleDropdownChange = (e, { name, value }) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    const { selectedYear, selectedObligatoryCourses, selectedOptionalCourses, selectedGrade } = formData
    dispatch(ddlang_years(selectedYear))  // Dispatch the action
    dispatch(ddlang_obligatoryCourses(selectedObligatoryCourses))  // Dispatch the action
    dispatch(ddlang_optionalCourses(selectedOptionalCourses))  // Dispatch the action
    dispatch(ddlang_grade(selectedGrade))  // Dispatch the action
    setOpenModal(false)
  }

  useEffect(() => {
    if (openModal) {
      setOpenModal(true)
    }
  }, [openModal, setOpenModal])

  return (
    <Draggable>
      <div>
        <AppDialog
          data-cy="ddlang-terms-dialog"
          closeDataCy="ddlang-terms-dialog-close"
          maxWidth="md"
          open={openModal}
          // Prevent closing on outside click (semantic's closeOnDimmerClick={false})
          onClose={(event, reason) => {
            if (reason !== 'backdropClick') setOpenModal(false)
          }}
          title="Terms and Conditions, Privacy Policy, and Consent to Participate in Research"
        >
          <div data-cy="tc-content">
            <h2>Consent to Participate in Research Study</h2>
            <p>
              By using the DD-LANG activities in Revita, you agree to participate in our research study. You consent to the collection and use of your data for research purposes, as outlined in the privacy notices and information about the study provided below. 
              Participation in this research is a requirement for using the DD-LANG activities in Revita. This requirement has been communicated to schools and potential participants in advance.
            </p>

            <h3>Research Study Information</h3>
            <p>
              The purpose of this study is to improve the effectiveness of language learning activities. Your participation will involve the collection of data related to your use of the DD-LANG activities, including your interaction patterns, performance metrics, and feedback.
            </p>

            <h3>Privacy and Data Protection</h3>
            <p>
              We are committed to protecting your privacy. The data collected from your use of DD-LANG activities will be used solely for research purposes and to improve our services. This data may include personally identifiable information such as your username, email address, and performance data. All data will be anonymized before any research analysis or reporting. Your data will be stored securely and will only be accessible to authorized researchers involved in this study. We will not share your personal information with any third parties without your explicit consent, except as required by law.
            </p>

            <h2>Background Questions</h2>
            <p>Before starting the exercises, we ask you to answer some background questions. // Ennen harjoitustehtävien aloittamista pyydämme sinua vastaamaan muutamaan taustakysymykseen.</p>
            
            <form
              onSubmit={e => {
                e.preventDefault()
                handleSubmit()
              }}
            >
              <Box sx={{ mt: '0.5em', mb: '1.5em' }}>
                <label>Question 1: How many years have you studied in lukio? / Kuinka monta vuotta olet opiskellut lukiossa?</label>
                <div data-cy="ddlang-year-select">
                  <AppSelect
                    placeholder='Select Year'
                    variant="contrast-outline"
                    matchTriggerWidth
                    value={formData.selectedYear}
                    options={yearsOptions.map(option => ({ value: option.value, label: option.text }))}
                    onChange={value => handleDropdownChange(null, { name: 'selectedYear', value })}
                  />
                </div>
              </Box>
              <Box sx={{ mt: '0.5em', mb: '1.5em' }}>
                <label>Question 2: How many English courses have you taken so far?</label>
                <label>2a: Which obligatory English courses have you taken? Mark all that you have taken (including the one that you may be taking at the moment);  // Mitä pakollisia englannin kursseja olet suorittanut? Merkitse kaikki suorittamasi kurssit (myös se, jota ehkä parhaillaan käyt).</label>
                <div data-cy="ddlang-obligatory-courses-select">
                  <Select
                    multiple
                    displayEmpty
                    fullWidth
                    value={formData.selectedObligatoryCourses}
                    renderValue={selected => (selected.length ? selected.join(', ') : 'Select Courses')}
                    onChange={e =>
                      handleDropdownChange(null, {
                        name: 'selectedObligatoryCourses',
                        value: e.target.value,
                      })
                    }
                  >
                    {obligatoryCoursesOptions.map(option => (
                      <MenuItem key={option.key} value={option.value}>
                        {option.text}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </Box>
              <Box sx={{ mt: '0.5em', mb: '1.5em' }}>
                <label>2b: Which optional English courses have you taken? Mark all that you have taken (including the one that you may be taking at the moment) // Mitä valinnaisia englannin kursseja olet suorittanut? Merkitse kaikki suorittamasi kurssit (myös se, jota ehkä parhaillaan käyt)</label>
                <div data-cy="ddlang-optional-courses-select">
                  <Select
                    multiple
                    displayEmpty
                    fullWidth
                    value={formData.selectedOptionalCourses}
                    renderValue={selected => (selected.length ? selected.join(', ') : 'Select Courses')}
                    onChange={e =>
                      handleDropdownChange(null, {
                        name: 'selectedOptionalCourses',
                        value: e.target.value,
                      })
                    }
                  >
                    {optionalCoursesOptions.map(option => (
                      <MenuItem key={option.key} value={option.value}>
                        {option.text}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </Box>
              <Box sx={{ mt: '0.5em', mb: '1.5em' }}>
                <label>Question 3: What is your latest course grade in English? // Mikä on viimeisin englannin kurssiarvosanasi?</label>
                <div data-cy="ddlang-grade-select">
                  <AppSelect
                    placeholder='Select Grade'
                    variant="contrast-outline"
                    matchTriggerWidth
                    value={formData.selectedGrade}
                    options={gradesOptions.map(option => ({ value: option.value, label: option.text }))}
                    onChange={value => handleDropdownChange(null, { name: 'selectedGrade', value })}
                  />
                </div>
              </Box>
              <AppButton
                type='submit'
                variant="primary"
                data-cy="ddlang-terms-submit-button"
                disabled={!isFormValid()}
              >
                Submit
              </AppButton>
            </form>
          </div>
        </AppDialog>
      </div>
    </Draggable>
  )
}

export default DDLangTermsAndConditions
