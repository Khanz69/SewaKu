// features/entries/entriesSlice.ts
import type { Product } from "@/src/types/product";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type EntriesState = {
  products: Product[];
  selectedProduct: Product | null;
  isDetailOpen: boolean;
};

const initialState: EntriesState = {
  products: [],
  selectedProduct: null,
  isDetailOpen: false,
};

const entriesSlice = createSlice({
  name: "entries",
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<Product>) {
      state.products.push(action.payload);
    },
    updateProduct(state, action: PayloadAction<Product>) {
      const idx = state.products.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) {
        state.products[idx] = action.payload;
      }
    },
    deleteProduct(state, action: PayloadAction<string>) {
      state.products = state.products.filter((p) => p.id !== action.payload);

      if (state.selectedProduct && state.selectedProduct.id === action.payload) {
        state.selectedProduct = null;
        state.isDetailOpen = false;
      }
    },
    openDetail(state, action: PayloadAction<Product>) {
      state.selectedProduct = action.payload;
      state.isDetailOpen = true;
    },
    closeDetail(state) {
      state.isDetailOpen = false;
      state.selectedProduct = null;
    },
  },
});

export const {
  addProduct,
  updateProduct,
  deleteProduct,
  openDetail,
  closeDetail,
} = entriesSlice.actions;

export default entriesSlice.reducer;
