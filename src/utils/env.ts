// backend-only envs

const requiredEnvs: string[] = [
  'AUTH_JWT_SECRET',
  
  // 'PROVIDER_CLIENT_ID',
  // 'PROVIDER_CLIENT_SECRET',
  // 'PROVIDER_ISSUER',

  'API_GATEWAY_URL',
  'PROJECT_ID',
  'TOKEN_ENDPOINT',
  'KEY_ID',
  'PRIVATE_KEY',
  'TOKEN_ID',
]
const missingEnvs = requiredEnvs.filter((name) => !process.env[name])
if (missingEnvs.length !== 0) {
  throw new Error(
    `Required envs are not provided: ${missingEnvs.join(', ')}. Please check README file.`
  )
}

export const logLevel = process.env.LOG_LEVEL || 'info'
export const authJwtSecret = process.env.AUTH_JWT_SECRET!
export const providerClientId = process.env.PROVIDER_CLIENT_ID!
export const providerClientSecret = process.env.PROVIDER_CLIENT_SECRET!
export const providerIssuer = process.env.PROVIDER_ISSUER!
export const verifierApiUrl = process.env.VERIFIER_API_URL!
export const apiKeyHash = process.env.API_KEY_HASH!
export const projectScopeToken = process.env.PROJECT_SCOPE_TOKEN!
export const apiGatewayUrl = process.env.API_GATEWAY_URL!
export const projectId = process.env.PROJECT_ID!
export const tokenEndpoint = process.env.TOKEN_ENDPOINT!
export const keyId = process.env.KEY_ID!
export const privateKey = process.env.PRIVATE_KEY!
export const publicKey = process.env.PUBLIC_KEY!
export const passphrase = process.env.PASSPHRASE!
export const tokenId = process.env.TOKEN_ID!
export const skipVerification = process.env.SKIP_VERIFICATION === 'true'

