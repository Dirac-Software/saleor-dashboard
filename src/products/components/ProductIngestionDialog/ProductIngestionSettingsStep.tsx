import {
  useChannelCurrenciesQuery,
  useShopCountriesQuery,
} from "@dashboard/graphql/hooks.generated";
import { StockUpdateModeEnum } from "@dashboard/graphql/types.generated";
import useWarehouseSearch from "@dashboard/searches/useWarehouseSearch";
import { Box, Checkbox, Input, RadioGroup, Select, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { productIngestionDialogMessages as messages } from "./messages";
import { ProductIngestionFormData } from "./types";

interface ProductIngestionSettingsStepProps {
  data: ProductIngestionFormData;
  onChange: (event: React.ChangeEvent<any>) => void;
}

export const ProductIngestionSettingsStep: React.FC<ProductIngestionSettingsStepProps> = ({
  data,
  onChange,
}) => {
  const intl = useIntl();
  const { result: warehouseSearchResult } = useWarehouseSearch({
    variables: {
      first: 20,
      channnelsId: [],
      query: "",
    },
  });
  const { data: countriesData } = useShopCountriesQuery();
  const { data: currenciesData } = useChannelCurrenciesQuery();

  const mappedFields = Object.entries(data.columnMapping).filter(([_, value]) => value).length;

  const warehouses = warehouseSearchResult.data?.search?.edges?.map(edge => edge.node) ?? [];
  const warehouseOptions = [
    { value: "", label: "Create new warehouse" },
    ...warehouses.map(warehouse => ({
      value: warehouse.name,
      label: warehouse.name,
    })),
  ];

  const handleWarehouseChange = (value: string): void => {
    // If selecting an existing warehouse, auto-populate address and country
    if (value && value !== "") {
      const selectedWarehouse = warehouses.find(w => w.name === value);

      if (selectedWarehouse?.address) {
        const address = [
          selectedWarehouse.address.streetAddress1,
          selectedWarehouse.address.streetAddress2,
          selectedWarehouse.address.city,
          selectedWarehouse.address.postalCode,
        ]
          .filter(Boolean)
          .join(", ");

        onChange({
          target: { name: "warehouseName", value: selectedWarehouse.name },
        } as any);

        onChange({
          target: { name: "warehouseAddress", value: address },
        } as any);

        onChange({
          target: { name: "warehouseCountry", value: selectedWarehouse.address.country.code },
        } as any);
      }
    }
    // Don't clear fields when selecting "Create new warehouse" - let user keep typing
  };

  const countryOptions =
    countriesData?.shop?.countries?.map(country => ({
      value: country.code,
      label: `${country.code} - ${country.country}`,
    })) ?? [];

  const currencyOptions =
    currenciesData?.shop?.channelCurrencies?.map(currency => ({
      value: currency,
      label: currency,
    })) ?? [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <Text size={3}>
        <FormattedMessage {...messages.settingsDescription} />
      </Text>

      <Box display="flex" flexDirection="column" gap={4}>
        <div>
          <Select
            label={intl.formatMessage(messages.warehouseLabel)}
            value={warehouses.find(w => w.name === data.warehouseName) ? data.warehouseName : ""}
            onChange={handleWarehouseChange}
            options={warehouseOptions}
            size="small"
          />
          <Text size={2} marginTop={2}>
            {intl.formatMessage(messages.warehouseHelp)}
          </Text>
        </div>

        <div>
          <Input
            name="warehouseName"
            label={intl.formatMessage(messages.warehouseNameInputLabel)}
            value={data.warehouseName}
            onChange={onChange}
            size="small"
            required
            placeholder="Enter warehouse name"
          />
        </div>

        <div>
          <Input
            name="warehouseAddress"
            label={intl.formatMessage(messages.warehouseAddressLabel)}
            value={data.warehouseAddress}
            onChange={onChange}
            size="small"
            required
          />
        </div>

        <div>
          <Select
            label={intl.formatMessage(messages.warehouseCountryLabel)}
            value={data.warehouseCountry}
            onChange={value =>
              onChange({
                target: { name: "warehouseCountry", value },
              } as any)
            }
            options={countryOptions}
            size="small"
          />
          <Text size={2} marginTop={2}>
            {intl.formatMessage(messages.warehouseCountryHelp)}
          </Text>
        </div>

        <div>
          <Input
            name="minimumOrderQuantity"
            label={intl.formatMessage(messages.moqLabel)}
            type="number"
            value={data.minimumOrderQuantity.toString()}
            onChange={onChange}
            helperText={intl.formatMessage(messages.moqHelp)}
            size="small"
          />
        </div>

        <div>
          <Select
            label={intl.formatMessage(messages.defaultCurrencyLabel)}
            value={data.defaultCurrency}
            onChange={value =>
              onChange({
                target: { name: "defaultCurrency", value },
              } as any)
            }
            options={currencyOptions}
            size="small"
          />
        </div>

        <div>
          <Text size={3} fontWeight="medium" marginBottom={2}>
            <FormattedMessage {...messages.stockUpdateModeLabel} />
          </Text>
          <RadioGroup
            value={data.stockUpdateMode}
            onValueChange={value =>
              onChange({
                target: { name: "stockUpdateMode", value },
              } as any)
            }
          >
            <RadioGroup.Item id="stock-replace" value={StockUpdateModeEnum.REPLACE}>
              <FormattedMessage {...messages.stockModeReplace} />
            </RadioGroup.Item>
            <RadioGroup.Item id="stock-add" value={StockUpdateModeEnum.ADD}>
              <FormattedMessage {...messages.stockModeAdd} />
            </RadioGroup.Item>
          </RadioGroup>
        </div>

        <Box borderStyle="solid" borderWidth={1} borderRadius={3} padding={4}>
          <Checkbox
            name="notForWeb"
            checked={data.notForWeb}
            onCheckedChange={checked =>
              onChange({
                target: { name: "notForWeb", value: checked },
              } as any)
            }
          >
            <Text size={3}>
              <FormattedMessage {...messages.notForWebLabel} />
            </Text>
          </Checkbox>
        </Box>

        <Box borderStyle="solid" borderWidth={1} borderRadius={3} padding={4}>
          <Checkbox
            name="dryRun"
            checked={data.dryRun}
            onCheckedChange={checked =>
              onChange({
                target: { name: "dryRun", value: checked },
              } as any)
            }
          >
            <Text size={3}>
              <FormattedMessage {...messages.dryRunLabel} />
            </Text>
          </Checkbox>
          <Text size={2} marginTop={2}>
            <FormattedMessage {...messages.dryRunHelp} />
          </Text>
        </Box>

        <Box borderStyle="solid" borderWidth={1} borderRadius={3} padding={4}>
          <Checkbox
            name="errorOnDuplicatesInSheet"
            checked={data.errorOnDuplicatesInSheet}
            onCheckedChange={checked =>
              onChange({
                target: { name: "errorOnDuplicatesInSheet", value: checked },
              } as any)
            }
          >
            <Text size={3}>
              <FormattedMessage {...messages.errorOnDuplicatesLabel} />
            </Text>
          </Checkbox>
          <Text size={2} marginTop={2}>
            <FormattedMessage {...messages.errorOnDuplicatesHelp} />
          </Text>
        </Box>

        <Box borderStyle="solid" borderWidth={1} borderRadius={3} padding={4}>
          <Checkbox
            name="confirmPriceInterpretation"
            checked={data.confirmPriceInterpretation}
            onCheckedChange={checked =>
              onChange({
                target: { name: "confirmPriceInterpretation", value: checked },
              } as any)
            }
          >
            <Text size={3}>
              <FormattedMessage {...messages.confirmPriceLabel} />
            </Text>
          </Checkbox>
          <Text size={2} marginTop={2}>
            <FormattedMessage {...messages.confirmPriceHelp} />
          </Text>
        </Box>
      </Box>

      {/* Summary Section */}
      <Box borderStyle="solid" borderWidth={1} borderRadius={3} padding={4}>
        <Text size={3} fontWeight="bold" marginBottom={3}>
          Import Summary
        </Text>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Text size={2}>
            <strong>File:</strong> {data.file?.name}
          </Text>
          {data.selectedSheet && (
            <Text size={2}>
              <strong>Sheet:</strong> {data.selectedSheet}
            </Text>
          )}
          <Text size={2}>
            <strong>Header Row:</strong> {data.headerRow} (
            {data.headerRow === 0 ? "first row" : `row ${data.headerRow + 1}`})
          </Text>
          <Text size={2}>
            <strong>Rows:</strong> {data.rowCount}
          </Text>
          <Text size={2}>
            <strong>Mapped Fields:</strong> {mappedFields} of{" "}
            {Object.keys(data.columnMapping).length}
          </Text>
          <Text size={2}>
            <strong>Warehouse:</strong> {data.warehouseName || "Not set"} (
            {data.warehouseCountry || "Not set"})
          </Text>
          <Text size={2}>
            <strong>Currency:</strong> {data.defaultCurrency}
          </Text>
          <Text size={2}>
            <strong>MOQ:</strong> {data.minimumOrderQuantity}
          </Text>
          <Text size={2}>
            <strong>Stock Mode:</strong> {data.stockUpdateMode}
          </Text>
          <Text size={2}>
            <strong>Wholesale Only:</strong> {data.notForWeb ? "Yes" : "No"}
          </Text>
          <Text size={2}>
            <strong>Dry Run:</strong> {data.dryRun ? "Yes (preview only)" : "No"}
          </Text>
          <Text size={2}>
            <strong>Error on Duplicates:</strong> {data.errorOnDuplicatesInSheet ? "Yes" : "No"}
          </Text>
        </div>
      </Box>
    </div>
  );
};
