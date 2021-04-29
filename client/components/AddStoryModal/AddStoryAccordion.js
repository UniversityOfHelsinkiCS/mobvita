import React, { useState, useEffect } from 'react'
import { Accordion, Form, Menu, Input, Button } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, FormattedHTMLMessage, useIntl } from 'react-intl'
import { postStory, setCustomUpload } from 'Utilities/redux/uploadProgressReducer'
import { FormControl, Spinner } from 'react-bootstrap'
import { capitalize, learningLanguageSelector } from 'Utilities/common'
import { updateLibrarySelect } from 'Utilities/redux/userReducer'
import useWindowDimensions from 'Utilities/windowDimensions'
import RecommendedSites from '../LibraryView/RecommendedSites'

const AddStoryAccordion = ({ setLibraries }) => {
  const [accordionState, setAccordionState] = useState(0)

  const intl = useIntl()
  const dispatch = useDispatch()
  const smallWindow = useWindowDimensions().width < 500

  const handleClick = (e, titleProps) => {
    const { index } = titleProps
    const newIndex = accordionState === index ? -1 : index
    setAccordionState(newIndex)
  }

  const getAccordionItemClass = (accordionState, index) => {
    return accordionState === index
      ? 'add-story-accordion-focused-item'
      : 'add-story-accordion-item'
  }

  const UploadFromWebContent = () => {
    const [storyUrl, setStoryUrl] = useState('')
    const learningLanguage = useSelector(learningLanguageSelector)

    const handleStorySubmit = event => {
      event.preventDefault()

      const newStory = {
        language: capitalize(learningLanguage),
        url: storyUrl,
      }

      if (storyUrl) {
        dispatch(postStory(newStory))
        setStoryUrl('')
        setLibraries({
          public: false,
          group: false,
          private: true,
        })
      }
    }

    return (
      <div>
        <Form id="url-upload">
          <Input
            fluid
            placeholder={intl.formatMessage({ id: 'enter-web-address' })}
            value={storyUrl}
            onChange={event => setStoryUrl(event.target.value)}
            data-cy="new-story-input"
            style={{ marginTop: '1.5em' }}
          />
        </Form>
        <div className="flex pb-sm">
          <Button
            form="url-upload"
            variant="primary"
            type="submit"
            onClick={handleStorySubmit}
            data-cy="submit-story"
            style={{ marginTop: '1em' }}
          >
            {intl.formatMessage({ id: 'upload-from-web' })}
          </Button>
        </div>
      </div>
    )
  }

  const UploadFromFileContent = () => {
    const intl = useIntl()

    const [file, setFile] = useState('')
    const [label, setLabel] = useState(intl.formatMessage({ id: 'choose-a-file' }))
    const [filename, setfFilename] = useState('')
    // const [showModel, setShowModel] = useState(false)
    const learningLanguage = useSelector(learningLanguageSelector)
    const { pending, storyId, progress } = useSelector(({ uploadProgress }) => uploadProgress)

    const dispatch = useDispatch()

    const containsOnlyLatinCharacters = filename => {
      if (filename) return /^[a-zA-Z0-9_\-.]+$/.test(filename)
      return true
    }

    const onChange = e => {
      if (e.target.files[0]) {
        setFile(e.target.files[0])
        setLabel(e.target.files[0].name)
        setfFilename(e.target.files[0].name)
      }
    }

    const handleSubmit = () => {
      const data = new FormData()
      data.append('file', file)
      data.append('language', learningLanguage)
      dispatch(setCustomUpload(true))
      dispatch(postStory(data))
      dispatch(updateLibrarySelect('private'))
    }

    useEffect(() => {
      if (progress) {
        if (progress === 1) setFile('')
      }
    }, [progress])

    const storyUploading = pending || storyId
    const submitDisabled = !file || storyUploading || !containsOnlyLatinCharacters(filename)

    return (
      <div>
        <br />
        <span className="bold">
          <FormattedHTMLMessage id="file-upload-instructions" />
        </span>
        {!containsOnlyLatinCharacters(filename) && (
          <div style={{ color: 'red' }}>
            <FormattedMessage id="check-for-non-latin-characters" />
          </div>
        )}
        <div className="space-evenly pt-lg">
          <input id="file" name="file" type="file" accept=".docx, .txt" onChange={onChange} />
          <label htmlFor="file">{label}</label>
          <Button
            disabled={submitDisabled}
            variant="primary"
            onClick={handleSubmit}
            style={{ minWidth: '10em' }}
          >
            {storyUploading ? (
              <Spinner animation="border" variant="white" size="lg" />
            ) : (
              <FormattedMessage id="Submit" />
            )}
          </Button>
        </div>
      </div>
    )
  }

  const PasteTextContent = () => {
    const maxCharacters = 50000
    const [text, setText] = useState('')
    const [charactersLeft, setCharactersLeft] = useState(maxCharacters)
    const learningLanguage = useSelector(learningLanguageSelector)
    const { pending, storyId, progress } = useSelector(({ uploadProgress }) => uploadProgress)

    const dispatch = useDispatch()

    const handleTextChange = e => {
      setCharactersLeft(maxCharacters - e.target.value.length)
      setText(e.target.value)
    }

    const addText = async () => {
      const newStory = {
        language: capitalize(learningLanguage),
        text,
      }
      await dispatch(setCustomUpload(true))
      dispatch(postStory(newStory))
    }

    useEffect(() => {
      if (progress) {
        if (progress === 1) setText('')
      }
    }, [progress])

    const textTooLong = charactersLeft < 0
    const submitDisabled = !text || pending || storyId || textTooLong || charactersLeft > 49950

    return (
      <div>
        <br />
        <span className="bold pb-sm">
          <FormattedMessage id="paste-the-raw-text-you-want-to-add-as-a-story-we-will-use-the-first-sentence-before-an-empty-line-as" />
        </span>
        <FormControl
          as="textarea"
          rows={8}
          className="story-text-input"
          value={text}
          onChange={handleTextChange}
          style={{ marginTop: '1em' }}
        />
        <span className="bold" style={{ marginRight: '1em' }}>
          <FormattedMessage id="characters-left" />
          {` ${charactersLeft}`}
        </span>
        <Button
          variant="primary"
          onClick={addText}
          disabled={submitDisabled}
          style={{ margin: '1em' }}
        >
          {pending || storyId ? (
            <Spinner animation="border" variant="dark" size="lg" />
          ) : (
            <span>
              <FormattedMessage id="Confirm" />
            </span>
          )}
        </Button>
        {textTooLong && (
          <span className="additional-info">
            <FormattedMessage id="this-text-is-too-long-maximum-50000-characters" />
          </span>
        )}
      </div>
    )
  }

  return (
    <Accordion as={Menu} fluid vertical>
      <h2 style={{ marginTop: '1.5rem', marginLeft: '2rem', marginBottom: '1.5rem' }}>
        <FormattedMessage id="add-your-stories" />
      </h2>
      <Menu.Item style={{ margin: '1rem' }}>
        <Accordion.Title
          active={accordionState === 0}
          content={
            <span className={getAccordionItemClass(accordionState, 0)}>
              <FormattedMessage id="upload-from-web" />
            </span>
          }
          index={0}
          onClick={handleClick}
        />
        <Accordion.Content active={accordionState === 0} content={<UploadFromWebContent />} />
      </Menu.Item>

      {!smallWindow && (
        <>
          <Menu.Item style={{ margin: '1rem' }}>
            <Accordion.Title
              active={accordionState === 1}
              content={
                <span className={getAccordionItemClass(accordionState, 1)}>
                  <FormattedMessage id="upload-stories" />
                </span>
              }
              index={1}
              onClick={handleClick}
            />
            <Accordion.Content active={accordionState === 1} content={<UploadFromFileContent />} />
          </Menu.Item>

          <Menu.Item style={{ margin: '1rem' }}>
            <Accordion.Title
              active={accordionState === 2}
              content={
                <span className={getAccordionItemClass(accordionState, 2)}>
                  <FormattedMessage id="paste-a-text" />
                </span>
              }
              index={2}
              onClick={handleClick}
            />
            <Accordion.Content active={accordionState === 2} content={<PasteTextContent />} />
          </Menu.Item>
        </>
      )}

      <Menu.Item style={{ margin: '1rem' }}>
        <Accordion.Title
          active={accordionState === 3}
          content={
            <span className={getAccordionItemClass(accordionState, 3)}>
              <FormattedMessage id="show-recommended-sites" />
            </span>
          }
          index={3}
          onClick={handleClick}
        />
        <Accordion.Content active={accordionState === 3} content={<RecommendedSites />} />
      </Menu.Item>
    </Accordion>
  )
}

export default AddStoryAccordion
