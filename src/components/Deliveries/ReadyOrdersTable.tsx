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

import { getOrderTotal, isOrderReadyToShip, type Order } from "../../data/orders.schema";
import { isDeliveryTerminal } from "../../data/deliveries.schema";
import { selectUser } from "../../store/auth/auth.slice";
import { selectDeliveries } from "../../store/deliveries/deliveries.slice";
import { selectOrders } from "../../store/orders/orders.slice";
import { COLORS } from "../../theme/COLORS";
import { formatMoney } from "../../utils/formatMoney";
import { FulfillmentStatusChip } from "../Orders/FulfillmentStatusChip";
import { OrderStatusChip } from "../Orders/OrderStatusChip";
import { ScheduleDeliveryModal } from "./ScheduleDeliveryModal";

const PAGE_SIZES = [10, 20, 50] as const;

const readyOrdersTableFeatures = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

const columnHelper = createColumnHelper<typeof readyOrdersTableFeatures, Order>();

export const ReadyOrdersTable = () => {
  const user = useSelector(selectUser);
  const orders = useSelector(selectOrders);
  const deliveries = useSelector(selectDeliveries);
  const [scheduledOrder, setScheduledOrder] = useState<Order | null>(null);
  const canSchedule = user?.role === "Staff";

  const readyOrders = useMemo(() => {
    const scheduledIds = new Set(
      deliveries
        .filter(
          (item) =>
            item.companyId === user?.companyId &&
            item.orderId &&
            !isDeliveryTerminal(item.status),
        )
        .map((item) => item.orderId),
    );

    return orders.filter(
      (order) =>
        order.companyId === user?.companyId &&
        isOrderReadyToShip(order) &&
        !scheduledIds.has(order.id),
    );
  }, [deliveries, orders, user?.companyId]);

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor("number", {
          header: "Order",
          cell: (info) => (
            <Typography sx={{ fontWeight: 600, color: COLORS.text.primary }}>
              {info.getValue()}
            </Typography>
          ),
        }),
        columnHelper.accessor("clientName", {
          header: "Client",
          cell: (info) => (
            <Typography sx={{ color: COLORS.text.secondary }}>{info.getValue()}</Typography>
          ),
        }),
        columnHelper.accessor("destination", {
          header: "Address",
          cell: (info) => (
            <Typography sx={{ color: COLORS.text.secondary }}>{info.getValue() || "—"}</Typography>
          ),
        }),
        columnHelper.accessor((row) => getOrderTotal(row.items), {
          id: "total",
          header: "Total",
          cell: (info) => (
            <Typography sx={{ fontWeight: 600, color: COLORS.text.primary }}>
              {formatMoney(info.getValue())}
            </Typography>
          ),
        }),
        columnHelper.accessor("status", {
          header: "Status",
          cell: (info) => <OrderStatusChip status={info.getValue()} />,
        }),
        columnHelper.accessor("fulfillmentStatus", {
          header: "Fulfillment",
          cell: (info) => <FulfillmentStatusChip status={info.getValue()} />,
        }),
      ]),
    [],
  );

  const table = useTable({
    features: readyOrdersTableFeatures,
    columns,
    data: readyOrders,
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
  const selected = readyOrders.find((item) => item.id === scheduledOrder?.id) ?? null;

  return (
    <>
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
                    No picked orders ready for delivery
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow
                    key={row.id}
                    hover={canSchedule}
                    onClick={() => {
                      if (canSchedule) {
                        setScheduledOrder(row.original);
                      }
                    }}
                    sx={{
                      cursor: canSchedule ? "pointer" : "default",
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

      <ScheduleDeliveryModal order={selected} onClose={() => setScheduledOrder(null)} />
    </>
  );
};
