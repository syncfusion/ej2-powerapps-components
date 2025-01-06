import {
  AggregateRowModel,
  ClipMode,
  Column,
  ColumnMenuItem,
  ColumnModel,
  FilterSettingsModel,
  GridLine,
  LoadingIndicatorModel,
  PageSettingsModel,
  PrintMode,
  SearchSettingsModel,
  SelectionSettingsModel,
  SortSettingsModel,
  TextWrapSettingsModel
} from "@syncfusion/ej2-grids";
import { CopyHierarchyType, ToolbarItems } from "@syncfusion/ej2-react-treegrid";

/**
 * Specifies Grid property interface.
 */
export interface ISfTreeGrid {
  width: string;
  height: string;
  enableRtl: boolean;
  dataSource: Record[];
  treeGridConfig: ITreeGridConfig;
  idMapping: string;
  parentIdMapping: string;
  frozenColumns: number | undefined;
  frozenRows: number | undefined;
  rowHeight: number | undefined;
  treeColumnIndex: number | undefined;
  clipMode: ClipMode;
  copyHierarchyMode: CopyHierarchyType;
  gridLines: GridLine;
  printMode: PrintMode;
  allowExcelExport: boolean;
  allowPdfExport: boolean;
  allowFiltering: boolean;
  allowSorting: boolean;
  allowMultiSorting: boolean;
  allowPaging: boolean;
  allowReordering: boolean;
  allowResizing: boolean;
  allowSelection: boolean;
  allowTextWrap: boolean;
  autoCheckHierarchy: boolean;
  enableAdaptiveUI: boolean;
  enableAltRow: boolean;
  enableAutoFill: boolean;
  enableCollapseAll: boolean;
  enableHover: boolean;
  showColumnChooser: boolean;
  showColumnMenu: boolean;
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
 * Represents the return type of the fetchDataSource function.
 */
export interface fetchDataSourceReturn {
  dataSourceObj: Record[];
  generatedColumnsObj: Record[];
}

/**
 * Represents the configuration options for the TreeGrid component.
 */
export interface ITreeGridConfig {
  aggregates?: AggregateRowModel[];
  columnMenuItems?: Exclude<ColumnMenuItem, "Group" | "Ungroup">[];
  filterSettings?: Omit<FilterSettingsModel, "operators">;
  loadingIndicator?: LoadingIndicatorModel;
  pageSettings?: Omit<PageSettingsModel, "totalRecordsCount" | "enableQueryString" | "template">;
  searchSettings?: SearchSettingsModel;
  selectionSettings?: SelectionSettingsModel;
  sortSettings?: SortSettingsModel;
  textWrapSettings?: TextWrapSettingsModel;
  toolbar?: Exclude<ToolbarItems, "Add" | "Edit" | "Update" | "Delete" | "Cancel">[];
  columns?: Omit<
    Column,
    | "uid"
    | "allowEditing"
    | "sortComparer"
    | "isPrimaryKey"
    | "commandsTemplate"
    | "commands"
    | "editType"
    | "validationRules"
    | "defaultValue"
    | "edit"
    | "editTemplate"
    | "filterTemplate"
    | "filterBarTemplate"
    | "isIdentity"
    | "template"
    | "headerTemplate"
    | "customAttributes"
    | "formatter"
    | "valueAccessor"
    | "hideAtMedia"
  >[];
}

/**
 * Defines a mapping of Dataverse types to Syncfusion TreeGrid column models.
 * Each Dataverse type is mapped to its corresponding column model properties.
 */
export const dataverseTypeMapping: { [key: string]: ColumnModel } = {
  "FP": {
    format: "N",
    type: "number"
  },
  "Decimal": {
    format: "N",
    type: "number"
  },
  "Currency": {
    format: "C",
    type: "number"
  },
  "Whole.None": {
    format: "N",
    type: "number"
  },
  "TwoOptions": {
    format: "",
    type: "boolean"
  },
  "DateAndTime.DateOnly": {
    format: { type: "date", format: "M/d/yyyy" },
    type: "date"
  },
  "DateAndTime.DateAndTime": {
    format: { type: "dateTime", format: "M/d/yyyy h:mm a" },
    type: "datetime"
  }
};
