import * as React from "react";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { SfChartComponent } from "./SfChart";
import { ISfChart, Record } from "./types";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class SfChart implements ComponentFramework.ReactControl<IInputs, IOutputs> {
  private context: ComponentFramework.Context<IInputs>;
  private notifyOutputChanged: () => void;
  private isTestHarness: boolean;
  private OnError: string;
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
    this.isTestHarness = document.getElementById('control-dimensions') !== null;
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
      let { columns } = context.parameters.DataSource;

      const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
      const allocatedHeight = parseInt(context.mode.allocatedHeight as unknown as string);

      const props: ISfChart = {
        dataSource: this.getChartData(context.parameters?.DataSource),
        width: allocatedWidth > 0 ? allocatedWidth + "px" : "100%",
        height: allocatedHeight > 0 ? allocatedHeight + "px" : "100%",
        enableDarkMode: this.validateBooleanProperty(context.parameters?.EnableDarkMode),
        rtl: this.context.userSettings.isRTL ?? false,
        series: this.parseJSONConfig(context.parameters?.Series),
        seriesType: context.parameters?.SeriesType?.raw,
        title: this.validateStringProperty(context.parameters?.Title),
        primaryXAxisType: context.parameters?.PrimaryXAxisType?.raw,
        enableLegendVisibility: this.validateBooleanProperty(context.parameters?.EnableLegendVisibility),
        enableMouseWheelZooming: this.validateBooleanProperty(context.parameters?.EnableMouseWheelZooming),
        enablePinchZooming: this.validateBooleanProperty(context.parameters?.EnablePinchZooming),
        enableSelectionZooming: this.validateBooleanProperty(context.parameters?.EnableSelectionZooming),
        enableCrosshair: this.validateBooleanProperty(context.parameters?.EnableCrosshair),
        enableCrosshairTooltip: this.validateBooleanProperty(context.parameters?.EnableCrosshairTooltip),
        enableTooltip: this.validateBooleanProperty(context.parameters?.EnableTooltip),
        isTestHarness: this.isTestHarness,
        handleEventAction: this.handleEventAction
      };

      // Set the height to Height property from XMl or 450px if the chart is rendered in Model-Driven Apps without label case.
      if (columns.length > 0 && !isNullOrUndefined(columns[0]["isPrimary"]) && !this.isTestHarness && allocatedHeight < 0) {
        let height = context.parameters?.Height?.raw;
        props.height = height && height > 0 ? height + "px" : "450px";
      }

      return React.createElement(SfChartComponent, props);
    } catch (error: any) {
      console.error(error);
      return React.createElement("div", null, "Error at UpdateView: " + error.message);
    }
  }

  /**
   * Returns the chart data based on the dataset.
   * @param dataSource - The dataset.
   * @returns The chart data
   * @remarks
   * This method is used to map the dataset records to the schedule data. It also loads all records for PowerPages application at once.
   */
  public getChartData(dataSource: DataSet): Record[] | [] {
    if (!dataSource || dataSource.loading) return [];

    const { columns, paging, sortedRecordIds, records } = dataSource;
    let isModelDriven: boolean = false;
    if (!columns || !sortedRecordIds || !records) return [];

    // Map the dataset records to the schedule data
    const returnData = sortedRecordIds.map((id) => {
      const record: Record = {};
      columns.forEach((column: Record) => {
        if (isNullOrUndefined(column.displayName) || column.dataType.includes("multiselectpicklist")) return;

        isModelDriven = !isNullOrUndefined(column["isPrimary"]) && !this.isTestHarness;
        if (isModelDriven && column.dataType === "TwoOptions") {
          record[column.displayName] = Boolean(parseInt(records[id].getValue(column.alias) as string));
          return;
        } else if (column.dataType.includes("DateAndTime")) {
          record[column.displayName] = new Date(records[id].getValue(column.alias) as string);
        } else {
          record[column.displayName] = records[id].getValue(column.alias);
        }
      });
      return record;
    });

    if (paging.hasNextPage && paging.pageSize !== paging.totalResultCount) {
      // Load all records for PowerPages application at once
      if (!isNullOrUndefined((columns[0] as Record)?.["attributes"]?.["SourceType"]))
        paging.setPageSize(paging.totalResultCount);
      paging.loadNextPage();
    }

    return returnData.length > 0 ? returnData : [];
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
    let error = eventArgs.error;

    if ((eventArgs.name === "onError" && error.message) || customErrorMessage) {
      console.error("Error: ", error);
      this.OnError = error.message
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
  public parseJSONConfig = (jsonString: ComponentFramework.PropertyTypes.StringProperty) => {
    try {
      const json = this.validateStringProperty(jsonString);
      return json ? JSON.parse(json) : {};
    } catch (error: any) {
      this.handleEventAction({ name: "onError", error: error }, "parseJSONConfig");
    }
  };

  /**
   * Validates a string property.
   * @param property - The string property to validate.
   * @returns The validated string value.
   */
  public validateStringProperty(property: ComponentFramework.PropertyTypes.StringProperty): string {
    return property && property.raw && property.raw !== "val" ? property.raw : "";
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
  public destroy(): void { }
}
