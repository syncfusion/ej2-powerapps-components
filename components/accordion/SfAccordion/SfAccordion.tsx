import { AccordionComponent } from "@syncfusion/ej2-react-navigations";
import * as React from "react";
import "./styles/theme.css";
import { ISfAccordion } from "./types";

/**
 * Renders SfAccordion component.
 *
 * @param {ISfAccordion} props - The props for the Accordion component.
 * @returns {JSX.Element} - The rendered Accordion component.
 */
export const SfAccordionComponent: React.FC<ISfAccordion> = React.memo((props: ISfAccordion) => {

  const accordionRef = React.useRef<AccordionComponent>(null);

  return (
    <>
      {props.items.length > 0 && (
        <AccordionComponent
          ref={accordionRef}
          width={props.width}
          height={props.height}
          enableRtl={props.enableRtl}
          items={props.items}
          expandMode={props.expandMode}
          animation={{
            expand: props.accordionConfig?.animation?.expand,
            collapse: props.accordionConfig?.animation?.collapse
          }}
          expandedIndices={props.accordionConfig?.expandedIndices || []}
        >
        </AccordionComponent>
      )}
      {props.items.length === 0 && (props.renderNoDataSource())}
    </>
  );
});

SfAccordionComponent.displayName = "SfAccordionComponent";