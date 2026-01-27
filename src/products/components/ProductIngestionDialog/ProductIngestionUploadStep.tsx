import FileUploadField from "@dashboard/components/FileUploadField";
import { Button, Input, Select, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { productIngestionDialogMessages as messages } from "./messages";
import { ProductIngestionFormData } from "./types";

interface ProductIngestionUploadStepProps {
  data: ProductIngestionFormData;
  onChange: (event: React.ChangeEvent<any>) => void;
  onFileUpload: (file: File) => void;
  onFileDelete: () => void;
  onLoadColumns: (fileId: string, sheetName: string, headerRow: number) => Promise<void>;
  loading: boolean;
  error?: string;
}

export const ProductIngestionUploadStep: React.FC<ProductIngestionUploadStepProps> = ({
  data,
  onChange,
  onFileUpload,
  onFileDelete,
  onLoadColumns,
  loading,
  error,
}) => {
  const intl = useIntl();

  const file = data.file
    ? {
        label: data.file.name,
        value: data.file.name,
      }
    : {
        label: "",
        value: "",
      };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <Text size={3}>
        <FormattedMessage {...messages.uploadDescription} />
      </Text>

      <FileUploadField
        disabled={loading}
        loading={loading}
        file={file}
        error={!!error}
        helperText={error}
        onFileUpload={onFileUpload}
        onFileDelete={onFileDelete}
        inputProps={{
          accept: ".xlsx,.xls,.csv",
        }}
      />

      {data.file && (
        <>
          <Text size={2}>
            <FormattedMessage {...messages.fileSelected} values={{ filename: data.file.name }} />
          </Text>

          {data.sheetNames && data.sheetNames.length > 1 && (
            <div>
              <Select
                label={intl.formatMessage(messages.sheetSelectLabel)}
                value={data.selectedSheet}
                onChange={value =>
                  onChange({
                    target: { name: "selectedSheet", value },
                  } as any)
                }
                options={data.sheetNames.map(sheet => ({
                  value: sheet,
                  label: sheet,
                }))}
                size="small"
              />
              <Text size={2} marginTop={2}>
                <FormattedMessage {...messages.sheetSelectHelp} />
              </Text>
            </div>
          )}

          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <Input
                name="headerRow"
                label={intl.formatMessage(messages.headerRowLabel)}
                type="number"
                value={data.headerRow.toString()}
                onChange={onChange}
                helperText={intl.formatMessage(messages.headerRowHelp)}
                size="small"
                min={0}
              />
            </div>
            <Button
              onClick={() =>
                onLoadColumns(data.fileId, data.selectedSheet || "Sheet1", data.headerRow)
              }
              disabled={loading || !data.fileId}
              variant="secondary"
            >
              <FormattedMessage {...messages.loadColumns} />
            </Button>
          </div>

          <Text size={2}>
            <FormattedMessage {...messages.rowsDetected} values={{ count: data.rowCount }} />
          </Text>

          {data.availableColumns && data.availableColumns.length > 0 && (
            <div
              style={{
                border: "1px solid var(--default-border-color)",
                borderRadius: "8px",
                padding: "1rem",
                marginTop: "1rem",
              }}
            >
              <Text size={3} marginBottom={3}>
                <strong>Detected Columns ({data.availableColumns.length})</strong>
              </Text>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                  gap: "0.5rem",
                }}
              >
                {data.availableColumns.map((col, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "0.5rem",
                      backgroundColor: "var(--default-background-color)",
                      border: "1px solid var(--default-border-color)",
                      borderRadius: "4px",
                    }}
                  >
                    <Text size={2}>{col || `Column ${idx + 1}`}</Text>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.previewData && data.previewData.length > 0 && (
            <div
              style={{
                border: "1px solid var(--default-border-color)",
                borderRadius: "8px",
                padding: "1rem",
                marginTop: "1rem",
              }}
            >
              <Text size={3} marginBottom={3}>
                <strong>Sheet Preview (First {data.previewData.length} rows)</strong>
              </Text>
              <div
                style={{
                  overflowX: "auto",
                  maxWidth: "100%",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.875rem",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        backgroundColor: "var(--default-background-color)",
                        borderBottom: "2px solid var(--default-border-color)",
                      }}
                    >
                      <th
                        style={{
                          padding: "0.5rem",
                          textAlign: "left",
                          fontWeight: 500,
                          minWidth: "50px",
                        }}
                      >
                        Row
                      </th>
                      {data.availableColumns.map((col, idx) => (
                        <th
                          key={idx}
                          style={{
                            padding: "0.5rem",
                            textAlign: "left",
                            fontWeight: 500,
                            minWidth: "120px",
                            maxWidth: "200px",
                          }}
                        >
                          <Text size={2}>
                            <strong>{col || `Col ${idx + 1}`}</strong>
                          </Text>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.previewData.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        style={{
                          borderBottom: "1px solid var(--default-border-color)",
                        }}
                      >
                        <td
                          style={{
                            padding: "0.5rem",
                            fontWeight: 500,
                            color: "var(--text-color-muted)",
                          }}
                        >
                          <Text size={2}>{rowIdx + 1}</Text>
                        </td>
                        {row.map((cell, cellIdx) => (
                          <td
                            key={cellIdx}
                            style={{
                              padding: "0.5rem",
                              maxWidth: "200px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <Text size={2}>{cell || "-"}</Text>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
