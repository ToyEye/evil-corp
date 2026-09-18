import { Suspense } from "react";
import Box from "@mui/material/Box";

import { PublicHeader } from "../PublicHeader/PublicHeader";
import { COLORS } from "../../theme/COLORS";
import { PublicFooter } from "./PublicFooter";
import { PublicAuthProvider } from "./publicAuth";

type PublicLayoutProps = {
  children: React.ReactNode;
};

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <PublicAuthProvider>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: COLORS.background.page,
        }}
      >
        <PublicHeader />
        <Box component="main" sx={{ flex: 1 }}>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </Box>
        <PublicFooter />
      </Box>
    </PublicAuthProvider>
  );
};
