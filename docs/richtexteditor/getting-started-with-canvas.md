# Getting Started with Syncfusion PowerApps RichTextEditor Code Component in Canvas Application

This article provides a step-by-step guide for setting up a PowerApps canvas application and integrating the Syncfusion PowerApps RichTextEditor code component.

Power Apps canvas empowers users to design custom applications with a personalized interface, offering creative freedom. Its intuitive drag-and-drop features enable seamless integration of elements, ensuring flexibility in app development and dynamic user experiences with diverse data sources.

## Prerequisites

- [Published Syncfusion PowerApps solution package](../../README.md#deploying-the-solution-package-in-the-powerapps-portal)

## Create a PowerApps Canvas application

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

## Import Syncfusion PowerApps RichTextEditor code component into canvas application

Integrating the Syncfusion PowerApps RichTextEditor code component into the blank canvas application involves the following steps:

1. Within the created blank canvas application, navigate to `Insert` -> `Get more components` icon below search bar.

   ![Canvas Import 1](../images/common/CV-Import1.png)

2. Switch to the `code` tab and import the published solution package component `SfRichTextEditor`.

   ![Canvas Import 2](../images/richtexteditor/CV-Import2.png)

3. Once imported, you'll find the Syncfusion PowerApps RichTextEditor code component in the `code components` section.

   ![Canvas Import 3](../images/richtexteditor/CV-Import3.png)

## Add Syncfusion PowerApps RichTextEditor code component into canvas application

Enhance your canvas application by adding the Syncfusion PowerApps RichTextEditor code component using the following steps:

1. From the `Insert` tab on left pane, drag and drop the `SfRichTextEditor` component located in the `code components` section into your application layout.

   ![Canvas Import Data For RichTextEditor](../images/richtexteditor/CV-ImportDataForRichTextEditor.png)

2. Initially, the RichTextEditor code component will be displayed with default properties. Customize the RichTextEditor code component properties in the right property pane and also via the PowerFx tab on top.

3. Once the document is loaded, the output of the RichTextEditor code component will displayed.

   ![Canvas Output](../images/richtexteditor/CV-Output.png)

## Preview the Syncfusion PowerApps RichTextEditor application

To preview the Syncfusion PowerApps RichTextEditor application in development environment with multiple device resolution, click the `Preview` button at the top right corner of the PowerApps portal.

![Canvas Preview](../images/richtexteditor/CV-Preview.png)

## Publish the Syncfusion PowerApps RichTextEditor application

To publish the Syncfusion PowerApps RichTextEditor application in the production environment, click the `Publish` button at the top right corner of the PowerApps portal. Now you can share the published application with your users.

Once the application is published, you can preview it by clicking the `play` button of the created Canvas application from the `Apps` tab on the homepage.

![Canvas Publish](../images/richtexteditor/CV-PublishOutput.png)

## See also

- [Getting Started with the Syncfusion PowerApps RichTextEditor Code Component in Model-Driven Application (Form)](getting-started-with-model-driven-form.md)

- [Getting Started with the Syncfusion PowerApps RichTextEditor Code Component in Model-Driven Application (Custom Pages)](getting-started-with-model-driven-custom-pages.md)
