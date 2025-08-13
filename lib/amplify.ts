// lib/amplify.ts
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'ap-south-1_9Yl6RDoRh',
      userPoolClientId: '2q22892si0oigtj2r56sav8biv',
      region: 'ap-south-1',
      signUpVerificationMethod: 'code',
      loginWith: { email: true },
    },
  },
});
