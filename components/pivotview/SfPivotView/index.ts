import * as React from "react";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { SfPivotViewComponent } from "./SfPivotView";
import { ISfPivotView } from "./types";

export class SfPivotView implements ComponentFramework.ReactControl<IInputs, IOutputs> {
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

      const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
      const allocatedHeight = parseInt(context.mode.allocatedHeight as unknown as string);

      const pivotViewProps: ISfPivotView = {
        dataSource: context.parameters?.DataSource,
        width: allocatedWidth > 0 ? allocatedWidth + "px" : "auto",
        height: allocatedHeight > 0 ? allocatedHeight + "px" : "auto",
        pivotViewConfig: this.validateStringProperty(context.parameters?.PivotViewConfig),
        chartType: context.parameters?.ChartType?.raw,
        displayOptions: context.parameters?.DisplayOptions?.raw,
        showFieldList: this.validateBooleanProperty(context.parameters?.ShowFieldsList),
        allowCalculatedField: this.validateBooleanProperty(context.parameters?.AllowCalculatedField),
        allowDeferLayoutUpdate: this.validateBooleanProperty(context.parameters?.AllowDeferLayoutUpdate),
        allowDrillThrough: this.validateBooleanProperty(context.parameters?.AllowDrillThrough),
        allowGrouping: this.validateBooleanProperty(context.parameters?.AllowGrouping),
        enableFieldSearching: this.validateBooleanProperty(context.parameters?.EnableFieldSearching),
        enablePaging: this.validateBooleanProperty(context.parameters?.EnablePaging),
        enableRtl: this.context.userSettings.isRTL ?? false,
        enableValueSorting: this.validateBooleanProperty(context.parameters?.EnableValueSorting),
        showGroupingBar: this.validateBooleanProperty(context.parameters?.ShowGroupingbar),
        showToolbar: this.validateBooleanProperty(context.parameters?.ShowToolbar),
        showTooltip: this.validateBooleanProperty(context.parameters?.ShowTooltip),
        showValuesButton: this.validateBooleanProperty(context.parameters?.ShowValuesbutton),
        isTestHarness: this.isTestHarness,
        handleEventAction: this.handleEventAction
      };
      if (this.isTestHarness && !(allocatedHeight > 0)) {
        pivotViewProps.height = "600px";
      } else if (allocatedHeight < 0) {
        // In ModelDriven form, use the context Height if available and valid, otherwise default to 600px
        let height = context.parameters?.Height?.raw;
        pivotViewProps.height = height && height > 0 ? height + "px" : "600px";
      }
      return React.createElement(SfPivotViewComponent, pivotViewProps);
    } catch (error: any) {
      this.handleEventAction({ name: "onError", error: error });
      return React.createElement("div", null, "An error occurred while rendering the Pivot View.");
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