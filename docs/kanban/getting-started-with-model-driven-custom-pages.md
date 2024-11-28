# Getting Started with Syncfusion PowerApps Kanban Code Component in Model-Driven Application (Custom Pages)

This article provides a step-by-step guide for setting up a PowerApps model-driven application with Custom pages (Canvas) and integrating the Syncfusion PowerApps Kanban code component.

PowerApps Model-Driven is a versatile platform for creating structured applications with a focus on data-centric design. It offers a guided approach, allowing users to build efficient business processes and workflows within a predefined data model.

## Prerequisites

- [Published Syncfusion PowerApps solution package](../../README.md#deploying-the-solution-package-in-the-powerapps-portal)

## Create a new Dataverse table

Syncfusion PowerApps Kanban code component requires data to be loaded from a data source. Follow the steps provided in [Create a new Dataverse table](../common/faq.md#how-to-create-a-new-dataverse-table) section to create a new table in Dataverse using the CSV in the Kanban code component [data](../../components/kanban/data/kanbanData.csv) folder. Skip this step if you have an existing table with data.

When creating the Dataverse table using [CSV](../../components/kanban/data/kanbanData.csv) file, ensure the column names and data types match those in the table below:

| Column Name | DataType   |
|-------------|------------|
| Id          | SingleLine.Text |
| Title       | SingleLine.Text |
| Status      | SingleLine.Text |
| Summary     | SingleLine.Text |
| Type        | SingleLine.Text |
| Priority    | SingleLine.Text |
| Tags        | SingleLine.Text |
| Estimate    | Decimal |
| Assignee    | SingleLine.Text |
| RankId      | Whole.none |
| Color       | SingleLine.Text |
| ClassName   | SingleLine.Text |

> [!NOTE]
> When setting up a Dataverse, make sure that the table columns are assigned the correct data types to prevent data loading issues in the Kanban code component.

## Create a PowerApps model-driven application

To create a model-driven application, follow the steps below:

1. In the [PowerApps portal](https://make.powerapps.com/), navigate to the `Apps` tab located in the left navigation pane and select the `Start with a page design` option.

![Model-Driven App Create](../images/common/CV-App.png)

2. Opt for the `Blank page with navigation` option and assign a meaningful name for your model-driven application. Proceed by clicking `create`.

![Model-Driven App Create 1](../images/common/CV-App1.png)

3. The PowerApps platform will generate a blank model-driven application based on your specifications. You are now ready to start building your application.

![Model-Driven App Created](../images/common/MD-Created.png)

4. To incorporate custom page into your application, click on the `Add Page` button. Select `Custom Page` & select `Create a new custom page` option. And assign a meaningful name for your custom page. Proceed by clicking `Add`.

![Add Custom Page 1](../images/common/CP-AddCustomPage1.png)

![Add Custom Page 2](../images/common/CP-AddCustomPage2.png)

5. The PowerApps platform will generate a blank custom page based on your specifications in a new tab. You are now ready to start building your custom page (Canvas).

6. Use any layouts & import the Syncfusion PowerApps Kanban code component to the custom page. Configure the data source for the Kanban code component by accessing the list of Dataverse tables. This step ensures that the Kanban code component is seamlessly connected to the relevant data.

7. Once the data is loaded, include the necessary kanbanConfig data for the Kanban code component by accessing the `kanbanConfig` property and paste the [**Kanban config data**](../../components/kanban/data/kanbanConfig.json). 

8. After loading the `kanbanConfig` data, ensure the keyField property is mapping the data in the Kanban board like assigning the value `Status` to the `keyField` property in the Kanban component. This is crucial for rendering the Kanban board layout correctly. Also, customize the other Kanban code component properties in the property pane.

![Custom Page Import](../images/common/CP-ImportLayout.png)

![Custom Page Import](../images/common/CP-Import.png)

![Canvas Output](../images/kanban/CP-Output.png)

> [!NOTE]
> Update the flexible height, width, and other properties of the Kanban code component to suit your application requirements. Also, refer to the [Kanban Canvas documentation](getting-started-with-canvas.md#import-syncfusion-powerapps-Kanban-code-component-into-canvas-application) for additional information.

9. Save the custom page and publish the changes to add it in the model-driven application.

10. After that in the previously created model-driven application, click on the `Publish` button to make the changes live.

![Model-Driven App with CP](../images/kanban/MD-CP-Output.png)

> [!NOTE]
> For more information, refer to the [Create an blank Model-Driven app in PowerApps](https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/build-app-three-steps).

## Publish the Syncfusion PowerApps Kanban application

After publishing the application, click the `play` button to preview the published application. You can also share the published application with your users.

![Model-Driven App Publish](../images/kanban/MD-CP-Publish.png)

## See Also

- [Getting Started with the Syncfusion PowerApps Kanban Code Component in Canvas Application](getting-started-with-canvas.md)
