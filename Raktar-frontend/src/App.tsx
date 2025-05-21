import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme.ts";
import {BrowserRouter} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Routing from "./routing/Routing.tsx";
import {useState} from "react";
import {emailKeyName, tokenKeyName} from "./constants/const.ts";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem(tokenKeyName));
  const [email, setEmail] = useState(localStorage.getItem(emailKeyName));
  const [role, setRole] = useState<string | null>(null);

  return <MantineProvider theme={theme}>
  <BrowserRouter>
      <AuthContext.Provider value={{ token, setToken, email, setEmail, role, setRole }}>
        <Routing/>
      </AuthContext.Provider>
  </BrowserRouter>
  </MantineProvider>;
}