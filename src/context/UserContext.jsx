import { createContext, useContext, useMemo, useState } from 'react';

const UserContext = createContext(null);
export function UserProvider({ children }) {
  const [role, setRole] = useState(() => roleFromHash());
  function roleFromHash() {
    if (typeof window === 'undefined') return null;
    if (window.location.hash === '#student') return 'learner';
    if (window.location.hash === '#teacher') return 'faculty';
    return null;
  }
  const value = useMemo(() => ({ role, setRole }), [role]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
export function useUser() { return useContext(UserContext); }
