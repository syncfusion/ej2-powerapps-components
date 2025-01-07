# Syncfusion PowerApps FileManager Code Component API Reference

Below are the list of public APIs available in FileManager PowerApps code component.

## Properties

### FileSystemData (DataSet)

Specifies the data source for the FileManager component by defining the `DataSource` from which the FileManager retrieves its rendering data. The `FileSystemData` property accepts a `DataSet` that contains the file system data. The `DataSet` should contain the following columns:

- `id` - Specifies the current item id.
- `name` - Specifies the item name.
- `parentId` - Specifies the parent id for the item.
- `size` - Specifies the item size.
- `dateModified` - Specifies the modified data for current item.
- `dateCreated` - Specifies the created data for current item.
- `filterPath` - Specifies the filter path representing the traversal path of current item.
- `type` - Specifies the item type like ‘.png’, ‘.jpg’, etc.
- `hasChild` - Specifies whether the current folder has child.
- `isFile` - Specifies whether the item is a file or folder.
- `imageUrl` - Specifies the url of the image that must be loaded within File Manager.
- `permission` - Specifies the access control permission.

Check out the [FileManager FlatData documentation](https://ej2.syncfusion.com/react/documentation/file-manager/flat-data) for more information on the available properties.

### Enable Dark Mode (TwoOptions)

If `enableDarkMode` set to true, then it will enable the dark mode for the FileManager code component.

### FileManagerConfig (Multiple)

The JSON string configuration settings for the FileManager component. Supported properties are:

- `contextMenuSettings` - Defines the context menu settings of the FileManager. Check out the for more information on the [context menu properties](https://ej2.syncfusion.com/react/documentation/file-manager/customization#context-menu-customization) as JSON.
- `detailsViewSettings` - Defines the details view settings of the FileManager. Check out the for more information on the [details view properties](https://ej2.syncfusion.com/react/documentation/file-manager/customization#details-view-customization) as JSON.
- `navigationPaneSettings` - Defines the navigation pane settings of the FileManager. Check out the for more information on the [navigation pane properties](https://ej2.syncfusion.com/react/documentation/file-manager/customization#navigation-pane-customization) as JSON.
- `searchSettings` - Defines the search settings of the FileManager as JSON.
- `selectedItems` - Defines the selected items of the FileManager as JSON array.
- `toolbarItems` - Defines the toolbar items of the FileManager as JSON.
- `toolbarSettings` - Defines the toolbar settings of the FileManager. Check out the for more information on the [toolbar setting properties](https://ej2.syncfusion.com/react/documentation/file-manager/customization#toolbar-customization) as JSON.

Defaults to `""`

> [!Note]
> The `FileManagerConfig` property is a JSON object that allows you to configure the FileManager component. You can define the properties of the FileManager component as a JSON object and assign it to the `FileManagerConfig` property to customize the FileManager component. Check out the [FileManager documentation](https://ej2.syncfusion.com/react/documentation/api/file-manager/) for more information on the available properties.

### CssClass (SingleLine.Text)

Specifies the root CSS class of the file manager that allows you to customize the appearance by overriding the styles.

Defaults to `""`

### Path (SingleLine.Text)

Specifies the current path of the file manager.

Defaults to `/`

### RootAliasName (SingleLine.Text)

Specifies the root folder alias name in file manager.

Defaults to `""`

### SortBy (SingleLine.Text)

Specifies the field name being used as the sorting criteria to sort the files of the file manager component.

Defaults to `name`

### SortOrder (Enum)

Specifies a value that indicates whether the folders and files are sorted in the ascending or descending order, or they are not sorted at all. The available types of sort orders are,

- `None` - Indicates that the folders and files are not sorted.
- `Ascending` - Indicates that the folders and files are sorted in the ascending order.
- `Descending` - Indicates that the folders and files are sorted in the descending order.

Defaults to `Ascending`

### View (Enum)

Specifies the initial view of the file manager. With the help of this property, initial view can be changed to details or large icons view. The available views are:

- `LargeIcons` - Displays the large icons view.
- `Details` - Displays the details view.

Defaults to `LargeIcons`

### AllowMultiSelection (TwoOptions)

Enables or disables the multiple files selection of the file manager.

Defaults to `true`

### EnableVirtualization (TwoOptions)

Gets or sets a value that enables/disables the virtualization feature of the File Manager. When enabled, the File Manager will only load a subset of files and folders based on the size of the view port, with the rest being loaded dynamically as the user scrolls vertically through the list. This can improve performance when dealing with a large number of files and folders, as it reduces the initial load time and memory usage.

Defaults to `false`

### ShowFileExtension (TwoOptions)

Shows or hides the file extension in file manager.

Defaults to `true`

### ShowItemCheckBoxes (TwoOptions)

Gets or sets a boolean value that determines whether to display checkboxes in the file manager. If enabled, checkboxes are shown for files or folders on hover.

Defaults to `true`

### ShowThumbnail (TwoOptions)

Shows or hides the thumbnail images in largeicons view.

Defaults to `true`

### Height (Whole.None)

Defines the height of the FileManager code component. It specifies the height of the FileManager when rendered in PowerApps table form.

Defaults to `200`

### Event Name (SingleLine.Text)

Defines the event name for the FileManager code component. It specifies the `event` of the FileManager. Possible values are `onError`.

### OnError (SingleLine.Text)

Outputs error message when onError is triggered. Use below PowerFx code in the **onChange** property to notify the error message in the canvas application.

```js
If(
    Self.EventName="onError",
    Notify(Self.OnError, NotificationType.Error)
)
```
