import * as React from "react";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { SfRichTextEditorComponent } from "./SfRichTextEditor";
import { ISfRichTextEditor } from "./types";
import { isNullOrUndefined } from "@syncfusion/ej2-base";

export class SfRichTextEditor implements ComponentFramework.ReactControl<IInputs, IOutputs> {
  private context: ComponentFramework.Context<IInputs>;
  private notifyOutputChanged: () => void;
  private OnError: string;
  private eventName: string;
  private rteValue: string;
  private isTestHarness = false;
  private config = {
    "iframeSettings": {
      "enable": false
    },
    "inlineMode": {
      "enable": false
    },
    "insertImageSettings": {
      "saveFormat": "Base64"
    },
    "pasteCleanupSettings": {
      "prompt": true
    },
    "fontFamily": {
      "default": "Segoe UI"
    },
    "fontSize": {
      "default": "10pt"
    },
    "toolbarSettings": {
      "enable": true,
      "items": [
        "Undo", "Redo", "|",
        "Bold", "Italic", "Underline", "StrikeThrough", "SuperScript", "SubScript", "|",
        "FontName", "FontSize", "FontColor", "BackgroundColor", "|",
        "LowerCase", "UpperCase", "|",
        "Blockquote", "|",
        "Outdent", "Indent", "|",
        "OrderedList", "UnorderedList", "|",
        "CreateLink", "Image", "CreateTable", "|",
        "SourceCode", "EmojiPicker", "Print", "FullScreen"
      ]
    },
    "quickToolbarSettings": {
      "actionOn": ["Selection", "Link", "Image", "Table"],
      "link": ["Open", "Edit", "UnLink"],
      "audio": ["AudioReplace", "AudioRemove", "AudioLayoutOption"],
      "video": ["VideoReplace", "VideoAlign", "VideoRemove", "VideoLayoutOption", "VideoDimension"],
      "image": ["Replace", "Align", "Caption", "Remove", "InsertLink"],
      "table": ["TableHeader", "TableRows", "TableColumns", "BackgroundColor", "-", "TableRemove", "Alignments", "TableCellVerticalAlign", "Styles"]
    },
    "numberFormatList": {
      "types": [
        { "text": "None", "value": "none" },
        { "text": "Number", "value": "decimal" },
        { "text": "Lower Greek", "value": "lowerGreek" },
        { "text": "Lower Roman", "value": "lowerRoman" },
        { "text": "Upper Alpha", "value": "upperAlpha" },
        { "text": "Lower Alpha", "value": "lowerAlpha" },
        { "text": "Upper Roman", "value": "upperRoman" }
      ]
    },
    "bulletFormatList": {
      "types": [
        { "text": "None", "value": "none" },
        { "text": "Disc", "value": "disc" },
        { "text": "Circle", "value": "circle" },
        { "text": "Square", "value": "square" }
      ]
    },
    "tableSettings": {
      "width": "100%",
      "resize": true,
      "minWidth": "100px",
      "maxWidth": "100%"
    }
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
    this.isTestHarness = document.getElementById('control-dimensions') !== null;
    this.notifyOutputChanged = notifyOutputChanged;
    context.mode.trackContainerResize(true);
    this.context = context;
    notifyOutputChanged();
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

      const props: ISfRichTextEditor = {
        width: allocatedWidth > 0 ? allocatedWidth + "px" : (this.isTestHarness ? "95%" : "100%"),
        height: allocatedHeight > 0 ? allocatedHeight + "px" : "auto",
        enableRtl: this.context.userSettings.isRTL ?? false,
        value: this.validateStringProperty(context.parameters.Value),
        rteConfig: this.getJSONFromString(context.parameters.RTEConfig),
        cssClass: this.validateStringProperty(context.parameters.CssClass) || undefined,
        maxLength: this.validateWholeNumberProperty(context.parameters.MaxLength),
        placeholder: this.validateStringProperty(context.parameters.Placeholder),
        enterKey: context.parameters?.EnterKey?.raw,
        showCharCount: this.validateBooleanProperty(context.parameters?.ShowCharCount),
        enableResize: this.validateBooleanProperty(context.parameters?.EnableResize),
        enableXhtml: this.validateBooleanProperty(context.parameters?.EnableXhtml),
        enabled: this.validateBooleanProperty(context.parameters?.Enabled),
        handleEventAction: this.handleEventAction
      };

      return React.createElement(SfRichTextEditorComponent, props);
    } catch (error: any) {
      console.error(error);
      return React.createElement("div", null, "Error at UpdateView: " + error.message);
    }
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

    if (!isNullOrUndefined(this.rteValue)) {
      outputs.Value = this.rteValue ? this.rteValue : "";
      this.rteValue = "";
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

    // Update the value property if the change event is triggered.
    if (eventArgs.name === "change") {
      this.rteValue = eventArgs.value || "";
    }

    this.notifyOutputChanged();
  };

  /**
   * Gets the JSON object from a string property.
   * @param jsonString - The JSON string property.
   * @returns The JSON object or the default RTE configuration.
   */
  public getJSONFromString = (jsonString: ComponentFramework.PropertyTypes.StringProperty) => {
    try {
      const json = this.validateStringProperty(jsonString);
      return json ? JSON.parse(json) : this.config;
    } catch (error: any) {
      this.handleEventAction({ name: "onError", error: error }, "getJSONFromString");
    }
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
   * Validates a property of whole number type and returns its value or a default value if not valid.
   * Ensures the number is greater than zero.
   * @param property - The property to validate.
   * @returns The validated property value or undefined.
   */
  public validateWholeNumberProperty(property: ComponentFramework.PropertyTypes.WholeNumberProperty): number | undefined {
    return property?.raw && property?.raw > 0 ? property.raw : -1;
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
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void { }
}
