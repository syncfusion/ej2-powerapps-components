# Getting Started with Syncfusion PowerApps Grid Code Component in Model-Driven Application (Custom Pages)

This article provides a step-by-step guide for setting up a PowerApps model-driven application with Custom pages (Canvas) and integrating the Syncfusion PowerApps Grid code component.

PowerApps Model-Driven is a versatile platform for creating structured applications with a focus on data-centric design. It offers a guided approach, allowing users to build efficient business processes and workflows within a predefined data model.

## Prerequisites

- [Published Syncfusion PowerApps solution package](../../README.md#deploying-the-solution-package-in-the-powerapps-portal)

## Create a new Dataverse table

Syncfusion PowerApps Grid code component requires data to be loaded from a data source. Follow the steps provided in [Create a new Dataverse table](../common/faq.md#how-to-create-a-new-dataverse-table) section to create a new table in Dataverse using the CSV in the Grid code component [data](../../components/grids/data/) folder. Skip this step if you have an existing table with data.

> [!NOTE]
> Ensure that the created Grid column table name match the fields in the CSV file with proper dataType to avoid data loading issues in the Grid code component.

## Create a PowerApps model-driven application

To create a model-driven application, follow the steps below:

1. In the [PowerApps portal](https://make.powerapps.com/), navigate to the `Apps` tab located in the left navigation pane and select the `Start with a page design` option.

    ![Model-Driven App Create](../images/common/CV-App.png)

2. Opt for the `Blank page with navigation` option and assign a meaningful name for your model-driven application. Proceed by clicking `create`.

    ![Model-Driven App Create 1](../images/common/CV-App1.png)

3. The PowerApps platform will generate a blank model-driven application based on your specifications. You are now ready to start building your application.

    ![Model-Driven App Created](../images/common/MD-Created.png)

4. To incorporate custom page into your application, click on the `Add Page` button. Select `Custom Page` & select `Create custom page` option. And assign a meaningful name for your custom page. Proceed by clicking `Add`.

    ![Add Custom Page 1](../images/common/CP-AddCustomPage1.png)

    ![Add Custom Page 2](../images/common/CP-AddCustomPage2.png)

5. The PowerApps platform will generate a blank custom page based on your specifications in a new tab. You are now ready to start building your custom page (Canvas).

6. Use any layouts & import the Syncfusion PowerApps Grid code component to the custom page. Configure the data source for the Grid code component by accessing the list of Dataverse tables. This step ensures that the Grid code component is seamlessly connected to the relevant data. Also, customize the Grid code component properties in the property pane.

    ![Custom Page Import](../images/common/CP-ImportLayout.png)

    ![Custom Page Import](../images/common/CP-Import.png)

    ![Canvas Output](../images/grids/CP-Output.png)

    > [!NOTE]
    > Update the flexible height, width, and other properties of the Grid code component to suit your application requirements. Also, refer to the [Grid Canvas documentation](getting-started-with-canvas.md#add-syncfusion-powerapps-grid-code-component-into-canvas-application) for additional information on property configuration of the code component.

7. Save the custom page and publish the changes to add it in the model-driven application.

8. After that in the previously created model-driven application, click on the `Publish` button to make the changes live.

    ![Model-Driven App with CP](../images/grids/MD-CP-Output.png)

> [!NOTE]
> For more information, refer to the [Create an blank Model-Driven app in PowerApps](https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/build-app-three-steps).

## Publish the Syncfusion PowerApps Grid application

After publishing the application, click the `play` button to preview the published application. You can also share the published application with your users.

![Model-Driven App Publish](../images/grids/MD-CP-Publish.png)

## See Also

- [Getting Started with the Syncfusion PowerApps Grid Code Component in Canvas Application](getting-started-with-canvas.md)

- [Getting Started with the Syncfusion PowerApps Grid Code Component in Model-Driven Application (Form)](getting-started-with-model-driven-form.md)
