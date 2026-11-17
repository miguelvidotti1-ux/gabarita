import { useEffect, useState } from 'react';
import {
  PremiumStatus,
  UserLike,
  subscribePremiumStatus,
} from './sisuService';

export function usePremiumStatus(user: UserLike | null | undefined): PremiumStatus {
  const [status, setStatus] = useState<PremiumStatus>({
    isPremium: false,
    isAdmin: false,
    loading: true,
    planLabel: 'Assinatura Inativa',
  });

  useEffect(() => {
    const unsub = subscribePremiumStatus(user, setStatus);
    return () => unsub();
  }, [user?.uid, user?.email, user?.role, user?.activePlanId, user?.isPremium, user?.paymentStatus]);

  return status;
}
