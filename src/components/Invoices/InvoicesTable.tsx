import { useMemo } from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import {
  createColumnHelper,
  createPaginatedRowModel,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";

import type { Invoice } from "../../data/invoices.schema";
import { useInvoicesQuery } from "../../hooks";
import { selectUser } from "../../store/auth/auth.slice";
import { COLORS } from "../../theme/COLORS";
import { formatDateTime } from "../../utils/formatDateTime";
import { formatMoney } from "../../utils/formatMoney";

const PAGE_SIZES = [10, 20, 50] as const;

const invoicesTableFeatures = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

const columnHelper = createColumnHelper<typeof invoicesTableFeatures, Invoice>();

const columns = columnHelper.columns([
  columnHelper.accessor("number", {
    header: "Number",
    cell: (info) => (
      <Typography sx={{ fontWeight: 600, color: COLORS.text.primary }}>{info.getValue()}</Typography>
    ),
  }),
  columnHelper.accessor("orderNumber", {
    header: "Order",
    cell: (info) => (
      <Typography sx={{ color: COLORS.text.secondary }}>{info.getValue()}</Typography>
    ),
  }),
  columnHelper.accessor("clientName", {
    header: "Client",
    cell: (info) => (
      <Typography sx={{ color: COLORS.text.secondary }}>{info.getValue()}</Typography>
    ),
  }),
  columnHelper.accessor("total", {
    header: "Total",
    cell: (info) => (
      <Typography sx={{ fontWeight: 600, color: COLORS.text.primary }}>
        {formatMoney(info.getValue())}
      </Typography>
    ),
  }),
  columnHelper.accessor("paidAt", {
    header: "Paid",
    cell: (info) => (
      <Typography sx={{ color: COLORS.text.secondary }}>{formatDateTime(info.getValue())}</Typography>
    ),
  }),
]);

export const InvoicesTable = () => {
  const user = useSelector(selectUser);
  const { data: itemsData } = useInvoicesQuery();
  const items = itemsData ?? [];
  const companyItems = useMemo(
    () => items.filter((item) => item.companyId === user?.companyId),
    [items, user?.companyId],
  );

  const table = useTable({
    features: invoicesTableFeatures,
    columns,
    data: companyItems,
    getRowId: (row) => row.id,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  });

  const rows = table.getRowModel().rows;
  const pageSize = table.state.pagination.pageSize;
  const pageIndex = table.state.pagination.pageIndex;
  const pageCount = Math.max(table.getPageCount(), 1);

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
                  No invoices yet
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.id}
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

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          px: 2.5,
          py: 1.75,
          borderTop: `1px solid ${COLORS.border.light}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {PAGE_SIZES.map((size) => (
            <Button
              key={size}
              variant={pageSize === size ? "contained" : "outlined"}
              onClick={() => table.setPageSize(size)}
              sx={{
                minWidth: 48,
                height: 36,
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                color: pageSize === size ? COLORS.text.inverse : COLORS.text.secondary,
                backgroundColor: pageSize === size ? COLORS.primary[600] : "transparent",
                borderColor: COLORS.border.default,
                boxShadow: "none",
                "&:hover": {
                  backgroundColor:
                    pageSize === size ? COLORS.primary[700] : COLORS.background.subtle,
                  borderColor: COLORS.border.strong,
                  boxShadow: "none",
                },
              }}
            >
              {size}
            </Button>
          ))}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography variant="body2" sx={{ color: COLORS.text.tertiary }}>
            Page {pageIndex + 1} of {pageCount}
          </Typography>
          <Button
            variant="outlined"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            sx={{
              minWidth: 84,
              height: 36,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              color: COLORS.text.secondary,
              borderColor: COLORS.border.default,
            }}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            sx={{
              minWidth: 84,
              height: 36,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              color: COLORS.text.secondary,
              borderColor: COLORS.border.default,
            }}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
