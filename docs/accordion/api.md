# Syncfusion PowerApps Accordion Code Component API Reference

Below are the list of public APIs available in Accordion PowerApps code component.

## Properties

### Items (DataSet)

Specifies the data source for the Accordion component by defining the `Items` from which the Accordion retrieves its rendering data. The `Items` property accepts a `DataSet` that contains the items data. The `DataSet` should contain the following columns:

- `id` - Sets unique ID to accordion item.
- `header` - Sets the header text to be displayed for the Accordion item. It also supports to include the title as HTML element or string.
- `expanded` - Sets the expand (true) or collapse (false) state of the Accordion item.
- `content` - Sets the text content to be displayed for the Accordion item. It also supports to include the content as HTML element or string.
- `disabled` - Sets true to disable an accordion item.
- `visible` - Sets false to hide an accordion item.

Check out the [Accordion documentation](https://ej2.syncfusion.com/documentation/api/accordion/accordionItemModel/) for more information on the available properties in items.

### Enable Dark Mode (TwoOptions)

If `enableDarkMode` set to true, then it will enable the dark mode for the Accordion code component.

Defaults to `false`

### AccordionConfig (Multiple)

The JSON string configuration settings for the Accordion component. Supported properties are:

- `animation` - Specifies the animation configuration settings for expanding and collapsing the panel.
- `expandedIndices` - Specifies the expanded items at initial load.

Defaults to `""`

> [!Note]
> The `AccordionConfig` property is a JSON object that allows you to configure the Accordion component. You can define the properties of the Accordion component as a JSON object and assign it to the `AccordionConfig` property to customize the Accordion component. Check out the [Accordion documentation](https://ej2.syncfusion.com/documentation/api/accordion/) for more information on the available properties.

### ExpandMode (Enum)

Specifies the options to expand single or multiple panel at a time. The possible values are,

- **Single** - Sets to expand only one Accordion item at a time.
- **Multiple** - Sets to expand more than one Accordion item at a time.

Defaults to `Multiple`

### Event Name (SingleLine.Text)

Defines the event name for the Accordion code component. It specifies the `event` of the Accordion. Possible values are `onError`.

### OnError (SingleLine.Text)

Outputs error message when onError is triggered. Use below PowerFx code in the **onChange** property to notify the error message in the canvas application.

```js
If(
    Self.EventName="onError",
    Notify(Self.OnError, NotificationType.Error)
)
```
