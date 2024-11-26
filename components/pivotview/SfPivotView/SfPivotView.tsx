import { isNullOrUndefined } from "@syncfusion/ej2-base";
import {
  PivotViewComponent,
  Grouping,
  GroupingBar,
  FieldList,
  CalculatedField,
  Inject,
  Toolbar,
  ToolbarItems,
  Pager,
  PivotChart
} from '@syncfusion/ej2-react-pivotview';
import * as React from "react";
import { ISfPivotView, IPivotViewConfig, Record } from './types';
import { ChartSettings } from "@syncfusion/ej2-pivotview/src/pivotview/model/chartsettings";
import { PivotZoomSettingsModel } from "@syncfusion/ej2-pivotview/src/pivotview/model/chartsettings-model";

/**
 * Represents the SfPivotViewComponent component.
 *
 * @param {ISfPivotView} props - The props for the PivotView component.
 * @returns {JSX.Element} - The rendered PivotView component.
 */
export const SfPivotViewComponent: React.FC<ISfPivotView> = React.memo((props: ISfPivotView) => {
  const pivotViewRef = React.useRef<PivotViewComponent>(null);
  const [pivotViewData, setPivotViewData] = React.useState<Record[]>([]);
  const [configJSON, setConfigJSON] = React.useState<IPivotViewConfig>();
  const toolbarOption: ToolbarItems[] = ['Grid', 'Chart', 'SubTotal', 'GrandTotal', 'FieldList'];

  React.useEffect(() => {
    if (!props.dataSource || props.dataSource.loading) return;

    const { columns, paging, sortedRecordIds, records } = props.dataSource;
    let isModelDriven: boolean = false, pivotViewConfigJSON;
    if (!columns || !sortedRecordIds || !records) return;

    // Map the dataset records to the pivotView data
    const returnData = sortedRecordIds.map((id) => {
      const record: Record = {};
      columns.forEach((column: Record) => {
        if (isNullOrUndefined(column.displayName) || column.dataType.includes("multiselectpicklist")) return;

        isModelDriven = !isNullOrUndefined(column["isPrimary"]) && !props.isTestHarness;
        if (isModelDriven && column.dataType === "TwoOptions") {
          record[column.displayName] = Boolean(
            parseInt(records[id].getValue(column.alias) as string)
          );
          return;
        } else if (column.dataType.includes("DateAndTime")) {
          record[column.displayName] = new Date(records[id].getValue(column.alias) as string);
        } else {
          record[column.displayName] = records[id].getValue(column.alias);
        }
      });
      return Object.keys(record).length > 0 ? record : {};
    });

    try {
      if (props.pivotViewConfig) {
        let parsedJSONConfig = JSON.parse(props.pivotViewConfig);
        for (const key of Object.keys(defaultPivotViewConfig) as (keyof IPivotViewConfig)[]) {
          if (!parsedJSONConfig[key]) {
            parsedJSONConfig[key] = defaultPivotViewConfig[key];
          }
        }
        pivotViewConfigJSON = parsedJSONConfig;
      } else
        pivotViewConfigJSON = defaultPivotViewConfig;
    } catch (error: any) {
      props.handleEventAction({ name: "onError", error: error });
    }

    setConfigJSON(pivotViewConfigJSON);
    setPivotViewData(returnData);

    if (paging.hasNextPage && paging.pageSize !== paging.totalResultCount) {
      // Load all records for PowerPages application at once
      if (!isNullOrUndefined((columns[0] as Record)?.["attributes"]?.["SourceType"]))
        paging.setPageSize(paging.totalResultCount);
      paging.loadNextPage();
    }
  }, [props.dataSource, props.pivotViewConfig, props.width, props.height]);

  // show fieldslist popup over specified target 
  const trend = (): void => {
    if (pivotViewRef.current) {
      const pivotFieldListModule = pivotViewRef.current.pivotFieldListModule;
      const dialogRenderer = pivotFieldListModule?.dialogRenderer;
      if (dialogRenderer) {
        dialogRenderer.fieldListDialog.target = document.body;
      }
    }
  }

  React.useEffect(() => {
    if (pivotViewRef.current) pivotViewRef.current.refresh();
  }, [props.width, props.height])

  return (
    <div style={{ overflow: 'auto' }}>
      <PivotViewComponent
        ref={pivotViewRef}
        width={props.width}
        height={props.height}
        dataSourceSettings={{
          dataSource: pivotViewData,
          columns: configJSON?.dataSourceSettings?.columns,
          values: configJSON?.dataSourceSettings?.values,
          rows: configJSON?.dataSourceSettings?.rows,
          formatSettings: configJSON?.dataSourceSettings?.formatSettings
        }}
        showFieldList={props.showFieldList}
        allowCalculatedField={props.allowCalculatedField}
        allowDeferLayoutUpdate={props.allowDeferLayoutUpdate}
        allowDrillThrough={props.allowDrillThrough}
        allowGrouping={props.allowGrouping}
        enableFieldSearching={props.enableFieldSearching}
        enablePaging={props.enablePaging}
        enableRtl={props.enableRtl}
        enableValueSorting={props.enableValueSorting}
        showGroupingBar={props.showGroupingBar}
        showToolbar={props.showToolbar}
        showTooltip={props.showTooltip}
        showValuesButton={props.showValuesButton}
        dataBound={trend.bind(this)}
        chartSettings={{
          chartSeries: { type: props.chartType },
          primaryXAxis: { title: configJSON?.chartSettings?.primaryXAxis?.title },
          primaryYAxis: { title: configJSON?.chartSettings?.primaryYAxis?.title },
          zoomSettings: {
            enableSelectionZooming: false,
            toolbarItems: []
          } as PivotZoomSettingsModel
        } as ChartSettings}
        displayOption={{
          view: props.displayOptions
        }}
        toolbar={toolbarOption}
        pageSettings={props.enablePaging ? {
          columnPageSize: configJSON?.pageSettings.columnPageSize,
          currentColumnPage: configJSON?.pageSettings.currentColumnPage,
          currentRowPage: configJSON?.pageSettings.currentRowPage,
          rowPageSize: configJSON?.pageSettings.rowPageSize
        } : undefined}
        pagerSettings={props.enablePaging ? {
          enableCompactView: configJSON?.pagerSettings.enableCompactView,
          isInversed: configJSON?.pagerSettings.isInversed,
          position: configJSON?.pagerSettings.position,
          showColumnPageSize: configJSON?.pagerSettings.showColumnPageSize,
          showColumnPager: configJSON?.pagerSettings.showColumnPager,
          showRowPageSize: configJSON?.pagerSettings.showRowPageSize,
          showRowPager: configJSON?.pagerSettings.showRowPager
        } : undefined}
        groupingBarSettings={props.showGroupingBar ? {
          allowDragAndDrop: configJSON?.groupingBarSettings?.allowDragAndDrop,
          showFieldsPanel: configJSON?.groupingBarSettings?.showFieldsPanel,
          showFilterIcon: configJSON?.groupingBarSettings?.showFilterIcon,
          showRemoveIcon: configJSON?.groupingBarSettings?.showRemoveIcon,
          showSortIcon: configJSON?.groupingBarSettings?.showSortIcon,
          showValueTypeIcon: configJSON?.groupingBarSettings?.showValueTypeIcon
        } : undefined}
        gridSettings={{ columnWidth: 140 }}
      >
        <Inject
          services={[
            Grouping,
            GroupingBar,
            FieldList,
            CalculatedField,
            Toolbar,
            Pager,
            PivotChart
          ]}
        />
      </PivotViewComponent>
    </div>
  );
});

SfPivotViewComponent.displayName = "SfPivotViewComponent";

const defaultPivotViewConfig: IPivotViewConfig = {
  chartSettings: {} as ChartSettings,
  dataSourceSettings: {},
  pageSettings: {},
  pagerSettings: {},
  groupingBarSettings: {}
};