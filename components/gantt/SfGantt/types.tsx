import { ColumnModel, DayWorkingTimeModel, EventMarkerModel, FilterSettingsModel, GridLine, HolidayModel, ResourceFieldsModel, SearchSettingsModel, SelectionSettingsModel, SortSettingsModel, SplitterSettingsModel, TaskFieldsModel, TimelineSettingsModel, ViewType } from "@syncfusion/ej2-react-gantt";

/**
* Specifies Gantt property interface.  
*/
export interface ISfGantt {
   dataSource: Record[] | undefined;
   ganttConfig: IGanttConfig | undefined;
   width: string | number;
   height: string | number;
   allowFiltering: boolean;
   allowReordering: boolean;
   allowResizing: boolean;
   allowSelection: boolean;
   allowSorting: boolean;
   enableCriticalPath: boolean;
   enableRtl: boolean;
   enableAdaptiveUI: boolean;
   showColumnMenu: boolean;
   showToolbar: boolean;
   gridLines: GridLine;
   timeZone: string | undefined;
   treeColumnIndex: number;
   viewType: ViewType;
   isTestHarness: boolean;
   renderNoDataSource: () => void;
   renderNoConfigData: () => void;
   handleEventAction: (eventArgs: any, customErrorMessage?: string) => void;
}

/**
* Represents the configuration options for the Gantt component.
*/
export interface IGanttConfig {
   columns: ColumnModel[];
   dayWorkingTime: DayWorkingTimeModel[];
   eventMarkers: EventMarkerModel[];
   filterSettings: FilterSettingsModel;
   holidays: HolidayModel[];
   resourceFields: ResourceFieldsModel;
   resources: Object[];
   searchSettings: SearchSettingsModel;
   selectionSettings: SelectionSettingsModel;
   sortSettings: SortSettingsModel;
   splitterSettings: SplitterSettingsModel;
   taskFields: TaskFieldsModel;
   timelineSettings: TimelineSettingsModel;
}

/**
* Specifies the record interface.
*/
export interface Record {
   [key: string]: NonNullable<unknown>;
}

export interface IUserSettings extends ComponentFramework.UserSettings {
   locale: string;
}