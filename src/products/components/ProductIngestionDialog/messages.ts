import { defineMessages } from "react-intl";

export const productIngestionDialogMessages = defineMessages({
  title: {
    id: "ru9DoH",
    defaultMessage: "Import Products",
    description: "import products dialog header",
  },
  uploadStepTitle: {
    id: "LQGH3A",
    defaultMessage: "Upload File",
    description: "upload step title",
  },
  mappingStepTitle: {
    id: "fwMk+T",
    defaultMessage: "Map Columns",
    description: "mapping step title",
  },
  settingsStepTitle: {
    id: "EZEe6a",
    defaultMessage: "Configure Settings",
    description: "settings step title",
  },
  uploadDescription: {
    id: "ZKT8HP",
    defaultMessage: "Upload an Excel file (XLSX or CSV) containing your product data",
    description: "upload step description",
  },
  uploadButton: {
    id: "BePqy2",
    defaultMessage: "Choose File",
    description: "upload file button",
  },
  next: {
    id: "VBskEq",
    defaultMessage: "Next",
    description: "next button",
  },
  back: {
    id: "PNq9W/",
    defaultMessage: "Back",
    description: "back button",
  },
  import: {
    id: "dtUxP6",
    defaultMessage: "Import Products",
    description: "import button",
  },
  cancel: {
    id: "sR5mWJ",
    defaultMessage: "Cancel",
    description: "cancel button",
  },
  mappingDescription: {
    id: "JCx/H/",
    defaultMessage:
      "Map columns from your spreadsheet to product fields. Drag and drop to reorder, or select from the dropdown.",
    description: "mapping step description",
  },
  columnHeader: {
    id: "DEw6Ue",
    defaultMessage: "Spreadsheet Column",
    description: "column header in mapping table",
  },
  mapsToHeader: {
    id: "QFQxs4",
    defaultMessage: "Maps To",
    description: "maps to header in mapping table",
  },
  previewHeader: {
    id: "aZu0nm",
    defaultMessage: "Preview Data",
    description: "preview header in mapping table",
  },
  warehouseLabel: {
    id: "S5yFlL",
    defaultMessage: "Warehouse",
    description: "warehouse field label",
  },
  warehouseNameInputLabel: {
    id: "l5hu79",
    defaultMessage: "Warehouse Name",
    description: "warehouse name input label",
  },
  warehouseHelp: {
    id: "fCo9A4",
    defaultMessage: "Select existing warehouse or create a new one",
    description: "warehouse field help text",
  },
  moqLabel: {
    id: "opEsoj",
    defaultMessage: "Minimum Order Quantity",
    description: "minimum order quantity label",
  },
  moqHelp: {
    id: "oVoGHo",
    defaultMessage: "Set the minimum quantity customers must order",
    description: "minimum order quantity help text",
  },
  confirmPriceLabel: {
    id: "mL+7FV",
    defaultMessage: "I confirm the price values are correct",
    description: "price confirmation checkbox label",
  },
  confirmPriceHelp: {
    id: "oXKQ1i",
    defaultMessage: "Please verify that prices in your file are in the correct currency and format",
    description: "price confirmation help text",
  },
  uploadError: {
    id: "evv3BD",
    defaultMessage: "Failed to upload file. Please try again.",
    description: "upload error message",
  },
  importError: {
    id: "56oxM1",
    defaultMessage: "Failed to import products. Please check your data and try again.",
    description: "import error message",
  },
  importSuccess: {
    id: "Vk5bN/",
    defaultMessage: "Successfully imported {created} products and updated {updated} products",
    description: "import success message",
  },
  noFileSelected: {
    id: "ygHXI8",
    defaultMessage: "Please select a file to upload",
    description: "no file error",
  },
  invalidMapping: {
    id: "+SpXzn",
    defaultMessage: "Please map at least the SKU and Name columns",
    description: "invalid mapping error",
  },
  settingsDescription: {
    id: "dNmilN",
    defaultMessage: "Configure import settings and confirm your choices",
    description: "settings step description",
  },
  fileSelected: {
    id: "2vbvmS",
    defaultMessage: "File: {filename}",
    description: "file selected label",
  },
  rowsDetected: {
    id: "Vf+FAa",
    defaultMessage: "{count} rows detected",
    description: "rows count label",
  },
  sheetSelectLabel: {
    id: "Gtqd71",
    defaultMessage: "Select Sheet",
    description: "sheet selection label",
  },
  sheetSelectHelp: {
    id: "qjufrI",
    defaultMessage: "Choose which sheet to import from the Excel file",
    description: "sheet selection help text",
  },
  warehouseAddressLabel: {
    id: "+dheBT",
    defaultMessage: "Warehouse Address",
    description: "warehouse address label",
  },
  warehouseCountryLabel: {
    id: "LytMpv",
    defaultMessage: "Warehouse Country",
    description: "warehouse country label",
  },
  warehouseCountryHelp: {
    id: "+2NQOM",
    defaultMessage: "ISO2 country code (e.g., GB, AE, US)",
    description: "warehouse country help text",
  },
  notForWebLabel: {
    id: "2/thh7",
    defaultMessage: "Not for web (wholesale only)",
    description: "not for web checkbox label",
  },
  defaultCurrencyLabel: {
    id: "tkCZ7g",
    defaultMessage: "Default Currency",
    description: "default currency label",
  },
  stockUpdateModeLabel: {
    id: "SRebNm",
    defaultMessage: "Stock Update Mode",
    description: "stock update mode label",
  },
  stockModeReplace: {
    id: "3CPRdD",
    defaultMessage: "Replace (overwrite existing stock)",
    description: "stock mode replace option",
  },
  stockModeAdd: {
    id: "3iFYj8",
    defaultMessage: "Add (increment existing stock)",
    description: "stock mode add option",
  },
  headerRowLabel: {
    id: "XW01wp",
    defaultMessage: "Header Row",
    description: "header row label",
  },
  headerRowHelp: {
    id: "ZfOQOT",
    defaultMessage: "Row number containing column headers (0 for first row)",
    description: "header row help text",
  },
  loadColumns: {
    id: "D+Vw8P",
    defaultMessage: "Load Columns",
    description: "load columns button",
  },
  dryRunLabel: {
    id: "3brBbm",
    defaultMessage: "Dry run (preview only, don't save changes)",
    description: "dry run checkbox label",
  },
  dryRunHelp: {
    id: "Bo1wqN",
    defaultMessage: "Enable to validate and preview the import without making any changes",
    description: "dry run help text",
  },
  errorOnDuplicatesLabel: {
    id: "73R/oW",
    defaultMessage: "Error on duplicate products in sheet",
    description: "error on duplicates checkbox label",
  },
  errorOnDuplicatesHelp: {
    id: "6Vj2rQ",
    defaultMessage:
      "If enabled, import will fail when duplicate products are found in the spreadsheet. If disabled, duplicate entries will be merged.",
    description: "error on duplicates help text",
  },
});
