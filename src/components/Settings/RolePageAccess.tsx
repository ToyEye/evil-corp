import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { getAssignableRoles } from "../../data/companies.dummy";
import {
  appPages,
  isPageAccessLocked,
} from "../../data/permissions.dummy";
import { selectUser } from "../../store/auth/auth.slice";
import {
  resetPageAccess,
  selectPageAccess,
  setRolePageAccess,
} from "../../store/permissions/permissions.slice";
import { useAppDispatch } from "../../store/types";
import { COLORS } from "../../theme/COLORS";

export const RolePageAccess = () => {
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);
  const pageAccess = useSelector(selectPageAccess);
  const roles = user ? getAssignableRoles(user.companyId) : [];

  return (
    <Box
      sx={{
        borderRadius: "16px",
        border: `1px solid ${COLORS.border.default}`,
        backgroundColor: COLORS.background.surface,
        boxShadow: `0 8px 24px ${COLORS.ui.shadow}`,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          p: 2.5,
          borderBottom: `1px solid ${COLORS.border.light}`,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}
          >
            Page access
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
            Choose which roles can open each page. The sidebar updates immediately.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={() => dispatch(resetPageAccess())}
          sx={{
            height: 40,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            color: COLORS.text.secondary,
            borderColor: COLORS.border.default,
            "&:hover": {
              borderColor: COLORS.border.strong,
              backgroundColor: COLORS.background.subtle,
            },
          }}
        >
          Reset defaults
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: COLORS.background.subtle }}>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: COLORS.text.tertiary,
                  fontSize: "0.75rem",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  borderBottomColor: COLORS.border.default,
                  minWidth: 220,
                }}
              >
                Page
              </TableCell>
              {roles.map((role) => (
                <TableCell
                  key={role}
                  align="center"
                  sx={{
                    fontWeight: 700,
                    color: COLORS.text.tertiary,
                    fontSize: "0.75rem",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    borderBottomColor: COLORS.border.default,
                    whiteSpace: "nowrap",
                  }}
                >
                  {role}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {appPages.map((page) => (
              <TableRow
                key={page.id}
                sx={{
                  "&:last-of-type td": { borderBottom: 0 },
                  "& td": { borderBottomColor: COLORS.border.light },
                }}
              >
                <TableCell>
                  <Typography sx={{ fontWeight: 600, color: COLORS.text.primary }}>
                    {page.label}
                  </Typography>
                  <Typography variant="body2" sx={{ color: COLORS.text.tertiary }}>
                    {page.description}
                  </Typography>
                </TableCell>
                {roles.map((role) => {
                  const locked = isPageAccessLocked(page.id, role);
                  const checkbox = (
                    <Checkbox
                      checked={pageAccess[page.id]?.includes(role) ?? false}
                      disabled={locked}
                      onChange={(_, allowed) =>
                        dispatch(
                          setRolePageAccess({
                            pageId: page.id,
                            role,
                            allowed,
                          }),
                        )
                      }
                      sx={{
                        color: COLORS.border.strong,
                        "&.Mui-checked": {
                          color: COLORS.primary[600],
                        },
                      }}
                    />
                  );

                  return (
                    <TableCell key={role} align="center">
                      {locked ? (
                        <Tooltip title="Admin must keep access to Settings">
                          <span>{checkbox}</span>
                        </Tooltip>
                      ) : (
                        checkbox
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
