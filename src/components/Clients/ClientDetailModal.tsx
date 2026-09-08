import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

import type { Client } from "../../data/clients.schema";
import { COLORS } from "../../theme/COLORS";

type ClientDetailModalProps = {
  client: Client | null;
  canEdit: boolean;
  onClose: () => void;
  onEdit: () => void;
};

const formatDate = (value: string) => {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const DetailBlock = ({ label, value }: { label: string; value: string }) => (
  <Box>
    <Typography
      variant="caption"
      sx={{
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color: COLORS.text.tertiary,
      }}
    >
      {label}
    </Typography>
    <Typography variant="body1" sx={{ color: COLORS.text.secondary, lineHeight: 1.6, mt: 0.5 }}>
      {value}
    </Typography>
  </Box>
);

export const ClientDetailModal = ({
  client,
  canEdit,
  onClose,
  onEdit,
}: ClientDetailModalProps) => {
  return (
    <Modal
      open={Boolean(client)}
      onClose={onClose}
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
      <Fade in={Boolean(client)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "calc(100% - 32px)", sm: 480 },
            maxHeight: "90vh",
            overflow: "auto",
            bgcolor: COLORS.background.surface,
            borderRadius: "16px",
            border: `1px solid ${COLORS.border.default}`,
            boxShadow: `0 24px 48px ${COLORS.ui.shadowStrong}`,
          }}
        >
          <Box
            sx={{
              px: 3,
              py: 2.5,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 2,
              borderBottom: `1px solid ${COLORS.border.light}`,
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.text.primary }}>
                {client?.name}
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.text.secondary, mt: 0.5 }}>
                Added {client ? formatDate(client.addedAt) : ""}
              </Typography>
            </Box>
            <IconButton
              aria-label="Close"
              onClick={onClose}
              sx={{
                color: COLORS.text.tertiary,
                backgroundColor: COLORS.background.subtle,
                "&:hover": { backgroundColor: COLORS.background.muted },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            <DetailBlock label="Phone" value={client?.phone ?? ""} />
            <DetailBlock label="Email" value={client?.email ?? ""} />
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: COLORS.text.tertiary,
                }}
              >
                Addresses
              </Typography>
              {client?.addresses.length ? (
                client.addresses.map((address) => (
                  <Typography
                    key={address.id}
                    variant="body1"
                    sx={{ color: COLORS.text.secondary, lineHeight: 1.6, mt: 0.5 }}
                  >
                    {address.line}
                  </Typography>
                ))
              ) : (
                <Typography variant="body1" sx={{ color: COLORS.text.muted, mt: 0.5 }}>
                  No addresses yet
                </Typography>
              )}
            </Box>
            {client?.note ? <DetailBlock label="Note" value={client.note} /> : null}

            {canEdit && client ? (
              <Button
                variant="contained"
                onClick={onEdit}
                sx={{
                  mt: 1,
                  py: 1.1,
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 600,
                  backgroundColor: COLORS.primary[600],
                  "&:hover": { backgroundColor: COLORS.primary[700] },
                }}
              >
                Edit
              </Button>
            ) : null}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
