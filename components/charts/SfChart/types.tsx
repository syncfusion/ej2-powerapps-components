import { ChartSeriesType, ValueType, SeriesModel } from '@syncfusion/ej2-charts';

/**
 * Specifies Chart property interface.
 */
export interface ISfChart {
  dataSource: Record[] | undefined;
  width: string;
  height: string;
  enableDarkMode: boolean;
  rtl: boolean;
  series: SeriesModel[];
  seriesType: ChartSeriesType;
  title: string;
  primaryXAxisType: ValueType;
  enableCrosshair: boolean;
  enableCrosshairTooltip: boolean;
  enableTooltip: boolean;
  enableLegendVisibility: boolean;
  enableMouseWheelZooming: boolean;
  enablePinchZooming: boolean;
  enableSelectionZooming: boolean;
  isTestHarness: boolean;
  handleEventAction: (eventArgs: any, customErrorMessage?: string) => void;
}

/**
 * Specifies the record interface.
 */
export interface Record {
  [key: string]: any;
}

/**
 * Represents the user settings for the chart component.
 */
export interface IUserSettings extends ComponentFramework.UserSettings {
  locale: string;
}
