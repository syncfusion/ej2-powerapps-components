# Syncfusion PowerApps Pivotview Code Component API Reference

Below are the list of public APIs available in Pivotview PowerApps code component.

## Properties

### DataSource (DataSet)

Defines the data source for the Pivotview code component. It specifies the `datasources` that the Pivotview retrieves its data.

### PivotViewConfig (Multiple)

The configuration settings for the Pivotview code component in JSON format. It specifies the `pivotViewConfig` of the Pivotview. The following properties are available in the `pivotViewConfig` object.

- `chartSettings`: Allows a set of options to customize a pivot chart with a variety of settings.
- `dataSourceSettings`: Allows the following pivot report information such as rows, columns, values, etc., that are used to render the pivot table and field list.
- `groupingBarSettings`: Allows a set of options for customizing the grouping bar UI with a variety of settings.
- `pageSettings`: Allows to set the page information to display the pivot table with specific page during paging and virtual scrolling.
- `pagerSettings`: Allows a set of options for customizing the paging UI with a variety of settings such as UI position, visibility to a specific axis info such as page size, paging data.

> [!NOTE]
> The `dataSourceSettings` property is mandatory in `pivotViewConfig` property. because without `dataSourceSettings` property Pivotview component not render. If you want to customize the Pivotview code component, you can use this property to set the configuration settings. Use the JSON format to set the configuration. Checkout the [Pivotview documentation](https://ej2.syncfusion.com/react/documentation/pivotview/getting-started) for more details on the configuration settings.

Defaults to `""`

### Show FieldsList (TwoOptions)

If `showFieldList` set to true, then built-in popup field list to be enabled in the pivot table UI.

Defaults to `false`

### Allow CalculatedField (TwoOptions)

If `allowCalculatedField` set to true, then built-in calculated field dialog to be displayed in the component

Defaults to `false`

### Allow DeferLayoutUpdate (TwoOptions)

If `allowDeferLayoutUpdate` set to true, then the pivot table component to be updated only on demand.

Defaults to `false`

### Enable FieldSearching (TwoOptions)

If `enableFieldSearching` set to true, then it enables the search option in the field list UI.

Defaults to `false`

### Show Valuesbutton (TwoOptions)

If `showValuesButton` set to true, then its create a pivot button with “Values” as a caption used to display in the grouping bar and field list UI.

Defaults to `false`

### Allow DrillThrough (TwoOptions)

If `allowDrillThrough` set to true, then its enable to view the underlying raw data of a summarized cell in the pivot table.

Defaults to `false`

### Enable ValueSorting (TwoOptions)

If `enableValueSorting` set to true, then you can sort the values by clicking directly on the value field header positioned either in row or column axis to ascending or descending order of the pivot table.

Defaults to `false`

### Allow Grouping (TwoOptions)

If `allowGrouping` set to true, then its show the grouping UI in the pivot table that automatically groups date, time, number and string at runtime. by right clicking on the pivot table’s row or column header.

Defaults to `false`

### Enable Paging (TwoOptions)

If `enablePaging` set to true, then its allows large amounts of data to be displayed page-by-page. 

Defaults to `false`

### Enable RTL (TwoOptions)

If `enableRtl` set to true, then enable rendering component in right to left direction.

Defaults to `false`

### Show Groupingbar (TwoOptions)

If `showGroupingBar` set to true, then its Allows you to show the grouping bar UI in the pivot table that automatically populates fields from the bound report.

Defaults to `false`

### Show Toolbar (TwoOptions)

If `showToolbar` set to true, then its show the toolbar UI that holds built-in toolbar options to accessing frequently used features like switching between pivot table and pivot chart, changing chart types, conditional formatting, number formatting, etc….

Defaults to `false`

### Show Tooltip (TwoOptions)

If `showTooltip` set to true, then its display the tooltip to the value cells either by mouse hovering or by touch in the pivot table.

Defaults to `false`

## Display Options (Enum)

Defines the type of the view port as either pivot table or pivot chart or both table and chart.. The available types are,

* **Table** - Allows you to display the view port as Pivot table.
* **Chart** - Allows you to display the view port as Pivot chart.
* **Both** - Allows you to display the view port as both Pivot table and Pivot chart.

Defaults to `Table`

### ChartType (Enum)

Defines the chart type for the Pivot Chart. It will be applied type in chartSeries property. The available types are,

 * **Line** - Renders the line series.
 * **Column** - Renders the column series.
 * **Area** - Renders the area series.
 * **Bar** - Renders the stacking column series
 * **Histogram** - Renders the histogram series
 * **StackingColumn** - Renders the stacking column series.
 * **StackingArea** - Renders the stacking area series.
 * **StackingStepArea** - Renders the stacking step area series.
 * **StackingLine** - Renders the stacking line series.
 * **StackingBar** - Renders the stacking bar series.
 * **StepLine** -  Renders the step line series.
 * **StepArea** -  Renders the step area series.
 * **SplineArea** - Renders the spline area series.
 * **Scatter** - Renders the scatter series.
 * **Spline** - Renders the spline series
 * **StackingColumn100** - Renders the stacking column series.
 * **StackingBar100** - Renders the stacking bar 100 percent series.
 * **StackingLine100** - Renders the stacking line 100 percent series.
 * **StackingArea100** - Renders the stacking area 100 percent series
 * **RangeColumn** - Renders the rangeColumn series.
 * **RangeStepArea** - Renders the rangeStepArea series.
 * **Hilo** - Renders the hilo series
 * **HiloOpenClose** - Renders the HiloOpenClose Series
 * **Waterfall** - Renders the Waterfall Series
 * **RangeArea** - Renders the rangeArea series.
 * **SplineRangeArea** - Renders the splineRangeArea series.
 * **Pareto** - Render the Pareto series.

Defaults to `Line`

### Height (Whole.None)

Defines the height of the Pivotview code component. It specifies the height of the Pivotview when rendered in PowerApps table form.

Defaults to `200`

### Event Name (SingleLine.Text)

Defines the event name for the Pivotview code component. It specifies the `event` of the Pivotview. Possible values are `onError`.

### OnError (SingleLine.Text)

Outputs error message when onError is triggered. Use below PowerFx code in the **onChange** property to notify the error message in the canvas application.

```
If(
    Self.EventName="onError",
    Notify(Self.OnError, NotificationType.Error)
)
```
