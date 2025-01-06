import { isNullOrUndefined } from "@syncfusion/ej2-base";
import * as React from "react";
import { NoDataSource } from "./NoDataSource";
import { SfAccordionComponent } from "./SfAccordion";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import {
    DataSet,
    IAccordionConfig,
    ISfAccordion,
    Record
} from "./types";

export class SfAccordion implements ComponentFramework.ReactControl<IInputs, IOutputs> {
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
            const items = context.parameters?.Items;
            const isItemsReady = items && !items.loading && !items.error;
            this.toggleDarkMode(this.validateBooleanProperty(context.parameters.EnableDarkMode) === true);

            // Show the NoDataSource component when the items is not available, loading, or has an error or when the total record count is zero.
            // Also, show the NoDataSource component when the first record name is "val" to prevent the control from rendering with invalid data.
            if (isItemsReady && items.paging.totalResultCount === 0 ||
                (this.isTestHarness && items.records[items.sortedRecordIds[0]].getValue("name") === "val")
            ) { return this.renderNoDataSource(); }

            this.setPageSizeAndLoadNextPage(items?.paging);
            const accordionConfig = this.parseJSONConfig(context.parameters.AccordionConfig);
            const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
            const allocatedHeight = parseInt(context.mode.allocatedHeight as unknown as string);

            const props: ISfAccordion = {
                items: this.fetchItemsData(items),
                width: allocatedWidth > 0 ? allocatedWidth + "px" : "100%",
                height: allocatedHeight > 0 ? allocatedHeight + "px" : "auto",
                enableRtl: this.context.userSettings.isRTL ?? false,
                accordionConfig: accordionConfig as IAccordionConfig,
                expandMode: context.parameters.ExpandMode.raw,
                renderNoDataSource: this.renderNoDataSource,
                handleEventAction: this.handleEventAction
            };

            return React.createElement(SfAccordionComponent, props);
        } catch (error: any) {
            this.handleEventAction({ name: "onError", error: error }, "updateView");
            return this.renderNoDataSource();
        }
    }

    /**
     * Fetches the items records and returns them as an array of records.
     * @param items - The items containing the records and fields.
     * @returns The items records as an array of records.
     */
    public fetchItemsData(items: DataSet): any {
        const { columns, sortedRecordIds, records } = items;
        const recordsArray: Record[] = [];
        const isModelDriven = !isNullOrUndefined(columns[0]?.["isPrimary"]) && !this.isTestHarness;

        sortedRecordIds.forEach((id) => {
            const record: Record = {};
            const recordData = records[id];

            columns.forEach((column: any) => {
                if (isNullOrUndefined(column.displayName) || column.dataType.includes("multiselectpicklist")) return;
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
        // Check if recordsArray has an "Id", "ID", or "id" key
        const hasIdColumn = recordsArray.some(obj =>
            Object.keys(obj).some(key => key.toLowerCase() === "id")
        );

        // If an "Id" column exists, sort the array by "Id", "ID", or "id"
        if (hasIdColumn) {
            recordsArray.sort((a, b) => {
                const firstID = Object.keys(a).find(key => key.toLowerCase() === "id");
                const secondID = Object.keys(b).find(key => key.toLowerCase() === "id");

                if (!firstID || !secondID) return 0; // Skip sorting if keys are missing
                return Number(a[firstID]) - Number(b[secondID]);
            });
        }
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
     * Validates a string property.
     * @param property - The string property to validate.
     * @returns The validated string value.
     */
    public validateStringProperty(property: ComponentFramework.PropertyTypes.StringProperty): string {
        return property && property.raw && property.raw !== "val" ? property.raw : "";
    }

    /**
     * Renders the NoDataSource component when items is not available, loading, or has an error,
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