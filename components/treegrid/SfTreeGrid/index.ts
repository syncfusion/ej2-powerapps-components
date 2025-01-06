import { isNullOrUndefined } from "@syncfusion/ej2-base";
import * as React from "react";
import { NoDataSource } from "./NoDataSource";
import { SfTreeGridComponent } from "./SfTreeGrid";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import {
  DataSet,
  ISfTreeGrid,
  ITreeGridConfig,
  Record,
  dataverseTypeMapping,
  fetchDataSourceReturn
} from "./types";

export class SfTreeGrid implements ComponentFramework.ReactControl<IInputs, IOutputs> {
  private context: ComponentFramework.Context<IInputs>;
  private notifyOutputChanged: () => void;
  private OnError: string;
  private eventName: string;
  private isTestHarness: boolean = false;

  /**
   * Empty constructor.
   */
  constructor() { }

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   */
  public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary): void {
    this.isTestHarness = document.getElementById("control-dimensions") !== null;
    this.notifyOutputChanged = notifyOutputChanged;
    context.mode.trackContainerResize(true);
    this.context = context;
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   * @returns ReactElement root react element for the control
   */
  public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
    try {
      this.context = context;

      const dataSource = context.parameters?.DataSource;
      const isDataSourceReady = dataSource && !dataSource.loading && !dataSource.error;
      this.toggleDarkMode(this.validateBooleanProperty(context.parameters.EnableDarkMode) === true);

      // Check if DataSource or Columns are not loaded properly, or if DataSource has no records
      if (!isDataSourceReady || (isDataSourceReady && dataSource.paging.totalResultCount === 0)) {
        return this.renderNoDataSource();
      }

      const treeGridConfig = this.parseJSONConfig(context.parameters.TreeGridConfig);
      const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
      const allocatedHeight = parseInt(context.mode.allocatedHeight as unknown as string);

      const props: ISfTreeGrid = {
        dataSource: [],
        width: this.getDimension(allocatedWidth),
        height: this.getDimension(allocatedHeight),
        enableRtl: this.context.userSettings.isRTL ?? false,
        treeGridConfig: treeGridConfig,
        idMapping: this.validateStringProperty(context.parameters.IdMapping),
        parentIdMapping: this.validateStringProperty(context.parameters.ParentIdMapping),
        frozenColumns: this.validateWholeNumberProperty(context.parameters.FrozenColumns),
        frozenRows: this.validateWholeNumberProperty(context.parameters.FrozenRows),
        rowHeight: this.validateWholeNumberProperty(context.parameters.RowHeight),
        treeColumnIndex: this.validateWholeNumberProperty(context.parameters.TreeColumnIndex),
        clipMode: context.parameters.ClipMode.raw,
        copyHierarchyMode: context.parameters.CopyHierarchyMode.raw,
        gridLines: context.parameters.GridLines.raw,
        printMode: context.parameters.PrintMode.raw,
        allowExcelExport: this.validateBooleanProperty(context.parameters.AllowExcelExport),
        allowPdfExport: this.validateBooleanProperty(context.parameters.AllowPdfExport),
        allowFiltering: this.validateBooleanProperty(context.parameters.AllowFiltering),
        allowSorting: this.validateBooleanProperty(context.parameters.AllowSorting),
        allowMultiSorting: this.validateBooleanProperty(context.parameters.AllowMultiSorting),
        allowPaging: this.validateBooleanProperty(context.parameters.AllowPaging),
        allowReordering: this.validateBooleanProperty(context.parameters.AllowReordering),
        allowResizing: this.validateBooleanProperty(context.parameters.AllowResizing),
        allowSelection: this.validateBooleanProperty(context.parameters.AllowSelection),
        allowTextWrap: this.validateBooleanProperty(context.parameters.AllowTextWrap),
        autoCheckHierarchy: this.validateBooleanProperty(context.parameters.AutoCheckHierarchy),
        enableAdaptiveUI: parseInt(context.client.getFormFactor() as unknown as string) === 3,
        enableAltRow: this.validateBooleanProperty(context.parameters.EnableAltRow),
        enableAutoFill: this.validateBooleanProperty(context.parameters.EnableAutoFill),
        enableCollapseAll: this.validateBooleanProperty(context.parameters.EnableCollapseAll),
        enableHover: this.validateBooleanProperty(context.parameters.EnableHover),
        showColumnChooser: this.validateBooleanProperty(context.parameters.ShowColumnChooser),
        showColumnMenu: this.validateBooleanProperty(context.parameters.ShowColumnMenu),
        renderNoDataSource: this.renderNoDataSource,
        handleEventAction: this.handleEventAction
      };

      // Fetch data source and columns from updated dataSource and configuration
      const { dataSourceObj, generatedColumnsObj } = this.fetchDataSource(dataSource, props.parentIdMapping, treeGridConfig);
      props.dataSource = dataSourceObj;

      // Update the treeGridConfig columns only if generatedColumnsObj is not empty
      if (generatedColumnsObj.length > 0) {
        props.treeGridConfig.columns = generatedColumnsObj as ITreeGridConfig["columns"];
      }
      props.treeGridConfig.columns?.forEach(c => {
        c.clipMode = props.clipMode;
      });

      return React.createElement(SfTreeGridComponent, props);
    } catch (error: any) {
      console.error(error);
      return React.createElement("div", null, "Error at UpdateView: " + error.message);
    }
  }

  /**
   * Fetches the data source for the TreeGrid component.
   * 
   * @param dataSource - The data source containing the records and columns.
   * @param parentId - The ID of the parent record.
   * @param configColumns - Optional configuration for the columns.
   * @returns An object containing the data source and generated columns.
   */
  public fetchDataSource(dataSource: DataSet, parentId: string, configColumns?: ITreeGridConfig): fetchDataSourceReturn {
    const { columns, paging, sortedRecordIds, records } = dataSource;
    const recordsArray: Record[] = [];
    const autoGeneratedColumns: Record[] = [];
    const processedColumnNames: string[] = [];
    const isModelDriven = !isNullOrUndefined(columns[0]?.["isPrimary"]) && !this.isTestHarness;

    sortedRecordIds.forEach((id) => {
      const record: Record = {};
      const recordData = records[id];

      columns.forEach((column: any) => {
        if (!column.displayName || column.dataType.includes("multiselectpicklist")) return;
        const { displayName, dataType } = column;

        const value = recordData.getValue(column.alias);
        if (isModelDriven && column.dataType === "TwoOptions" && !isNullOrUndefined(value)) {
          record[column.displayName] = Boolean(parseInt(value as string));
        } else if (column.dataType.includes("DateAndTime")) {
          record[displayName] = new Date(value as string);
        } else if (typeof value === 'string') {
          if (value) record[displayName] = value;
        } else {
          record[displayName] = value;
        }

        // Add auto-generated columns if not already present in the configuration columns
        if (!configColumns?.columns && !processedColumnNames.includes(column.displayName) && column.displayName !== parentId) {
          processedColumnNames.push(column.displayName);
          autoGeneratedColumns.push({
            field: column.displayName,
            headerText: displayName,
            format: dataverseTypeMapping[dataType]?.format ?? "",
            type: dataverseTypeMapping[dataType]?.type ?? "string",
            minWidth: "70"
          });
        }
      });

      if (Object.keys(record).length > 0) recordsArray.push(record);
    });

    if (paging.hasNextPage && paging.pageSize !== paging.totalResultCount) {
      // Load all records for PowerPages application at once
      const firstColumn = columns[0] as any;
      if (firstColumn?.attributes?.["SourceType"] !== undefined) {
        paging.setPageSize(paging.totalResultCount);
      }
      paging.loadNextPage();
    }

    return { dataSourceObj: recordsArray, generatedColumnsObj: autoGeneratedColumns };
  }

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
   */
  public getOutputs(): IOutputs {
    const outputs: IOutputs = {};

    if (this.eventName) {
      outputs.EventName = this.eventName;
      this.eventName = "";
    }

    if (this.OnError) {
      outputs.OnError = this.OnError;
      this.OnError = "";
    }
    return outputs;
  }

  /**
   * Handles the event action by updating the event name and error arguments.
   * @param eventArgs - The event arguments.
   * @param customErrorMessage - An optional custom error message.
   */
  public handleEventAction = (eventArgs: any, customErrorMessage?: string): void => {
    this.eventName = eventArgs.name;
    const error = eventArgs.error;

    // Log the error message if available.
    if ((eventArgs.name === "onError" && error.message) || customErrorMessage) {
      console.error("Error: ", error);
      this.OnError = error.message
        ? `${error.name}: ${error.message}`
        : `Error while handling ${customErrorMessage}`;
    }

    if (!this.isTestHarness) this.notifyOutputChanged();
  };

  /**
   * Gets the dimension value as a string.
   * @param dimension - The dimension value to convert.
   * @returns The dimension value as a string.
   */
  private getDimension(dimension: number): string {
    return dimension > 0 ? `${dimension}px` : "auto";
  }

  /**
   * Gets the JSON object from a string property.
   * @param jsonString - The JSON string property.
   * @returns The JSON object or the default RTE configuration.
   */
  public parseJSONConfig = (jsonString: ComponentFramework.PropertyTypes.StringProperty) => {
    try {
      const json = this.validateStringProperty(jsonString);
      return json ? JSON.parse(json) : {};
    } catch (error: any) {
      this.handleEventAction({ name: "onError", error: error }, "parseJSONConfig");
    }
  };

  /**
   * Validates a boolean property.
   * @param property - The boolean property to validate.
   * @returns The validated boolean value.
   */
  public validateBooleanProperty(property: ComponentFramework.PropertyTypes.TwoOptionsProperty): boolean {
    return property && typeof property.raw === "string" ? property.raw === "true" : property.raw;
  }

  /**
   * Validates a property of whole number type and returns its value or a default value if not valid.
   * Ensures the number is greater than zero.
   * @param property - The property to validate.
   * @returns The validated property value or undefined.
   */
  public validateWholeNumberProperty(property: ComponentFramework.PropertyTypes.WholeNumberProperty): number | undefined {
    return property && property.raw && property.raw > 0 ? property.raw : 0;
  }

  /**
   * Validates a string property.
   * @param property - The string property to validate.
   * @returns The validated string value.
   */
  public validateStringProperty(property: ComponentFramework.PropertyTypes.StringProperty): string {
    return property && property.raw && property.raw !== "val" ? property.raw : "";
  }

  /**
   * Renders the NoDataSource component when data source is not available, loading, or has an error,
   * or when the total record count is zero.
   * @returns {React.ReactElement} The React element representing the NoDataSource component.
   */
  public renderNoDataSource = (): React.ReactElement => {
    return React.createElement(NoDataSource, { resources: this.context.resources });
  };

  /**
   * Toggles the dark mode for the application.
   *
   * @param {boolean} [enable] - Optional parameter to enable or disable dark mode. 
   * If true, dark mode will be enabled. If false or not provided, dark mode will be disabled.
   */
  public toggleDarkMode(enable?: boolean): void {
    const body = document.body;

    if (enable) {
      body.classList.add('e-dark-mode');
    } else {
      body.classList.remove('e-dark-mode');
    }
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
  }
}
