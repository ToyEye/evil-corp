import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import InputAdornment from "@mui/material/InputAdornment";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  filterFn_includesString,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";

import { dummyCompanies, dummyUsers } from "../../data/users.dummy";
import { USER_ROLES, type User } from "../../data/users.schema";
import { formFieldSx } from "../Forms/formStyles";
import { COLORS } from "../../theme/COLORS";

const usersTableFeatures = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
});

const columnHelper = createColumnHelper<typeof usersTableFeatures, User>();

const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: "Name",
    filterFn: filterFn_includesString,
    cell: (info) => (
      <Typography sx={{ fontWeight: 600, color: COLORS.text.primary }}>
        {info.getValue()}
      </Typography>
    ),
  }),
  columnHelper.accessor("email", {
    header: "Email",
    enableColumnFilter: false,
    cell: (info) => (
      <Typography sx={{ color: COLORS.text.secondary }}>{info.getValue()}</Typography>
    ),
  }),
  columnHelper.accessor("role", {
    header: "Role",
    filterFn: filterFn_includesString,
    cell: (info) => (
      <Chip
        label={info.getValue()}
        size="small"
        sx={{
          fontWeight: 600,
          borderRadius: "8px",
          backgroundColor: COLORS.primary[50],
          color: COLORS.primary[700],
        }}
      />
    ),
  }),
  columnHelper.accessor("companyName", {
    header: "Company",
    filterFn: filterFn_includesString,
    cell: (info) => (
      <Typography sx={{ color: COLORS.text.secondary }}>{info.getValue()}</Typography>
    ),
  }),
]);

const companyOptions = dummyCompanies.map((company) => company.name);
const roleOptions = [...USER_ROLES];

const getStringFilterValue = (value: unknown) =>
  typeof value === "string" ? value : "";

export const UsersTable = () => {
  const table = useTable({
    features: usersTableFeatures,
    columns,
    data: dummyUsers,
    getRowId: (row) => row.id,
  });

  const nameColumn = table.getColumn("name");
  const roleColumn = table.getColumn("role");
  const companyColumn = table.getColumn("companyName");
  const rows = table.getRowModel().rows;
  const hasActiveFilters = table.state.columnFilters.length > 0;

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
          alignItems: "flex-end",
          gap: 2,
          p: 2.5,
          borderBottom: `1px solid ${COLORS.border.light}`,
        }}
      >
        <TextField
          size="small"
          label="Search name"
          placeholder="Search by name"
          value={getStringFilterValue(nameColumn?.getFilterValue())}
          onChange={(event) => nameColumn?.setFilterValue(event.target.value)}
          sx={{ ...formFieldSx, minWidth: 220, flex: 1 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ color: COLORS.text.muted, fontSize: 20 }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <Autocomplete
          size="small"
          freeSolo
          options={companyOptions}
          value={getStringFilterValue(companyColumn?.getFilterValue())}
          inputValue={getStringFilterValue(companyColumn?.getFilterValue())}
          onInputChange={(_, value) => companyColumn?.setFilterValue(value || undefined)}
          sx={{ minWidth: 240, flex: 1 }}
          renderInput={(params) => (
            <TextField {...params} label="Company" placeholder="Search company" sx={formFieldSx} />
          )}
        />

        <Autocomplete
          size="small"
          freeSolo
          options={roleOptions}
          value={getStringFilterValue(roleColumn?.getFilterValue())}
          inputValue={getStringFilterValue(roleColumn?.getFilterValue())}
          onInputChange={(_, value) => roleColumn?.setFilterValue(value || undefined)}
          sx={{ minWidth: 200, flex: 1 }}
          renderInput={(params) => (
            <TextField {...params} label="Role" placeholder="Search role" sx={formFieldSx} />
          )}
        />

        <Button
          variant="outlined"
          disabled={!hasActiveFilters}
          onClick={() => table.resetColumnFilters(true)}
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
          Clear
        </Button>

        <Typography variant="body2" sx={{ flex: "1 0 100%", color: COLORS.text.tertiary }}>
          Showing {rows.length} of {dummyUsers.length} users
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} sx={{ backgroundColor: COLORS.background.subtle }}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    sx={{
                      fontWeight: 700,
                      color: COLORS.text.tertiary,
                      fontSize: "0.75rem",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      borderBottomColor: COLORS.border.default,
                    }}
                  >
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  sx={{ py: 6, textAlign: "center", color: COLORS.text.muted }}
                >
                  No users match the current filters
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{
                    "&:last-of-type td": { borderBottom: 0 },
                    "& td": { borderBottomColor: COLORS.border.light },
                  }}
                >
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
