import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: import.meta.env.VITE_COGNITO_AUTHORITY as string,
  client_id: import.meta.env.VITE_COGNITO_CLIENT_ID as string,
  redirect_uri:
    (import.meta.env.VITE_COGNITO_REDIRECT_URI as string) ||
    `${window.location.origin}/auth/callback`,
  response_type:
    ((import.meta.env.VITE_COGNITO_RESPONSE_TYPE as string) || "code") as
      | "code"
      | "id_token"
      | "token"
      | "code id_token"
      | "code token"
      | "id_token token"
      | "code id_token token",
  scope: ((import.meta.env.VITE_COGNITO_SCOPE as string) ||
    "email openid phone") as string,
};

createRoot(document.getElementById("root")!).render(
  <AuthProvider
    {...cognitoAuthConfig}
    onSigninCallback={() => {
      // Clean up the URL and send the user to home after Cognito redirects back
      window.history.replaceState({}, document.title, "/");
    }}
  >
    <App />
  </AuthProvider>
);
