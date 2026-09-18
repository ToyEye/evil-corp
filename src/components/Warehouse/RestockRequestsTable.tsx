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

import { findOrderByNote } from "../../data/orders.schema";
import {
  canReceiveRestock,
  canSupplyAdvanceRestock,
  getNextRestockStatus,
  getRestockPurposeLabel,
  type RestockRequest,
} from "../../data/restock.schema";
import { selectUser } from "../../store/auth/auth.slice";
import {
  adjustInventoryQuantity,
  selectInventoryItems,
} from "../../store/inventory/inventory.slice";
import { reserveOrderItems, selectOrders } from "../../store/orders/orders.slice";
import { addRestockRequest, selectRestockRequests, updateRestockStatus } from "../../store/restock/restock.slice";
import { logOpsEvent } from "../../store/ops/logOpsEvent";
import { paths } from "../../routing/routes";
import { useAppDispatch } from "../../store/types";
import { COLORS } from "../../theme/COLORS";
import { RestockDetailModal } from "./RestockDetailModal";
import { RestockStatusChip } from "./RestockStatusChip";
import { SupplyRequestFormModal, type SupplyRequestFormValues } from "./SupplyRequestFormModal";

const PAGE_SIZES = [10, 20, 50] as const;

const restockTableFeatures = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

const columnHelper = createColumnHelper<typeof restockTableFeatures, RestockRequest>();

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

const columns = columnHelper.columns([
  columnHelper.accessor("productName", {
    header: "Product",
    cell: (info) => (
      <Box>
        <Typography sx={{ fontWeight: 600, color: COLORS.text.primary }}>
          {info.getValue()}
        </Typography>
        <Typography variant="body2" sx={{ color: COLORS.text.tertiary }}>
          {info.row.original.sku}
        </Typography>
      </Box>
    ),
  }),
  columnHelper.accessor("quantity", {
    header: "Qty",
    cell: (info) => (
      <Typography sx={{ fontWeight: 600, color: COLORS.text.primary }}>{info.getValue()}</Typography>
    ),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => <RestockStatusChip status={info.getValue()} />,
  }),
  columnHelper.accessor((row) => getRestockPurposeLabel(row), {
    id: "purpose",
    header: "Purpose",
    cell: (info) => (
      <Typography sx={{ color: COLORS.text.secondary }}>{info.getValue()}</Typography>
    ),
  }),
  columnHelper.accessor("requestedByName", {
    header: "From",
    cell: (info) => (
      <Typography sx={{ color: COLORS.text.secondary }}>{info.getValue()}</Typography>
    ),
  }),
  columnHelper.accessor("createdAt", {
    header: "Sent",
    cell: (info) => (
      <Typography sx={{ color: COLORS.text.secondary }}>{formatDateTime(info.getValue())}</Typography>
    ),
  }),
  columnHelper.accessor("note", {
    header: "Note",
    cell: (info) => (
      <Typography sx={{ color: COLORS.text.secondary }}>
        {info.getValue().trim() || "—"}
      </Typography>
    ),
  }),
]);

type RestockRequestsTableProps = {
  title?: string;
  description?: string;
  incomingOnly?: boolean;
};

