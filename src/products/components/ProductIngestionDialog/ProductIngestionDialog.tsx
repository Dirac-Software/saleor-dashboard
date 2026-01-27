import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import makeCreatorSteps from "@dashboard/components/CreatorSteps";
import { DashboardModal } from "@dashboard/components/Modal";
import {
  useProductIngestionIngestMutation,
  useProductIngestionUploadFileMutation,
} from "@dashboard/graphql/hooks.generated";
import { StockUpdateModeEnum } from "@dashboard/graphql/types.generated";
import useForm from "@dashboard/hooks/useForm";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import useWizard from "@dashboard/hooks/useWizard";
import { Button } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { productIngestionDialogMessages as messages } from "./messages";
import { ProductIngestionMappingStep } from "./ProductIngestionMappingStep";
import { ProductIngestionSettingsStep } from "./ProductIngestionSettingsStep";
import { ProductIngestionUploadStep } from "./ProductIngestionUploadStep";
import {
  ProductIngestionDialogProps,
  ProductIngestionFormData,
  ProductIngestionStep,
} from "./types";

const initialFormData: ProductIngestionFormData = {
  file: null,
  fileId: "",
  availableColumns: [],
  rowCount: 0,
  sheetNames: [],
  selectedSheet: "",
  headerRow: 0,
  previewData: null,
  columnMapping: {
    code: "",
    brand: "",
    description: "",
    category: "",
    sizes: "",
    rrp: "",
    price: "",
    weight: "",
    image: "",
  },
  warehouseName: "",
  warehouseAddress: "",
  warehouseCountry: "",
  minimumOrderQuantity: 1,
  confirmPriceInterpretation: false,
  notForWeb: false,
  defaultCurrency: "GBP",
  stockUpdateMode: StockUpdateModeEnum.REPLACE,
  dryRun: false,
  errorOnDuplicatesInSheet: false,
};

const ProductIngestionSteps = makeCreatorSteps<ProductIngestionStep>();

