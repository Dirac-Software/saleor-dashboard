import {
  ExportInfoInput as GraphQLExportInfoInput,
  ExportProductsInput as GraphQLExportProductsInput,
  ExportScope,
  FileTypesEnum,
  InputMaybe,
} from "@dashboard/graphql";

// Extended type to include new fields that will be added to GraphQL schema
export type ExportInfoInput = GraphQLExportInfoInput & {
  embedImages?: boolean;
  compressVariants?: boolean;
  priceListFormat?: boolean;
};

// Extended ExportProductsInput that uses the extended ExportInfoInput
export type ExportProductsInput = Omit<GraphQLExportProductsInput, "exportInfo"> & {
  exportInfo?: InputMaybe<ExportInfoInput>;
  embedImages?: boolean;
  compressVariants?: boolean;
  priceListFormat?: boolean;
};

export interface ExportSettingsInput {
  scope: ExportScope;
  fileType: FileTypesEnum;
  embedImages?: boolean;
  compressVariants?: boolean;
  priceListFormat?: boolean;
}

export interface ExportSettingsFormData {
  fileType: FileTypesEnum;
  scope: ExportScope;
  embedImages?: boolean;
  compressVariants?: boolean;
  priceListFormat?: boolean;
}

export const exportSettingsInitialFormData = {
  fileType: FileTypesEnum.CSV,
  scope: ExportScope.ALL,
  embedImages: false,
  compressVariants: false,
  priceListFormat: false,
};

export const exportSettingsInitialFormDataWithIds = {
  fileType: FileTypesEnum.CSV,
  scope: ExportScope.IDS,
  embedImages: false,
  compressVariants: false,
  priceListFormat: false,
};
