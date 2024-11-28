import { SelectionMode } from "@syncfusion/ej2-react-spreadsheet";

/**
* Specifies Spreadsheet property interface.  
*/
export interface ISfSpreadsheet {
   dataSource: Record[];
   documentPath: string;
   width: string | number;
   height: string | number;
   allowFiltering: boolean;
   allowFreezePane: boolean;
   allowOpen: boolean;
   allowPrint: boolean;
   allowResizing: boolean;
   allowSave: boolean;
   allowSorting: boolean;
   allowWrap: boolean;
   enableRtl: boolean;
   showAggregate: boolean;
   showFormulaBar: boolean;
   showRibbon: boolean;
   showSheetTabs: boolean;
   selectionMode: SelectionMode;
   isTestHarness: boolean;
   handleEventAction: (eventArgs: any, customErrorMessage?: string) => void;
}

export type DataSet = ComponentFramework.PropertyTypes.DataSet;

/**
* Specifies the record interface.
*/
export interface Record {
   [key: string]: any;
}

export interface IUserSettings extends ComponentFramework.UserSettings {
   locale: string;
}

/**
* Represents the return type of the fetchDataSource function.
*/
export interface fetchDataSourceReturn {
   dataSourceObj: Record[];
}

