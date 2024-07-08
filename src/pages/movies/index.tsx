import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import * as S from './index.styled'
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  ThemeProvider,
  Alert,
  ListItem,
  ListItemText,
  Snackbar,
  createTheme,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Paper,
} from '@mui/material'

//Import custom hooks
import { useVerifyVpMutation } from 'src/hooks/verifier/useVerifyVpMutation'

import LoadingModal from 'src/components/LoadingModal/LoadingModal'
import ErrorModal from 'src/components/common/ErrorModal/ErrorModal'
import FetchDataBanner from 'src/components/FetchDataBanner'
import { hostUrl } from 'src/utils/env_public'
import React from 'react'
import axios from 'axios'
import useInitiateAnyRequest from 'src/hooks/useInitiateAnyRequest'
import { presentationDefinitions } from 'src/utils/presentation-definitions'

const theme = createTheme({
  typography: {
    fontSize: 28,
  },
})

const Movies: FC = () => {
  const { push } = useRouter()
  const [open, setOpen] = useState(false)
  const [movies, setMovies] = useState<any>([])
  const [moviePreferences, setMoviePreferences] = useState()

  //use hooks for Initiating request for User Profile VC
  const { isInitializing, isExtensionInstalled, handleInitiate, isLoading, error, errorDescription, data } =
    useInitiateAnyRequest({
      presentationDefinition: presentationDefinitions.moviePreference,
      callbackUrl: `${hostUrl}/movies-callback`,
      doVerification: false,
    })

  useEffect(() => {
    if (data) {
      //set state from profile VC
      setMoviePreferences((state: any) => ({
        ...state,
        ...data,
      }))
      setOpen(true)

      push('/movies')
    }
  }, [data])

  useEffect(() => {
    const searchMovies = async () => {
      const response = await axios.post(`${hostUrl}/api/movies/search`, {
        method: 'POST',
        data: moviePreferences,
      })
      let dataResponse = response.data
      if (typeof dataResponse == 'string') {
        dataResponse = JSON.parse(dataResponse)
      }

      setMovies(dataResponse)
    }

    searchMovies()
  }, [moviePreferences])

  return (
    <ThemeProvider theme={theme}>
      {/* //Display Error if any or loading modal popup */}
      {error && <ErrorModal error={error} errorDescription={errorDescription} closeCallback="/movies" />}
      {isLoading && (
        <LoadingModal title="Verifying" message="Please wait for a few seconds until we process your request." />
      )}

      <Snackbar
        open={open}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => setOpen(false)}
        message="Hooray, we have got your movie preferences from your Vault"
      />

      <S.Wrapper>
        <Container>
          <Box sx={{ mt: 1 }}>
            <Typography variant="h4" align="center">
              Search Movies
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {!moviePreferences && (
                <>
                  <FetchDataBanner
                    title="Share your movie preferences"
                    handleParticipate={handleInitiate}
                    isInitializing={isInitializing}
                    isExtensionInstalled={isExtensionInstalled}
                  />
                </>
              )}
              {moviePreferences && (
                <>
                  <p>Your Movie Preferences</p>
                  <p>Actors : {moviePreferences.actors?.join(', ') || 'None'}</p>
                  <p>Directors : {moviePreferences.directors?.join(', ') || 'None'}</p>
                  <p>Genres : {moviePreferences.genres?.join(', ') || 'None'}</p>
                </>
              )}
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Director</TableCell>
                  <TableCell>Starring</TableCell>
                  <TableCell>Genre</TableCell>
                  <TableCell>ImageURL</TableCell>
                  <TableCell>Release</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {movies.map((row) => (
                  <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {row.title}
                    </TableCell>
                    <TableCell>{row.director.join(', ')}</TableCell>
                    <TableCell>{row.starring.join(', ')}</TableCell>
                    <TableCell>{row.genre.join(', ')}</TableCell>
                    <TableCell>
                      <img src={row.imageURL} width={100} height={100} />
                    </TableCell>
                    <TableCell>{row.release}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </S.Wrapper>
    </ThemeProvider>
  )
}

export default Movies
