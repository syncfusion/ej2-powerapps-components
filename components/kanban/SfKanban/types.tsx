import { CardSettingsModel, SortSettingsModel, StackedHeadersModel, SwimlaneSettingsModel } from "@syncfusion/ej2-react-kanban";
import { Columns } from "@syncfusion/ej2-kanban/src/kanban/models/columns";

/**
* Specifies Kanban property interface.  
*/
export interface ISfKanban {
   dataSource: Record[];
   kanbanConfig: IKanbanConfig;
   width: string | number;
   height: string | number;
   keyField: string | undefined;
   cardHeight: string | undefined;
   cssClass: string | undefined;
   enableRtl: boolean;
   enableTooltip: boolean;
   isTestHarness: boolean;
   renderNoDataSource: () => void;
   handleEventAction: (eventArgs: any, customErrorMessage?: string) => void;
}

export type DataSet = ComponentFramework.PropertyTypes.DataSet;

/**
* Specifies the record interface.
*/
export interface Record {
   [key: string]: NonNullable<unknown>;
}

export interface IUserSettings extends ComponentFramework.UserSettings {
   locale: string;
}

/**
* Represents the return type of the fetchDataSource function.
*/
export interface fetchDataSourceReturn {
   dataSourceObj: Record[];
   generatedColumnsObj: Record[];
}

/**
* Represents the configuration options for the Kanban component.
*/
export interface IKanbanConfig {
   cardSettings?: Omit<CardSettingsModel, "template">;
   sortSettings?: SortSettingsModel;
   stackedHeaders?: StackedHeadersModel[];
   swimlaneSettings?: Omit<SwimlaneSettingsModel, "sortComparer" | "template">;
   columns?: Omit<
      Columns,
      | "showAddButton"
      | "template"
   >[];
}