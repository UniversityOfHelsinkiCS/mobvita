import React, { useEffect } from 'react'
import { Modal, Form, Dropdown } from 'semantic-ui-react'

const DDLangTermsAndConditions = ({ trigger, handleChange, openModal, setOpenModal }) => {
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

  const handleDropdownChange = (e, { name, value }) => {
    handleChange(name, value)
  }

  useEffect(() => {
    if (openModal) {
      setOpenModal(true)
    }
  }, [openModal, setOpenModal])

  return (
    <Modal dimmer="inverted" closeIcon open={openModal} onClose={() => setOpenModal(false)} trigger={trigger}>
      <Modal.Header>Terms and Conditions, Privacy Policy, and Consent to Participate in Research</Modal.Header>
      <Modal.Content data-cy="tc-content">
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
        
        <Form>
          <Form.Field>
            <label>Question 1: How many years have you studied in lukio? / Kuinka monta vuotta olet opiskellut lukiossa?</label>
            <Dropdown
              placeholder='Select Year'
              fluid
              selection
              options={yearsOptions}
              name="years"
              onChange={handleDropdownChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Question 2: How many English courses have you taken so far?</label>
            <label>2a: Which obligatory English courses have you taken? Mark all that you have taken (including the one that you may be taking at the moment);  // Mitä pakollisia englannin kursseja olet suorittanut? Merkitse kaikki suorittamasi kurssit (myös se, jota ehkä parhaillaan käyt).</label>
            <Dropdown
              placeholder='Select Courses'
              fluid
              multiple
              selection
              options={obligatoryCoursesOptions}
              name="obligatoryCourses"
              onChange={handleDropdownChange}
            />
          </Form.Field>
          <Form.Field>
            <label>2b: Which optional English courses have you taken? Mark all that you have taken (including the one that you may be taking at the moment) // Mitä valinnaisia englannin kursseja olet suorittanut? Merkitse kaikki suorittamasi kurssit (myös se, jota ehkä parhaillaan käyt)</label>
            <Dropdown
              placeholder='Select Courses'
              fluid
              multiple
              selection
              options={optionalCoursesOptions}
              name="optionalCourses"
              onChange={handleDropdownChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Question 3: What is your latest course grade in English? // Mikä on viimeisin englannin kurssiarvosanasi?</label>
            <Dropdown
              placeholder='Select Grade'
              fluid
              selection
              options={gradesOptions}
              name="grade"
              onChange={handleDropdownChange}
            />
          </Form.Field>
        </Form>
      </Modal.Content>
    </Modal>
  )
}

export default DDLangTermsAndConditions
