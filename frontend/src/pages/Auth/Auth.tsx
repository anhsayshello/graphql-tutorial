import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import { useMutation } from "@apollo/client";
import { LOGIN, SIGN_UP } from "@/graphql/mutations/user.mutation";
import { setTokenToLS } from "@/utils/utils";
import { useAuthenticatedStore } from "@/stores/useAuthenticatedStore";

export default function Auth() {
  const [value, setValue] = React.useState("login");

  const handleChange = (e, newValue: "login" | "signup") => {
    setValue(newValue);
  };

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
    },
  });
  console.log(result);

  const { isAuthenticated, setIsAuthenticated } = useAuthenticatedStore(
    (state) => state
  );
  console.log(isAuthenticated);
  React.useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setTokenToLS(token);
      setIsAuthenticated(true);
    }
  }, [result.data, setIsAuthenticated]);

  const [signup] = useMutation(SIGN_UP, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
    },
  });

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formJson = Object.fromEntries((formData as any).entries());
    const username = formJson.username;
    console.log(formJson);
    const result = await signup({
      variables: { username },
    });
    console.log(result);
  };

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formJson = Object.fromEntries((formData as any).entries());
    const username = formJson.username;
    const password = formJson.password;
    console.log(formJson);
    login({
      variables: { username, password },
    });
  };

  return (
    <React.Fragment>
      <Dialog open={!isAuthenticated}>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="Login" value="login" />
                <Tab label="Sign Up" value="signup" />
              </TabList>
            </Box>
            <TabPanel value="login">
              <DialogTitle>Login</DialogTitle>
              <DialogContent sx={{ paddingBottom: 0 }}>
                <DialogContentText>
                  To subscribe to this website,
                </DialogContentText>
                <form onSubmit={handleLogin}>
                  <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="name"
                    name="username"
                    label="username"
                    type="text"
                    fullWidth
                    variant="standard"
                  />
                  <TextField
                    required
                    margin="dense"
                    id="password"
                    name="password"
                    label="password"
                    type="password"
                    fullWidth
                    variant="standard"
                  />
                  <DialogActions>
                    <Button type="submit">GO</Button>
                  </DialogActions>
                </form>
              </DialogContent>
            </TabPanel>

            <TabPanel value="signup">
              <DialogTitle>Sign Up</DialogTitle>
              <DialogContent sx={{ paddingBottom: 0 }}>
                <DialogContentText>
                  To subscribe to this website,
                </DialogContentText>
                <form onSubmit={handleSignup}>
                  <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="name"
                    name="username"
                    label="username"
                    type="text"
                    fullWidth
                    variant="standard"
                  />
                  <TextField
                    required
                    margin="dense"
                    id="password"
                    name="password"
                    label="password"
                    type="password"
                    fullWidth
                    variant="standard"
                  />
                  <DialogActions>
                    <Button type="submit">GO</Button>
                  </DialogActions>
                </form>
              </DialogContent>
            </TabPanel>
          </TabContext>
        </Box>
      </Dialog>
    </React.Fragment>
  );
}
