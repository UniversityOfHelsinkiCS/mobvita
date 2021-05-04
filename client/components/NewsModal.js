import React from 'react'
import { Modal, Divider } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { getNews } from 'Utilities/redux/newsReducer'
import { getMetadata } from 'Utilities/redux/metadataReducer'
import { learningLanguageSelector } from 'Utilities/common'

export default function NewsModal({ trigger }) {
  const dispatch = useDispatch()
  const { news } = useSelector(({ news }) => news)
  const learningLanguage = useSelector(learningLanguageSelector)

  const fetchNews = () => {
    dispatch(getNews())
  }

  const fetchMetadata = () => {
    dispatch(getMetadata(learningLanguage))
  }

  return (
    <Modal
      dimmer="inverted"
      closeIcon={{ style: { top: '1.0535rem', right: '1rem' }, color: 'black', name: 'close' }}
      trigger={trigger}
      onOpen={fetchNews}
      onClose={fetchMetadata}
    >
      <Modal.Header className="bold" as="h2">
        <FormattedMessage id="news" />
      </Modal.Header>
      <Modal.Content>
        {news.map(e => {
          return (
            <div key={e.date}>
              {new Date(e?.date).toLocaleString().split(/([, ])/)[0]}
              <span dangerouslySetInnerHTML={{ __html: e?.content }} />
              <Divider />
            </div>
          )
        })}
      </Modal.Content>
    </Modal>
  )
}