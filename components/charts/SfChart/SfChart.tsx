import {
  AreaSeries,
  BarSeries,
  Category,
  ChartComponent,
  ColumnSeries,
  Crosshair,
  DataLabel,
  DateTime,
  DateTimeCategory,
  HiloOpenCloseSeries,
  HiloSeries,
  HistogramSeries,
  Inject,
  Legend,
  LineSeries,
  Logarithmic,
  ParetoSeries,
  PieSeries,
  PolarSeries,
  RadarSeries,
  RangeAreaSeries,
  RangeColumnSeries,
  RangeStepAreaSeries,
  ScatterSeries,
  SeriesCollectionDirective,
  SeriesDirective,
  SplineAreaSeries,
  SplineRangeAreaSeries,
  SplineSeries,
  StackingAreaSeries,
  StackingBarSeries,
  StackingColumnSeries,
  StackingLineSeries,
  StackingStepAreaSeries,
  StepAreaSeries,
  StepLineSeries,
  Tooltip,
  WaterfallSeries,
  Zoom
} from "@syncfusion/ej2-react-charts";
import * as React from "react";
import { ISfChart } from "./types";

/**
 * SfChartComponent is a configurable Chart component that displays data.
 *
 * @param {ISfChart} props - The props for the Chart component.
 * @returns {JSX.Element} - The rendered Chart component.
 */
export const SfChartComponent: React.FC<ISfChart> = React.memo((props: ISfChart) => {

  const chartRef = React.useRef<ChartComponent>(null);

  /**
   * Renders the series directives based on the provided series data.
   * @returns An array of series directives.
  */
  const renderSeriesDirective = React.useMemo(() => {
    try {
      const seriesDirective: any[] = [];
      if (!props.series || Object.keys(props.series).length === 0) return;
      for (let i = 0; i < props.series.length; i++) {
        if (props.series[i]["name"] === undefined) continue;
  
        props.series[i]["dataSource"] = props.dataSource;
        if (!props.series[i]["type"]) {
          props.series[i]["type"] = props.seriesType;
        }
        seriesDirective.push(<SeriesDirective key={i} {...props.series[i]} />);
      }
      return seriesDirective;
    } catch (e: any) {
      props.handleEventAction({ name: "onError", error: e }, "renderSeriesDirective");
    }
  }, [props.seriesType, props.series, props.dataSource]);
  
  // Update the chart theme when the chart theme property changes.
  React.useEffect(() => {
    if (chartRef.current) chartRef.current.refresh();
  }, [props.enableTooltip, props.enableCrosshairTooltip, props.series, props.seriesType, props.enableCrosshair]);

  return (
    <ChartComponent
      ref={chartRef}
      theme="Fluent2"
      width={props.width}
      height={props.height}
      enableRtl={props.rtl}
      title={props.title}
      tooltip={{ enable: props.enableTooltip }}
      crosshair={{ enable: props.enableCrosshair }}
      primaryXAxis={{
        valueType: props.primaryXAxisType,
        crosshairTooltip: { enable: props.enableCrosshairTooltip }
      }}
      primaryYAxis={{
        crosshairTooltip: { enable: props.enableCrosshairTooltip }
      }}
      legendSettings={{
        visible: props.enableLegendVisibility
      }}
      zoomSettings={{
        enableMouseWheelZooming: props.enableMouseWheelZooming,
        enablePinchZooming: props.enablePinchZooming,
        enableSelectionZooming: props.enableSelectionZooming
      }}
    >
      <Inject
        services={[
          LineSeries,
          ColumnSeries,
          AreaSeries,
          PieSeries,
          PolarSeries,
          RadarSeries,
          BarSeries,
          HistogramSeries,
          StackingColumnSeries,
          StackingAreaSeries,
          StackingLineSeries,
          StackingBarSeries,
          StepLineSeries,
          StepAreaSeries,
          ScatterSeries,
          SplineSeries,
          RangeColumnSeries,
          HiloSeries,
          HiloOpenCloseSeries,
          WaterfallSeries,
          RangeAreaSeries,
          RangeStepAreaSeries,
          SplineRangeAreaSeries,
          StackingStepAreaSeries,
          SplineAreaSeries,
          ParetoSeries,
          Legend,
          Crosshair,
          Tooltip,
          DataLabel,
          Category,
          DateTime,
          Logarithmic,
          DateTimeCategory,
          Zoom
        ]}
      />
      <SeriesCollectionDirective>
        {renderSeriesDirective}
      </SeriesCollectionDirective>
    </ChartComponent>
  );
}
);

SfChartComponent.displayName = "SfChartComponent";
