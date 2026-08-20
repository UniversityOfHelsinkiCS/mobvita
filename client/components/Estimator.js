import React, { useState } from 'react'
import axios from 'axios'
import { Alert, Box, Chip, Container, TableBody, TableCell, TableRow } from '@mui/material'
import AppButton from 'Components/AppButton'
import AppTable from 'Components/ui/AppTable'
import AppTextField from 'Components/ui/AppTextField'
import Spinner from 'Components/Spinner'
import { colors, font } from 'Assets/mui_theme/designTokens'

const Estimator = () => {
  const [text, setText] = useState('')
  const [results, setResults] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const estimate = async () => {
    setIsLoading(true)
    try {
      const response = await axios.post('/api/estimate', { text })
      setResults(response.data)
      setIsLoading(false)
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setIsLoading(false)
    }
  }

  const handleClick = e => {
    e.preventDefault()
    estimate()
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'center', my: '3rem' }}>
        <h3>Estimate the complexity of Finnish text</h3>
      </Box>
      <AppTextField
        multiline
        rows={10}
        placeholder="Paste your text here"
        onChange={e => setText(e.target.value)}
      />
      <Box sx={{ mt: '0.5rem', fontSize: font.label, color: colors.muted }}>
        Max. 500 words, {text.trim().split(/\s+/).filter(Boolean).length} used
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', my: '1rem' }}>
        <AppButton
          type="button"
          style={{ width: '100px', height: '40px' }}
          disabled={!text || isLoading}
          onClick={e => handleClick(e)}
        >
          {!isLoading ? <span>Estimate</span> : <Spinner inline />}
        </AppButton>
      </Box>
      {errorMessage && (
        <Alert severity="error" onClose={() => setErrorMessage('')} sx={{ mt: '3rem' }}>
          {errorMessage}
        </Alert>
      )}
      {results && (
        <Box sx={{ my: '3rem' }}>
          <h4 style={{ marginBottom: '20px' }}>Results</h4>
          <AppTable bordered>
            <TableBody>
              <TableRow>
                <TableCell>Score</TableCell>
                <TableCell>{results.score.toFixed(1)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>CEFR</TableCell>
                <TableCell>{results.cefr}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Level</TableCell>
                <TableCell>{results.level}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Top features</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.4em' }}>
                    {results.explanation.slice(0, 10).map(item => (
                      <Chip
                        key={item.feature}
                        size="small"
                        label={item.feature}
                        sx={{
                          backgroundColor: item.contribution > 0 ? colors.green : colors.error,
                          color: item.contribution > 0 ? colors.ink : '#fff',
                        }}
                      />
                    ))}
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </AppTable>
        </Box>
      )}
    </Container>
  )
}

export default Estimator
