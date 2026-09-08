import { useMemo, useState } from "react";
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

import type { Client } from "../../data/clients.schema";
import { selectUser } from "../../store/auth/auth.slice";
import { addClient, selectClients, updateClient } from "../../store/clients/clients.slice";
import { syncDeliveryClient } from "../../store/deliveries/deliveries.slice";
import { useAppDispatch } from "../../store/types";
import { COLORS } from "../../theme/COLORS";
import { ClientDetailModal } from "./ClientDetailModal";
import { ClientFormModal, type ClientFormValues } from "./ClientFormModal";

const PAGE_SIZES = [10, 20, 50] as const;

const clientsTableFeatures = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

const columnHelper = createColumnHelper<typeof clientsTableFeatures, Client>();

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

const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => (
      <Typography sx={{ fontWeight: 600, color: COLORS.text.primary }}>{info.getValue()}</Typography>
    ),
  }),
  columnHelper.accessor("phone", {
    header: "Phone",
    cell: (info) => (
      <Typography sx={{ color: COLORS.text.secondary }}>{info.getValue()}</Typography>
    ),
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => (
      <Typography sx={{ color: COLORS.text.secondary }}>{info.getValue()}</Typography>
    ),
  }),
  columnHelper.accessor("addedAt", {
    header: "Date added",
    cell: (info) => (
      <Typography sx={{ color: COLORS.text.secondary }}>{formatDate(info.getValue())}</Typography>
    ),
  }),
]);

export const ClientsTable = () => {
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);
  const items = useSelector(selectClients);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<Client | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const canManage = user?.role === "Staff";
  const companyItems = useMemo(
    () => items.filter((item) => item.companyId === user?.companyId),
    [items, user?.companyId],
  );

  const table = useTable({
    features: clientsTableFeatures,
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

  const toAddresses = (values: ClientFormValues) =>
    values.addresses
      .map((address) => ({
        id: address.id ?? crypto.randomUUID(),
        line: address.line.trim(),
      }))
      .filter((address) => address.line);

  const handleAdd = (values: ClientFormValues) => {
    if (!user) {
      return;
    }

    dispatch(
      addClient({
        id: crypto.randomUUID(),
        name: values.name.trim(),
        phone: values.phone.trim(),
        email: values.email.trim().toLowerCase(),
        addedAt: values.addedAt,
        note: values.note.trim(),
        addresses: toAddresses(values),
        companyId: user.companyId,
        companyName: user.companyName,
      }),
    );
    setIsAddOpen(false);
  };

  const handleEdit = (values: ClientFormValues) => {
    if (!detailItem) {
      return;
    }

    const nextClient: Client = {
      ...detailItem,
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim().toLowerCase(),
      addedAt: values.addedAt,
      note: values.note.trim(),
      addresses: toAddresses(values),
    };

    dispatch(updateClient(nextClient));
    dispatch(
      syncDeliveryClient({
        clientId: nextClient.id,
        clientName: nextClient.name,
        addresses: nextClient.addresses,
      }),
    );
    setDetailItem(nextClient);
    setIsEditing(false);
  };

  return (
    <>
      {canManage && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={() => setIsAddOpen(true)}
            sx={{
              px: 2.5,
              py: 1.1,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: COLORS.primary[600],
              boxShadow: `0 4px 14px ${COLORS.ui.shadowStrong}`,
              "&:hover": { backgroundColor: COLORS.primary[700] },
            }}
          >
            Add client
          </Button>
        </Box>
      )}

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
                    No clients in this directory
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    onClick={() => {
                      setIsEditing(false);
                      setDetailItem(row.original);
                    }}
                    sx={{
                      cursor: "pointer",
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
                    backgroundColor: pageSize === size ? COLORS.primary[700] : COLORS.background.subtle,
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

      <ClientFormModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
      />
      <ClientFormModal
        isOpen={isEditing && Boolean(detailItem)}
        client={detailItem}
        onClose={() => setIsEditing(false)}
        onSubmit={handleEdit}
      />
      <ClientDetailModal
        client={isEditing ? null : detailItem}
        canEdit={canManage}
        onClose={() => {
          setIsEditing(false);
          setDetailItem(null);
        }}
        onEdit={() => setIsEditing(true)}
      />
    </>
  );
};
