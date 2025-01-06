# Syncfusion PowerApps TreeGrid Code Component API Reference

Below are the list of public APIs available in TreeGrid PowerApps code component.

## Properties

### DataSource (DataSet)

Specifies the data source for the TreeGrid component by defining the `DataSource` from which the TreeGrid retrieves its rendering data.

### Enable Dark Mode (TwoOptions)

If `enableDarkMode` set to true, then it will enable the dark mode for the TreeGrid code component.

### TreeGridConfig (Multiple)

The JSON string configuration settings for the TreeGrid component include an optional `columns` property, which will be automatically populated based on the data source if not specified. Supported properties are:

* `columns` - Defines the columns of the TreeGrid. Each column has its own properties that define the column's behavior. Check out the for more information on the [column properties](https://ej2.syncfusion.com/javascript/documentation/treegrid/columns) as JSON.
* `aggregates` - Defines the aggregate columns of the TreeGrid. Check out the for more information on the [aggregate properties](https://ej2.syncfusion.com/javascript/documentation/treegrid/aggregates) as JSON.
* `columnMenuItems` - Defines the column menu items of the TreeGrid. Check out the for more information on the [column menu item properties](https://ej2.syncfusion.com/javascript/documentation/treegrid/columns/column-menu) as JSON.
* `filterSettings` - Defines the filter settings of the TreeGrid. Check out the for more information on the [filter setting properties](https://ej2.syncfusion.com/javascript/documentation/treegrid/filtering) as JSON.
* `loadingIndicator` - Defines the loading indicator of the TreeGrid. Check out the for more information on the [loading indicator properties](https://ej2.syncfusion.com/javascript/documentation/treegrid/loading-animation) as JSON.
* `pageSettings` - Defines the page settings of the TreeGrid. Check out the for more information on the [page setting properties](https://ej2.syncfusion.com/javascript/documentation/treegrid/paging) as JSON.
* `searchSettings` - Defines the search settings of the TreeGrid. Check out the for more information on the [search setting properties](https://ej2.syncfusion.com/javascript/documentation/treegrid/searching) as JSON.
* `selectionSettings` - Defines the selection settings of the TreeGrid. Check out the for more information on the [selection setting properties](https://ej2.syncfusion.com/javascript/documentation/treegrid/selection) as JSON.
* `sortSettings` - Defines the sort settings of the TreeGrid. Check out the for more information on the [sort setting properties](https://ej2.syncfusion.com/javascript/documentation/treegrid/sorting) as JSON.
* `textWrapSettings` - Defines the text wrap settings of the TreeGrid. Check out the for more information on the [text wrap setting properties](https://ej2.syncfusion.com/javascript/documentation/treegrid/cell/auto-wrap) as JSON.
* `toolbar` - Defines the toolbar of the TreeGrid. Check out the for more information on the [toolbar properties](https://ej2.syncfusion.com/javascript/documentation/treegrid/tool-bar/tool-bar) as JSON.

Defaults to `""`

> [!Note]
> The `TreeGridConfig` property is a JSON object that allows you to configure the TreeGrid component. You can define the columns, aggregates, column menu items, filter settings, loading indicator, page settings, search settings, selection settings, sort settings, text wrap settings, and toolbar of the TreeGrid component. Check out supported properties in [types.tsx](../../components/treegrid/SfTreeGrid/types.tsx#L84) file.

### IdMapping (SingleLine.Text)

Specifies the name of the field in the dataSource, which contains the id of that row.

Defaults to `""`

### ParentIdMapping (SingleLine.Text)

Specifies the name of the field in the dataSource, which contains the parent's id.

Defaults to `""`

### FrozenColumns (Whole.None)

Gets or sets the number of frozen columns.

Defaults to `0`

### FrozenRows (Whole.None)

Gets or sets the number of frozen rows.

Defaults to `0`

### RowHeight (Whole.None)

Defines the height of TreeGrid rows.

Defaults to `-1`

### TreeColumnIndex (Whole.None)

Specifies the index of the column that needs to have the expander button.

Defaults to `0`

### ClipMode (Enum)

Defines the mode of clip. The available modes are,

* `Clip` - Truncates the cell content when it overflows its area.
* `Ellipsis` - Displays ellipsis when the cell content overflows its area.
* `EllipsisWithTooltip` - Displays ellipsis when the cell content overflows its area,

Defaults to `Ellipsis`

### CopyHierarchyMode (Enum)

Defines the copy clipboard types. The available built-in items are,

* `Parent` - Copy the selected data with parent record.
* `Child` - Copy the selected data with child record.
* `Both` - Copy the selected data with both parent and child record.
* `None` - Copy only the selected record.

Defaults to `Parent`

### GridLines (Enum)

Defines the mode of TreeGrid lines. The available modes are,

* `Both` - Displays both horizontal and vertical TreeGrid lines.
* `None` - No TreeGrid lines are displayed.
* `Horizontal` - Displays the horizontal TreeGrid lines only.
* `Vertical` - Displays the vertical TreeGrid lines only.
* `Default` - Displays TreeGrid lines based on the theme.

Defaults to `Default`

### PrintMode (Enum)

Defines the print modes. The available print modes are,

* `AllPages` - Prints all pages of the TreeGrid.
* `CurrentPage` - Prints the current page of the TreeGrid.

Defaults to `AllPages`

### AllowExcelExport (TwoOptions)

If allowExcelExport set to true, then it will allow the user to export treegrid to Excel file.

Defaults to `false`

### AllowPdfExport (TwoOptions)

If allowPdfExport set to true, then it will allow the user to export treegrid to Pdf file.

Defaults to `false`

### AllowFiltering (TwoOptions)

If allowFiltering is set to true the filter bar will be displayed. If set to false the filter bar will not be displayed. Filter bar allows the user to filter tree grid records with required criteria.

Defaults to `false`

### AllowSorting (TwoOptions)

If allowSorting is set to true, it allows sorting of treegrid records when column header is clicked.

Defaults to `false`

### AllowMultiSorting (TwoOptions)

If allowMultiSorting set to true, then it will allow the user to sort multiple column in the treegrid.

Defaults to `true`

### AllowPaging (TwoOptions)

If allowPaging is set to true, pager renders.

Defaults to `false`

### AllowReordering (TwoOptions)

If allowReordering is set to true, TreeGrid columns can be reordered. Reordering can be done by drag and drop of a particular column from one index to another index.

Defaults to `false`

### AllowResizing (TwoOptions)

If allowResizing is set to true, TreeGrid columns can be resized.

Defaults to `false`

### AllowSelection (TwoOptions)

If allowSelection is set to true, it allows selection of (highlight row) TreeGrid records by clicking it.

Defaults to `true`

### AllowTextWrap (TwoOptions)

If allowTextWrap set to true, then text content will wrap to the next line when its text content exceeds the width of the Column Cells.

Defaults to `false`

### AutoCheckHierarchy (TwoOptions)

If autoCheckHierarchy is set to true, hierarchy checkbox selection is enabled in TreeGrid.

Defaults to `false`

### EnableAltRow (TwoOptions)

If enableAltRow is set to true, the TreeGrid will render with e-altrow CSS class to the alternative tr elements.

Defaults to `true`

### EnableAutoFill (TwoOptions)

If enableAutoFill is set to true, then the auto fill icon will displayed on cell selection for copy cells. It requires the selection mode to be Cell and cellSelectionMode to be Box.

Defaults to `false`

### EnableCollapseAll (TwoOptions)

Specifies whether to load all the rows in collapsed state when the TreeGrid is rendered for the first time.

Defaults to `false`

### EnableHover (TwoOptions)

If enableHover is set to true, the row hover is enabled in the TreeGrid.

Defaults to `false`

### ShowColumnChooser (TwoOptions)

If showColumnChooser is set to true, it allows you to dynamically show or hide columns.

Defaults to `false`

### ShowColumnMenu (TwoOptions)

If showColumnMenu set to true, then it will enable the column menu options in each column.

Defaults to `false`

### Event Name (SingleLine.Text)

Defines the event name for the TreeGrid code component. It specifies the `event` of the TreeGrid. Possible values are `onError`.

### OnError (SingleLine.Text)

Outputs error message when onError is triggered. Use below PowerFx code in the **onChange** property to notify the error message in the canvas application.

```js
If(
    Self.EventName="onError",
    Notify(Self.OnErrorArgs, NotificationType.Error)
)
```
