import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const pages = [{ link: "/", name: "Home" }];

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
        <Toolbar>
          <Typography
            component="a"
            variant="h6"
            noWrap
            sx={{ color: "#000000" }}
            href="/"
          >
            Evil Corp
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
