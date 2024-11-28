import {
  EventSettingsModel,
  GroupModel,
  HeaderRowsModel,
  ResourcesModel,
  TimeScaleModel,
  View,
  ViewsModel,
  WorkHoursModel
} from "@syncfusion/ej2-react-schedule";

/**
 * Represents the configuration options for the Syncfusion Schedule component.
 */
export interface ISfSchedule {
  dataSource: Record[] | undefined;
  width: string;
  height: string;
  enableRtl: boolean;
  enableAdaptiveUI: boolean;
  scheduleConfig: IScheduleConfig | undefined;
  currentView: View;
  selectedDate: Date;
  timeZone: string | undefined;
  minDate: Date | undefined;
  maxDate: Date | undefined;
  timeFormat: string | undefined;
  dateFormat: string | undefined;
  startHour: string | undefined;
  endHour: string | undefined;
  firstDayOfWeek: number;
  showQuickInfo: boolean;
  showHeaderBar: boolean;
  showWeekend: boolean;
  showWeekNumber: boolean;
  showTimeIndicator: boolean;
  rowAutoHeight: boolean;
  isTestHarness: boolean;
  handleEventAction: (event: any) => void;
}

/**
 * Represents the configuration options for the schedule component.
 */
export interface IScheduleConfig {
  workHours: WorkHoursModel;
  workDays: number[];
  timeScale: TimeScaleModel;
  views: View[] | ViewsModel[];
  group: GroupModel;
  headerRows: HeaderRowsModel[];
  resources: ResourcesModel[];
  eventSettings: EventSettingsModel;
}

/**
 * Specifies the record interface.
 */
export interface Record {
  [key: string]: any;
}

/**
 * Represents a data set in the component framework.
 */
export type DataSet = ComponentFramework.PropertyTypes.DataSet;

/**
 * Represents the user settings for the schedule component.
 */
export interface IUserSettings extends ComponentFramework.UserSettings {
  locale: string;
}
