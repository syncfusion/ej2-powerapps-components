# Syncfusion PowerApps Spreadsheet Code Component API Reference

Below are the list of public APIs available in Spreadsheet PowerApps code component.

## Properties

### DataSource (DataSet)

Defines the data source for the Spreadsheet code component. It specifies the `datasources` that the Spreadsheet retrieves its data.

### Enable Dark Mode (TwoOptions)

If `enableDarkMode` set to true, then it will enable the dark mode for the Spreadsheet code component.

### DocumentPath (SingleLine.Text)

Defines the path of the document to be loaded in the Spreadsheet code component.

Defaults to `"https://cdn.syncfusion.com/scripts/spreadsheet/Sample.xlsx"`

> [!NOTE]
> Only downloadable links are supported for the `documentPath` property.
> The Spreadsheet component initially renders based on the documentPath property, which can accept base64 data as well. However, if a dataSource is provided, it takes precedence and renders the JSON-based data instead.

### Allow Filtering (TwoOptions)

If `allowFiltering` set to true, then it will allows you to enable filter and its functionalities.

Defaults to `true`

### Allow FreezePane (TwoOptions)

If `allowFreezePane` set to true, then it will allows you to enable freeze pane functionality in spreadsheet

Defaults to `true`

### Allow Open (TwoOptions)

If `allowOpen` set to true, then it will allows you to open an Excel file (.xlsx, .xls, and .csv) in Spreadsheet.

Defaults to `true`

### Allow Print (TwoOptions)

If `allowPrint` set to true, then it will allows you to enable printing functionality in the spreadsheet. 

Defaults to `true`

### Allow Resizing (TwoOptions)

If `allowResizing` set to true, then it will allows you to spreadsheet columns and rows can be resized.

Defaults to `true`

### Allow Save (TwoOptions)

If `allowSave` set to true, then it will allows you to save Spreadsheet with all data as Excel file (.xlsx, .xls, and .csv).

Defaults to `true`

### Allow Sorting (TwoOptions)

If `allowSorting` set to true, then it will allows you to enable sort and its functionalities

Defaults to `true`

### Allow Wrap (TwoOptions)

If `allowWrap` set to true, then it will allows you to enable wrap text feature. By using this feature the wrapping applied cell text can wrap to the next line, if the text width exceeds the column width.

Defaults to `true`

### Show Aggregate (TwoOptions)

If `showAggregate` set to true, then it will show the AVERAGE, SUM, COUNT, MIN and MAX values based on the selected cells.

Defaults to `true`

### Show FormulaBar (TwoOptions)

If `showFormulaBar` set to true, then it shows the formula bar and its features.

Defaults to `true`

### Show Ribbon (TwoOptions)

If `showRibbon` set to true, then it shows the ribbon in spreadsheet.

Defaults to `true`

### Show SheetTabs (TwoOptions)

If `showSheetTabs` set to true, then it shows the sheets tabs, this is used to navigate among the sheets and create or delete sheets by UI interaction.

Defaults to `true`

### Selection Mode (Enum)

Defines the type of the selectionMode in the Spreadsheet. The available types are,

* **None** - Disable the visibility of hyperlink in all cells.
* **Single** - Allows you to set the visibility of hyperlink in all cells.
* **Multiple** - Allows you to set the visibility of hyperlink in row headers.

Defaults to `Multiple`

### Event Name (SingleLine.Text)

Defines the event name for the Spreadsheet code component. It specifies the `event` of the Spreadsheet. Possible values are `onError`.

### OnError (SingleLine.Text)

Outputs error message when onError is triggered. Use below PowerFx code in the **onChange** property to notify the error message in the canvas application.

```js
If(
    Self.EventName="onError",
    Notify(Self.OnError, NotificationType.Error)
)
```
