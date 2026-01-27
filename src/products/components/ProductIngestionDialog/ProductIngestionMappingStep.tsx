import { Box, Select, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { productIngestionDialogMessages as messages } from "./messages";
import { PRODUCT_FIELD_OPTIONS, ProductIngestionFormData } from "./types";

interface ProductIngestionMappingStepProps {
  data: ProductIngestionFormData;
  onChange: (event: React.ChangeEvent<any>) => void;
  onMappingChange: (
    fieldName: keyof ProductIngestionFormData["columnMapping"],
    columnName: string,
  ) => void;
}

export const ProductIngestionMappingStep: React.FC<ProductIngestionMappingStepProps> = ({
  data,
  onMappingChange,
}) => {
  if (!data.availableColumns || data.availableColumns.length === 0) {
    return <Text size={3}>No columns detected in the file. Please upload a file first.</Text>;
  }

  const availableOptions = [
    { value: "", label: "Not mapped" },
    ...data.availableColumns.map(col => ({ value: col, label: col })),
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <Text size={3}>
        <FormattedMessage {...messages.mappingDescription} />
      </Text>

      <Box borderStyle="solid" borderWidth={1} borderRadius={3} overflow="auto" __maxHeight="400px">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                backgroundColor: "var(--default-background-color)",
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              <th
                style={{
                  padding: "12px",
                  textAlign: "left",
                  borderBottom: "1px solid var(--default-border-color)",
                  fontWeight: 600,
                  minWidth: "180px",
                }}
              >
                Product Field
              </th>
              <th
                style={{
                  padding: "12px",
                  textAlign: "left",
                  borderBottom: "1px solid var(--default-border-color)",
                  fontWeight: 600,
                  minWidth: "200px",
                }}
              >
                Maps To Column
              </th>
              <th
                style={{
                  padding: "12px",
                  textAlign: "left",
                  borderBottom: "1px solid var(--default-border-color)",
                  fontWeight: 600,
                }}
              >
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {PRODUCT_FIELD_OPTIONS.filter(opt => opt.value).map(field => (
              <tr
                key={field.value}
                style={{
                  borderBottom: "1px solid var(--default-border-color)",
                }}
              >
                <td style={{ padding: "12px" }}>
                  <Text size={3} fontWeight="medium">
                    {field.label}
                  </Text>
                </td>
                <td style={{ padding: "12px" }}>
                  <Select
                    value={data.columnMapping[field.value as keyof typeof data.columnMapping] || ""}
                    onChange={value =>
                      onMappingChange(field.value as keyof typeof data.columnMapping, value)
                    }
                    options={availableOptions}
                    size="small"
                  />
                </td>
                <td style={{ padding: "12px" }}>
                  <Text size={2}>{field.description}</Text>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>

      <Text size={2}>
        <FormattedMessage {...messages.rowsDetected} values={{ count: data.rowCount }} />
      </Text>
    </div>
  );
};
