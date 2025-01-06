# Getting Started with Syncfusion Chart Code Component in Local (TestHarness)

This article provides a step-by-step guide to run the Syncfusion Chart code component in local (TestHarness).

## Prerequisites

Before getting started with the Syncfusion Chart code component, ensure the following prerequisites are satisfied:

- [node.js  (>= v18.20.4)](https://nodejs.org/en/download/) (LTS version is recommended)
- [System requirements for Syncfusion React components](https://ej2.syncfusion.com/react/documentation/system-requirement)

## Rapid utilization of Chart code component

To run the Syncfusion Chart code component, follow these steps:

1. Ensure that all the prerequisites are met.

2. Open a command prompt (cmd) and navigate to the Chart code component, which is located in the [components/charts/](./) folder.

3. Utilize the following command to install the dependent packages:

    ```bash
    npm install
    ```

4. Execute the sample with the following command to visualize the Chart code component:

    ```bash
    npm start watch
    ```

    ![Output1](../../docs/images/charts/CC-Output1.png)

5. Now, within the `Data Inputs` section of the property pane, designate the data source for the Chart code component using the [**ChartData.csv**](./data/chartData.csv).

    > [!NOTE]
    > After loading the data source, proceed to select the required column types of DataSource section in the property pane. For example, assign the `Whole.None` column type for the `VietnamX` column of DataSource property.

    ![CSV Import](../../docs/images/common/CC-CSVImport.png)

6. After loading the CSV file, click the `Apply` button to load the data source in the Chart code component.

7. Once the data is loaded, include the necessary series data for the Chart code component by accessing the `series` property and paste the [**Series config data**](./data/seriesConfig.json).

    ![Output2](../../docs/images/charts/CC-Output2.png)

8. Customize the Chart code component properties in the right property pane.

> [!NOTE]
> Additionally, explore the [API documentation](../../docs/charts/api.md) for comprehensive details on the properties, methods, and events of the Chart code component.

## See also

- [Getting Started with the Syncfusion PowerApps Chart Code Component in Canvas Application](../../docs/charts/getting-started-with-canvas.md)

- [Getting Started with the Syncfusion PowerApps Chart Code Component in Model-Driven Application (Form)](../../docs/charts/getting-started-with-model-driven-form.md)

- [Getting Started with the Syncfusion PowerApps Chart Code Component in Model-Driven Application (Custom Pages)](../../docs/charts/getting-started-with-model-driven-custom-pages.md)

- [Getting Started with the Syncfusion PowerApps Chart Code Component in PowerPages](../../docs/charts/getting-started-with-power-pages.md)
