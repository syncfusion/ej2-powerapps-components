# Getting Started with Syncfusion Pivotview Code Component in Local (TestHarness)

This article provides a step-by-step guide to run the Syncfusion Pivotview code component in local (TestHarness).

## Prerequisites:

Before getting started with the Syncfusion Pivotview code component, ensure the following prerequisites are satisfied:

- [node.js  (>= v18.20.4)](https://nodejs.org/en/download/) (LTS version is recommended)
- [System requirements for Syncfusion React components](https://ej2.syncfusion.com/react/documentation/system-requirement)

## Rapid utilization of Pivotview code component

To run the Syncfusion Pivotview code component, follow these steps:

1. Ensure that all the prerequisites are met.

2. Open a command prompt (cmd) and navigate to the Pivotview code component, which is located in the [components/pivotview/](../../components/pivotview/) folder.

3. Utilize the following command to install the dependent packages:

```bash
npm install
```

4. Execute the sample with the following command to visualize the Pivotview code component:

```bash
npm start watch
```

![Output1](../images/pivotview/CC-Output1.png)

5. Now, within the `Data Inputs` section of the property pane, designate the data source for the Pivotview code component using the [**pivotViewData.csv**](../../components/pivotview/data/pivotViewData.csv).

> [!NOTE]
> After loading the data source, proceed to select the required column types of DataSource section in the property pane. For example, assign the `Whole.None` column type for the `Sold` column of DataSource property.

![CSV Import](../images/common/CC-CSVImport.png)

6. After loading the CSV file, click the `Apply` button to load the data source in the Pivotview code component. 

7. Once the data is loaded, include the necessary pivotViewConfig data for the Pivotview code component by accessing the `pivotViewConfig` property and paste the [**PivotView config data**](../../components/pivotview/data/pivotViewConfig.json). 

![Output2](../images/pivotview/CC-Output2.png)

8. Customize the Pivotview code component properties in the right property pane.

> [!NOTE]
> Additionally, explore the [API documentation](./api.md) for comprehensive details on the properties, methods, and events of the Pivotview code component.

## See also

- [Getting Started with the Syncfusion PowerApps Pivotview Code Component in Canvas Application](getting-started-with-canvas.md)

- [Getting Started with the Syncfusion PowerApps Pivotview Code Component in Model-Driven Application (Form)](getting-started-with-model-driven-form.md)

- [Getting Started with the Syncfusion PowerApps Pivotview Code Component in Model-Driven Application (Custom Pages)](getting-started-with-model-driven-custom-pages.md)

- [Getting Started with the Syncfusion PowerApps Pivotview Code Component in PowerPages](getting-started-with-power-pages.md)
