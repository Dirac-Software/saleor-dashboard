import {
  ExportProductsInput as GraphQLExportProductsInput,
  ExportScope,
  FileTypesEnum,
} from "@dashboard/graphql";

// Extended type to include new fields that will be added to GraphQL schema
export type ExportProductsInput = GraphQLExportProductsInput & {
  embedImages?: boolean;
  compressVariants?: boolean;
};

export interface ExportSettingsInput {
  scope: ExportScope;
  fileType: FileTypesEnum;
  embedImages?: boolean;
  compressVariants?: boolean;
}

export interface ExportSettingsFormData {
  fileType: FileTypesEnum;
  scope: ExportScope;
  embedImages?: boolean;
  compressVariants?: boolean;
}

export const exportSettingsInitialFormData = {
  fileType: FileTypesEnum.CSV,
  scope: ExportScope.ALL,
  embedImages: false,
  compressVariants: false,
};

export const exportSettingsInitialFormDataWithIds = {
  fileType: FileTypesEnum.CSV,
  scope: ExportScope.IDS,
  embedImages: false,
  compressVariants: false,
};
