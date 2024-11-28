# Syncfusion PowerApps Kanban Code Component API Reference

Below are the list of public APIs available in Kanban PowerApps code component.

## Properties

### DataSource (DataSet)

Defines the data source for the Kanban code component. It specifies the `datasources` that the Kanban retrieves its data.

### Enable Dark Mode (TwoOptions)

If `enableDarkMode` set to true, then it will enable the dark mode for the Kanban code component.

### Kanban Config (Multiple)

The configuration settings for the Kanban code component in JSON format. It specifies the `kanbanConfig` of the Kanban. The following properties are available in the `kanbanConfig` object.

- `cardSettings`: Defines the Kanban board related settings such as header field, content field, show or hide header, and single or multiple selection.
- `columns`: Defines the Kanban board columns and their properties such as header text, key field, allow toggle, expand or collapse state, min or max count, and show or hide item count.
- `sortSettings`: Defines the sort settings such as field and direction.
- `stackedHeaders`: Defines the stacked header for Kanban columns with text and key fields.
- `swimlaneSettings`: Defines the swimlane settings to Kanban board such as key field, text field, allow drag-and-drop, show or hide empty row, show or hide items count, and more.

> [!NOTE]
> The `cardSettings` and `columns` property is mandatory. because without `cardSettings` and `columns` property Kanban component not render. If you want to customize the Kanban code component, you can use this property to set the configuration settings. Use the JSON format to set the configuration. Checkout the [Kanban documentation](https://ej2.syncfusion.com/react/documentation/kanban/getting-started) for more details on the configuration settings.

Defaults to `""`

### KeyField (SingleLine.Text)

Defines the key field of Kanban board. The Kanban renders its layout based on this key field.

Defaults to `""`

> [!Important]
> The keyField property is mandatory for mapping the data in the Kanban board. If the keyField is not mapped or is left empty, the Kanban board will not render the columns properly. You must specify a valid key field for the Kanban layout to work as expected.

### CardHeight (SingleLine.Text)

Sets the height of the each card in the kanban. The string type includes pixel. When height is set with specific pixel value, then the card will be rendered to that specified height. In case, if auto value is set, then the height of the card gets auto-adjusted based on the content.

Defaults to `auto`

### CssClass (SingleLine.Text)

It is used to customize the Kanban, which accepts custom CSS class names that defines specific user-defined styles and themes to be applied on the Kanban element.

Defaults to `""`

### Enable Tooltip (TwoOptions)

If `enableTooltip` set to true, then it will enables the tooltip in Kanban board. The property relates to the tooltipTemplate property

Defaults to `false`

### Event Name (SingleLine.Text)

Defines the event name for the Kanban code component. It specifies the `event` of the Kanban. Possible values are `onError`.

### OnError (SingleLine.Text)

Outputs error message when onError is triggered. Use below PowerFx code in the **onChange** property to notify the error message in the canvas application.

```js
If(
    Self.EventName="onError",
    Notify(Self.OnError, NotificationType.Error)
)
```
