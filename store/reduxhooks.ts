// store/reduxhooks.ts
import type { Product } from "@/src/types/product";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./index";

import {
    addProduct as addProductAction,
    closeDetail as closeDetailAction,
    deleteProduct as deleteProductAction,
    openDetail as openDetailAction,
    updateProduct as updateProductAction,
} from "../features/entries/entriesSlice";

export const useProducts = () => {
  const dispatch = useDispatch<AppDispatch>();

  const products = useSelector((state: RootState) => state.entries.products);
  const selectedProduct = useSelector(
    (state: RootState) => state.entries.selectedProduct
  );
  const isDetailOpen = useSelector(
    (state: RootState) => state.entries.isDetailOpen
  );

  const addProduct = (product: Product) => {
    dispatch(addProductAction(product));
  };

  const updateProduct = (product: Product) => {
    dispatch(updateProductAction(product));
  };

  const deleteProduct = (id: string) => {
    dispatch(deleteProductAction(id));
  };

  const openDetail = (product: Product) => {
    dispatch(openDetailAction(product));
  };

  const closeDetail = () => {
    dispatch(closeDetailAction());
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    openDetail,
    closeDetail,
    isDetailOpen,
    selectedProduct,
  };
};
