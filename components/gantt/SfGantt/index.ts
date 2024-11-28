import * as React from "react";
import { NoDataSource } from "./NoDataSource";
import { NoConfigData } from "./NoConfigData";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { SfGanttComponent } from "./SfGantt";
import { IGanttConfig, ISfGantt, Record } from "./types";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class SfGantt implements ComponentFramework.ReactControl<IInputs, IOutputs> {
  private context: ComponentFramework.Context<IInputs>;
  private notifyOutputChanged: () => void;
  private isTestHarness: boolean;
  private onError: string;
  private eventName: string;
  private defaultGanttConfig: IGanttConfig = {
    columns: [],
    dayWorkingTime: [{ from: 8, to: 12 }, { from: 13, to: 17 }],
    eventMarkers: [],
    filterSettings: {},
    holidays: [],
    resourceFields: {},
    resources: [],
    searchSettings: {},
    selectionSettings: { mode: 'Row', type: 'Single' },
    sortSettings: { columns: [] },
    splitterSettings: {},
    taskFields: {},
    timelineSettings: {}
  };

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
      let dataSource: any = context.parameters?.DataSource;
      const dataSourceLoaded = dataSource && !dataSource.loading && !dataSource.error;
      this.toggleDarkMode(this.validateBooleanProperty(context.parameters.EnableDarkMode) === true);

      // Check if DataSource are not loaded properly, or if DataSource has no records
      if ((!dataSourceLoaded) || (dataSourceLoaded && dataSource.paging.totalResultCount === 0)) {
        return this.renderNoDataSource();
      }

      this.setPageSizeAndLoadNextPage(dataSource.paging);

      const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
      const allocatedHeight = parseInt(context.mode.allocatedHeight as unknown as string);

      const props: ISfGantt = {
        dataSource: this.getGanttData(dataSource),
        width: allocatedWidth > 0 ? allocatedWidth + "px" : "auto",
        height: allocatedHeight > 0 ? allocatedHeight + "px" : "auto",
        ganttConfig: this.parseJSONConfig(context.parameters?.GanttConfig),
        allowFiltering: this.validateBooleanProperty(context.parameters?.AllowFiltering),
        allowReordering: this.validateBooleanProperty(context.parameters?.AllowReordering),
        allowResizing: this.validateBooleanProperty(context.parameters?.AllowResizing),
        allowSelection: this.validateBooleanProperty(context.parameters?.AllowSelection),
        allowSorting: this.validateBooleanProperty(context.parameters?.AllowSorting),
        enableCriticalPath: this.validateBooleanProperty(context.parameters?.EnableCriticalPath),
        enableRtl: this.context.userSettings.isRTL ?? false,
        enableAdaptiveUI: parseInt(context.client.getFormFactor() as unknown as string) === 3,
        showColumnMenu: this.validateBooleanProperty(context.parameters?.ShowColumnMenu),
        showToolbar: this.validateBooleanProperty(context.parameters?.ShowToolbar),
        gridLines: context.parameters?.GridLines?.raw,
        timeZone: this.validateStringProperty(context.parameters?.TimeZone),
        treeColumnIndex: this.validateWholeNumberProperty(context.parameters.TreeColumnIndex, 1),
        viewType: context.parameters?.ViewType?.raw,
        isTestHarness: this.isTestHarness,
        renderNoDataSource: this.renderNoDataSource,
        renderNoConfigData: this.renderNoConfigData,
        handleEventAction: this.handleEventAction
      };
      if (this.isTestHarness && !(allocatedWidth > 0)) {
        props.width = 1250;
      }

      return React.createElement(SfGanttComponent, props);
    } catch (error: any) {
      this.handleEventAction({ name: "onError", error: error });
      return React.createElement("div", null, "An error occurred while rendering the Gantt Chart.");
    }
  }

  /**
   * Returns the Gantt data based on the dataset.
   * @param dataSource - The dataset.
   * @returns The gantt data
   * @remarks
   * This method is used to map the dataset records to the gantt data.
   */
  public getGanttData(dataSource: DataSet): Record[] | [] {
    if (!dataSource || dataSource.loading) return [];

    const { columns, sortedRecordIds, records } = dataSource;
    let isModelDriven: boolean = false;
    if (!columns || !sortedRecordIds || !records) return [];

    // Map the dataset records to the gantt data
    const returnData = sortedRecordIds.map((id) => {
      const record: Record = {};
      let resourcesData: Object = {};
      let indicatorsData: Object[] = [];
      columns.forEach((column: any) => {
        if (isNullOrUndefined(column.displayName) || column.dataType.includes("multiselectpicklist")) return;

        isModelDriven = !isNullOrUndefined(column["isPrimary"]) && !this.isTestHarness;
        let value = records[id].getValue(column.alias);
        if (isModelDriven && column.dataType === "TwoOptions") {
          record[column.displayName] = Boolean(parseInt(value as string));
        }
        else if (column.dataType.includes("DateAndTime") && value != '') {
          record[column.displayName] = new Date(value as string);
        }
        if (value !== null && value !== undefined && value !== '') {
          record[column.displayName] = records[id].getValue(column.alias);
        }
        // Process Resources and Indicators fields
        try {
          if (column.displayName === "Resources" && value) {
            resourcesData = JSON.parse(value as string);
          } else if (column.displayName === "Indicators" && value) {
            indicatorsData = JSON.parse(value as string);
          }
        } catch (e) {
          console.error(`Invalid JSON format for ${column.displayName} field:`, e);
        }
      });
      // Assign Resources and Indicators to the record object
      record.Resources = resourcesData;
      record.Indicators = indicatorsData;
      return record;
    });

    // Sort the dataSource
    const sortedData = returnData.every((item, i, arr) => i === 0 || Number(arr[i - 1].TaskID) <= Number(item.TaskID))
      ? returnData
      : returnData.sort((a, b) => Number(a.TaskID) - Number(b.TaskID));
    
    return sortedData.length > 0 ? sortedData : [];
  }

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
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
   */
  public getOutputs(): IOutputs {
    const outputs: IOutputs = {};

    if (this.eventName) {
      outputs.EventName = this.eventName;
      this.eventName = "";
    }

    if (this.onError) {
      outputs.OnError = this.onError;
      this.onError = "";
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
    let error = eventArgs.error;

    if ((eventArgs.name === "onError" && error.message) || customErrorMessage) {
      console.error("Error: ", error);
      this.onError = error.message
        ? `${error.name}: ${error.message}`
        : `Error while handling ${customErrorMessage}`;
    }

    if (!this.isTestHarness) {
      this.notifyOutputChanged();
    }
  };

  /**
   * Parses a JSON string and returns the parsed JSON object.
   * If the JSON string is invalid, it handles the error by invoking the "onError" event.
   * @param jsonString - The JSON string to parse.
   * @returns The parsed JSON object, or an empty object if the JSON string is empty or invalid.
   */
  public parseJSONConfig = (jsonString: ComponentFramework.PropertyTypes.StringProperty): IGanttConfig | undefined => {
    try {
      const json = this.validateStringProperty(jsonString);
      return json ? JSON.parse(json) : this.defaultGanttConfig;
    } catch (error: any) {
      this.handleEventAction({ name: "onError", error: error }, "parseJSONConfig");
    }
  };

  /**
   * Validates a property of whole number type and returns its value or a default value if not valid.
   * Ensures the number is greater than zero.
   * @param property - The property to validate.
   * @param defaultValue - The default value to return if the property is not valid.
   * @returns The validated property value or the default value.
   */
  public validateWholeNumberProperty(property: ComponentFramework.PropertyTypes.WholeNumberProperty, defaultValue: number): number {
    if (property && typeof property.raw === 'number' && property.raw >= 0) {
      return property.raw;
    }
    return defaultValue;
  }

  /**
   * Validates a string property.
   * @param property - The string property to validate.
   * @returns The validated string value.
   */
  public validateStringProperty(property: ComponentFramework.PropertyTypes.StringProperty): string | undefined {
    return property && property.raw && property.raw !== "val" ? property.raw : undefined;
  }

  /**
   * Validates a boolean property.
   * @param property - The boolean property to validate.
   * @returns The validated boolean value.
   */
  public validateBooleanProperty(property: ComponentFramework.PropertyTypes.TwoOptionsProperty): boolean {
    return typeof property.raw === "string" ? property.raw === "true" : property.raw;
  }

  /**
   * Sets the page size to the total result count and loads the next page of data if available.
   * @param paging - The paging object from the dataset.
   */
  public setPageSizeAndLoadNextPage = (paging: ComponentFramework.PropertyTypes.DataSet["paging"]): void => {
    if (paging && paging.hasNextPage && paging.pageSize !== paging.totalResultCount) {
      paging.setPageSize(paging.totalResultCount);
      paging.loadNextPage();
    }
  };

  /**
   * Renders the NoDataSource component when data source is not available, loading, or has an error,
   * or when the total record count is zero.
   * @returns {React.ReactElement} The React element representing the NoDataSource component.
   */
  public renderNoDataSource = (): React.ReactElement => {
    return React.createElement(NoDataSource, { resources: this.context.resources });
  };

  /**
   * Renders the NoConfigData component when GanttConfig data is not available.
   * @returns {React.ReactElement} The React element representing the NoConfigData component.
   */
  public renderNoConfigData = (): React.ReactElement => {
    return React.createElement(NoConfigData, { resources: this.context.resources });
  };

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
  }
}