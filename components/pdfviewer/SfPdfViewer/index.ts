import * as React from "react";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { SfPdfViewerComponent } from "./SfPdfViewer";
import { ISfPdfViewer } from "./types";

export class SfPdfViewer implements ComponentFramework.ReactControl<IInputs, IOutputs> {
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

            const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
            const allocatedHeight = parseInt(context.mode.allocatedHeight as unknown as string);

            const props: ISfPdfViewer = {
                documentPath: context.parameters.DocumentPath?.raw ?? "",
                enableToolbar: this.validateBooleanProperty(context.parameters.EnableToolbar),
                enableNavigationToolbar: this.validateBooleanProperty(context.parameters.EnableNavigationToolbar),
                enableBookmark: this.validateBooleanProperty(context.parameters.EnableBookmark),
                enableDownload: this.validateBooleanProperty(context.parameters.EnableDownload),
                enablePrint: this.validateBooleanProperty(context.parameters.EnablePrint),
                enableTextSearch: this.validateBooleanProperty(context.parameters.EnableTextSearch),
                enableTextSelection: this.validateBooleanProperty(context.parameters.EnableTextSelection),
                enableNavigation: this.validateBooleanProperty(context.parameters.EnableNavigation),
                enableMagnification: this.validateBooleanProperty(context.parameters.EnableMagnification),
                openThumbnailPane: this.validateBooleanProperty(context.parameters.OpenThumbnailPane),
                interactionMode: context.parameters.InteractionMode.raw,
                width: this.validateWholeNumberProperty(allocatedWidth, "100%"),
                height: this.validateWholeNumberProperty(allocatedHeight, this.isTestHarness || allocatedHeight < 0 ? "600px" : "100%")
            };
            return React.createElement(SfPdfViewerComponent, props);
        } catch (error) {
            console.error(error);
            return React.createElement("div", null, "An error occurred while rendering the Pdfviewer.");
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
     * If not in the test harness, triggers a notifyOutputChanged of PCF.
     * @param {any} eventArgs - The event arguments.
     */
    public handleEventAction = (eventArgs: any): void => {
        this.eventName = eventArgs.name;

        if (eventArgs.error) {
            this.onError = eventArgs.error;
        }

        if (!this.isTestHarness) {
            this.notifyOutputChanged();
        }
    }

    /**
     * Validates a property of whole number type and returns its value or a default value if not valid.
     * Ensures the number is greater than zero.
     * @param property - The property to validate.
     * @returns The validated property value or default value.
     */
    public validateWholeNumberProperty(property: ComponentFramework.PropertyTypes.WholeNumberProperty | number, defaultValue: number | string): number | string {
        if (typeof property === 'number') {
            return property > 0 ? property : defaultValue;
        }
        return property.raw && property.raw > 0 ? property.raw : defaultValue;
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
