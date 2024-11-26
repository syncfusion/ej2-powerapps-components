import { isNullOrUndefined } from "@syncfusion/ej2-base";
import * as React from "react";
import { NoDataSource } from "./NoDataSource";
import { SfFileManagerComponent } from "./SfFileManager";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import {
  DataSet,
  IFileManagerConfig,
  ISfFileManager,
  Record
} from "./types";

export class SfFileManager implements ComponentFramework.ReactControl<IInputs, IOutputs> {
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
      const FileSystemData = context.parameters?.FileSystemData;
      const isFileSystemDataReady = FileSystemData && !FileSystemData.loading && !FileSystemData.error;
      this.toggleDarkMode(this.validateBooleanProperty(context.parameters.EnableDarkMode) === true);

      // Show the NoDataSource component when the data source is not available, loading, or has an error or when the total record count is zero.
      // Also, show the NoDataSource component when the first record name is "val" to prevent the control from rendering with invalid data.
      if (isFileSystemDataReady && FileSystemData.paging.totalResultCount === 0 ||
        (this.isTestHarness && FileSystemData.records[FileSystemData.sortedRecordIds[0]].getValue("name") === "val")
      ) { return this.renderNoDataSource(); }

      this.setPageSizeAndLoadNextPage(FileSystemData?.paging);
      const fileManagerConfig = this.parseJSONConfig(context.parameters.FileManagerConfig);
      const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
      const allocatedHeight = parseInt(context.mode.allocatedHeight as unknown as string);

      const props: ISfFileManager = {
        fileSystemData: this.fetchDataSource(FileSystemData),
        width: this.getDimension(allocatedWidth, "100%"),
        height: this.getDimension(allocatedHeight, "550px"),
        enableRtl: this.context.userSettings.isRTL ?? false,
        fileManagerConfig: fileManagerConfig as IFileManagerConfig,
        cssClass: this.validateStringProperty(context.parameters.CssClass),
        path: this.validateStringProperty(context.parameters.Path),
        rootAliasName: this.validateStringProperty(context.parameters.RootAliasName),
        sortBy: this.validateStringProperty(context.parameters.SortBy),
        sortOrder: context.parameters.SortOrder.raw,
        view: context.parameters.View.raw,
        allowMultiSelection: this.validateBooleanProperty(context.parameters.AllowMultiSelection),
        enableVirtualization: this.validateBooleanProperty(context.parameters.EnableVirtualization),
        showFileExtension: this.validateBooleanProperty(context.parameters.ShowFileExtension),
        showItemCheckBoxes: this.validateBooleanProperty(context.parameters.ShowItemCheckBoxes),
        showThumbnail: this.validateBooleanProperty(context.parameters.ShowThumbnail),
        renderNoDataSource: this.renderNoDataSource,
        handleEventAction: this.handleEventAction
      };

      // Set the height to Height property from XMl or 450px if component is rendered in Model-Driven Apps.
      if (allocatedHeight < 0 && !this.isTestHarness) {
        const height = context.parameters?.Height?.raw;
        props.height = height && height > 0 ? height + "px" : "550px";
      }

      return React.createElement(SfFileManagerComponent, props);
    } catch (error: any) {
      this.handleEventAction({ name: "onError", error: error }, "updateView");
      return this.renderNoDataSource();
    }
  }

  /**
   * Fetches the data source records and returns them as an array of records.
   * @param dataSource - The data source to fetch records from.
   * @returns The data source records as an array of records.
   */
  public fetchDataSource(dataSource: DataSet): any {
    const { columns, sortedRecordIds, records } = dataSource;
    const recordsArray: Record[] = [];
    const isModelDriven = !isNullOrUndefined(columns[0]?.["isPrimary"]) && !this.isTestHarness;

    sortedRecordIds.forEach((id) => {
      const record: Record = {};
      const recordData = records[id];

      columns.forEach((column: any) => {
        if (!column.displayName || column.dataType.includes("multiselectpicklist")) return;
        const displayName = this.toCamelCase(column.displayName);

        const value = recordData.getValue(column.alias);
        if (isModelDriven && column.dataType === "TwoOptions" && !isNullOrUndefined(value)) {
          record[displayName] = Boolean(parseInt(value as string));
        } else if (column.dataType.includes("DateAndTime")) {
          record[displayName] = new Date(value as string);
        } else if (typeof value === 'string') {
          if (value) record[displayName] = value;
        } else {
          record[displayName] = value;
        }
      });

      if (Object.keys(record).length > 0) recordsArray.push(record);
    });
    return recordsArray;
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

    this.notifyOutputChanged();
  };

  /**
   * Gets the dimension value as a string.
   * @param dimension - The dimension value to convert.
   * @param defaultValue - The default value to return if the dimension is less than or equal to zero.
   * @returns The dimension value as a string.
   */
  private getDimension(dimension: number, defaultValue: string): string {
    return dimension > 0 ? `${dimension}px` : defaultValue;
  }

  /**
   * Parses a JSON string and returns the parsed JSON object.
   * If the JSON string is invalid, it handles the error by invoking the "onError" event.
   * @param jsonString - The JSON string to parse.
   * @returns The parsed JSON object, or an empty object if the JSON string is empty or invalid.
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
    return typeof property.raw === "string" ? property.raw === "true" : property.raw;
  }

  /**
   * Validates a property of whole number type and returns its value or a default value if not valid.
   * Ensures the number is greater than zero.
   * @param property - The property to validate.
   * @returns The validated property value or undefined.
   */
  public validateWholeNumberProperty(property: ComponentFramework.PropertyTypes.WholeNumberProperty): number | undefined {
    return property.raw && property.raw > 0 ? property.raw : 0;
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
   * Converts a string to camel case.
   * @param displayName - The string to convert.
   * @returns The camel case version of the input string.
   */
  private toCamelCase(displayName: string): string {
    const hasNoSpaces = !displayName.includes(' ');
    return hasNoSpaces ?
      displayName.charAt(0).toLowerCase() + displayName.slice(1) :
      displayName.split(' ').map((word, index) => {
        const lowerCaseWord = word.toLowerCase();
        return index === 0 ? lowerCaseWord : lowerCaseWord.charAt(0).toUpperCase() + lowerCaseWord.slice(1);
      }).join('');
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
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void { }
}