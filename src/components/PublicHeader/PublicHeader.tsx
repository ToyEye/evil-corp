import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";

export const PublicHeader = () => {
  return (
    <AppBar
      position="static"
      sx={{
        maxWidth: "calc(100% - 128px)",
        margin: "0 auto",
        borderRadius: "8px",
        border: "1px solid rgba(0, 0, 0, 0.12)",
        backgroundColor: "#ffffff",
      }}
    >
      <Container maxWidth="md">
        <Toolbar>Public Header</Toolbar>
      </Container>
    </AppBar>
  );
};
