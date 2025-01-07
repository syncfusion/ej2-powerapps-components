import {
  EnterKey,
  FontFamilyModel,
  FontSizeModel,
  FormatModel,
  IFrameSettingsModel,
  InlineModeModel,
  AudioSettingsModel,
  ImageSettingsModel,
  VideoSettingsModel,
  PasteCleanupSettingsModel,
  ToolbarSettingsModel,
  QuickToolbarSettingsModel,
  NumberFormatListModel,
  BulletFormatListModel,
  TableSettingsModel
} from "@syncfusion/ej2-react-richtexteditor";

/**
 * Specifies RichTextEditor property interface.
 */
export interface ISfRichTextEditor {
  width: string | number;
  height: string | number;
  value: string | undefined;
  rteConfig: RichTextEditorConfig;
  cssClass: string | undefined;
  maxLength: number | undefined;
  placeholder: string;
  enterKey: EnterKey;
  enableResize: boolean;
  enableRtl: boolean;
  enableXhtml: boolean;
  enabled: boolean;
  showCharCount: boolean;
  handleEventAction: (eventArgs: object, customErrorMessage?: string) => void;
}

export type DataSet = ComponentFramework.PropertyTypes.DataSet;

export interface IUserSettings extends ComponentFramework.UserSettings {
  locale: string;
}

/**
 * Represents the configuration options for the Rich Text Editor.
 */
export interface RichTextEditorConfig {
  fontFamily: FontFamilyModelSS;
  fontSize: FontSizeModelSS;
  format: FormatModelSS;
  iframeSettings: IFrameSettingsModelSS;
  inlineMode: InlineModeModel;
  insertAudioSettings: AudioSettingsModelSS;
  insertImageSettings: ImageSettingsModelSS;
  insertVideoSettings: VideoSettingsModelSS;
  pasteCleanupSettings: PasteCleanupSettingsModel;
  toolbarSettings: ToolbarSettingsModelSS;
  quickToolbarSettings: QuickToolbarSettingsModelSS;
  numberFormatList: NumberFormatListModel;
  bulletFormatList: BulletFormatListModel;
  tableSettings: TableSettingsModelSS;
}

// Syncfusion RichTextEditor models with selected properties
interface FontFamilyModelSS extends Pick<FontFamilyModel, 'default' | 'items'> { }
interface FontSizeModelSS extends Pick<FontSizeModel, 'default' | 'items'> { }
interface FormatModelSS extends Pick<FormatModel, 'default' | 'types'> { }
interface IFrameSettingsModelSS extends Pick<IFrameSettingsModel, 'enable'> { }
interface AudioSettingsModelSS extends Pick<AudioSettingsModel, 'saveFormat' | 'saveUrl' | 'path' | 'removeUrl'> { }
interface ImageSettingsModelSS extends Pick<ImageSettingsModel, 'saveFormat' | 'saveUrl' | 'path' | 'resize' | 'removeUrl'> { }
interface VideoSettingsModelSS extends Pick<VideoSettingsModel, 'saveFormat' | 'saveUrl' | 'path' | 'resize' | 'removeUrl'> { }
interface ToolbarSettingsModelSS extends Pick<ToolbarSettingsModel, 'enable' | 'enableFloating' | 'type' | 'items'> { }
interface QuickToolbarSettingsModelSS extends Pick<QuickToolbarSettingsModel, 'enable' | 'link' | 'image' | 'audio' | 'video' | 'text' | 'table'> { }
interface TableSettingsModelSS extends Pick<TableSettingsModel, 'width' | 'resize' | 'minWidth' | 'maxWidth'> { }
