import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

import {
  RESTOCK_STATUS_LABELS,
  getNextRestockStatus,
  getRestockPurposeLabel,
  type RestockRequest,
} from "../../data/restock.schema";
import { COLORS } from "../../theme/COLORS";
import { ActivityTimeline } from "../Activity/ActivityTimeline";
import { RestockStatusChip } from "./RestockStatusChip";

type RestockDetailModalProps = {
  request: RestockRequest | null;
  canUpdateStatus: boolean;
  onClose: () => void;
  onAdvanceStatus: (request: RestockRequest) => void;
};

const formatDateTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

export const RestockDetailModal = ({
  request,
  canUpdateStatus,
  onClose,
  onAdvanceStatus,
}: RestockDetailModalProps) => {
  const nextStatus = request ? getNextRestockStatus(request.status) : undefined;
  const isOpen = Boolean(request);

  return (
    <Modal
      open={isOpen}
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
      <Fade in={isOpen}>
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
                {request?.productName}
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.text.secondary, mt: 0.5 }}>
                {request?.sku}
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

          {request ? (
            <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
              <RestockStatusChip status={request.status} />
              <DetailBlock label="Quantity" value={String(request.quantity)} />
              <DetailBlock label="Purpose" value={getRestockPurposeLabel(request)} />
              <DetailBlock label="From" value={request.requestedByName} />
              <DetailBlock label="Sent" value={formatDateTime(request.createdAt)} />
              {request.note ? <DetailBlock label="Notes" value={request.note} /> : null}

              {canUpdateStatus && nextStatus ? (
                <Button
                  variant="contained"
                  onClick={() => onAdvanceStatus(request)}
                  sx={{
                    alignSelf: "flex-start",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "10px",
                    backgroundColor:
                      nextStatus === "Received" ? COLORS.success[600] : COLORS.primary[600],
                    "&:hover": {
                      backgroundColor:
                        nextStatus === "Received" ? COLORS.success[700] : COLORS.primary[700],
                    },
                  }}
                >
                  {nextStatus === "Received"
                    ? "Receive into warehouse"
                    : `Mark as ${RESTOCK_STATUS_LABELS[nextStatus]}`}
                </Button>
              ) : null}

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: COLORS.text.tertiary,
                    display: "block",
                    mb: 1,
                  }}
                >
                  Activity
                </Typography>
                <ActivityTimeline entityType="restock" entityId={request.id} />
              </Box>
            </Box>
          ) : null}
        </Box>
      </Fade>
    </Modal>
  );
};
