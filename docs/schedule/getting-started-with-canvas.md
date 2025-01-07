# Getting Started with Syncfusion PowerApps Schedule Code Component in Canvas Application

This article provides a step-by-step guide for setting up a PowerApps canvas application and integrating the Syncfusion PowerApps Schedule code component.

Power Apps canvas empowers users to design custom applications with a personalized interface, offering creative freedom. Its intuitive drag-and-drop features enable seamless integration of elements, ensuring flexibility in app development and dynamic user experiences with diverse data sources.

## Prerequisites

- [Published Syncfusion PowerApps solution package](../../README.md#deploying-the-solution-package-in-the-powerapps-portal)

## Create a new Dataverse table

Syncfusion PowerApps Schedule code component requires data to be loaded from a data source. Follow the steps provided in the [Create a new Dataverse table](../common/faq.md#how-to-create-a-new-dataverse-table) section to create a new table in Dataverse using the CSV in the Schedule sample [data](../../components/schedule/data/) folder. Skip this step if you have an existing table with data.

When creating the Dataverse table using [CSV](../../components/schedule/data/scheduleData.csv) file, ensure the column names and data types match those in the table below:

| Column Name | DataType   |
|-------------|------------|
| Id          | Whole.none |
| Subject     | SingleLine.Text |
| StartTime   | Date and Time |
| EndTime     | Date and Time |
| IsAllDay    | Yes/no |
| ProjectId   | Whole.none |
| TaskId      | Whole.none |

> [!NOTE]
> When setting up a Dataverse, make sure that the table columns are assigned the correct data types to prevent data loading issues in the Schedule code component.

## Create a PowerApps canvas application

Initiate the creation of a canvas application by following these steps:

1. If you're creating the canvas application for the first time in your PowerApps environment, ensure to [`enable the PowerApps component framework for canvas apps`](../common/faq.md#how-to-enable-pac-framework-support-in-a-powerapps-environment) support. Otherwise, proceed to the next step.

2. Go to the [PowerApps portal](https://make.powerapps.com/), access the `Apps` tab from the left navigation pane, and click on `Start with a page design`.

    ![Canvas App Create](../images/common/CV-App.png)

3. Choose the `Blank canvas` option and specify either tablet or phone resolution.

    ![Canvas App Create 1](../images/common/CV-App1.png)

4. The PowerApps blank canvas application will be generated as like below.

    ![Canvas App Created](../images/common/CV-Created.png)

> [!NOTE]
> For additional guidance, refer to the [Create an blank canvas app in PowerApps](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/create-blank-app) documentation.

## Import Syncfusion PowerApps Schedule code component into canvas application

Integrating the Syncfusion PowerApps Schedule code component into the blank canvas application involves the following steps:

1. Within the created blank canvas application, navigate to `Insert` -> `Get more components` icon below search bar.

    ![Canvas Import 1](../images/common/CV-Import1.png)

2. Switch to the `code` tab and import the published solution build component `SfSchedule`.

    ![Canvas Import 2](../images/schedule/CV-Import2.png)

3. Once imported, you'll find the Syncfusion PowerApps Schedule code component in the `code components` section.

    ![Canvas Import 3](../images/schedule/CV-Import3.png)

## Add Syncfusion PowerApps Schedule code component into canvas application

Enhance your canvas application by adding the Syncfusion PowerApps Schedule code component using the following steps:

1. From the `Insert` tab, drag and drop the `SfSchedule` component located in the `code components` section into your application layout.

    ![Canvas Import Data For Schedule](../images/schedule/CV-ImportDataForSchedule.png)

2. First update the selectedDate property with `2023/01/04` and Load the Schedule code component data from the Dataverse tables previously created or connectors listed in data source tab. Also, we can also use the optional [ScheduleConfig](../../components/schedule/data/scheduleConfig.json) JSON into the `ScheduleConfig` property.

    > [!NOTE]
    > Please note that when employing the `PowerFx table` or `Connectors` to load the data source, you can add columns data by clicking on `edit` in the **Fields** section located below the **Data Source** property. For further details, please consult the comprehensive [list of all connectors supported in PowerApps](https://learn.microsoft.com/en-us/connectors/connector-reference/connector-reference-powerapps-connectors).

    ![Canvas DataSource](../images/schedule/CV-DataSource.png)

3. Once the data is loaded, the output of the Schedule code component will displayed. Customize the Schedule code component properties in the right property pane and also via the PowerFx tab on top.

    ![Canvas Output](../images/schedule/CV-Output.png)

## Preview the Syncfusion PowerApps Schedule application

To preview the Syncfusion PowerApps Schedule application in development environment with multiple device resolution, click the `Preview` button at the top right corner of the PowerApps portal.

![Canvas Preview](../images/schedule/CV-Preview.png)

## Publish the Syncfusion PowerApps Schedule application

To publish the Syncfusion PowerApps Schedule application in the production environment, click the `Publish` button at the top right corner of the PowerApps portal. Now you can share the published application with your users.

Once the application is published, you can preview it by clicking the `play` button from the `Apps` tab on the homepage.

![Canvas Publish](../images/schedule/CV-PublishOutput.png)

## See also

- [Getting Started with the Syncfusion PowerApps Schedule Code Component in Model-Driven Application (Form)](getting-started-with-model-driven-form.md)

- [Getting Started with the Syncfusion PowerApps Schedule Code Component in Model-Driven Application (Custom Pages)](getting-started-with-model-driven-custom-pages.md)

- [Getting Started with the Syncfusion PowerApps Schedule Code Component in PowerPages](getting-started-with-power-pages.md)
