import React, { createContext, useCallback, useContext, useState } from "react";
import SignInDialog from "./SignInDialog";

export type AuthMode = "signin" | "signup";

interface AuthDialogContextValue {
  open: boolean;
  mode: AuthMode;
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
}

const AuthDialogContext = createContext<AuthDialogContextValue | undefined>(undefined);

export const AuthDialogProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("signin");

  const openAuth = useCallback((m: AuthMode = "signin") => {
    setMode(m);
    setOpen(true);
  }, []);

  const closeAuth = useCallback(() => setOpen(false), []);

  return (
    <AuthDialogContext.Provider value={{ open, mode, openAuth, closeAuth }}>
      {children}
      {/* Key forces remount when mode changes so initialMode applies */}
      <SignInDialog open={open} onOpenChange={setOpen} initialMode={mode} key={mode} />
    </AuthDialogContext.Provider>
  );
};

export const useAuthDialog = () => {
  const ctx = useContext(AuthDialogContext);
  if (!ctx) throw new Error("useAuthDialog must be used within AuthDialogProvider");
  return ctx;
};
