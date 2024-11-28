import { isNullOrUndefined } from "@syncfusion/ej2-base";
import * as React from "react";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { SfSpreadsheetComponent } from "./SfSpreadsheet";
import {
  DataSet,
  ISfSpreadsheet,
  Record,
  fetchDataSourceReturn
} from "./types";

export class SfSpreadsheet implements ComponentFramework.ReactControl<IInputs, IOutputs> {
  private context: ComponentFramework.Context<IInputs>;
  private notifyOutputChanged: () => void;
  private isTestHarness: boolean;
  private onError: string;
  private eventName: string;

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

      this.toggleDarkMode(this.validateBooleanProperty(context.parameters.EnableDarkMode) === true);
      const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
      const allocatedHeight = parseInt(context.mode.allocatedHeight as unknown as string);

      const props: ISfSpreadsheet = {
        dataSource: [],
        documentPath: context.parameters?.DocumentPath?.raw ?? "",
        width: allocatedWidth > 0 ? allocatedWidth + "px" : "100%",
        height: allocatedHeight > 0 ? allocatedHeight + "px" : "100%",
        allowFiltering: this.validateBooleanProperty(context.parameters?.AllowFiltering),
        allowFreezePane: this.validateBooleanProperty(context.parameters?.AllowFreezePane),
        allowOpen: this.validateBooleanProperty(context.parameters?.AllowOpen),
        allowPrint: this.validateBooleanProperty(context.parameters?.AllowPrint),
        allowResizing: this.validateBooleanProperty(context.parameters?.AllowResizing),
        allowSave: this.validateBooleanProperty(context.parameters?.AllowSave),
        allowSorting: this.validateBooleanProperty(context.parameters?.AllowSorting),
        allowWrap: this.validateBooleanProperty(context.parameters?.AllowWrap),
        enableRtl: this.context.userSettings.isRTL ?? false,
        showAggregate: this.validateBooleanProperty(context.parameters?.ShowAggregate),
        showFormulaBar: this.validateBooleanProperty(context.parameters?.ShowFormulaBar),
        showRibbon: this.validateBooleanProperty(context.parameters?.ShowRibbon),
        showSheetTabs: this.validateBooleanProperty(context.parameters?.ShowSheetTabs),
        selectionMode: context.parameters?.SelectionMode?.raw,
        isTestHarness: this.isTestHarness,
        handleEventAction: this.handleEventAction
      };
      if (this.isTestHarness && !(allocatedHeight > 0)) {
        props.height = '600px';
      }
      // Fetch data source and columns from updated dataSource and configuration
      const { dataSourceObj } = this.fetchDataSource(dataSource);
      props.dataSource = dataSourceObj;

      return React.createElement(SfSpreadsheetComponent, props);
    } catch (error: any) {
      this.handleEventAction({ name: "onError", error: error });
      return React.createElement("div", null, "Error at UpdateView: " + error.message);
    }
  }

  /**
   * Fetches the data source for the TreeGrid component.
   * 
   * @param dataSource - The data source containing the records and columns.
   * @returns An object containing the data source and generated columns.
   */
  public fetchDataSource(dataSource: DataSet): fetchDataSourceReturn {
    const { columns, paging, sortedRecordIds, records } = dataSource;
    const recordsArray: Record[] = [];
    const isModelDriven = !isNullOrUndefined(columns[0]?.["isPrimary"]) && !this.isTestHarness;

    sortedRecordIds.forEach((id) => {
      const record: Record = {};
      const recordData = records[id];

      columns.forEach((column: Record) => {
        if (!column.displayName || column.dataType.includes("multiselectpicklist")) return;

        const value = recordData.getValue(column.alias);
        if (isModelDriven && column.dataType === "TwoOptions" && !isNullOrUndefined(value)) {
          record[column.displayName] = Boolean(parseInt(value as string));
        } else if (value) {
          record[column.displayName] = value;
        }
      });
      if (Object.keys(record).length > 0) recordsArray.push(record);
    });

    if (paging.hasNextPage && paging.pageSize !== paging.totalResultCount) {
      // Load all records for PowerPages application at once
      const firstColumn = columns[0] as Record;
      if (firstColumn?.attributes?.["SourceType"] !== undefined) {
        paging.setPageSize(paging.totalResultCount);
      }
      paging.loadNextPage();
    }

    return { dataSourceObj: recordsArray };
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
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
  }
}