import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import { useSelector } from "react-redux";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import {
  useApproveJoinRequestMutation,
  useJoinRequestsQuery,
  useRejectJoinRequestMutation,
  useSupportThreadsQuery,
  useUsersQuery,
} from "../../hooks";
import { selectUser } from "../../store/auth/auth.slice";
import { COLORS } from "../../theme/COLORS";
import { DashboardStatCard } from "./DashboardStatCard";

export const PlatformDashboard = () => {
  const user = useSelector(selectUser);
  const isAdmin = user?.role === "Admin";
  const { data: usersData } = useUsersQuery();
  const users = usersData ?? [];
  const { data: threadsData } = useSupportThreadsQuery();
  const threads = threadsData ?? [];
  const {
    data: joinRequestsData,
    isLoading: joinRequestsLoading,
    isError: joinRequestsError,
  } = useJoinRequestsQuery();
  const joinRequests = joinRequestsData ?? [];
  const pendingRequests = joinRequests.filter(
    (request) => request.status === "pending",
  );
  const approveJoinRequest = useApproveJoinRequestMutation();
  const rejectJoinRequest = useRejectJoinRequestMutation();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: COLORS.text.primary }}
          >
            Dashboard
          </Typography>
          <Chip
            label="Platform"
            size="small"
            sx={{
              fontWeight: 600,
              borderRadius: "8px",
              backgroundColor: COLORS.primary[50],
              color: COLORS.primary[700],
            }}
          />
        </Box>
        <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
          Overview of everyone using the platform
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 360px))",
            lg: isAdmin ? "repeat(3, minmax(0, 360px))" : "repeat(2, minmax(0, 360px))",
          },
          gap: 2,
        }}
      >
        <DashboardStatCard
          label="Total users"
          value={users.length}
          description="People across all companies"
          icon={PeopleOutlinedIcon}
        />
        <DashboardStatCard
          label="Support chats"
          value={threads.length}
          description="Client company conversations"
          icon={SupportAgentOutlinedIcon}
          accent="info"
        />
        {isAdmin ? (
          <DashboardStatCard
            label="Pending requests"
            value={pendingRequests.length}
            description="Join requests awaiting review"
            icon={HowToRegOutlinedIcon}
            accent="warning"
          />
        ) : null}
      </Box>

      {isAdmin ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            p: 2,
            borderRadius: "12px",
            border: `1px solid ${COLORS.border.default}`,
            backgroundColor: COLORS.background.surface,
            maxWidth: 720,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: COLORS.text.primary }}
          >
            Join requests
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
            Approve to create a client company and SEO account, or reject the
            request.
          </Typography>

          {joinRequestsLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress size={28} />
            </Box>
          ) : null}

          {joinRequestsError ? (
            <Alert severity="error">Failed to load join requests</Alert>
          ) : null}

          {!joinRequestsLoading &&
          !joinRequestsError &&
          pendingRequests.length === 0 ? (
            <Typography variant="body2" sx={{ color: COLORS.text.tertiary }}>
              No pending requests
            </Typography>
          ) : null}

          {pendingRequests.map((request) => (
            <Box
              key={request.id}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { sm: "center" },
                justifyContent: "space-between",
                gap: 1.5,
                p: 1.5,
                borderRadius: "10px",
                backgroundColor: COLORS.background.subtle,
                border: `1px solid ${COLORS.border.light}`,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{ fontWeight: 600, color: COLORS.text.primary }}
                >
                  {request.contactName}
                  {request.companyName ? ` · ${request.companyName}` : ""}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: COLORS.text.secondary }}
                >
                  {request.email}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: COLORS.text.tertiary, mt: 0.5 }}
                >
                  {request.message}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  disabled={
                    rejectJoinRequest.isPending || approveJoinRequest.isPending
                  }
                  onClick={() => rejectJoinRequest.mutate(request.id)}
                >
                  Reject
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  disabled={
                    approveJoinRequest.isPending || rejectJoinRequest.isPending
                  }
                  onClick={() =>
                    approveJoinRequest.mutate({ id: request.id })
                  }
                  sx={{
                    backgroundColor: COLORS.primary[600],
                    "&:hover": { backgroundColor: COLORS.primary[700] },
                  }}
                >
                  Approve
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      ) : null}
    </Box>
  );
};
