import {
  Aggregate,
  ColumnChooser,
  ColumnMenu,
  ColumnModel,
  ExcelExport,
  Filter,
  Freeze,
  Inject,
  Page,
  PdfExport,
  Reorder,
  Resize,
  Selection,
  Sort,
  Toolbar,
  TreeGridComponent,
  TreeClipboard,
  DetailRow
} from "@syncfusion/ej2-react-treegrid";
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import * as React from "react";
import { ISfTreeGrid, ITreeGridConfig } from "./types";

/**
 * Renders SfTreeGrid component.
 *
 * @param {ISfTreeGrid} props - The props for the TreeGrid component.
 * @returns {JSX.Element} - The rendered TreeGrid component.
 */
export const SfTreeGridComponent: React.FC<ISfTreeGrid> = React.memo((props: ISfTreeGrid) => {

  const treegridRef = React.useRef<TreeGridComponent>(null);
  const [allowPaging, setAllowPaging] = React.useState(false);
  const [autoCheckHierarchy, setAutoCheckHierarchy] = React.useState(false);
  const [allowSelection, setAllowSelection] = React.useState(props.allowSelection);
  const [treeGridConfig, setTreeGridConfig] = React.useState<ITreeGridConfig | undefined>(undefined);

  // Effect to freeze refresh the Grid when specific props are updated
  React.useEffect(() => {
    setAllowPaging(props.allowPaging);
    setAutoCheckHierarchy(props.autoCheckHierarchy);
    setAllowSelection(props.allowSelection);
    setTreeGridConfig(props.treeGridConfig);
  }, [props.allowPaging, props.autoCheckHierarchy, props.allowSelection, props.treeGridConfig]);

  // Effect to refresh the TreeGrid when specific props are updated
  React.useEffect(() => {
    treegridRef.current?.refresh();
  }, [props.idMapping, props.parentIdMapping, treeGridConfig]);

  /**
   * Handles the click event of the toolbar items in the SfTreeGrid component.
   * @param args - The event arguments containing information about the clicked toolbar item.
   */
  const toolbarClick = (args: ClickEventArgs): void => {
    if (treegridRef.current === null) return;
    switch (args.item.id) {
      case treegridRef.current.grid.element.id + "_pdfexport":
        if (treegridRef.current.enableRtl !== true && treegridRef.current.locale !== "ar")
          treegridRef.current.pdfExport();
        break;
      case treegridRef.current.grid.element.id + "_excelexport":
        treegridRef.current.excelExport();
        break;
      case treegridRef.current.grid.element.id + "_csvexport":
        treegridRef.current.csvExport();
        break;
    }
  };

  return (
    <>
      {props.dataSource.length > 0 && (
        <div style={{ height: props.height, width: props.width }} className={props.enableAdaptiveUI ? "e-bigger" : ""}>
          <TreeGridComponent
            dataBound={() => { treegridRef.current?.grid.hideScroll(); }}
            width={"auto"}
            height={"100%"}
            ref={treegridRef}
            dataSource={props.dataSource}
            aggregates={treeGridConfig?.aggregates ? treeGridConfig.aggregates : undefined}
            columnMenuItems={props.treeGridConfig?.columnMenuItems}
            columns={props.treeGridConfig?.columns as ColumnModel[]}
            filterSettings={props.allowFiltering ? {
              columns: props.treeGridConfig?.filterSettings?.columns,
              type: props.treeGridConfig?.filterSettings?.type,
              mode: props.treeGridConfig?.filterSettings?.mode,
              showFilterBarStatus: props.treeGridConfig?.filterSettings?.showFilterBarStatus,
              immediateModeDelay: props.treeGridConfig?.filterSettings?.immediateModeDelay,
              ignoreAccent: props.treeGridConfig?.filterSettings?.ignoreAccent
            } : undefined}
            loadingIndicator={{ indicatorType: props.treeGridConfig?.loadingIndicator?.indicatorType }}
            pageSettings={props.treeGridConfig?.pageSettings ? {
              pageSize: props.treeGridConfig?.pageSettings?.pageSize || 12,
              pageCount: props.treeGridConfig?.pageSettings?.pageCount || 2,
              currentPage: props.treeGridConfig?.pageSettings?.currentPage || 1,
              pageSizes: props.treeGridConfig?.pageSettings?.pageSizes || false
            } : undefined}
            searchSettings={props.treeGridConfig?.toolbar?.includes("Search") ? {
              fields: props.treeGridConfig?.searchSettings?.fields,
              ignoreCase: props.treeGridConfig?.searchSettings?.ignoreCase,
              operator: props.treeGridConfig?.searchSettings?.operator,
              key: props.treeGridConfig?.searchSettings?.key ?? ""
            } : undefined}
            selectionSettings={props.allowSelection ? {
              mode: props.treeGridConfig?.selectionSettings?.mode,
              cellSelectionMode: props.treeGridConfig?.selectionSettings?.cellSelectionMode,
              type: props.treeGridConfig?.selectionSettings?.type,
              persistSelection: props.treeGridConfig?.selectionSettings?.persistSelection,
              checkboxMode: props.treeGridConfig?.selectionSettings?.checkboxMode,
              checkboxOnly: props.treeGridConfig?.selectionSettings?.checkboxOnly,
              enableToggle: props.treeGridConfig?.selectionSettings?.enableToggle
            } : undefined}
            sortSettings={props.allowSorting ? {
              columns: props.treeGridConfig?.sortSettings?.columns,
              allowUnsort: props.treeGridConfig?.sortSettings?.allowUnsort
            } : undefined}
            textWrapSettings={props.allowTextWrap ? {
              wrapMode: props.treeGridConfig?.textWrapSettings?.wrapMode
            } : undefined}
            toolbar={treeGridConfig?.toolbar}
            enableRtl={props.enableRtl}
            idMapping={props.idMapping || "TaskID"}
            parentIdMapping={props.parentIdMapping || "ParentID"}
            frozenColumns={props.frozenColumns}
            frozenRows={props.frozenRows}
            rowHeight={props.rowHeight}
            treeColumnIndex={props.treeColumnIndex}
            clipMode={props.clipMode}
            copyHierarchyMode={props.copyHierarchyMode}
            gridLines={props.gridLines}
            printMode={props.printMode}
            allowExcelExport={props.allowExcelExport}
            allowPdfExport={props.allowPdfExport}
            allowFiltering={props.allowFiltering}
            allowSorting={props.allowSorting}
            allowMultiSorting={props.allowMultiSorting}
            allowPaging={allowPaging}
            allowReordering={props.allowReordering}
            allowResizing={props.allowResizing}
            allowSelection={allowSelection}
            allowTextWrap={props.allowTextWrap}
            autoCheckHierarchy={autoCheckHierarchy}
            enableAdaptiveUI={props.enableAdaptiveUI}
            enableAltRow={props.enableAltRow}
            enableAutoFill={props.enableAutoFill}
            enableCollapseAll={props.enableCollapseAll}
            enableHover={props.enableHover}
            enableHtmlSanitizer={true}
            showColumnChooser={props.showColumnChooser}
            showColumnMenu={props.showColumnMenu}
            toolbarClick={toolbarClick}
          >
            <Inject
              services={[
                Page,
                Sort,
                Filter,
                Resize,
                Reorder,
                Toolbar,
                Aggregate,
                Freeze,
                TreeClipboard,
                ColumnChooser,
                ColumnMenu,
                ExcelExport,
                PdfExport,
                Selection,
                DetailRow
              ]}
            />
          </TreeGridComponent>
        </div>
      )}
      {props.dataSource.length === 0 && (props.renderNoDataSource())}
    </>
  );
});

SfTreeGridComponent.displayName = "SfTreeGridComponent";
