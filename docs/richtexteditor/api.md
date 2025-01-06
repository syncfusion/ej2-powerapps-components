# Syncfusion PowerApps RichTextEditor Code Component API Reference

Below are the list of public APIs available in RichTextEditor PowerApps code component.

## Properties

### Enable Dark Mode (TwoOptions)

If `enableDarkMode` set to true, then it will enable the dark mode for the RichTextEditor code component.

### Value (SingleMultipleText)

Specifies the value displayed in the RichTextEditor's content area and it should be string.

Defaults to ``.

### RTEConfig (SingleMultipleText)

The configuration settings for the RichTextEditor code component in JSON format. It specifies the `RTEConfig` of the RTE. The following properties are available in the `RTEConfig` object.

- `fontFamily` - Specifies the font family for the RichTextEditor.
- `fontSize` - Specifies the font size for the RichTextEditor.
- `format` - Specifies the format for the RichTextEditor.
- `iframeSettings` - Specifies the iframe settings for the RichTextEditor.
- `inlineMode` - Specifies the inline mode for the RichTextEditor.
- `insertAudioSettings` - Specifies the insert audio settings for the RichTextEditor.
- `insertImageSettings` - Specifies the insert image settings for the RichTextEditor.
- `insertVideoSettings` - Specifies the insert video settings for the RichTextEditor.
- `pasteCleanupSettings` - Specifies the paste cleanup settings for the RichTextEditor.
- `toolbarSettings` - Specifies the toolbar settings for the RichTextEditor.
- `quickToolbarSettings` - Specifies the quick toolbar settings for the RichTextEditor.
- `numberFormatList` - Specifies the number format list for the RichTextEditor.
- `bulletFormatList` - Specifies the bullet format list for the RichTextEditor.
- `tableSettings` - Specifies the table settings for the RichTextEditor.

> [!NOTE]
> The `RTEConfig` property is not mandatory. If you want to customize the RichTextEditor code component, you can use this property to set the configuration settings. Use the JSON format to set the configuration. Checkout the [RichTextEditor documentation](https://ej2.syncfusion.com/react/documentation/rich-text-editor/getting-started) for more details on the configuration settings.

Defaults to ``.

### CssClass (SingleLine.Text)

Specifies the CSS class name appended with the root element of the RichTextEditor. One or more custom CSS classes can be added to a RichTextEditor.

Defaults to ``.

### MaxLength (Whole.None)

Specifies the maximum number of characters allowed in the Rich Text Editor component.

Defaults to `-1`.

### Placeholder (SingleLine.Text)

Specifies the placeholder for the RichTextEditor’s content used when the Rich Text Editor body is empty.

Defaults to ``.

### EnterKey (Enum)

Specifies tag to be inserted when enter key is pressed.

- `P` - When the enter key is pressed a `p` tag will be inserted and the default value of the Rich Text Editor will be `&lt;p&gt;&lt;br&gt;&lt;/p&gt;`.
- `DIV` - When the enter key is pressed a `div` tag will be inserted instead of the default `P` tag and the default value of the Rich Text Editor will be `&lt;div&gt;&lt;br&gt;&lt;/div&gt;`.
- `BR` - When the enter key is pressed a `br` tag will be inserted instead of the default `P` tag and the default value of the Rich Text Editor will be `&lt;br&gt;`.

Defaults to `P`.

### ShowCharCount (TwoOptions)

Sets Boolean value to enable or disable the display of the character counter.

Defaults to `false`.

### EnableResize (TwoOptions)

Enables or disables the resizing option in the editor. If enabled, the Rich Text Editor can be resized by dragging the resize icon in the bottom right corner.

Defaults to `false`.

### EnableXhtml (TwoOptions)

Specifies a value that indicates whether the xhtml is enabled or not.

Defaults to `false`.

## Enabled (TwoOptions)

Specifies a value that indicates whether the component is enabled or not.

Defaults to `true`.

### Event Name (SingleLine.Text)

Defines the event name for the RichTextEditor code component. It specifies the `event` of the RichTextEditor. Possible values are `onError`.

### OnError (SingleLine.Text)

Outputs error message when onError is triggered. Use below PowerFx code in onChange property to notify the error message.

```js
If(
    Self.EventName="onError",
    Notify(Self.OnError, NotificationType.Error)
)
```
