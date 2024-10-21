import { GridLine, ColumnModel, EditMode } from "@syncfusion/ej2-react-grids";

/**
 * Specifies Grid property interface.
 */
export interface ISfGrid {
  dataSource: ComponentFramework.PropertyTypes.DataSet;
  columns: ComponentFramework.PropertyTypes.DataSet;
  width: string | number;
  height: string | number;
  primaryKey: string;
  rtl: boolean;
  allowEditing: boolean;
  editMode: EditMode;
  allowPaging: boolean;
  pageSize: number;
  pageCount: number;
  allowSorting: boolean;
  allowMultiSorting: boolean;
  allowGrouping: boolean;
  showGroupedColumn: boolean;
  allowFiltering: boolean;
  gridLines: GridLine;
  allowTextWrap: boolean;
  allowResizing: boolean;
  isTestHarness: boolean;
  renderNoDataSource: () => void;
  handleEventAction: (eventArgs: any, customErrorMessage?: string) => void;
}

export interface Record {
  [key: string]: any;
}

export type DataSet = ComponentFramework.PropertyTypes.DataSet;

export type IFetchedDataSetObject = {
  fetchedData: Record[];
  fetchedColumns: ColumnModel[];
  generatedColumnData: ColumnModel[];
}

export interface IEntityRecord extends ComponentFramework.PropertyHelper.DataSetApi.EntityRecord {
  setValue: (key: string, value: any) => void;
  save: () => Promise<void>;
}

export interface IUserSettings extends ComponentFramework.UserSettings {
  locale: string;
}

/**
 * Defines a mapping of Dataverse types to Syncfusion Grid column models.
 * Each Dataverse type is mapped to its corresponding column model properties.
 */
export const dataverseTypeMapping: { [key: string]: ColumnModel } = {
  "FP": {
    editType: "numericEdit",
    format: "N",
    type: "number"
  },
  "Decimal": {
    editType: "numericEdit",
    format: "N",
    type: "number"
  },
  "Currency": {
    editType: "numericEdit",
    format: "C",
    type: "number"
  },
  "Whole.None": {
    editType: "numericEdit",
    format: "N",
    type: "number"
  },
  "TwoOptions": {
    editType: "booleanEdit",
    format: "",
    type: "boolean"
  },
  "DateAndTime.DateOnly": {
    editType: "datePickerEdit",
    format: { type: "date", format: "M/d/yyyy" },
    type: "date"
  },
  "DateAndTime.DateAndTime": {
    editType: "dateTimePickerEdit",
    format: { type: "dateTime", format: "M/d/yyyy h:mm a" },
    type: "datetime"
  }
};