export const ProductIngestionDialog: React.FC<ProductIngestionDialogProps> = ({
  open,
  onClose,
  onCompleted,
}) => {
  const intl = useIntl();
  const [step, { next, prev, set: setStep }] = useWizard<ProductIngestionStep>(
    ProductIngestionStep.UPLOAD,
    [ProductIngestionStep.UPLOAD, ProductIngestionStep.MAPPING, ProductIngestionStep.SETTINGS],
  );

  const [uploadFile, uploadFileResult] = useProductIngestionUploadFileMutation();
  const [ingestProducts] = useProductIngestionIngestMutation();

  const [uploadError, setUploadError] = useState<string>("");
  const [submitState, setSubmitState] = useState<ConfirmButtonTransitionState>("default");

  const handleSubmit = async (data: ProductIngestionFormData): Promise<any[]> => {
    try {
      setSubmitState("loading");

      const result = await ingestProducts({
        variables: {
          input: {
            fileId: data.fileId,
            warehouseName: data.warehouseName,
            warehouseAddress: data.warehouseAddress,
            warehouseCountry: data.warehouseCountry,
            sheetName: data.selectedSheet || "Sheet1",
            headerRow: data.headerRow,
            columnMapping: {
              code: data.columnMapping.code || null,
              brand: data.columnMapping.brand || null,
              description: data.columnMapping.description || null,
              category: data.columnMapping.category || null,
              sizes: data.columnMapping.sizes || null,
              rrp: data.columnMapping.rrp || null,
              price: data.columnMapping.price || null,
              weight: data.columnMapping.weight || null,
              image: data.columnMapping.image || null,
            },
            minimumOrderQuantity: data.minimumOrderQuantity,
            confirmPriceInterpretation: data.confirmPriceInterpretation,
            notForWeb: data.notForWeb,
            defaultCurrency: data.defaultCurrency || null,
            stockUpdateMode: data.stockUpdateMode,
            dryRun: data.dryRun,
            errorOnDuplicatesInSheet: data.errorOnDuplicatesInSheet,
          },
        },
      });

      if (result.data?.productIngestionIngest?.errors?.length) {
        setSubmitState("error");

        return result.data.productIngestionIngest.errors;
      }

      setSubmitState("success");
      onCompleted({
        success: result.data?.productIngestionIngest?.success ?? false,
        createdProductsCount: result.data?.productIngestionIngest?.createdProductsCount ?? 0,
        updatedProductsCount: result.data?.productIngestionIngest?.updatedProductsCount ?? 0,
        skippedProductsCount: result.data?.productIngestionIngest?.skippedProductsCount ?? 0,
        totalVariantsCreated: result.data?.productIngestionIngest?.totalVariantsCreated ?? 0,
        totalVariantsUpdated: result.data?.productIngestionIngest?.totalVariantsUpdated ?? 0,
        warehouseName: result.data?.productIngestionIngest?.warehouseName ?? "",
      });

      setTimeout(() => {
        onClose();
      }, 1500);

      return [];
    } catch (error) {
      console.error("Import error:", error);
      setSubmitState("error");

      return [];
    }
  };

  const form = useForm(initialFormData, handleSubmit);

  useModalDialogOpen(open, {
    onClose: () => {
      form.reset();
      setStep(ProductIngestionStep.UPLOAD);
      setUploadError("");
      setSubmitState("default");
    },
  });

  const loadColumns = async (
    fileId: string,
    sheetName: string,
    headerRow: number,
  ): Promise<void> => {
    try {
      setUploadError("");

      const result = await uploadFile({
        variables: {
          input: {
            file: form.data.file ?? new File([], ""),
            sheetName,
            headerRow,
          },
        },
      });

      if (result.data?.productIngestionUploadFile?.errors?.length) {
        console.error("Load columns errors:", result.data.productIngestionUploadFile.errors);
        setUploadError(intl.formatMessage(messages.uploadError));

        return;
      }

      const availableColumns = result.data?.productIngestionUploadFile?.availableColumns ?? [];
      const rowCount = result.data?.productIngestionUploadFile?.rowCount ?? 0;
      const newFileId = result.data?.productIngestionUploadFile?.fileId;
      // TODO: Backend doesn't support previewData yet. When added, uncomment in mutations.ts and regenerate
      const previewData = (result.data?.productIngestionUploadFile as any)?.previewData ?? null;

      if (newFileId) {
        form.change({ target: { name: "fileId", value: newFileId } } as any);
      }

      form.change({ target: { name: "selectedSheet", value: sheetName } } as any);
      form.change({ target: { name: "headerRow", value: headerRow } } as any);
      form.change({ target: { name: "availableColumns", value: availableColumns } } as any);
      form.change({ target: { name: "rowCount", value: rowCount } } as any);
      form.change({ target: { name: "previewData", value: previewData } } as any);

      // Auto-map columns based on header names (smart defaults)
      const autoMapping: typeof initialFormData.columnMapping = {
        code: "",
        brand: "",
        description: "",
        category: "",
        sizes: "",
        rrp: "",
        price: "",
        weight: "",
        image: "",
      };

      availableColumns.filter(Boolean).forEach(column => {
        if (!column) return;

        const lowerColumn = column.toLowerCase();

        if (lowerColumn.includes("code") || lowerColumn.includes("sku")) autoMapping.code = column;
        else if (lowerColumn.includes("brand")) autoMapping.brand = column;
        else if (lowerColumn.includes("description") || lowerColumn.includes("name"))
          autoMapping.description = column;
        else if (lowerColumn.includes("category")) autoMapping.category = column;
        else if (lowerColumn.includes("size")) autoMapping.sizes = column;
        else if (lowerColumn.includes("rrp") || lowerColumn.includes("retail"))
          autoMapping.rrp = column;
        else if (lowerColumn.includes("price") && !lowerColumn.includes("rrp"))
          autoMapping.price = column;
        else if (lowerColumn.includes("weight")) autoMapping.weight = column;
        else if (lowerColumn.includes("image")) autoMapping.image = column;
      });

      form.change({ target: { name: "columnMapping", value: autoMapping } } as any);
    } catch (error) {
      console.error("Load columns error:", error);
      setUploadError(intl.formatMessage(messages.uploadError));
    }
  };

  const handleFileUpload = async (file: File): Promise<void> => {
    try {
      setUploadError("");
      form.change({ target: { name: "file", value: file } } as any);

      const result = await uploadFile({
        variables: { input: { file, sheetName: "Sheet1", headerRow: 0 } },
      });

      if (result.data?.productIngestionUploadFile?.errors?.length) {
        setUploadError(intl.formatMessage(messages.uploadError));

        return;
      }

      const fileId = result.data?.productIngestionUploadFile?.fileId;
      const sheetNames = result.data?.productIngestionUploadFile?.sheetNames ?? [];
      const availableColumns = result.data?.productIngestionUploadFile?.availableColumns ?? [];
      const rowCount = result.data?.productIngestionUploadFile?.rowCount ?? 0;
      // TODO: Backend doesn't support previewData yet. When added, uncomment in mutations.ts and regenerate
      const previewData = (result.data?.productIngestionUploadFile as any)?.previewData ?? null;

      if (fileId) {
        form.change({ target: { name: "fileId", value: fileId } } as any);
        form.change({ target: { name: "sheetNames", value: sheetNames } } as any);
        form.change({
          target: { name: "selectedSheet", value: sheetNames[0] || "Sheet1" },
        } as any);
        form.change({ target: { name: "availableColumns", value: availableColumns } } as any);
        form.change({ target: { name: "rowCount", value: rowCount } } as any);
        form.change({ target: { name: "previewData", value: previewData } } as any);

        // Auto-map columns
        const autoMapping: typeof initialFormData.columnMapping = {
          code: "",
          brand: "",
          description: "",
          category: "",
          sizes: "",
          rrp: "",
          price: "",
          weight: "",
          image: "",
        };

        availableColumns.filter(Boolean).forEach(column => {
          if (!column) return;

          const lowerColumn = column.toLowerCase();

          if (lowerColumn.includes("code") || lowerColumn.includes("sku"))
            autoMapping.code = column;
          else if (lowerColumn.includes("brand")) autoMapping.brand = column;
          else if (lowerColumn.includes("description") || lowerColumn.includes("name"))
            autoMapping.description = column;
          else if (lowerColumn.includes("category")) autoMapping.category = column;
          else if (lowerColumn.includes("size")) autoMapping.sizes = column;
          else if (lowerColumn.includes("rrp") || lowerColumn.includes("retail"))
            autoMapping.rrp = column;
          else if (lowerColumn.includes("price") && !lowerColumn.includes("rrp"))
            autoMapping.price = column;
          else if (lowerColumn.includes("weight")) autoMapping.weight = column;
          else if (lowerColumn.includes("image")) autoMapping.image = column;
        });

        form.change({ target: { name: "columnMapping", value: autoMapping } } as any);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(intl.formatMessage(messages.uploadError));
    }
  };

  const handleFileDelete = (): void => {
    form.change({ target: { name: "file", value: null } } as any);
    form.change({ target: { name: "fileId", value: "" } } as any);
    form.change({ target: { name: "availableColumns", value: [] } } as any);
    form.change({ target: { name: "rowCount", value: 0 } } as any);
    form.change({ target: { name: "sheetNames", value: [] } } as any);
    form.change({ target: { name: "selectedSheet", value: "" } } as any);
    form.change({ target: { name: "previewData", value: null } } as any);
    form.change({ target: { name: "columnMapping", value: initialFormData.columnMapping } } as any);
    setUploadError("");
  };

  const handleMappingChange = (
    fieldName: keyof ProductIngestionFormData["columnMapping"],
    columnName: string,
  ): void => {
    const newMapping = { ...form.data.columnMapping, [fieldName]: columnName };

    form.change({ target: { name: "columnMapping", value: newMapping } } as any);
  };

  const handleNext = (): void => {
    if (step === ProductIngestionStep.UPLOAD) {
      if (!form.data.file) {
        setUploadError(intl.formatMessage(messages.noFileSelected));

        return;
      }
    }

    if (step === ProductIngestionStep.MAPPING) {
      // At least one field should be mapped
      const hasMappedField = Object.values(form.data.columnMapping).some(v => v);

      if (!hasMappedField) {
        console.warn("At least one column should be mapped");
      }
    }

    next();
  };

  const handleClose = (): void => {
    onClose();
  };

  const canProceed = (): boolean => {
    if (step === ProductIngestionStep.UPLOAD) {
      return !!form.data.file && !!form.data.fileId;
    }

    if (step === ProductIngestionStep.MAPPING) {
      // At least code or description should be mapped
      return !!form.data.columnMapping.code || !!form.data.columnMapping.description;
    }

    if (step === ProductIngestionStep.SETTINGS) {
      return (
        form.data.confirmPriceInterpretation &&
        !!form.data.warehouseName &&
        !!form.data.warehouseAddress &&
        !!form.data.warehouseCountry
      );
    }

    return false;
  };

  const steps = [
    {
      label: intl.formatMessage(messages.uploadStepTitle),
      value: ProductIngestionStep.UPLOAD,
    },
    {
      label: intl.formatMessage(messages.mappingStepTitle),
      value: ProductIngestionStep.MAPPING,
    },
    {
      label: intl.formatMessage(messages.settingsStepTitle),
      value: ProductIngestionStep.SETTINGS,
    },
  ];

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="lg">
        <DashboardModal.Header>
          <FormattedMessage {...messages.title} />
        </DashboardModal.Header>

        <ProductIngestionSteps currentStep={step} steps={steps} onStepClick={setStep} />

        <div style={{ padding: "1.5rem" }}>
          {step === ProductIngestionStep.UPLOAD && (
            <ProductIngestionUploadStep
              data={form.data}
              onChange={form.change}
              onFileUpload={handleFileUpload}
              onFileDelete={handleFileDelete}
              onLoadColumns={loadColumns}
              loading={uploadFileResult.loading}
              error={uploadError}
            />
          )}

          {step === ProductIngestionStep.MAPPING && (
            <ProductIngestionMappingStep
              data={form.data}
              onChange={form.change}
              onMappingChange={handleMappingChange}
            />
          )}

          {step === ProductIngestionStep.SETTINGS && (
            <ProductIngestionSettingsStep data={form.data} onChange={form.change} />
          )}
        </div>

        <DashboardModal.Actions>
          <Button onClick={handleClose} variant="secondary">
            <FormattedMessage {...messages.cancel} />
          </Button>

          {step > ProductIngestionStep.UPLOAD && (
            <Button onClick={prev} variant="secondary">
              <FormattedMessage {...messages.back} />
            </Button>
          )}

          {step < ProductIngestionStep.SETTINGS ? (
            <Button onClick={handleNext} disabled={!canProceed()} variant="primary">
              <FormattedMessage {...messages.next} />
            </Button>
          ) : (
            <ConfirmButton
              onClick={form.submit}
              disabled={!canProceed()}
              transitionState={submitState}
            >
              <FormattedMessage {...messages.import} />
            </ConfirmButton>
          )}
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
