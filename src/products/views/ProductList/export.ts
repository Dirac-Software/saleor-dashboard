import {
  ExportInfoInput,
  ExportProductsInput as GraphQLExportProductsInput,
  ExportScope,
  FileTypesEnum,
  InputMaybe,
  ProductFilterInput,
  Scalars,
} from "@dashboard/graphql";

// Extended type to include new fields that will be added to GraphQL schema
type ExportProductsInputExtended = GraphQLExportProductsInput & {
  embedImages?: boolean;
  compressVariants?: boolean;
};

export class ProductsExportParameters {
  private readonly exportInfo?: InputMaybe<ExportInfoInput>;

  private readonly fileType: FileTypesEnum;

  private readonly filter?: InputMaybe<ProductFilterInput>;

  private readonly ids?: InputMaybe<Array<Scalars["ID"]>>;

  private readonly scope: ExportScope;

  private readonly embedImages?: boolean;

  private readonly compressVariants?: boolean;

  constructor(input: ExportProductsInputExtended) {
    this.exportInfo = input.exportInfo;
    this.fileType = input.fileType;
    this.filter = input.filter;
    this.ids = input.ids;
    this.scope = input.scope;
    this.embedImages = input.embedImages;
    this.compressVariants = input.compressVariants;
  }

  asExportProductsInput(): GraphQLExportProductsInput {
    const result: any = {
      exportInfo: this.exportInfo,
      fileType: this.fileType,
      filter: this.filter,
      ids: this.ids,
      scope: this.scope,
    };

    // Only include new fields if they are defined
    // Once GraphQL schema is updated, these will be part of the type
    if (this.embedImages !== undefined) {
      result.embedImages = this.embedImages;
    }

    if (this.compressVariants !== undefined) {
      result.compressVariants = this.compressVariants;
    }

    return result;
  }
}
