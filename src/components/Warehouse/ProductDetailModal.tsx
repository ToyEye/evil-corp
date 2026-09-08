import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

import type { InventoryItem } from "../../data/inventory.schema";
import { COLORS } from "../../theme/COLORS";
import { StockQuantityChip } from "./StockQuantityChip";

type ProductDetailModalProps = {
  item: InventoryItem | null;
  canEdit: boolean;
  canRequestRestock: boolean;
  onClose: () => void;
  onEdit: (item: InventoryItem) => void;
  onRequestRestock: (item: InventoryItem) => void;
};

export const ProductDetailModal = ({
  item,
  canEdit,
  canRequestRestock,
  onClose,
  onEdit,
  onRequestRestock,
}: ProductDetailModalProps) => {
  return (
    <Modal
      open={Boolean(item)}
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
      <Fade in={Boolean(item)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "calc(100% - 32px)", sm: 460 },
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
                {item?.name}
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.text.tertiary, mt: 0.5 }}>
                {item?.sku}
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
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                label={item?.category}
                size="small"
                sx={{
                  fontWeight: 600,
                  borderRadius: "8px",
                  backgroundColor: COLORS.primary[50],
                  color: COLORS.primary[700],
                }}
              />
              <StockQuantityChip quantity={item?.quantity ?? 0} />
            </Box>

            <Typography variant="body1" sx={{ color: COLORS.text.secondary, lineHeight: 1.6 }}>
              {item?.description}
            </Typography>

            {(canRequestRestock || canEdit) && item && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
                {canRequestRestock && (
                  <Button
                    variant="outlined"
                    onClick={() => onRequestRestock(item)}
                    sx={{
                      py: 1.1,
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 600,
                      color: COLORS.primary[700],
                      borderColor: COLORS.border.default,
                      "&:hover": {
                        borderColor: COLORS.border.strong,
                        backgroundColor: COLORS.primary[50],
                      },
                    }}
                  >
                    Request restock
                  </Button>
                )}
                {canEdit && (
                  <Button
                    variant="contained"
                    onClick={() => onEdit(item)}
                    sx={{
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
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
