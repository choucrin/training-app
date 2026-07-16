import { useEffect, useState } from 'react';
import { subscribeAuth, handleRedirectResult, signIn, signOutUser, type User } from '../firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleRedirectResult().catch(() => undefined);
    const unsubscribe = subscribeAuth((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { user, loading, signIn, signOut: signOutUser };
}
