import Checkbox from "@dashboard/components/Checkbox";
import Hr from "@dashboard/components/Hr";
import {
  NewRadioGroupField as RadioGroupField,
  RadioGroupFieldChoice,
} from "@dashboard/components/RadioGroupField";
import { ExportErrorFragment, ExportScope, FileTypesEnum } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { getFormErrors } from "@dashboard/utils/errors";
import getExportErrorMessage from "@dashboard/utils/errors/export";
import { FormControlLabel } from "@material-ui/core";
import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { ExportSettingsInput } from "./types";

export type ExportItemsQuantity = Record<"all" | "filter", number>;

interface ExportScopeLabels {
  allItems: string;
  selectedItems: string;
}

interface ExportDialogSettingsProps {
  data: ExportSettingsInput;
  errors: ExportErrorFragment[];
  itemsQuantity: ExportItemsQuantity;
  selectedItems: number;
  exportScopeLabels: ExportScopeLabels;
  onChange: (event: ChangeEvent) => void;
  allowScopeSelection?: boolean;
}

const formFields: Array<keyof ExportSettingsInput> = [
  "fileType",
  "scope",
  "embedImages",
  "compressVariants",
  "priceListFormat",
];
const ExportDialogSettings = ({
  data,
  errors,
  onChange,
  selectedItems,
  itemsQuantity,
  exportScopeLabels,
  allowScopeSelection = true,
}: ExportDialogSettingsProps) => {
  const intl = useIntl();
  const formErrors = getFormErrors(formFields, errors);
  const productExportTypeChoices: Array<RadioGroupFieldChoice<FileTypesEnum>> = [
    {
      label: intl.formatMessage({
        id: "9Tl/bT",
        defaultMessage: "Spreadsheet for Excel, Numbers etc.",
        description: "export items as spreadsheet",
      }),
      value: FileTypesEnum.XLSX,
    },
    {
      label: intl.formatMessage({
        id: "li1BBk",
        defaultMessage: "Plain CSV file",
        description: "export items as csv file",
      }),
      value: FileTypesEnum.CSV,
    },
  ];
  const exportScopeChoices = [
    {
      label: exportScopeLabels.allItems,
      value: ExportScope.ALL,
    },
    {
      disabled: selectedItems === 0,
      label: exportScopeLabels.selectedItems,
      value: ExportScope.IDS,
    },
    {
      label: intl.formatMessage(
        {
          id: "SZt9kC",
          defaultMessage: "Current search ({number})",
          description: "export filtered items to csv file",
        },
        {
          number: itemsQuantity.filter || "...",
        },
      ),
      value: ExportScope.FILTER,
    },
  ];

  return (
    <>
      {allowScopeSelection && (
        <>
          <Text>
            {intl.formatMessage({
              id: "g6yuk2",
              defaultMessage: "Export information for:",
              description: "export items to csv file, choice field label",
            })}
          </Text>

          <RadioGroupField
            name="scope"
            value={data.scope}
            error={!!formErrors.scope}
            onChange={onChange}
            choices={exportScopeChoices}
            errorMessage={getExportErrorMessage(formErrors.scope, intl)}
          />
          <Hr />
        </>
      )}

      <Text>
        {intl.formatMessage({
          id: "z1puMb",
          defaultMessage: "Export as:",
          description: "export items as csv or spreadsheet file",
        })}
      </Text>

      <RadioGroupField
        name="fileType"
        value={data.fileType}
        error={!!formErrors.fileType}
        onChange={onChange}
        choices={productExportTypeChoices}
        errorMessage={getExportErrorMessage(formErrors.fileType, intl)}
      />

      {data.fileType === FileTypesEnum.XLSX && (
        <>
          <Hr />
          <Box marginTop={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.embedImages}
                  name="embedImages"
                  onChange={event =>
                    onChange({ target: { name: "embedImages", value: event.target.checked } })
                  }
                />
              }
              label={
                <FormattedMessage
                  id="jfow+e"
                  defaultMessage="Embed images directly in Excel (larger files)"
                />
              }
            />
          </Box>
          <Box marginTop={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.compressVariants}
                  name="compressVariants"
                  onChange={event =>
                    onChange({ target: { name: "compressVariants", value: event.target.checked } })
                  }
                />
              }
              label={
                <FormattedMessage
                  id="8fQun1"
                  defaultMessage="Compress variants into Size[Quantity] format"
                />
              }
            />
          </Box>
          <Box marginTop={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.priceListFormat}
                  name="priceListFormat"
                  onChange={event =>
                    onChange({ target: { name: "priceListFormat", value: event.target.checked } })
                  }
                />
              }
              label={
                <FormattedMessage
                  id="K+O1Vm"
                  defaultMessage="Print for price list (use price list format)"
                />
              }
            />
          </Box>
        </>
      )}
    </>
  );
};

export default ExportDialogSettings;
