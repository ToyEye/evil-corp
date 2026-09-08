import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import type { SplitDeliveryLine } from "./deliveryForm.utils";
import { PREVIEW_BAR_HEIGHT } from "../PreviewSwitcher/previewSwitcher.styles";
import { COLORS } from "../../theme/COLORS";
import { formFieldSx, submitButtonSx } from "../Forms/formStyles";

type DeliveryRestockPanelProps = {
  open: boolean;
  items: SplitDeliveryLine[];
  note: string;
  sent: boolean;
  canSend: boolean;
  onNoteChange: (value: string) => void;
  onRemove: (productId: string) => void;
  onSend: () => void;
  onClose: () => void;
};

export const DeliveryRestockPanel = ({
  open,
  items,
  note,
  sent,
  canSend,
  onNoteChange,
  onRemove,
  onSend,
  onClose,
}: DeliveryRestockPanelProps) => {
  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 400 },
            top: PREVIEW_BAR_HEIGHT,
            height: `calc(100% - ${PREVIEW_BAR_HEIGHT}px)`,
            overflowY: "auto",
            backgroundColor: COLORS.background.surface,
            borderLeft: `1px solid ${COLORS.border.default}`,
            boxShadow: `0 8px 24px ${COLORS.ui.shadow}`,
          },
        },
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1,
          borderBottom: `1px solid ${COLORS.border.light}`,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.text.primary }}>
            Supply request
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.text.secondary, mt: 0.5 }}>
            Missing stock for the Supply department
          </Typography>
        </Box>
        <IconButton
          type="button"
          aria-label="Close supply request"
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

      <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2 }}>
        {items.length === 0 ? (
          <Typography variant="body2" sx={{ color: COLORS.text.muted }}>
            Add missing products from the delivery form
          </Typography>
        ) : (
          items.map((item) => (
            <Box
              key={item.productId}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 1,
                p: 1.5,
                borderRadius: "12px",
                backgroundColor: COLORS.background.subtle,
                border: `1px solid ${COLORS.border.light}`,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 600, color: COLORS.text.primary }}>
                  {item.name}
                </Typography>
                <Typography variant="body2" sx={{ color: COLORS.text.tertiary }}>
                  {item.sku}
                </Typography>
                <Typography variant="body2" sx={{ color: COLORS.text.secondary, mt: 0.5 }}>
                  {item.quantity} to restock
                </Typography>
              </Box>
              <IconButton
                type="button"
                aria-label={`Remove ${item.name} from supply request`}
                onClick={() => onRemove(item.productId)}
                sx={{ color: COLORS.text.tertiary }}
              >
                <DeleteOutlinedIcon fontSize="small" />
              </IconButton>
            </Box>
          ))
        )}

        <TextField
          label="Note for supply"
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          fullWidth
          multiline
          minRows={2}
          sx={formFieldSx}
        />

        {sent ? (
          <Typography variant="body2" sx={{ color: COLORS.success.text }}>
            Request sent. You can create the delivery.
          </Typography>
        ) : null}

        {!canSend && !sent && items.length > 0 ? (
          <Typography variant="body2" sx={{ color: COLORS.text.tertiary }}>
            Add every short product before sending the request
          </Typography>
        ) : null}

        <Typography variant="caption" sx={{ color: COLORS.text.muted }}>
          Note is optional
        </Typography>

        <Button
          type="button"
          variant="contained"
          disabled={!canSend}
          onClick={onSend}
          sx={{ ...submitButtonSx, mt: 0 }}
        >
          Send request
        </Button>
      </Box>
    </Drawer>
  );
};
