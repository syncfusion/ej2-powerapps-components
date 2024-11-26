# Syncfusion PowerApps Gantt Code Component API Reference

Below are the list of public APIs available in Gantt PowerApps code component.

## Properties

### DataSource (DataSet)

Defines the data source for the Gantt code component. It specifies the `datasources` that the Gantt retrieves its data.

> [!NOTE]
> The `dataSource` defines in self-referential data, also known as hierarchical or tree-structured data, you typically need a structure where each item can reference itself through a parent-child relationship. Checkout the [Gantt documentation](https://ej2.syncfusion.com/react/documentation/gantt/data-binding#self-referential-data-binding-flat-data) for more details on the self-refrential data.

### Enable Dark Mode (TwoOptions)

If `enableDarkMode` set to true, then it will enable the dark mode for the Gantt code component.

### GanttConfig (Multiple)

The configuration settings for the Gantt code component in JSON format. It specifies the `ganttConfig` of the Gantt. The following properties are available in the `ganttConfig` object.

- `taskFields`: Defines mapping properties to find task values such as id, start date, end date, duration and progress values from data source.
- `columns`: Defines column collection displayed in grid If the `columns` declaration was empty then columns are automatically populated from taskSettings value.
- `resources`: Defines resource collection assigned for projects.
- `resourceFields`: Defines mapping properties to find resource values such as id, name, unit and group from resource collection.
- `dayWorkingTime`: Defines customized working time of project.
- `eventMarkers`: Defines events and status of project throughout the timeline.
- `filterSettings`: Allows you to configures the filter settings for Gantt.
- `holidays`: Defines holidays presented in project timeline.
- `searchSettings`: Allows you to configures the search settings for Gantt.
- `selectionSettings`: Allows you to configures the selection settings for Gantt.
- `sortSettings`: Allows you to configures the sort settings for Gantt.
- `splitterSettings`: Allows you to configures the splitter settings for Gantt.
- `timelineSettings`: Allows you to configures the timeline settings for Gantt.

> [!NOTE]
> The `taskFields` property is mandatory in `ganttConfig` property. because without `taskFields` property Gantt Chart component not render. If you want to customize the Gantt code component, you can use this property to set the configuration settings. Use the JSON format to set the configuration. Checkout the [Gantt documentation](https://ej2.syncfusion.com/react/documentation/gantt/getting-started) for more details on the configuration settings.

Defaults to `""`

### Allow Filtering (TwoOptions)

If `allowFiltering` set to true, then it enables filtering support in Gantt.

Defaults to `false`

### Allow Reordering (TwoOptions)

If `allowReordering` set to true, Gantt columns can be reordered. Reordering can be done by drag and drop of a particular column from one index to another index.

Defaults to `false`

### Allow Resizing (TwoOptions)

If `allowResizing` set to true, then the Gantt columns can be resized.

Defaults to `false`

### Allow Selection (TwoOptions)

If `allowSelection` set to true, it allows selection of (highlight row) Gantt chart rows by clicking it.

Defaults to `true`

### Allow Sorting (TwoOptions)

If `allowSorting` set to true,  it allows sorting of gantt chart tasks when column header is clicked.

Defaults to `false`

### Enable CriticalPath (TwoOptions)

If `enableCriticalPath` set to true, It highlights the critical tasks in the Gantt Chart that affect the project’s end date.

Defaults to `false`

### Show ColumnMenu (TwoOptions)

If `showColumnMenu` set to true, then it will enable the column menu options in each columns.

Defaults to `false`

### Show Toolbar (TwoOptions)

If `ShowToolbar` set to true, then its show the toolbar UI that holds built-in toolbar options to accessing frequently used features like ExpandAll, CollapseAll, PrevTimeSpan, NextTimeSpan, ZoomIn, ZoomOut, ZoomToFit, etc….

Defaults to `false`

### GridLines (Enum)

It Configures the grid lines in tree grid and gantt chart. The available types are,

* **Horizontal** - Define horizontal lines.
* **Vertical** - Define vertical lines.
* **Both** - Define both horizontal and vertical lines.
* **None** - Define no lines.

Defaults to `Horizontal`

### TimeZone (SingleLine.Text)

By default, task schedule dates are calculated with system time zone. If Gantt chart assigned with specific time zone, then schedule dates are calculated as given time zone date value.

### Tree ColumnIndex (Whole.None)

Defines the expander column index in Grid.

Defaults to `0`

### View Type (Enum)

Defines the view type of the Gantt. The available types are,

 * **ProjectView** - Defines the project view type of the Gantt.
 * **ResourceView** - Defines the resource view type of the Gantt.

Defaults to `ProjectView`

### Event Name (SingleLine.Text)

Defines the event name for the Gantt code component. It specifies the `event` of the Gantt. Possible values are `onError`.

### OnError (SingleLine.Text)

Outputs error message when onError is triggered. Use below PowerFx code in the **onChange** property to notify the error message in the canvas application.

```js
If(
    Self.EventName="onError",
    Notify(Self.OnError, NotificationType.Error)
)
```
