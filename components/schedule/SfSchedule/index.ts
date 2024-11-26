import * as React from "react";
import { SfScheduleComponent } from "./SfSchedule";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { DataSet, IScheduleConfig, ISfSchedule, Record } from "./types";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import { timezoneData } from "@syncfusion/ej2-react-schedule";

export class SfSchedule implements ComponentFramework.ReactControl<IInputs, IOutputs> {
  private context: ComponentFramework.Context<IInputs>;
  private notifyOutputChanged: () => void;
  private isTestHarness: boolean;
  private OnError: string;
  private eventName: string;
  private defaultScheduleConfig: IScheduleConfig = {
    workHours: { start: '09:00', end: '18:00' },
    workDays: [1, 2, 3, 4, 5],
    timeScale: {},
    views: ["Day", "Week", "WorkWeek", "Month", "Agenda"],
    group: { resources: [] },
    headerRows: [],
    resources: [],
    eventSettings: {}
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

      this.toggleDarkMode(this.validateBooleanProperty(context.parameters.EnableDarkMode) === true);
      const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
      const allocatedHeight = parseInt(context.mode.allocatedHeight as unknown as string);

      const scheduleProps: ISfSchedule = {
        dataSource: this.getScheduleData(context.parameters?.DataSource),
        width: allocatedWidth > 0 ? allocatedWidth + "px" : "auto",
        height: allocatedHeight > 0 ? allocatedHeight + "px" : "auto",
        enableRtl: context.userSettings.isRTL ?? false,
        enableAdaptiveUI: parseInt(context.client.getFormFactor() as unknown as string) === 3,
        scheduleConfig: this.parseJSONConfig(context.parameters?.ScheduleConfig) as IScheduleConfig,
        currentView: context.parameters?.CurrentView.raw,
        firstDayOfWeek: parseInt(context.parameters?.FirstDayOfWeek.raw as unknown as string),
        selectedDate: this.validateAndParseDate(context.parameters?.SelectedDate),
        timeZone: this.validateTimeZone(this.validateStringProperty(context.parameters.TimeZone)),
        minDate: this.validateAndParseDate(context.parameters?.MinDate),
        maxDate: this.validateAndParseDate(context.parameters?.MaxDate),
        timeFormat: this.validateStringProperty(context.parameters?.TimeFormat),
        dateFormat: this.validateStringProperty(context.parameters?.DateFormat),
        startHour: this.validateStringProperty(context.parameters?.StartHour),
        endHour: this.validateStringProperty(context.parameters?.EndHour),
        showQuickInfo: this.validateBooleanProperty(context.parameters?.ShowQuickInfo),
        showHeaderBar: this.validateBooleanProperty(context.parameters?.showHeaderBar),
        showWeekend: this.validateBooleanProperty(context.parameters?.ShowWeekend),
        showWeekNumber: this.validateBooleanProperty(context.parameters?.ShowWeekNumber),
        showTimeIndicator: this.validateBooleanProperty(context.parameters?.ShowTimeIndicator),
        rowAutoHeight: this.validateBooleanProperty(context.parameters?.RowAutoHeight),
        isTestHarness: this.isTestHarness,
        handleEventAction: this.handleEventAction
      };
      return React.createElement(SfScheduleComponent, scheduleProps);
    } catch (error: any) {
      this.handleEventAction({ name: "onError", error: error });
      return React.createElement("div", null, "An error occurred while rendering the schedule.");
    }
  }

  /**
   * Retrieves the schedule data from the provided dataSource.
   * 
   * @param dataSource - The DataSet containing the schedule data.
   * @returns An array of Record objects representing the schedule data, or undefined if the dataSource is invalid or loading.
   */
  private getScheduleData = (dataSource: DataSet): Record[] | undefined => {
    if (!dataSource || dataSource.loading) return;

    const { columns, paging, sortedRecordIds, records } = dataSource;
    let isModelDriven: boolean = false;
    if (!columns || !sortedRecordIds || !records) return;

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

    return returnData.length > 0 ? returnData : undefined;
  };

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
   * Validates and parses a string property into a Date object.
   * If the property is empty, equals "val", or is an invalid date string, returns the current date.
   * If the property is a valid date string, parses and returns it as a Date object.
   *
   * @param property - The string property to validate and parse.
   * @returns A Date object representing the parsed date.
   */
  public validateAndParseDate(property: ComponentFramework.PropertyTypes.StringProperty): Date {
    const dateRegex = /^\d{4}[-/]\d{2}[-/]\d{2}$/;
    if (!property || !property.raw || property.raw === "val" || !dateRegex.test(property.raw))
      return new Date();
    const parsedDate = new Date(property.raw);
    return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  }

  public validateTimeZone = (timeZone: string | undefined): string | undefined => {
    if (timeZone && timezoneData.length > 0) {
      const tz = timeZone.trim().toLocaleLowerCase();
      return timezoneData.find((data) => data.Value.toLocaleLowerCase() === tz)?.Value;
    }
    return undefined;
  }

  /**
   * Parses a JSON string and returns the parsed JSON object.
   * If the JSON string is invalid, it handles the error by invoking the "onError" event.
   * @param jsonString - The JSON string to parse.
   * @returns The parsed JSON object, or an empty object if the JSON string is empty or invalid.
   */
  public parseJSONConfig = (jsonString: ComponentFramework.PropertyTypes.StringProperty): IScheduleConfig | undefined => {
    try {
      const json = this.validateStringProperty(jsonString);
      return json ? JSON.parse(json) : this.defaultScheduleConfig;
    } catch (error: any) {
      this.handleEventAction({ name: "onError", error: error }, "parseJSONConfig");
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
  public destroy(): void { }
}
