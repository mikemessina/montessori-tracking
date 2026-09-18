import { useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, authPersistenceReady } from "../firebase";
import { AuthContext } from "./AuthContext";

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};

    authPersistenceReady
      .then(() => {
        unsubscribe = onAuthStateChanged(auth, (nextUser) => {
          setUser(nextUser);
          setLoading(false);
        });
      })
      .catch((error) => {
        console.error("Failed to initialize authentication", error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
