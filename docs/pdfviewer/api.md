# Syncfusion PowerApps PdfViewer Code Component API Reference

Below are the list of public APIs available in PdfViewer PowerApps code component.

## Properties

### Enable Dark Mode (TwoOptions)

If `enableDarkMode` set to true, then it will enable the dark mode for the PdfViewer code component.

### DocumentPath (SingleLine.Text)

Defines the path of the document to be loaded in the PdfViewer code component.

Defaults to `"https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"`

### EnableToolbar (TwoOptions)

If `enableToolbar` set to true, then it will enable the toolbar for the PdfViewer code component.

Defaults to `true`

### EnableNavigationToolbar (TwoOptions)

If `enableNavigationToolbar` set to true, then it will enable the navigation toolbar for the PdfViewer code component.

Defaults to `true`

### EnableBookmark (TwoOptions)

If `enableBookmark` set to true, then it will enable the bookmark for the PdfViewer code component.

Defaults to `true`

### EnableDownload (TwoOptions)

If `enableDownload` set to true, then it will enable the download for the PdfViewer code component.

Defaults to `true`

### EnablePrint (TwoOptions)

If `enablePrint` set to true, then it will enable the print for the PdfViewer code component.

Defaults to `true`

### EnableTextSearch (TwoOptions)

If `enableTextSearch` set to true, then it will enable the text search for the PdfViewer code component.

Defaults to `true`

### EnableTextSelection (TwoOptions)

If `enableTextSelection` set to true, then it will enable the text selection for the PdfViewer code component.

Defaults to `true`

### EnableMagnification (TwoOptions)

If `enableMagnification` set to true, then it will enable the magnification for the PdfViewer code component.

Defaults to `true`

### EnableNavigation (TwoOptions)

If `enableNavigation` set to true, then it will enable the navigation for the PdfViewer code component.

Defaults to `true`

### OpenThumbnailPane (TwoOptions)

If `OpenThumbnailPane` set to true, then it will open the thumbnail pane of the PdfViewer code component.

Defaults to `false`

### InteractionMode (Enum)

Defines the interaction mode for the PdfViewer code component. Possible values are `pan`, `text selection`.

Defaults to `pan`

### EventName (SingleLine.Text)

Defines the event name for the PdfViewer code component. It specifies the `event` of the PdfViewer. Possible values are `onError`.

### OnError (SingleLine.Text)

Outputs error message when onError is triggered. Use below PowerFx code in onChange property to notify the error message.

```js
If(
    Self.EventName="onError",
    Notify(Self.OnError, NotificationType.Error)
)
```
