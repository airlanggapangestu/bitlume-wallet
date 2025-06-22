import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { Actor } from "@dfinity/agent";
import { getInternetIdentityNetwork } from "@/core/lib/canisterUtils";
import { backend } from "declarations/backend";
import { bitcoin } from "declarations/bitcoin";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authClient, setAuthClient] = useState(null);
  const [user, setUser] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const client = await AuthClient.create({
        identityProvider: getInternetIdentityNetwork(),
      });
      setAuthClient(client);
      await updateIdentity(client);
    };
    initAuth();
  }, []);

  const updateIdentity = async (client) => {
    try {
      const authenticated = await client.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        const newIdentity = client.getIdentity();
        setIdentity(newIdentity);
        Actor.agentOf(backend).replaceIdentity(newIdentity);
        Actor.agentOf(bitcoin).replaceIdentity(newIdentity);

        setIsLoading(true);
        const userResponse = await backend.get_profile();
        setIsLoading(false);

        if ("Ok" in userResponse) {
          setUser(userResponse.Ok);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(true);
          setUser(null);
        }
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Auth error:", err);
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!authClient) return;
    await new Promise((resolve, reject) =>
      authClient.login({
        identityProvider: getInternetIdentityNetwork(),
        onSuccess: resolve,
        onError: reject,
      })
    );
    const newIdentity = authClient.getIdentity();
    await handleLoginSuccess(newIdentity);
  };

  const handleLoginSuccess = async (newIdentity) => {
    setIdentity(newIdentity);
    Actor.agentOf(backend).replaceIdentity(newIdentity);
    Actor.agentOf(bitcoin).replaceIdentity(newIdentity);

    setIsLoading(true);
    const userResponse = await backend.get_profile();
    setIsLoading(false);

    if ("Ok" in userResponse) {
      setIsAuthenticated(true);
      setUser(userResponse.Ok);
      window.location.href = "/dashboard";
    } else if ("Err" in userResponse) {
      console.error("Error getting profile:", userResponse.Err);
      setIsAuthenticated(true);
      setUser(null);
      window.location.href = "/dashboard";
    }
  };

  const logout = async () => {
    await authClient.logout();
    setUser(null);
    setIsAuthenticated(false);
    document.location.href = "/";
  };

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        handleLogin,
        identity,
        logout,
        isLoading,
        user,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
