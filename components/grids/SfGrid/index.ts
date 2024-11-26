import * as React from "react";
import { NoDataSource } from "./NoDataSource";
import { SfGridComponent } from "./SfGrid";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { ISfGrid } from "./types";

export class SfGrid implements ComponentFramework.ReactControl<IInputs, IOutputs> {
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
      const dataSource = context.parameters?.DataSource;
      const columns = context.parameters?.Columns;

      this.toggleDarkMode(this.validateBooleanProperty(context.parameters.EnableDarkMode) === true);
      const dataSourceLoaded = dataSource && !dataSource.loading && !dataSource.error;
      const columnsLoaded = columns && !columns.loading && !columns.error;

      // Check if DataSource or Columns are not loaded properly, or if DataSource has no records
      if (!dataSourceLoaded
        || (!dataSourceLoaded && !columnsLoaded)
        || (dataSourceLoaded && dataSource.paging.totalResultCount === 0)
      ) {
        return this.renderNoDataSource();
      }

      this.setPageSizeAndLoadNextPage(dataSource.paging);
      if (columns?.paging) {
        this.setPageSizeAndLoadNextPage(columns.paging);
      }

      const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
      const allocatedHeight = parseInt(context.mode.allocatedHeight as unknown as string);

      const props: ISfGrid = {
        dataSource: dataSource,
        columns: columns,
        width: allocatedWidth > 0 ? allocatedWidth : "auto",
        height: allocatedHeight > 0 ? allocatedHeight : "100%",
        primaryKey: context.parameters.PrimaryKey?.raw ?? "",
        rtl: context.userSettings.isRTL ?? false,
        enableAdaptiveUI: parseInt(context.client.getFormFactor() as unknown as string) === 3,
        allowEditing: this.validateBooleanProperty(context.parameters.AllowEditing),
        editMode: context.parameters.EditMode.raw,
        allowPaging: this.validateBooleanProperty(context.parameters.AllowPaging),
        pageSize: this.validateWholeNumberProperty(context.parameters.PageSize, 12),
        pageCount: this.validateWholeNumberProperty(context.parameters.PageCount, 8),
        allowSorting: this.validateBooleanProperty(context.parameters.AllowSorting),
        allowMultiSorting: this.validateBooleanProperty(context.parameters.AllowMultiSorting),
        allowGrouping: this.validateBooleanProperty(context.parameters.AllowGrouping),
        showGroupedColumn: this.validateBooleanProperty(context.parameters.ShowGroupedColumn),
        allowFiltering: this.validateBooleanProperty(context.parameters.AllowFiltering),
        gridLines: context.parameters.GridLines.raw,
        allowTextWrap: this.validateBooleanProperty(context.parameters.AllowTextWrap),
        allowResizing: this.validateBooleanProperty(context.parameters.AllowResizing),
        isTestHarness: this.isTestHarness,
        renderNoDataSource: this.renderNoDataSource,
        handleEventAction: this.handleEventAction
      };

      return React.createElement(SfGridComponent, props);
    } catch (error) {
      console.error(error);
      return React.createElement("div", null, "An error occurred while rendering the grid.");
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
   * If not in the test harness, triggers a notifyOutputChanged of PCF.
   * @param {any} eventArgs - The event arguments.
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
   * Validates a property of whole number type and returns its value or a default value if not valid.
   * Ensures the number is greater than zero.
   * @param property - The property to validate.
   * @param defaultValue - The default value to return if the property is not valid.
   * @returns The validated property value or the default value.
   */
  public validateWholeNumberProperty(property: ComponentFramework.PropertyTypes.WholeNumberProperty, defaultValue: number): number {
    return property.raw && typeof property.raw === 'number' && property.raw > 0 ? property.raw : defaultValue;
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
