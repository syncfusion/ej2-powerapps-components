# Syncfusion PowerApps Grid Code Component API Reference

Below are the list of public APIs available in Grid code component.

## Properties

### DataSource (DataSet)

Defines the data source for the Grid component. It specifies the `dataset` that the Grid retrieves its data.

### Columns (DataSet)

Defines the column data for the Grid component. It specifies the `dataset` that the Grid retrieves its data to display the columns. Below are the list of properties available in Columns dataset.

* `ColHeaderText` - Defines the column header text.
* `ColType` - Defines the column type.
* `ColEditType` - Defines the column edit type.
* `ColClipMode` - Defines the column clip mode.
* `ColTextAlign` - Defines the column text align.
* `ColHeaderTextAlign` - Defines the column header text align.
* `ColVisible` - Defines the column visibility.
* `ColIsPrimaryKey` - Defines the column is primary key.
* `ColAllowSorting` - Defines the column allow sorting.
* `ColAllowResizing` - Defines the column allow resizing.
* `ColAllowFiltering` - Defines the column allow filtering.
* `ColAllowGrouping` - Defines the column allow grouping.
* `ColallowEditing` - Defines the column allow editing.
* `ColDisableHtmlEncode` - Defines the column disable html encode.
* `ColEnableGroupByFormat` - Defines the column enable group by format.
* `ColDisplayAsCheckBox` - Defines the column display as check box.
* `ColAutoFit` - Defines the column auto fit.
* `ColWidth` - Defines the column width.
* `ColMinWidth` - Defines the column min width.
* `ColMaxWidth` - Defines the column max width.
* `ColFormat` - Defines the column format.

### Primary Key (SingleLine.Text)

Defines the column name which is the `primaryKey` of the Grid only for auto generated columns.

Defaults to `""`

### Allow Editing (TwoOptions)

If `allowEditing` set to true, then it will allow editing of a record.

Defaults to `false`

> [!NOTE]
> In canvas applications, it is important to note that the PowerApps entity save functionality is currently in an experimental phase. Moreover, it should be understood that columns utilizing Decimal and Float data types within Dataverse tables do not support saving operations within canvas. For comprehensive details regarding these considerations, please consult the provided links outlining the [constraints associated with setValue for entities](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/reference/entityrecord/setvalue#limitations) and the [experimental nature of entity save](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/reference/entityrecord/save#available-for).

### Edit Mode (Enum)

Defines the edit mode of the Grid. The available edit modes are,

* **Normal** - Defines the normal edit mode which edits a single row at a time.
* **Dialog** - Defines the dialog edit mode which edits a row in a dialog.

Defaults to `Normal`

### Allow Paging (TwoOptions)

If `allowPaging` set to true, the pager renders at the footer of the Grid. It is used to handle page navigation in the Grid.

Defaults to `false`

### Page Size (Whole.None)

Defines the number of records to be displayed per page.

Defaults to `12`

### Page Count (Whole.None)

Defines the number of pages to be displayed in the pager container.

Defaults to `8`

### Allow Sorting (TwoOptions)

If `allowSorting` set to true, then it will allow sorting of grid records when column header is clicked.

Defaults to `false`

### Allow Multi Sorting (TwoOptions)

If `allowMultiSorting` set to true, then it will allow multiple column sorting of grid records when click on the multiple column headers.

Defaults to `false`

### Allow Filtering (TwoOptions)

If `allowFiltering` set to true, then it will allow filtering of grid records.

Defaults to `false`

### Grid Lines (Enum)

Defines `GridLines`. The available GridLines are,

* **Default** - Displays GridLines based on the theme.
* **Both** - Displays both the horizontal and vertical GridLines.
* **None** - No GridLines are displayed.
* **Horizontal** - Displays the horizontal GridLines only.
* **Vertical** - Displays the vertical GridLines only.

Defaults to `Default`

### Allow TextWrap (TwoOptions)

If `allowTextWrap` set to true, then text content will wrap to the next line when its text content exceeds the width of the Column Cells.

Defaults to `false`

### Allow Resizing (TwoOptions)

If `allowResizing` set to true, then it will allow resizing of grid columns.

Defaults to `false`

### Event Name (SingleLine.Text)

Defines the event name for the Grid component. It specifies the `event` of the Grid. Possible values are `recordDoubleClick`, `rowSelected`, `rowDeselected`, `onError`.

### OnError (SingleLine.Text)

Outputs error message when onError is triggered. Use below PowerFx code in the **onChange** property to notify the error message in the canvas application.

```
If(
    Self.EventName="onError",
    Notify(Self.OnError, NotificationType.Error)
)
```