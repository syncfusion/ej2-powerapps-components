import {
  RichTextEditorComponent,
  HtmlEditor,
  Toolbar,
  Image,
  Link,
  QuickToolbar,
  Table,
  FormatPainter,
  Video,
  Audio,
  PasteCleanup,
  Inject,
  MarkdownEditor,
  Count,
  Resize,
  EmojiPicker
} from "@syncfusion/ej2-react-richtexteditor";
import { BeforeOpenEventArgs } from "@syncfusion/ej2-popups"
import * as React from "react";
import { ISfRichTextEditor } from "./types";
import "./styles/theme.css";

/**
 * SfRichTextEditorComponent is a configurable RichTextEditor that displays formatted data.
 *
 * @param {SfRichTextEditor} props - The props for the RichTextEditor component.
 * @returns {JSX.Element} - The rendered RichTextEditor component.
 */
export const SfRichTextEditorComponent: React.FC<ISfRichTextEditor> = React.memo((props: ISfRichTextEditor) => {

  const richtexteditorRef = React.useRef<RichTextEditorComponent>(null);

  React.useEffect(() => {
    if (props.value !== richtexteditorRef.current?.value) {
      richtexteditorRef.current?.refreshUI();
    }
  });

  React.useEffect(() => {
    if (richtexteditorRef.current) richtexteditorRef.current?.refresh();
  }, [props.enableResize]);

  const beforeDialogOpen = (args: BeforeOpenEventArgs) => {
    if (args.target && typeof args.target !== 'string') {
      args.target.style.overflow = 'auto';
    }
  };

  return (
    <RichTextEditorComponent
      ref={richtexteditorRef}
      width={props.width}
      height={props.height}
      value={props.value}
      autoSaveOnIdle={true}
      saveInterval={0}
      change={(args: any) => { props.handleEventAction(args); }}
      cssClass={props.cssClass}
      maxLength={props.maxLength}
      placeholder={props.placeholder}
      enterKey={props.enterKey}
      enableResize={props.enableResize}
      enableRtl={props.enableRtl}
      enableXhtml={props.enableXhtml}
      enabled={props.enabled}
      showCharCount={props.showCharCount}
      fontFamily={props.rteConfig?.fontFamily && {
        default: props.rteConfig?.fontFamily?.default,
        items: props.rteConfig?.fontFamily?.items || [{ text: "Segoe UI", value: "Segoe UI" }, { text: "Arial", value: "Arial,Helvetica,sans-serif" }, { text: "Courier New", value: "Courier New,Courier,monospace" }, { text: "Georgia", value: "Georgia,serif" }, { text: "Impact", value: "Impact,Charcoal,sans-serif" }, { text: "Lucida Console", value: "Lucida Console,Monaco,monospace" }, { text: "Tahoma", value: "Tahoma,Geneva,sans-serif" }, { text: "Times New Roman", value: "Times New Roman,Times,serif" }, { text: "Trebuchet MS", value: "Trebuchet MS,Helvetica,sans-serif" }, { text: "Verdana", value: "Verdana,Geneva,sans-serif" }]
      }}
      fontSize={props.rteConfig?.fontSize && {
        default: props.rteConfig?.fontSize?.default,
        items: props.rteConfig?.fontSize?.items || [{ text: "8", value: "8pt" }, { text: "10", value: "10pt" }, { text: "12", value: "12pt" }, { text: "14", value: "14pt" }, { text: "18", value: "18pt" }, { text: "24", value: "24pt" }, { text: "36", value: "36pt" }]
      }}
      format={props.rteConfig?.format && {
        default: props.rteConfig?.format?.default,
        types: props.rteConfig?.format?.types || [ { text: 'Paragraph', value: 'P' }, { text: 'Heading 1', value: 'H1' }, { text: 'Heading 2', value: 'H2' }, { text: 'Heading 3', value: 'H3' }, { text: 'Heading 4', value: 'H4' }, { text: 'Heading 5', value: 'H5' }, { text: 'Heading 6', value: 'H6' }, { text: 'Preformatted', value: 'Pre' } ]
      }}
      iframeSettings={props.rteConfig?.iframeSettings && {
        enable: props.rteConfig?.iframeSettings.enable
      }}
      inlineMode={props.rteConfig?.inlineMode}
      insertAudioSettings={props.rteConfig?.insertAudioSettings && {
        saveFormat: props.rteConfig?.insertAudioSettings?.saveFormat ?? "Blob",
        saveUrl: props.rteConfig?.insertAudioSettings?.saveUrl,
        path: props.rteConfig?.insertAudioSettings?.path,
        removeUrl: props.rteConfig?.insertAudioSettings?.removeUrl,
      }}
      insertImageSettings={props.rteConfig?.insertImageSettings && {
        saveFormat: props.rteConfig?.insertImageSettings?.saveFormat ?? "Blob",
        saveUrl: props.rteConfig?.insertImageSettings?.saveUrl,
        path: props.rteConfig?.insertImageSettings?.path,
        resize: props.rteConfig?.insertImageSettings?.resize ?? true,
        removeUrl: props.rteConfig?.insertImageSettings?.removeUrl,
      }}
      insertVideoSettings={props.rteConfig?.insertVideoSettings && {
        saveFormat: props.rteConfig?.insertVideoSettings?.saveFormat ?? "Blob",
        saveUrl: props.rteConfig?.insertVideoSettings?.saveUrl,
        path: props.rteConfig?.insertVideoSettings?.path,
        resize: props.rteConfig?.insertVideoSettings?.resize ?? true,
        removeUrl: props.rteConfig?.insertVideoSettings?.removeUrl
      }}
      pasteCleanupSettings={props.rteConfig?.pasteCleanupSettings}
      toolbarSettings={props.rteConfig?.toolbarSettings && {
        enable: props.rteConfig?.toolbarSettings?.enable ?? true,
        enableFloating: props.rteConfig?.toolbarSettings?.enableFloating ?? false,
        type: props.rteConfig?.toolbarSettings?.type,
        items: props.rteConfig?.toolbarSettings?.items
      }}
      quickToolbarSettings={props.rteConfig?.quickToolbarSettings && {
        enable: props.rteConfig?.quickToolbarSettings?.enable ?? true,
        link: props.rteConfig?.quickToolbarSettings?.link,
        image: props.rteConfig?.quickToolbarSettings?.image,
        audio: props.rteConfig?.quickToolbarSettings?.audio,
        video: props.rteConfig?.quickToolbarSettings?.video,
        text: props.rteConfig?.quickToolbarSettings?.text,
        table: props.rteConfig?.quickToolbarSettings?.table
      }}
      numberFormatList={props.rteConfig?.numberFormatList && {
        types: props.rteConfig?.numberFormatList?.types
      }}
      bulletFormatList={props.rteConfig?.bulletFormatList && {
        types: props.rteConfig?.bulletFormatList?.types
      }}
      tableSettings={props.rteConfig?.tableSettings && {
        width: props.rteConfig?.tableSettings?.width ?? "100%",
        resize: props.rteConfig?.tableSettings?.resize ?? true,
        minWidth: props.rteConfig?.tableSettings?.minWidth ?? 0,
        maxWidth: props.rteConfig?.tableSettings?.maxWidth,
      }}
      beforeDialogOpen={beforeDialogOpen}
    >
      <Inject
        services={[
          HtmlEditor,
          MarkdownEditor,
          Toolbar,
          Image,
          Link,
          QuickToolbar,
          Table,
          Video,
          Audio,
          PasteCleanup,
          Count,
          FormatPainter,
          Resize,
          EmojiPicker
        ]}
      />
    </RichTextEditorComponent>
  );
});

SfRichTextEditorComponent.displayName = "SfRichTextEditorComponent";
