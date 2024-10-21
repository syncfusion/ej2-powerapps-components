import { InteractionMode } from '@syncfusion/ej2-pdfviewer';

/**
 * Specifies PdfViewer property interface.
 */
export interface ISfPdfViewer {
  documentPath: string;
  enableToolbar: boolean;
  enableNavigationToolbar: boolean;
  enableBookmark: boolean;
  enableDownload: boolean;
  enablePrint: boolean;
  enableTextSearch: boolean;
  enableTextSelection: boolean;
  enableMagnification: boolean;
  enableNavigation: boolean;
  openThumbnailPane: boolean;
  interactionMode: InteractionMode;
  width: number | string;
  height: number | string;
}

export interface IUserSettings extends ComponentFramework.UserSettings {
  locale: string;
}
