import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import {
  FAILURE_REASONS,
  type DeliveryProof,
  type FailureReason,
} from "../../data/deliveries.schema";
import { COLORS } from "../../theme/COLORS";
import { validateAvatarImage } from "../../utils/imageValidation";
import { formFieldSx } from "../Forms/formStyles";
import { SignaturePad } from "./SignaturePad";

type ProofOfDeliveryFormProps = {
  mode: "done" | "failed";
  onSubmit: (input: { proof: DeliveryProof; failureReason?: FailureReason }) => void;
  onCancel: () => void;
};

const captureGeo = () =>
  new Promise<{ lat?: number; lng?: number }>((resolve) => {
    if (!navigator.geolocation) {
      resolve({});
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
      () => resolve({}),
      { enableHighAccuracy: true, timeout: 4000 },
    );
  });

export const ProofOfDeliveryForm = ({ mode, onSubmit, onCancel }: ProofOfDeliveryFormProps) => {
  const [signatureUrl, setSignatureUrl] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoError, setPhotoError] = useState<string>();
  const [failureReason, setFailureReason] = useState<FailureReason | "">("");
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhoto = async (file?: File) => {
    if (!file) {
      return;
    }

    try {
      setPhotoUrl(await validateAvatarImage(file));
      setPhotoError(undefined);
    } catch (caught) {
      setPhotoError(caught instanceof Error ? caught.message : "Could not read the photo");
    }
  };

  const handleSubmit = async () => {
    if (mode === "done" && !signatureUrl) {
      setError("Capture a signature before completing the delivery");
      return;
    }

    if (mode === "failed" && !failureReason) {
      setError("Choose why the delivery could not be completed");
      return;
    }

    setIsSubmitting(true);
    const geo = await captureGeo();
    onSubmit({
      proof: {
        signatureUrl: signatureUrl || undefined,
        photoUrl: photoUrl || undefined,
        lat: geo.lat,
        lng: geo.lng,
        capturedAt: new Date().toISOString(),
      },
      failureReason: failureReason || undefined,
    });
    setIsSubmitting(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        p: 2,
        borderRadius: "12px",
        border: `1px solid ${COLORS.border.default}`,
        backgroundColor: COLORS.background.subtle,
      }}
    >
      <Typography sx={{ fontWeight: 700, color: COLORS.text.primary }}>
        {mode === "done" ? "Proof of delivery" : "Could not deliver"}
      </Typography>

      {mode === "failed" ? (
        <TextField
          select
          label="Reason"
          value={failureReason}
          onChange={(event) => {
            setFailureReason(event.target.value as FailureReason);
            setError(undefined);
          }}
          sx={formFieldSx}
        >
          {FAILURE_REASONS.map((reason) => (
            <MenuItem key={reason} value={reason}>
              {reason}
            </MenuItem>
          ))}
        </TextField>
      ) : (
        <SignaturePad
          value={signatureUrl}
          onChange={(next) => {
            setSignatureUrl(next);
            setError(undefined);
          }}
        />
      )}

      <Button
        component="label"
        variant="outlined"
        sx={{
          alignSelf: "flex-start",
          textTransform: "none",
          fontWeight: 600,
          borderRadius: "10px",
          color: COLORS.text.secondary,
          borderColor: COLORS.border.default,
        }}
      >
        {photoUrl ? "Replace photo" : "Add photo"}
        <input
          hidden
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => {
            void handlePhoto(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </Button>
      {photoError ? (
        <Typography variant="caption" sx={{ color: COLORS.error[700] }}>
          {photoError}
        </Typography>
      ) : null}
      {photoUrl ? (
        <Box
          component="img"
          src={photoUrl}
          alt="Delivery photo"
          sx={{
            width: "100%",
            maxHeight: 180,
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
      ) : null}

      {error ? (
        <Typography variant="body2" sx={{ color: COLORS.error[700] }}>
          {error}
        </Typography>
      ) : null}

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        <Button
          variant="contained"
          disabled={isSubmitting}
          onClick={() => {
            void handleSubmit();
          }}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "10px",
            backgroundColor: mode === "done" ? COLORS.success[600] : COLORS.error[600],
            "&:hover": {
              backgroundColor: mode === "done" ? COLORS.success[700] : COLORS.error[700],
            },
          }}
        >
          {mode === "done" ? "Complete delivery" : "Submit failure"}
        </Button>
        <Button
          onClick={onCancel}
          sx={{ textTransform: "none", fontWeight: 600, color: COLORS.text.secondary }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};
