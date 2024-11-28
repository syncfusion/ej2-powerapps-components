import {
  SortOrder,
  ViewType,
  ContextMenuSettingsModel,
  DetailsViewSettingsModel,
  NavigationPaneSettingsModel,
  SearchSettingsModel,
  ToolbarSettingsModel,
  ToolbarItemModel
} from "@syncfusion/ej2-react-filemanager"

/**
 * Specifies FileManager property interface.
 */
export interface ISfFileManager {
  width: string;
  height: string;
  fileSystemData: Record[];
  enableRtl: boolean;
  fileManagerConfig: IFileManagerConfig;
  cssClass: string;
  path: string;
  rootAliasName: string;
  sortBy: string;
  sortOrder: SortOrder;
  view: ViewType;
  allowMultiSelection: boolean;
  enableVirtualization: boolean;
  showFileExtension: boolean;
  showItemCheckBoxes: boolean;
  showThumbnail: boolean;
  renderNoDataSource: () => void;
  handleEventAction: (eventArgs: any, customErrorMessage?: string) => void;
}

export type DataSet = ComponentFramework.PropertyTypes.DataSet;

export interface IUserSettings extends ComponentFramework.UserSettings {
  locale: string;
}

export interface Record {
  [key: string]: NonNullable<unknown>;
}

/**
 * Represents the configuration options for the FileManager component.
 */
export interface IFileManagerConfig {
  contextMenuSettings: ContextMenuSettingsModel;
  detailsViewSettings: DetailsViewSettingsModel;
  navigationPaneSettings: NavigationPaneSettingsModel;
  searchSettings: SearchSettingsModel;
  selectedItems: string[];
  toolbarItems: ToolbarItemModel[];
  toolbarSettings: ToolbarSettingsModel;
}