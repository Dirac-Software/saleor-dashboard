import {
  ExportInfoInput as GraphQLExportInfoInput,
  ExportProductsInput as GraphQLExportProductsInput,
  ExportScope,
  FileTypesEnum,
  InputMaybe,
  ProductFilterInput,
  Scalars,
} from "@dashboard/graphql";

// Extended type to include new fields that will be added to GraphQL schema
type ExportInfoInputExtended = GraphQLExportInfoInput & {
  embedImages?: boolean;
  compressVariants?: boolean;
  priceListFormat?: boolean;
};

type ExportProductsInputExtended = Omit<GraphQLExportProductsInput, "exportInfo"> & {
  exportInfo?: InputMaybe<ExportInfoInputExtended>;
  embedImages?: boolean;
  compressVariants?: boolean;
  priceListFormat?: boolean;
};

export class ProductsExportParameters {
  private readonly exportInfo?: InputMaybe<ExportInfoInputExtended>;

  private readonly fileType: FileTypesEnum;

  private readonly filter?: InputMaybe<ProductFilterInput>;

  private readonly ids?: InputMaybe<Array<Scalars["ID"]>>;

  private readonly scope: ExportScope;

  constructor(input: ExportProductsInputExtended) {
    // Move embedImages, compressVariants, and priceListFormat from root level into exportInfo
    const { embedImages, compressVariants, priceListFormat, exportInfo, ...rest } = input;

    this.exportInfo = exportInfo
      ? {
          ...exportInfo,
          embedImages: embedImages !== undefined ? embedImages : exportInfo.embedImages,
          compressVariants:
            compressVariants !== undefined ? compressVariants : exportInfo.compressVariants,
          priceListFormat:
            priceListFormat !== undefined ? priceListFormat : exportInfo.priceListFormat,
        }
      : undefined;

    this.fileType = rest.fileType;
    this.filter = rest.filter;
    this.ids = rest.ids;
    this.scope = rest.scope;
  }

  asExportProductsInput(): GraphQLExportProductsInput {
    return {
      exportInfo: this.exportInfo as any,
      fileType: this.fileType,
      filter: this.filter,
      ids: this.ids,
      scope: this.scope,
    };
  }
}
