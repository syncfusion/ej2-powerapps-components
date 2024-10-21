import { ChartSeriesType, PagerSettingsModel, GroupingBarSettingsModel, IDataOptions, PageSettingsModel, View } from "@syncfusion/ej2-react-pivotview";
import { ChartSettings } from "@syncfusion/ej2-pivotview/src/pivotview/model/chartsettings";

/**
 * Specifies PivotView property interface.  
 */
export interface ISfPivotView {
  dataSource: ComponentFramework.PropertyTypes.DataSet;
  pivotViewConfig: string | undefined;
  width: string | number;
  height: string | number;
  chartType: ChartSeriesType;
  displayOptions: View | undefined;
  showFieldList: boolean;
  allowCalculatedField: boolean;
  allowDeferLayoutUpdate: boolean;
  enableFieldSearching: boolean;
  showValuesButton: boolean;
  allowDrillThrough: boolean;
  enableValueSorting: boolean;
  allowGrouping: boolean;
  enablePaging: boolean;
  enableRtl: boolean;
  showGroupingBar: boolean;
  showToolbar: boolean;
  showTooltip: boolean;
  isTestHarness: boolean;
  handleEventAction: (eventArgs: any, customErrorMessage?: string) => void;
}

/**
 * Represents the configuration options for the PivotView component.
 */
export interface IPivotViewConfig {
  chartSettings: ChartSettings;
  dataSourceSettings: IDataOptions;
  pageSettings: PageSettingsModel;
  pagerSettings: PagerSettingsModel;
  groupingBarSettings: GroupingBarSettingsModel;
}

/**
 * Specifies the record interface.
 */
export interface Record {
  [key: string]: any;
}

export interface IUserSettings extends ComponentFramework.UserSettings {
  locale: string;
}