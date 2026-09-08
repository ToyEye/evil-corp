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

import type { InventoryItem } from "../../data/inventory.schema";
import { selectUser } from "../../store/auth/auth.slice";
import {
  addInventoryItem,
  selectInventoryItems,
  updateInventoryItem,
} from "../../store/inventory/inventory.slice";
import { addRestockRequest } from "../../store/restock/restock.slice";
import { useAppDispatch } from "../../store/types";
import { COLORS } from "../../theme/COLORS";
import { getStockLevel } from "../../theme/stockLevel";
import { ProductDetailModal } from "./ProductDetailModal";
import { ProductFormModal, type ProductFormValues } from "./ProductFormModal";
import { RestockRequestModal, type RestockRequestFormValues } from "./RestockRequestModal";
import { StockQuantityChip } from "./StockQuantityChip";

const PAGE_SIZES = [10, 20, 50] as const;

const warehouseTableFeatures = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

const columnHelper = createColumnHelper<typeof warehouseTableFeatures, InventoryItem>();

const columns = columnHelper.columns([
  columnHelper.accessor("sku", {
    header: "SKU",
    cell: (info) => (
      <Typography sx={{ fontWeight: 600, color: COLORS.text.primary }}>{info.getValue()}</Typography>
    ),
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => (
      <Typography sx={{ color: COLORS.text.secondary }}>{info.getValue()}</Typography>
    ),
  }),
  columnHelper.accessor("quantity", {
    header: "Quantity",
    cell: (info) => <StockQuantityChip quantity={info.getValue()} />,
  }),
]);

const toFormValues = (item: InventoryItem): ProductFormValues => ({
  sku: item.sku,
  name: item.name,
  description: item.description,
  quantity: item.quantity,
  category: item.category,
});

export const WarehouseTable = () => {
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);
  const items = useSelector(selectInventoryItems);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<InventoryItem | null>(null);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [restockItem, setRestockItem] = useState<InventoryItem | null>(null);
  const [skuError, setSkuError] = useState<string>();

  const canManage = user?.role === "Storekeeper";
  const companyItems = useMemo(
    () => items.filter((item) => item.companyId === user?.companyId),
    [items, user?.companyId],
  );

  const table = useTable({
    features: warehouseTableFeatures,
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

  const isSkuTaken = (sku: string, ignoreId?: string) =>
    companyItems.some(
      (item) =>
        item.id !== ignoreId && item.sku.toLowerCase() === sku.trim().toLowerCase(),
    );

  const handleAdd = (values: ProductFormValues) => {
    if (!user) {
      return;
    }

    if (isSkuTaken(values.sku)) {
      setSkuError("This SKU already exists in the warehouse");
      return;
    }

    dispatch(
      addInventoryItem({
        id: crypto.randomUUID(),
        sku: values.sku.trim(),
        name: values.name.trim(),
        description: values.description.trim(),
        quantity: values.quantity,
        category: values.category,
        companyId: user.companyId,
        companyName: user.companyName,
      }),
    );
    setSkuError(undefined);
    setIsAddOpen(false);
  };

  const handleEdit = (values: ProductFormValues) => {
    if (!editItem) {
      return;
    }

    dispatch(
      updateInventoryItem({
        ...editItem,
        name: values.name.trim(),
        description: values.description.trim(),
        quantity: values.quantity,
        category: values.category,
      }),
    );
    setEditItem(null);
  };

  const handleRestock = (values: RestockRequestFormValues) => {
    if (!user || !restockItem) {
      return;
    }

    dispatch(
      addRestockRequest({
        id: crypto.randomUUID(),
        productId: restockItem.id,
        sku: restockItem.sku,
        productName: restockItem.name,
        quantity: values.quantity,
        note: values.note.trim(),
        requestedById: user.id,
        requestedByName: user.name,
        companyId: user.companyId,
        companyName: user.companyName,
        createdAt: new Date().toISOString(),
      }),
    );
    setRestockItem(null);
  };

  const stockRowSx = (quantity: number) => {
    const level = getStockLevel(quantity);

    if (level === "critical") {
      return {
        backgroundColor: COLORS.error[50],
        "&.MuiTableRow-hover:hover": { backgroundColor: COLORS.error[100] },
      };
    }

    if (level === "low") {
      return {
        backgroundColor: COLORS.warning[50],
        "&.MuiTableRow-hover:hover": { backgroundColor: COLORS.warning[100] },
      };
    }

    return {};
  };

  return (
    <>
      {canManage && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={() => {
              setSkuError(undefined);
              setIsAddOpen(true);
            }}
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
            Add
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
                    No products in this warehouse
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
                      ...stockRowSx(row.original.quantity),
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

      <ProductFormModal
        isOpen={isAddOpen}
        mode="add"
        skuError={skuError}
        onClose={() => {
          setSkuError(undefined);
          setIsAddOpen(false);
        }}
        onSubmit={handleAdd}
      />

      <ProductDetailModal
        item={detailItem}
        canEdit={canManage}
        canRequestRestock={canManage}
        onClose={() => setDetailItem(null)}
        onEdit={(item) => {
          setDetailItem(null);
          setEditItem(item);
        }}
        onRequestRestock={(item) => {
          setDetailItem(null);
          setRestockItem(item);
        }}
      />

      <RestockRequestModal
        item={restockItem}
        onClose={() => setRestockItem(null)}
        onSubmit={handleRestock}
      />

      <ProductFormModal
        isOpen={Boolean(editItem)}
        mode="edit"
        initialValues={editItem ? toFormValues(editItem) : undefined}
        onClose={() => setEditItem(null)}
        onSubmit={handleEdit}
      />
    </>
  );
};
