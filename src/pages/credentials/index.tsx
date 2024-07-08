import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import * as S from './index.styled'
import axios from 'axios'
import {
  Box,
  Container,
  TextField,
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
  AlertColor,
} from '@mui/material'
import QrCodeGenerator from 'src/components/QrCode/QrCodeGenerator'
import { useSession } from 'next-auth/react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Button from '@mui/material/Button'
import { hostUrl, vaultUrl } from 'src/utils/env_public'
import { WebinarDetailsType } from 'src/utils/webinar'
import FetchDataBanner from 'src/components/FetchDataBanner'
import { useVerifyVpMutation } from 'src/hooks/verifier/useVerifyVpMutation'
import { presentationDefinitions } from 'src/utils/presentation-definitions'
import ErrorModal from 'src/components/common/ErrorModal/ErrorModal'
import LoadingModal from 'src/components/LoadingModal/LoadingModal'
import useInitiateAnyRequest from 'src/hooks/useInitiateAnyRequest'
import { ToastProps } from 'src/types/error'

type handleResponse = {
  credentialOfferUri: string
  expiresIn: number
  issuanceId: string
  txCode: string
}

const theme = createTheme({
  typography: {
    fontSize: 28,
  },
})

type credentialsProps = {
  credtype: string
  credtitle: string
  email: string | null | undefined
  name: string | null | undefined
  creddate?: string
  webinardate?: string
  desc?: string
  webinartitle?: string
  holderDid: string | null | undefined
}

const defaults: credentialsProps = {
  credtype: 'AFFINIDI DEVELOPER WEBINAR SERIES',
  credtitle: 'Certificate of Attendance',
  email: '',
  name: '',
  creddate: new Date().toISOString(),
  webinardate: '',
  desc: '',
  webinartitle: '',
  holderDid: '',
}

const WebinarAccordion = ({
  webinar,
  selectedWebinar,
  setSelectedWebniar,
}: {
  webinar: any
  selectedWebinar: any
  setSelectedWebniar: any
}) => {
  const handleChange = (webinar: any) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setSelectedWebniar(webinar)
    console.log('selectedWebinar', webinar)
  }

  return (
    <Accordion expanded={selectedWebinar.id === webinar.id} onChange={handleChange(webinar)}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="webinar-content"
        id={`webinar-header${webinar.id}`}
      >
        <Typography variant="h6">{webinar.webinartitle}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography color="textSecondary">
          <b>Webinar Date </b>: {webinar.webinardate}
        </Typography>
        <Typography variant="body1">
          <b>Webinar Details</b> : {webinar.desc}
        </Typography>
      </AccordionDetails>
    </Accordion>
  )
}

