# Getting Started with Syncfusion FileManager Code Component in Local (TestHarness)

This article provides a step-by-step guide to run the Syncfusion FileManager code component in local (TestHarness).

## Prerequisites

Before getting started with the Schedule code component, ensure the following prerequisites are satisfied:

- [node.js (>= v18.20.4)](https://nodejs.org/en/download/) (LTS version is recommended)
- [System requirements for Syncfusion React components](https://ej2.syncfusion.com/react/documentation/system-requirement)

## Rapid utilization of FileManager code component

To run the Syncfusion FileManager code component, follow these steps:

1. Ensure that all the prerequisites are met.

2. Open a command prompt (cmd) and navigate to the FileManager code component, which is located in the [components/filemanager/](../../components/filemanager/) folder.

3. Utilize the following command to install the dependent packages:

```bash
npm install
```

4. Execute the sample with the following command to visualize the FileManager code component:

```bash
npm start watch
```

![Output1](../images/filemanager/CC-Output1.png)

5. Now, within the `Data Inputs` section of the property pane, designate the data source for the FileManager code component using the [**fileSystemData.csv**](../../components/filemanager/data/fileSystemData.csv).

> [!NOTE]
> After loading the data source, proceed to select the required column types of DataSource section in the property pane. For example, assign the `Whole.None` column type for the `TaskID` column of DataSource property.

![CSV Import](../images/common/CC-CSVImport.png)

6. After loading the CSV file, click the `Apply` button to load the fileSystemData in the FileManager code component. Optionally, we can initialize FileManager config property data from the [**FileManagerConfig.json**](../../components/filemanager/data/FileManagerConfig.json) file.

![Output2](../images/filemanager/CC-Output2.png)

7. Customize the FileManager code component properties in the right property pane.

> [!NOTE]
> Additionally, explore the [API documentation](./api.md) for comprehensive details on the properties, methods, and events of the FileManager code component.

## See also

- [Getting Started with the Syncfusion PowerApps FileManager Code Component in Canvas Application](getting-started-with-canvas.md)

- [Getting Started with the Syncfusion PowerApps FileManager Code Component in Model-Driven Application (Form)](getting-started-with-model-driven-form.md)

- [Getting Started with the Syncfusion PowerApps FileManager Code Component in Model-Driven Application (Custom Pages)](getting-started-with-model-driven-custom-pages.md)

- [Getting Started with the Syncfusion PowerApps FileManager Code Component in PowerPages](getting-started-with-power-pages.md)
