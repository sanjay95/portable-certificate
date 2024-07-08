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
  Paper,
  CardHeader,
  CardActions,
} from '@mui/material'
import webinarDetails from 'src/utils/webinar'
import { useSession } from 'next-auth/react'
import axios from 'axios'
//Import custom hooks
import { useVerifyVpMutation } from 'src/hooks/verifier/useVerifyVpMutation'

import LoadingModal from 'src/components/LoadingModal/LoadingModal'
import ErrorModal from 'src/components/common/ErrorModal/ErrorModal'
import FetchDataBanner from 'src/components/FetchDataBanner'
import { hostUrl, vaultUrl } from 'src/utils/env_public'
import { useInitiateProfileRequest } from '@affinidi/affinidi-react-auth'
import { set } from 'zod'
import { Router } from 'react-router-dom'
import QrCodeGenerator from 'src/components/QrCode/QrCodeGenerator'
import { ToastProps } from 'src/types/error'

const theme = createTheme({
  typography: {
    fontSize: 28,
  },
})
type handleResponse = {
  credentialOfferUri: string
  expiresIn: number
  issuanceId: string
  txCode: string
}

type RegistrationProps = {
  passtype: string
  passAmount: string
  email: string | null | undefined
  name: string | null | undefined
  phoneNumber?: string
  dob?: string
  gender?: string
  address?: string
  postcode?: string
  city?: string
  country?: string
  holderDid: string | null | undefined
}

const defaults: RegistrationProps = {
  passtype: '',
  passAmount: '',
  email: '',
  name: '',
  phoneNumber: '',
  dob: '',
  gender: '',
  address: '',
  postcode: '',
  city: '',
  country: '',
  holderDid: '',
}

