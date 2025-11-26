// selectors.ts
import { RootState } from '../../store';

export const selectProducts = (state: RootState) => state.entries.products;
