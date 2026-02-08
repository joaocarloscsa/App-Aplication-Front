'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { verifyEmail } from '@/services/auth';
import EmailVerificationState from './EmailVerificationState';

type State = 'loading' | 'success' | 'expired' | 'invalid' | 'already';

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [state, setState] = useState<State>('loading');

  useEffect(() => {
    if (!token) {
      setState('invalid');
      return;
    }

    verifyEmail(token)
      .then(() => setState('success'))
      .catch((err) => {
        switch (err?.code) {
          case 'email_verification_token_expired':
            setState('expired');
            break;
          case 'email_verification_token_already_used':
            setState('already');
            break;
          default:
            setState('invalid');
        }
      });
  }, [token]);

  return <EmailVerificationState state={state} />;
}
