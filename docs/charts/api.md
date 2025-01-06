# Syncfusion PowerApps Chart Code Component API Reference

Below are the list of public APIs available in Chart PowerApps code component.

## Properties

### DataSource (DataSet)

Defines the data source for the Chart code component. It specifies the `datasources` that the Chart receives its series data.

### Enable Dark Mode (TwoOptions)

If `enableDarkMode` set to true, then it will enable the dark mode for the Chart code component.

### Series (Multiple)

Defines configuration options for the chart's series. The dataSource will be updated automatically.

Check out the [Chart documentation](https://ej2.syncfusion.com/documentation/chart/chart-types/line) for more information on the available series types and their properties.

Defaults to `""`

### SeriesType (Enum)

Defines the global series type for the Chart code component. It will be applied to all series in Series property, if type not specified. The available types are,

- **Line** - Renders the line series.
- **Column** - Renders the column series.
- **Area** - Renders the area series.
- **Bar** - Renders the stacking column series
- **Histogram** - Renders the histogram series
- **StackingColumn** - Renders the stacking column series.
- **StackingArea** - Renders the stacking area series.
- **StackingStepArea** - Renders the stacking step area series.
- **StackingLine** - Renders the stacking line series.
- **StackingBar** - Renders the stacking bar series.
- **StepLine** -  Renders the step line series.
- **StepArea** -  Renders the step area series.
- **SplineArea** - Renders the spline area series.
- **Scatter** - Renders the scatter series.
- **Spline** - Renders the spline series
- **StackingColumn100** - Renders the stacking column series.
- **StackingBar100** - Renders the stacking bar 100 percent series.
- **StackingLine100** - Renders the stacking line 100 percent series.
- **StackingArea100** - Renders the stacking area 100 percent series
- **RangeColumn** - Renders the rangeColumn series.
- **RangeStepArea** - Renders the rangeStepArea series.
- **Hilo** - Renders the hilo series
- **HiloOpenClose** - Renders the HiloOpenClose Series
- **Waterfall** - Renders the Waterfall Series
- **RangeArea** - Renders the rangeArea series.
- **SplineRangeArea** - Renders the splineRangeArea series.
- **Pareto** - Render the Pareto series.

Defaults to `Line`

### Title (SingleLine.Text)

Defines the title of the Chart code component.

Defaults to `""`

### Primary X-Axis Type (Enum)

Defines the type of the Chart component horizontal axis. The available types are,

- **Auto** - Automatically assigns the x axis type based on the `xName` property of the chart series.
- **Double** - Displays the x axis as double type.
- **DateTime** - Displays the x axis as date time type.
- **Category** - Displays the x axis as category type.
- **Logarithmic** - Displays the x axis as logarithmic type.
- **DateTimeCategory** - Displays the x axis as date time category type.

Defaults to `Auto`

### Enable Crosshair (TwoOptions)

If `enableCrosshair` set to true, then it will enable the crosshair for the Chart code component.

Defaults to `false`

### Enable Tooltip (TwoOptions)

If `enableTooltip` set to true, then it will enable the tooltip for the Chart code component data points.

Defaults to `false`

### Enable Crosshair ToolTip (TwoOptions)

If `enableCrosshairToolTip` set to true, then it will enable the crosshair tooltip for the Chart code component data points.

Defaults to `false`

### Enable Legend Visibility (TwoOptions)

If `enableLegendVisibility` set to true, then it will enable the legend visibility for the Chart code component.

Defaults to `true`

### Enable MouseWheel Zooming (TwoOptions)

If `enableMouseWheelZooming` set to true, then it will enable the mouse wheel zooming for the Chart code component.

Defaults to `false`

### Enable Pinch Zooming (TwoOptions)

If `EnablePinchZooming` set to true, then it will enable the pinch zooming for the Chart code component.

Defaults to `false`

### Enable Selection Zooming (TwoOptions)

If `EnableSelectionZooming` set to true, then it will enable the selection zooming for the Chart code component.

Defaults to `false`

### Height (Whole.None)

Defines the height of the Chart code component. It specifies the height of the Chart when rendered in PowerApps table form.

Defaults to `200`

### Event Name (SingleLine.Text)

Defines the event name for the Chart code component. It specifies the `event` of the Chart. Possible values are `onError`.

### OnError (SingleLine.Text)

Outputs error message when onError is triggered. Use below PowerFx code in the **onChange** property to notify the error message in the canvas application.

```js
If(
    Self.EventName="onError",
    Notify(Self.OnError, NotificationType.Error)
)
```
