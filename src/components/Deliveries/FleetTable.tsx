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

import { getVehicleRemainingUnits, getVehicleUsedUnits } from "../../data/fleet.utils";
import type { Vehicle } from "../../data/vehicles.schema";
import {
  useCreateVehicleMutation,
  useDeliveriesQuery,
  useVehiclesQuery,
} from "../../hooks";
import { selectUser } from "../../store/auth/auth.slice";
import { COLORS } from "../../theme/COLORS";
import { VehicleFormModal, type VehicleFormValues } from "./VehicleFormModal";

const PAGE_SIZES = [10, 20, 50] as const;

const fleetTableFeatures = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

type FleetRow = Vehicle & { usedUnits: number; remainingUnits: number };

const columnHelper = createColumnHelper<typeof fleetTableFeatures, FleetRow>();

const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: "Vehicle",
    cell: (info) => (
      <Typography sx={{ fontWeight: 600, color: COLORS.text.primary }}>{info.getValue()}</Typography>
    ),
  }),
  columnHelper.accessor("plate", {
    header: "Plate",
    cell: (info) => (
      <Typography sx={{ color: COLORS.text.secondary }}>{info.getValue()}</Typography>
    ),
  }),
  columnHelper.accessor("type", {
    header: "Type",
    cell: (info) => (
      <Typography sx={{ color: COLORS.text.secondary }}>{info.getValue()}</Typography>
    ),
  }),
  columnHelper.accessor("maxUnits", {
    header: "Capacity",
    cell: (info) => (
      <Typography sx={{ color: COLORS.text.secondary }}>{info.getValue()} units</Typography>
    ),
  }),
  columnHelper.accessor("usedUnits", {
    header: "On trips",
    cell: (info) => (
      <Typography sx={{ color: COLORS.text.secondary }}>{info.getValue()}</Typography>
    ),
  }),
  columnHelper.accessor("remainingUnits", {
    header: "Remaining",
    cell: (info) => {
      const remaining = info.getValue();
      const color =
        remaining <= 0 ? COLORS.error[700] : remaining < 8 ? COLORS.warning[700] : COLORS.success[700];

      return <Typography sx={{ fontWeight: 600, color }}>{remaining}</Typography>;
    },
  }),
]);

export const FleetTable = () => {
  const user = useSelector(selectUser);
  const { data: vehiclesData } = useVehiclesQuery();
  const { data: deliveriesData } = useDeliveriesQuery();
  const createVehicle = useCreateVehicleMutation();
  const vehicles = vehiclesData ?? [];
  const deliveries = deliveriesData ?? [];
  const [isAddOpen, setIsAddOpen] = useState(false);
  const canManage = user?.role === "Staff";

  const rowsData = useMemo(
    () =>
      vehicles
        .filter((item) => item.companyId === user?.companyId)
        .map((item) => ({
          ...item,
          usedUnits: getVehicleUsedUnits(item.id, deliveries),
          remainingUnits: getVehicleRemainingUnits(item, deliveries),
        })),
    [deliveries, user?.companyId, vehicles],
  );

  const table = useTable({
    features: fleetTableFeatures,
    columns,
    data: rowsData,
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

  const handleAdd = (values: VehicleFormValues) => {
    if (!user) {
      return;
    }

    createVehicle.mutate({
      name: values.name.trim(),
      plate: values.plate.trim().toUpperCase(),
      type: values.type,
      maxUnits: values.maxUnits,
    });
    setIsAddOpen(false);
  };

  return (
    <>
      {canManage ? (
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
            Add vehicle
          </Button>
        </Box>
      ) : null}

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
                    No vehicles in this fleet
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

      <VehicleFormModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSubmit={handleAdd} />
    </>
  );
};