const Registration: FC = () => {
  const { push } = useRouter()
  const [toast, setToast] = useState<ToastProps | false>()
  const [selectedWebinar, setSelectedWebniar] = useState(webinarDetails[0])
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [issuanceResponse, setIssuanceResponse] = useState<handleResponse>()
  //create state with defaults
  const [passinfo, setPassinfo] = useState<RegistrationProps>({
    ...defaults,
    passtype: 'Premimum Pass',
    passAmount: '₹18,999',
  })

  //Prefill available data from session, if user is logged-in
  const { data: session } = useSession()
  useEffect(() => {
    if (!session || !session.user) return
    setPassinfo((state) => ({
      ...state,
      email: session.user?.email,
      name: session.user?.name,
      holderDid: session.user?.userId,
    }))
  }, [session])

  //use hooks for Initiating request for User Profile VC
  const { isInitializing, isExtensionInstalled, handleInitiate, isLoading, error, errorDescription, profileData } =
    useInitiateProfileRequest({
      callbackUrl: `${hostUrl}/registration-callback`,
      doVerification: true,
      useVerifyVpMutation,
    })

  useEffect(() => {
    if (profileData) {
      //set state from profile VC
      setPassinfo((state) => ({
        ...state,
        email: profileData.email,
        name: `${profileData.givenName || ''} ${profileData.familyName || ''}`.trim(),
        phoneNumber: profileData.phoneNumber,
        dob: profileData.birthdate,
        gender: profileData.gender,
        address: profileData.address?.formatted,
        postcode: profileData.address?.postalCode,
        city: profileData.address?.locality,
        country: profileData.address?.country,
      }))
      setToast({ message: 'Hooray, we have got profile details from your Vault' })

      push('/registration')
    }
  }, [profileData])

  const handleClose = () => {
    setIssuanceResponse(undefined)
    setIsButtonDisabled(false)
    setSelectedWebniar(webinarDetails[0])
    setPassinfo({ ...defaults, passtype: 'Premimum Pass', passAmount: '₹18,999', email: session?.user?.email, holderDid: session?.user?.userId, name: session?.user?.name })

    push('/registration')
  }

  const handleRegistration = (webinar: any) => {
    console.log('Registration')
    setSelectedWebniar(webinar)
  }

  const handleStartIssuance = async () => {
    if (!passinfo.holderDid) {
      setToast({ message: 'Please login', type: 'error' })
      return
    }
    if (!selectedWebinar || !passinfo.email || !passinfo.name) {
      setToast({ message: 'Please fetch profile details from vault', type: 'error' })
      return
    }

    console.log('Start Issuance')
    console.log('passinfo :', passinfo)
    setIsButtonDisabled(true)
    const apiData = {
      credentialTypeId: 'WebinarRegistrationSchema',
      holderDid: passinfo.holderDid,
      credentialData: {
        email: passinfo.email,
        name: passinfo.name,
        phoneNumber: passinfo.phoneNumber,
        dob: passinfo.dob,
        gender: passinfo.gender,
        address: passinfo.address,
        postcode: passinfo.postcode,
        city: passinfo.city,
        country: passinfo.country,
        credtype: 'AFFINIDI DEVELOPER WEBINAR SERIES',
        credtitle: 'Certificate Of Registration',
        webinardate: selectedWebinar.webinardate,
        desc: selectedWebinar.desc,
        webinartitle: selectedWebinar.webinartitle,
        passAmount: passinfo.passAmount,
        passType: passinfo.passtype,
      },
    }
    console.log('apiData', apiData)
    const response = await axios<handleResponse>(`${hostUrl}/api/credentials/issuance-start`, {
      method: 'POST',
      data: apiData,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    let dataResponse = response.data
    console.log('dataResponse', dataResponse)

    if (typeof dataResponse == 'string') {
      dataResponse = JSON.parse(dataResponse)
    }

    if (dataResponse.credentialOfferUri) {
      setIssuanceResponse(dataResponse)
    }
    setToast({ message: 'Webinar Registration Credentails Issued Successfully', type: 'success' })
    console.log('issuanceResponse', issuanceResponse)
  }

  return (
    <ThemeProvider theme={theme}>
      {/* //Display Error if any or loading modal popup */}
      {error && <ErrorModal error={error} errorDescription={errorDescription} closeCallback="/registration" />}
      {isLoading && (
        <LoadingModal title="Verifying" message="Please wait for a few seconds until we process your request." />
      )}

      {toast && toast.message && (
        <Snackbar
          open={!!toast.message}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={() => setToast(false)}
          message={'test'}
        >
          <Alert
            onClose={() => setToast(false)}
            severity={toast?.type || 'info'}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {toast.message || 'test'}
          </Alert>
        </Snackbar>
      )}

      <Grid container spacing={1}>
        <Grid item xs={6}>
          <S.Wrapper>
            <Container maxWidth="sm" sx={{ marginRight: '1rem' }}>
              <Box sx={{ mt: 1 }}>
                <Typography variant="h4" align="center">
                  Webinars
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please select the desired webinar and register
                </Typography>
                <br />
              </Box>

              {webinarDetails.map((webinar) => (
                <div key={webinar.id}>
                  <Card>
                    <CardHeader title={webinar.webinartitle} subheader={webinar.webinardate} />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {webinar.desc}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => handleRegistration(webinar)}
                      >
                        Select
                      </Button>
                      <Button size="small">Learn More</Button>
                    </CardActions>
                  </Card>
                  <br />
                </div>
              ))}
            </Container>
          </S.Wrapper>
        </Grid>
        <Grid item xs={6}>
          <S.Wrapper>
            <Container maxWidth="sm" sx={{ marginLeft: '1rem' }}>
              <Box sx={{ mt: 1 }}>
                <Typography variant="h4" align="center">
                  Registration Form
                </Typography>
              </Box>

              <Card variant="outlined" sx={{ mt: 2 }}>
                <CardContent>
                  {!issuanceResponse && (
                    <Box component="form">
                      <Grid container spacing={1}>
                        <Grid item xs={12}>
                          <FetchDataBanner
                            title="Share your user profile from your Affinidi Vault to autofill below form"
                            handleParticipate={handleInitiate}
                            isInitializing={isInitializing}
                            isExtensionInstalled={isExtensionInstalled}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          {' '}
                          <ListItem sx={{ py: 1, px: 0 }}>
                            <ListItemText primary={'Selected Webinar'} secondary={selectedWebinar.webinartitle} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                              {selectedWebinar.webinardate}
                            </Typography>
                          </ListItem>
                        </Grid>
                        <Grid item xs={12}>
                          <ListItem sx={{ py: 1, px: 0 }}>
                            <ListItemText
                              primary={passinfo.passtype}
                              secondary="In-Person Ticket, Access to full 2 days In person conference"
                            />
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                              {passinfo.passAmount}
                            </Typography>
                          </ListItem>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Holder's DID"
                            variant="standard"
                            fullWidth
                            margin="normal"
                            InputProps={{
                              readOnly: true,
                            }}
                            value={passinfo.holderDid}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setPassinfo((p) => ({ ...p, holderDid: e.target.value }))
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            label="Email"
                            variant="standard"
                            fullWidth
                            margin="normal"
                            InputProps={{
                              readOnly: true,
                            }}
                            value={passinfo.email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setPassinfo((p) => ({ ...p, email: e.target.value }))
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            label="Full Name"
                            variant="standard"
                            fullWidth
                            margin="normal"
                            value={passinfo.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setPassinfo((p) => ({ ...p, name: e.target.value }))
                            }
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <TextField
                            label="Phone Number"
                            variant="standard"
                            fullWidth
                            margin="normal"
                            value={passinfo.phoneNumber}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setPassinfo((p) => ({ ...p, phoneNumber: e.target.value }))
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            label="Date of Birth"
                            variant="standard"
                            fullWidth
                            margin="normal"
                            value={passinfo.dob}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setPassinfo((p) => ({ ...p, dob: e.target.value }))
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            label="Gender"
                            variant="standard"
                            fullWidth
                            margin="normal"
                            value={passinfo.gender}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setPassinfo((p) => ({ ...p, gender: e.target.value }))
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            label="Address"
                            variant="standard"
                            fullWidth
                            margin="normal"
                            value={passinfo.address}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setPassinfo((p) => ({ ...p, address: e.target.value }))
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            label="Post Code"
                            variant="standard"
                            fullWidth
                            margin="normal"
                            value={passinfo.postcode}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setPassinfo((p) => ({ ...p, postcode: e.target.value }))
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            label="City"
                            variant="standard"
                            fullWidth
                            margin="normal"
                            value={passinfo.city}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setPassinfo((p) => ({ ...p, city: e.target.value }))
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            label="Country"
                            variant="standard"
                            fullWidth
                            margin="normal"
                            value={passinfo.country}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setPassinfo((p) => ({ ...p, country: e.target.value }))
                            }
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            onClick={handleStartIssuance}
                            disabled={isButtonDisabled}
                            fullWidth
                            sx={{ mt: 2 }}
                          >
                            Register
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                  {issuanceResponse && (
                    <Paper elevation={3} style={{ padding: '20px', marginTop: '10px', marginBottom: '10px' }}>
                      <Typography variant="h5" gutterBottom>
                        Your Registration Credentials Offer is Ready
                      </Typography>
                      <p></p>
                      <Typography variant="body1">
                        <b>{vaultUrl}={issuanceResponse.credentialOfferUri}</b>
                      </Typography>
                      <p></p>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <QrCodeGenerator qrCodeData={`${vaultUrl}=${issuanceResponse.credentialOfferUri}`} />
                      </div>
                      <p></p>
                      <Typography variant="body1">
                        {issuanceResponse.txCode && `Your Transaction Code: ${issuanceResponse.txCode}`}
                      </Typography>
                      <p></p>
                      <Box
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', justifyContent: 'left' }}
                      >
                        <Typography variant="body1">Offer Timeout in {issuanceResponse.expiresIn} Second</Typography>

                        <Grid container spacing={2} justifyContent="center">
                          <Grid item>
                            <Button
                              variant="contained"
                              color="secondary"
                              href={`${vaultUrl}=${issuanceResponse.credentialOfferUri}`}
                              target="_blank"
                              sx={{ mt: 2 }}
                            >
                              Accept Offer
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button variant="contained" color="primary" onClick={handleClose} fullWidth sx={{ mt: 2 }}>
                              Deny Offer
                            </Button>
                          </Grid>
                        </Grid>
                      </Box>
                    </Paper>
                  )}
                </CardContent>
              </Card>
            </Container>
          </S.Wrapper>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

export default Registration
