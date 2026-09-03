import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

import { COLORS } from "../../theme/COLORS";
import { useState } from "react";
import { CustomTabPanel } from "../common/CustomTabPanel";
import { LoginForm } from "../Forms/LoginForm";
import { SignUpForm } from "../Forms/SignUpForm";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

export const AuthModal = ({ isOpen, onClose }: Props) => {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="auth-modal-title"
      aria-describedby="auth-modal-description"
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 400,
          sx: {
            backgroundColor: COLORS.ui.overlay,
            backdropFilter: "blur(4px)",
          },
        },
      }}
    >
      <Fade in={isOpen}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "calc(100% - 32px)", sm: 440 },
            maxWidth: "100%",
            bgcolor: COLORS.background.surface,
            borderRadius: "16px",
            border: `1px solid ${COLORS.border.default}`,
            boxShadow: `0 24px 48px ${COLORS.ui.shadowStrong}`,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              px: 3,
              pt: 2.5,
              pb: 1,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 2,
              borderBottom: `1px solid ${COLORS.border.light}`,
              background: `linear-gradient(180deg, ${COLORS.primary[50]} 0%, ${COLORS.background.surface} 100%)`,
            }}
          >
            <Box>
              <Typography
                id="auth-modal-title"
                variant="h5"
                sx={{ color: COLORS.text.primary, fontWeight: 700 }}
              >
                Evil Corp
              </Typography>
              <Typography
                id="auth-modal-description"
                variant="body2"
                sx={{ color: COLORS.text.secondary, mt: 0.5 }}
              >
                {value === 0
                  ? "Access your account"
                  : "Start your journey with us"}
              </Typography>
            </Box>

            <IconButton
              aria-label="Close auth modal"
              onClick={onClose}
              sx={{
                color: COLORS.text.tertiary,
                backgroundColor: COLORS.background.subtle,
                border: `1px solid ${COLORS.border.default}`,
                "&:hover": {
                  color: COLORS.text.primary,
                  backgroundColor: COLORS.background.muted,
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="Auth tabs"
              centered
              sx={{
                minHeight: 44,
                "& .MuiTabs-flexContainer": {
                  justifyContent: "center",
                },
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                  backgroundColor: COLORS.primary[600],
                },
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  color: COLORS.text.tertiary,
                  minHeight: 44,
                  transition: "color 0.2s ease",
                  "&.Mui-selected": {
                    color: COLORS.primary[700],
                  },
                },
              }}
            >
              <Tab label="Sign in" {...a11yProps(0)} />
              <Tab label="Sign up" {...a11yProps(1)} />
            </Tabs>
          </Box>

          <CustomTabPanel value={value} index={0}>
            <LoginForm />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <SignUpForm />
          </CustomTabPanel>
        </Box>
      </Fade>
    </Modal>
  );
};