export const RestockRequestsTable = ({ title, description, incomingOnly }: RestockRequestsTableProps) => {
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);
  const items = useSelector(selectRestockRequests);
  const orders = useSelector(selectOrders);
  const inventory = useSelector(selectInventoryItems);
  const [detailItem, setDetailItem] = useState<RestockRequest | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const canCreate = user?.role === "Supply" && !incomingOnly;
  const companyItems = useMemo(
    () =>
      items.filter((item) => {
        if (item.companyId !== user?.companyId) {
          return false;
        }

        if (incomingOnly) {
          return item.status === "Delivered";
        }

        return true;
      }),
    [incomingOnly, items, user?.companyId],
  );
  const companyProducts = useMemo(
    () => inventory.filter((item) => item.companyId === user?.companyId),
    [inventory, user?.companyId],
  );

  const table = useTable({
    features: restockTableFeatures,
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
  const selected = companyItems.find((item) => item.id === detailItem?.id) ?? null;

  const handleCreate = (values: SupplyRequestFormValues) => {
    if (!user) {
      return;
    }

    const product = companyProducts.find((item) => item.id === values.productId);

    if (!product) {
      return;
    }

    const note = values.note.trim();
    const matchedOrder = values.purposes.includes("order")
      ? findOrderByNote(note, orders, user.companyId)
      : undefined;

    dispatch(
      addRestockRequest({
        id: crypto.randomUUID(),
        productId: product.id,
        sku: product.sku,
        productName: product.name,
        quantity: values.quantity,
        note,
        status: "New",
        purposes: values.purposes,
        orderId: matchedOrder?.id,
        orderNumber: matchedOrder?.number,
        requestedById: user.id,
        requestedByName: user.name,
        companyId: user.companyId,
        companyName: user.companyName,
        createdAt: new Date().toISOString(),
      }),
    );
    setIsCreateOpen(false);
  };

  const canUpdateRequest = (request: RestockRequest) => {
    if (!user) {
      return false;
    }

    if (user.role === "Supply") {
      return canSupplyAdvanceRestock(request.status);
    }

    if (user.role === "Storekeeper") {
      return canReceiveRestock(request.status);
    }

    return false;
  };

  const handleAdvanceStatus = (request: RestockRequest) => {
    const nextStatus = getNextRestockStatus(request.status);

    if (!nextStatus || !user || !canUpdateRequest(request)) {
      return;
    }

    dispatch(updateRestockStatus({ id: request.id, status: nextStatus }));

    if (nextStatus === "Delivered") {
      dispatch(
        logOpsEvent({
          companyId: request.companyId,
          entityType: "restock",
          entityId: request.id,
          entityNumber: request.sku,
          message: "Supplier delivery arrived at the dock",
          actorId: user.id,
          actorName: user.name,
          notify: [
            {
              role: "Storekeeper",
              title: "Goods waiting at the dock",
              body: `${request.productName} is ready to receive`,
              href: paths.warehouse(user.companyName),
            },
          ],
        }),
      );
      return;
    }

    if (nextStatus !== "Received") {
      dispatch(
        logOpsEvent({
          companyId: request.companyId,
          entityType: "restock",
          entityId: request.id,
          entityNumber: request.sku,
          message: `Restock marked as ${nextStatus}`,
          actorId: user.id,
          actorName: user.name,
        }),
      );
      return;
    }

    dispatch(adjustInventoryQuantity({ id: request.productId, delta: request.quantity }));

    if (request.purposes.includes("order") && request.orderId) {
      const order = orders.find((item) => item.id === request.orderId);
      const line = order?.items.find((item) => item.productId === request.productId);
      const remaining = line ? Math.max(0, line.quantity - line.reservedQuantity) : 0;
      const toReserve = Math.min(request.quantity, remaining);

      if (toReserve > 0) {
        dispatch(
          reserveOrderItems({
            orderId: request.orderId,
            productId: request.productId,
            quantity: toReserve,
          }),
        );
        dispatch(adjustInventoryQuantity({ id: request.productId, delta: -toReserve }));
      }
    }

    dispatch(
      logOpsEvent({
        companyId: request.companyId,
        entityType: "restock",
        entityId: request.id,
        entityNumber: request.sku,
        message: "Received into warehouse",
        actorId: user.id,
        actorName: user.name,
        notify: request.orderNumber
          ? [
              {
                role: "Staff",
                title: "Stock received for an order",
                body: `${request.productName} can now cover ${request.orderNumber}`,
                href: paths.orders(user.companyName),
              },
            ]
          : undefined,
      }),
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {(title || description) && (
          <Box>
            {title && (
              <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>
                {title}
              </Typography>
            )}
            {description && (
              <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
                {description}
              </Typography>
            )}
          </Box>
        )}
        {canCreate ? (
          <Button
            variant="contained"
            onClick={() => setIsCreateOpen(true)}
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
            Create request
          </Button>
        ) : null}
      </Box>

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
                    No {incomingOnly ? "incoming receipts" : "restock requests"} yet
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    onClick={() => setDetailItem(row.original)}
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

      <RestockDetailModal
        request={selected}
        canUpdateStatus={Boolean(selected && canUpdateRequest(selected))}
        onClose={() => setDetailItem(null)}
        onAdvanceStatus={handleAdvanceStatus}
      />
      <SupplyRequestFormModal
        open={isCreateOpen}
        products={companyProducts}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />
    </Box>
  );
};
