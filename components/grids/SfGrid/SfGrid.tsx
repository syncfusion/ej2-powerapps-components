import { isNullOrUndefined, isUndefined } from "@syncfusion/ej2-base";
import {
  ColumnModel,
  Edit,
  Filter,
  GridComponent,
  Group,
  Inject,
  Page,
  Resize,
  Selection,
  Sort,
  Toolbar,
  ToolbarItem
} from "@syncfusion/ej2-react-grids";
import * as React from "react";
import "./styles/theme.css";
import {
  DataSet,
  IEntityRecord,
  IFetchedDataSetObject,
  ISfGrid,
  Record,
  dataverseTypeMapping
} from "./types";

/**
 * Renders a SfGrid component with various features such as editing, paging, sorting, grouping, filtering, etc.
 *
 * @param {ISfGrid} props - The props for the Grid component.
 * @returns {JSX.Element} - The rendered Grid component.
 */
export const SfGridComponent: React.FC<ISfGrid> = React.memo((props: ISfGrid) => {
  const {
    dataSource,
    columns,
    width,
    height,
    primaryKey,
    rtl,
    allowEditing,
    editMode,
    allowPaging,
    pageSize,
    pageCount,
    allowSorting,
    allowMultiSorting,
    allowGrouping,
    showGroupedColumn,
    allowFiltering,
    gridLines,
    allowTextWrap,
    allowResizing,
    isTestHarness,
    renderNoDataSource,
    handleEventAction
  } = props;

  const gridRef = React.useRef<GridComponent>(null);
  const [gridDataSource, setGridDataSource] = React.useState<Record[]>([]);
  const [gridColumns, setGridColumns] = React.useState<ColumnModel[]>([]);

  /**
   * Map of dataSource column names to their respective data types.
   */
  const columnDataTypeMap = React.useMemo(() => {
    return (
      dataSource.columns.reduce((result: Record, item) => {
        result[item.name] = item.dataType;
        return result;
      }, {}) ?? {}
    );
  }, [dataSource]);

  /**
   * Represents the toolbar options for the SfGrid component.
   */
  const toolbarOptions = React.useMemo(() => {
    if (allowEditing && editMode === "Dialog") {
      return [ToolbarItem.Edit];
    } else if (allowEditing) {
      return [ToolbarItem.Edit, ToolbarItem.Update, ToolbarItem.Cancel];
    }
  }, [allowEditing, editMode]);

  /**
   * Returns an array of keys from the `data` object that have different values compared to the `previousData` object.
   * @param data - The current data object.
   * @param previousData - The previous data object.
   * @returns An array of keys with updated values.
   */
  const getUpdatedRecords = (data: Record, previousData: Record): string[] => {
    if (!data || !previousData) return [];
    return Object.keys(data).filter((key) => {
      const newData = data[key], prevData = previousData[key];

      if (isUndefined(newData)) return false;

      if (typeof newData === "object" && typeof prevData === "object") {
        return newData.getTime() !== prevData?.getTime();
      }
      return newData !== prevData;
    });
  };

  /**
   * Handles the action begin event for the grid.
   * @param args - The event arguments.
   */
  const actionBegin = async (args: any) => {
    try {
      if (args.requestType !== "save") return;

      const { currentPage, pageSize } = gridRef.current?.pagerModule?.pagerObj ?? {};
      const index = args.rowIndex + ((currentPage ?? 1) - 1) * (pageSize ?? 1);
      const rowIndex = dataSource?.sortedRecordIds[index];
      const stringTypes = [
        "SingleLine.Text",
        "SingleLine.TextArea",
        "SingleLine.RichText",
        "SingleLine.Email",
        "SingleLine.PhoneNumber",
        "SingleLine.Symbol",
        "SingleLine.URL",
        "MultipleLine.Text",
        "MultipleLine.RichText"
      ];
      const objectTypes = ["TwoOptions", "OptionSet"];
      const ignoreTypes = ["file", "image"];

      if (!rowIndex) return;
      let record = dataSource?.records[rowIndex] as IEntityRecord;

      if (!record?.setValue || !record?.save) return;
      const updatedRecords = getUpdatedRecords(args.data, args.previousData);

      // Update and save modified record fields as per the column type.
      for (const key of updatedRecords) {
        if (ignoreTypes.includes(columnDataTypeMap[key])) continue;
        let value = args.data[key];

        if (objectTypes.includes(columnDataTypeMap[key])) {
          value = { Id: args.data[key] };
        } else if (stringTypes.includes(columnDataTypeMap[key])) {
          value = String(args.data[key]);
        }
        record.setValue(key, value);
      }

      if (updatedRecords.length > 0) await record.save();
    } catch (error: any) {
      props.handleEventAction({ name: "onError", error: error.message }, "Save");
      dataSource?.refresh();
    }
  };

  /**
   * useEffect hook to manage data and column updates for a grid component.
   * This hook fetches data and column information from provided data sources,
   * sets the grid columns and data source accordingly, and triggers updates
   * based on changes in the dataSource, columns, or primaryKey.
   */
  React.useEffect(() => {
    if (dataSource || (dataSource && columns)) {
      const { fetchedData, generatedColumnData } = fetchDataFromDataSet(dataSource, dataSource?.getTargetEntityType());
      // Check if the columns are default harness data. To load the auto generated columns data from the dataset.
      const defaultColumnsData = isTestHarness
        ? fetchedData.some((obj) => Object.values(obj).every((value) => value === "val"))
        : false;
      let { fetchedColumns } = fetchDataFromDataSet(columns, columns?.getTargetEntityType(), generatedColumnData);
      fetchedColumns = fetchedColumns.length > 0 && !defaultColumnsData ? fetchedColumns : generatedColumnData;
      setGridColumns(fetchedColumns);
      setGridDataSource(fetchedData);
    }
  }, [dataSource, columns, primaryKey]);

  /**
   * Fetches data from a DataSet and returns an object containing the fetched data and columns.
   * @param dataSet - The DataSet from which to fetch the data.
   * @param entityType - The entity type associated with the data.
   * @param generatedColumn - Optional generated columns to include in the fetched data.
   * @returns An object containing the fetched data and columns.
   */
  const fetchDataFromDataSet = (dataSet: DataSet, entityType: string, generatedColumn?: ColumnModel[]): IFetchedDataSetObject => {
    let fetchDataFromDataSet = { fetchedData: [], fetchedColumns: [], generatedColumnData: [] } as IFetchedDataSetObject;

    try {
      if (!dataSet) return fetchDataFromDataSet;
      const { sortedRecordIds, records } = dataSet;
      const uniqueColumnNames: string[] = [];

      sortedRecordIds.forEach((id) => {
        const rowRecord: Record = {};
        dataSet.columns.forEach((column: Record) => {
          const { alias, displayName, dataType } = column;
          let isNonPrimaryDataset: boolean = alias.substring(0, 3) === "Col" || alias.includes("_col");
          let isModelDriven: boolean = !isNullOrUndefined(column["isPrimary"]) && !isTestHarness;

          // Generate column alias if the column alias has a prefix (non-primary dataset)
          let updatedColumnAlias: string = isNonPrimaryDataset
            ? displayName.charAt(3).toLowerCase() + displayName.substring(4)
            : alias;

          // Generate the column name based on the entity type and column alias if the column name is not present (canvas app scenario)
          let updatedColumnName: string = !isModelDriven && records[id].getValue(alias) === null
            ? `${entityType?.split("_")[0]}_col${updatedColumnAlias.toLowerCase().trim()}`
            : alias;

          let data = records[id].getValue(updatedColumnName);

          if (data) {
            if (isModelDriven && dataType === "TwoOptions") {
              rowRecord[updatedColumnAlias] = Boolean(parseInt(data as string));
            } else if (dataType.includes("DateAndTime")) {
              rowRecord[updatedColumnAlias] = new Date(data as string);
            } else {
              rowRecord[updatedColumnAlias] = data;
            }
          }

          // Check if the column is generated and add it to the generated column data (primary dataset)
          if (!generatedColumn && !uniqueColumnNames.includes(updatedColumnAlias)) {
            uniqueColumnNames.push(updatedColumnAlias);
            fetchDataFromDataSet.generatedColumnData.push({
              field: updatedColumnAlias,
              headerText: displayName,
              isPrimaryKey: displayName === primaryKey,
              editType: dataverseTypeMapping[dataType]?.editType ?? "defaultEdit",
              format: dataverseTypeMapping[dataType]?.format ?? "",
              type: dataverseTypeMapping[dataType]?.type ?? "string",
              minWidth: "100"
            });
          }
        });

        // Set the field property for the generated column based on the headerText property
        generatedColumn?.forEach((column: Record) => {
          if (column.headerText === rowRecord["headerText"]) {
            rowRecord["field"] = column["field"];
          }
        });

        if (generatedColumn && isNullOrUndefined(rowRecord["field"]) && rowRecord["type"] !== "checkbox") return;

        // Parse the format property if it contains JSON as a string
        if (generatedColumn && (rowRecord["format"]?.includes("{") || rowRecord["format"]?.includes("}"))) {
          try {
            const parsedFormat = JSON.parse(rowRecord["format"]?.replace(/'/g, '"'));
            rowRecord["format"] = parsedFormat;
          } catch (error) {
            console.error("Error parsing column format:", error);
          }
        }

        if (Object.keys(rowRecord).length > 0) {
          generatedColumn
            ? fetchDataFromDataSet.fetchedColumns.push(rowRecord)
            : fetchDataFromDataSet.fetchedData.push(rowRecord);
        }
      });

      return fetchDataFromDataSet;
    } catch (error: any) {
      props.handleEventAction({ name: "onError", error: error.message }, "FetchDataFromDataSet");
      return fetchDataFromDataSet;
    }
  };

  // Effect to freeze refresh the Grid when specific props are updated
  React.useEffect(() => {
    if (gridColumns.length > 0 && gridDataSource.length > 0) gridRef.current?.freezeRefresh();
  }, [allowEditing, allowPaging, allowGrouping, allowFiltering, allowResizing, allowTextWrap]);

  return (
    <div style={{ height: height, width: width }}>
      {gridColumns.length > 0 && (
        <GridComponent
          ref={gridRef}
          dataSource={gridDataSource}
          width={"auto"}
          height={"100%"}
          columns={gridColumns}
          enableRtl={rtl}
          editSettings={{ allowEditing: allowEditing, mode: editMode }}
          actionBegin={actionBegin}
          toolbar={toolbarOptions}
          allowPaging={allowPaging}
          pageSettings={{ pageSize: pageSize, pageCount: pageCount }}
          allowSorting={allowSorting}
          allowMultiSorting={allowMultiSorting}
          allowGrouping={allowGrouping}
          groupSettings={{ showGroupedColumn: showGroupedColumn }}
          allowFiltering={allowFiltering}
          gridLines={gridLines}
          allowTextWrap={allowTextWrap}
          allowResizing={allowResizing}
          resizeSettings={{ mode: allowResizing ? "Auto" : undefined }}
          dataBound={() => { gridRef.current?.hideScroll(); }}
          loadingIndicator={{ indicatorType: "Spinner" }}
          recordDoubleClick={(args) => handleEventAction(args)}
          rowSelected={(args) => handleEventAction(args)}
          rowDeselected={(args) => handleEventAction(args)}
        >
          <Inject services={[Page, Selection, Sort, Group, Toolbar, Edit, Filter, Resize]} />
        </GridComponent>
      )}
      {gridColumns.length === 0 && renderNoDataSource()}
    </div>
  );
});

SfGridComponent.displayName = "SfGridComponent";
