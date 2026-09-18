import { Suspense } from "react";
import Box from "@mui/material/Box";

import { Aside } from "../Aside/Aside";
import { PrivateHeader } from "../PrivateHeader/PrivateHeader";
import { COLORS } from "../../theme/COLORS";

type PrivateLayoutProps = {
  children: React.ReactNode;
};

export const PrivateLayout = ({ children }: PrivateLayoutProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: COLORS.background.page,
      }}
    >
      <Aside />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <PrivateHeader />
        <Box component="main" sx={{ flex: 1, p: 3 }}>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </Box>
        <Box
          component="footer"
          sx={{
            textAlign: "center",
            py: 2,
            color: COLORS.text.muted,
            fontSize: "0.875rem",
          }}
        >
          © {new Date().getFullYear()} - All rights reserved
        </Box>
      </Box>
    </Box>
  );
};
