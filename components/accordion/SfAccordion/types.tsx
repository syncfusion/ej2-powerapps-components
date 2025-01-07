import { AccordionAnimationSettingsModel, ExpandMode } from "@syncfusion/ej2-react-navigations";

/**
 * Specifies Accordion property interface.
 */
export interface ISfAccordion {
    width: string | number;
    height: string | number;
    items: Record[];
    accordionConfig: IAccordionConfig;
    enableRtl: boolean;
    expandMode: ExpandMode;
    renderNoDataSource: () => void;
    handleEventAction: (eventArgs: any, customErrorMessage?: string) => void;
}

export type DataSet = ComponentFramework.PropertyTypes.DataSet;

export interface IUserSettings extends ComponentFramework.UserSettings {
    locale: string;
}

export interface Record {
    [key: string]: NonNullable<unknown>;
}

/**
 * Represents the configuration options for the Accordion component.
 */
export interface IAccordionConfig {
    animation: AccordionAnimationSettingsModel;
    expandedIndices: number[];
}