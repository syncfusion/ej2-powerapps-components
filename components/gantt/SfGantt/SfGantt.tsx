import {
  GanttComponent,
  Selection,
  Inject,
  Filter,
  Toolbar,
  Reorder,
  Resize,
  Sort,
  CriticalPath,
  ColumnMenu,
  DayMarkers
} from "@syncfusion/ej2-react-gantt";
import { closest } from "@syncfusion/ej2-base" 
import * as React from "react";
import { ISfGantt } from './types';
import "./styles/theme.css";

/**
 * Represents the SfGanttComponent component.
 *
 * @param {IGanttConfig} props - The props for the Gantt component.
 * @returns {JSX.Element} - The rendered Gantt component.
 */
export const SfGanttComponent: React.FC<ISfGantt> = React.memo((props: ISfGantt) => {
  const ganttRef = React.useRef<GanttComponent>(null);
  const toolbarOption = ['Search', 'ExpandAll', 'CollapseAll', 'PrevTimeSpan', 'NextTimeSpan', 'ZoomIn', 'ZoomOut', 'ZoomToFit'];
  let noDataSource: boolean = false;

  //check DataSource is added or not
  noDataSource = !props.dataSource || props.dataSource.length === 0 || props.dataSource.every(item => item.name === 'val' && item.telephone1 === 'val');

  React.useEffect(() => {
    if (ganttRef.current) ganttRef.current.refresh();
  }, [props.width, props.height, props.allowFiltering, props.allowSorting])

  const dataBound = () => {
    let ganttObj = (document.getElementsByClassName('e-gantt')[0] as any).ej2_instances[0];
    if (ganttObj) {
      let gridRef
      if (ganttObj) {
        gridRef = ganttObj.treeGrid.grid
      }
        
      if ((gridRef as any).resizeModule) {
        (gridRef as any).resizeModule.updateHelper = function () {
          const rect = closest(this.element, 'th.e-headercell');
          let left: number;
          left = Math.floor(this.calcPos(rect).left + (this.parent.enableRtl ? 0 - 1 : rect.getBoundingClientRect().width - 2));
          const borderWidth = 2;
          if (left > this.parentElementWidth) {
            left = this.parentElementWidth - borderWidth;
          }
          let scalerElement = this.parent.element.closest('.animated-canvas-scaler');
          if (scalerElement) {
            let scalerStyle = scalerElement.style.transform;
            const parts = scalerStyle.split(' ');
            const scaleValue = parseFloat(parts[2].replace('scale(', '').replace(')', ''));
            if (scalerStyle) {
              left = left / scaleValue;
            }
          }
          this.helper.style.left = left + 'px';
        };
        (gridRef as any).resizeModule.setHelperHeight = function () {
          let height = this.parent.getContent().offsetHeight - this.getScrollBarWidth();
          const rect: any = closest(this.element, 'th.e-headercell');
          const tr: HTMLElement[] = [].slice.call(this.parent.getHeaderContent().querySelectorAll('tr'));
          for (let i = tr.indexOf(rect.parentElement); i < tr.length && i > -1; i++) {
            height += tr[parseInt(i.toString(), 10)].offsetHeight;
          }
          const pos = this.calcPos(rect);
          pos.left += (this.parent.enableRtl ? 0 - 1 : rect.getBoundingClientRect().width - 2);
          let scalerElement = this.parent.element.closest('.animated-canvas-scaler');
          if (scalerElement) {
            let scalerStyle = scalerElement.style.transform;
            const parts = scalerStyle.split(' ');
            const scaleValue = parseFloat(parts[2].replace('scale(', '').replace(')', ''));
            if (scalerStyle) {
              pos.left = pos.left / scaleValue;
            }
          }
          this.helper.style.cssText = 'height: ' + height + 'px; top: ' + pos.top + 'px; left:' + Math.floor(pos.left) + 'px;';
          if (this.parent.enableVirtualization) {
            this.helper.classList.add('e-virtual-rhandler');
          }
        }
      }
    }
  };
  return (
    <>
      {!noDataSource && props.ganttConfig?.taskFields && Object.keys(props.ganttConfig?.taskFields).length > 0 && (
        <GanttComponent
          key={props.showToolbar ? "toolbar-visible" : "toolbar-hidden"}
          ref={ganttRef}
          dataBound={dataBound.bind(this)}
          width={props.width}
          height={props.height && props.height !== 'auto' ? props.height : '650px'}
          dataSource={props.dataSource}
          taskFields={{
            id: props.ganttConfig?.taskFields?.id,
            name: props.ganttConfig?.taskFields?.name,
            startDate: props.ganttConfig?.taskFields?.startDate,
            endDate: props.ganttConfig?.taskFields?.endDate,
            duration: props.ganttConfig?.taskFields?.duration,
            progress: props.ganttConfig?.taskFields.progress,
            dependency: props.ganttConfig?.taskFields?.dependency,
            parentID: props.ganttConfig?.taskFields?.parentID,
            resourceInfo: props.ganttConfig?.taskFields?.resourceInfo,
            indicators: props.ganttConfig?.taskFields?.indicators
          }}
          allowFiltering={props.allowFiltering}
          allowReordering={props.allowReordering}
          allowResizing={props.allowResizing}
          allowSelection={props.allowSelection}
          allowSorting={props.allowSorting}
          enableCriticalPath={props.enableCriticalPath}
          enableRtl={props.enableRtl}
          enableAdaptiveUI={props.enableAdaptiveUI}
          showColumnMenu={props.showColumnMenu}
          gridLines={props.gridLines}
          timezone={props.timeZone}
          treeColumnIndex={props.treeColumnIndex}
          viewType={props.viewType}
          columns={props.ganttConfig?.columns?.map(column => ({
            field: column.field,
            headerText: column.headerText,
            width: column.width,
            format: column.format
          }))}
          resources={props.ganttConfig?.resources}
          resourceFields={{
            id: props.ganttConfig?.resourceFields?.id,
            name: props.ganttConfig?.resourceFields?.name,
            unit: props.ganttConfig?.resourceFields?.unit,
            group: props.ganttConfig?.resourceFields?.group
          }}
          dayWorkingTime={props.ganttConfig?.dayWorkingTime}
          eventMarkers={props.ganttConfig?.eventMarkers?.map(event => ({
            day: event.day,
            label: event.label
          }))}
          filterSettings={props.allowFiltering ? {
            columns: props.ganttConfig?.filterSettings?.columns?.map(column => ({
              field: column.field,
              value: column.value,
              operator: column.operator,
              matchCase: column.matchCase,
              predicate: column.predicate
            }))
          } : undefined}
          holidays={props.ganttConfig?.holidays?.map(holiday => ({
            from: holiday.from,
            to: holiday.to,
            label: holiday.label
          }))}
          searchSettings={props.allowFiltering && !props.showToolbar && !props.showColumnMenu ? props.ganttConfig?.searchSettings : {
            fields: [],
            key: "",
          }}
          selectionSettings={{
            mode: props.ganttConfig?.selectionSettings.mode,
            type: props.ganttConfig?.selectionSettings.type,
            enableToggle: props.ganttConfig?.selectionSettings.enableToggle
          }}
          sortSettings={props.allowSorting ? props.ganttConfig?.sortSettings : undefined}
          splitterSettings={{
            position: props.ganttConfig?.splitterSettings.position,
            minimum: props.ganttConfig?.splitterSettings.minimum,
            separatorSize: props.ganttConfig?.splitterSettings.separatorSize,
            view: props.ganttConfig?.splitterSettings.view
          }}
          timelineSettings={props.ganttConfig?.timelineSettings}
          toolbar={props.showToolbar ? toolbarOption : []}
        >
          <Inject services={[Selection, Sort, Filter, Resize, Reorder, CriticalPath, ColumnMenu, DayMarkers, Toolbar]} />
        </GanttComponent>
      )}
      {noDataSource && props.renderNoDataSource()}
      {!noDataSource && (!props.ganttConfig?.taskFields || Object.keys(props.ganttConfig?.taskFields).length === 0) && props.renderNoConfigData()}
    </>
  );
});

SfGanttComponent.displayName = "SfGanttComponent";