const Credentials: FC = () => {
  const { push } = useRouter()
  const [toast, setToast] = useState<ToastProps | false>()
  const [issuanceResponse, setIssuanceResponse] = useState<handleResponse>()
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  //create state with defaults
  const [credinfo, setCredinfo] = useState<credentialsProps>({ ...defaults })
  const [selectedWebinar, setSelectedWebniar] = useState<WebinarDetailsType>()

  //Prefill available data from session, if user is logged-in
  const { data: session } = useSession()
  useEffect(() => {
    if (!session || !session.user) return
    setCredinfo((state) => ({
      ...state,
      email: session.user?.email,
      name: session.user?.name,
      holderDid: session.user?.userId,
    }))
  }, [session])

  //use hooks for Initiating request for User Profile VC
  const {
    isInitializing,
    isExtensionInstalled,
    handleInitiate,
    isLoading,
    error,
    errorDescription,
    data: webinarFetchedData,
  } = useInitiateAnyRequest({
    presentationDefinition: presentationDefinitions.webinarRegistrationVC,
    callbackUrl: `${hostUrl}/credentials-callback`,
    doVerification: true,
    useVerifyVpMutation,
  })

  useEffect(() => {
    if (webinarFetchedData) {
      setCredinfo((state) => ({
        ...state,
        name: webinarFetchedData.name,
        email: webinarFetchedData.email,
      }))

      setSelectedWebniar({
        id: 1,
        webinartitle: webinarFetchedData.webinartitle,
        webinardate: webinarFetchedData.webinardate,
        desc: webinarFetchedData.desc,
      })

      setToast({ message: 'Hooray, we have got webinar details from your Vault' })

      push('/credentials')
    }
  }, [webinarFetchedData, credinfo.name])

  const handleClose = () => {
    setSelectedWebniar(undefined)
    setIssuanceResponse(undefined)
    setIsButtonDisabled(false)
    push('/credentials')
  }

  const handleClick = async () => {
    if (!credinfo.holderDid) {
      setToast({ message: 'Please login', type: 'error' })
      return
    }
    if (!selectedWebinar || !credinfo.email || !credinfo.name) {
      setToast({ message: 'Please fetch webinar details from vault', type: 'error' })
      return
    }

    setIsButtonDisabled(true)
    const apiData = {
      credentialTypeId: 'WebinarCredentialSchema',
      holderDid: credinfo.holderDid,
      credentialData: {
        email: credinfo.email,
        name: credinfo.name,
        credtype: credinfo.credtype,
        credtitle: credinfo.credtitle,
        webinardate: selectedWebinar.webinardate,
        desc: selectedWebinar.desc,
        webinartitle: selectedWebinar.webinartitle,
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
    setToast({ message: 'Credentail Issued Successfully', type: 'success' })
    console.log('issuanceResponse', issuanceResponse)
  }

  return (
    <ThemeProvider theme={theme}>
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

      <S.Wrapper>
        <Container maxWidth="sm">
          <Box sx={{ mt: 1 }}>
            <Typography variant="h4" align="center">
              Webinar Attendance Certificate
            </Typography>
            <br />
            <Typography variant="body2" color="text.secondary">
              Please share your webinar registration certificate and get the webinar participation certificate
            </Typography>
          </Box>

          <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
              {!issuanceResponse && (
                <div>
                  {!selectedWebinar && (
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <>
                          <FetchDataBanner
                            title="Share your Webinar Registration Details from your Affinidi Vault"
                            handleParticipate={handleInitiate}
                            isInitializing={isInitializing}
                            isExtensionInstalled={isExtensionInstalled}
                          />
                        </>
                      </Grid>
                    </Grid>
                  )}
                  {error && (
                    <ErrorModal error={error} errorDescription={errorDescription} closeCallback="/credentials" />
                  )}
                  {isLoading && (
                    <LoadingModal
                      title="Verifying"
                      message="Please wait for a few seconds until we process your request."
                    />
                  )}
                  {selectedWebinar && (
                    <>
                      <h2>Your Registered Webinar Details</h2>
                      <WebinarAccordion
                        key={selectedWebinar.id}
                        webinar={selectedWebinar}
                        setSelectedWebniar={setSelectedWebniar}
                        selectedWebinar={selectedWebinar}
                      />
                    </>
                  )}
                  <TextField
                    label="Holder's DID"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                    }}
                    value={credinfo.holderDid}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCredinfo((p) => ({ ...p, holderDid: e.target.value }))
                    }
                  />
                  <TextField
                    label="Email"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    value={credinfo.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCredinfo((p) => ({ ...p, email: e.target.value }))
                    }
                  />
                  <TextField
                    label="Full Name"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    value={credinfo.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCredinfo((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClick}
                    disabled={isButtonDisabled}
                    fullWidth
                    sx={{ mt: 1 }}
                  >
                    Get Your Credentials
                  </Button>
                </div>
              )}

              {issuanceResponse && (
                <Paper elevation={3} style={{ padding: '20px', marginTop: '10px', marginBottom: '10px' }}>
                  <Typography variant="h5" gutterBottom>
                    Your Attendance Credentials Offer is Ready
                  </Typography>
                  <p></p>
                  <Typography variant="body1">
                    <b>{issuanceResponse.credentialOfferUri}</b>
                  </Typography>
                  <p></p>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <QrCodeGenerator qrCodeData={issuanceResponse.credentialOfferUri} />
                  </div>
                  <p></p>
                  <Typography variant="body1">
                    {issuanceResponse.txCode && `Your Transaction Code: ${issuanceResponse.txCode}`}
                  </Typography>
                  <p></p>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', justifyContent: 'left' }}>
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
    </ThemeProvider>
  )
}

export default Credentials
