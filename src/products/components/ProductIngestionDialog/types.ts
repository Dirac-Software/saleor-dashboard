export enum ProductIngestionStep {
  UPLOAD = 0,
  MAPPING = 1,
  SETTINGS = 2,
}

import { StockUpdateModeEnum } from "@dashboard/graphql/types.generated";

export interface ProductIngestionFormData {
  file: File | null;
  fileId: string;
  availableColumns: string[];
  rowCount: number;
  sheetNames: string[];
  selectedSheet: string;
  headerRow: number;
  previewData: string[][] | null;
  columnMapping: {
    code: string;
    brand: string;
    description: string;
    category: string;
    sizes: string;
    rrp: string;
    price: string;
    weight: string;
    image: string;
  };
  warehouseName: string;
  warehouseAddress: string;
  warehouseCountry: string;
  minimumOrderQuantity: number;
  confirmPriceInterpretation: boolean;
  notForWeb: boolean;
  defaultCurrency: string;
  stockUpdateMode: StockUpdateModeEnum;
  dryRun: boolean;
  errorOnDuplicatesInSheet: boolean;
}

export interface ProductIngestionDialogProps {
  open: boolean;
  onClose: () => void;
  onCompleted: (data: ProductIngestionResult) => void;
}

export interface ProductIngestionResult {
  success: boolean;
  createdProductsCount: number;
  updatedProductsCount: number;
  skippedProductsCount: number;
  totalVariantsCreated: number;
  totalVariantsUpdated: number;
  warehouseName: string;
}

export interface ColumnMappingOption {
  value: string;
  label: string;
  description?: string;
}

// Available product fields for mapping (matching SpreadsheetColumnMappingInput)
export const PRODUCT_FIELD_OPTIONS: ColumnMappingOption[] = [
  { value: "", label: "Skip this column", description: "Don't import this column" },
  { value: "code", label: "Product Code", description: "Product code/SKU" },
  { value: "brand", label: "Brand", description: "Product brand/manufacturer" },
  { value: "description", label: "Description", description: "Product description/name" },
  { value: "category", label: "Category", description: "Product category" },
  { value: "sizes", label: "Sizes", description: "Sizes with quantities (e.g., '8[5], 9[3]')" },
  { value: "rrp", label: "RRP", description: "Recommended retail price" },
  { value: "price", label: "Price", description: "Sale price (excluding VAT)" },
  { value: "weight", label: "Weight", description: "Product weight in grams" },
  { value: "image", label: "Image URL", description: "Product image URL" },
];
