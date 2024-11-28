import {
  Agenda,
  Day,
  Inject,
  Month,
  MonthAgenda,
  ScheduleComponent,
  TimelineMonth,
  TimelineViews,
  TimelineYear,
  Week,
  WorkWeek,
  Year,
  resetTime
} from "@syncfusion/ej2-react-schedule";
import * as React from "react";
import "./styles/theme.css";
import { ISfSchedule } from "./types";

/**
 * Represents the SfScheduleComponent component.
 *
 * @param {ISfSchedule} props - The props for the Schedule component.
 * @returns {JSX.Element} - The rendered Schedule component.
 */
export const SfScheduleComponent: React.FC<ISfSchedule> = React.memo((props) => {
  const scheduleRef = React.useRef<ScheduleComponent>(null);

  React.useEffect(() => {
    if (scheduleRef.current) scheduleRef.current.refresh();
  }, [props.width, props.height, props.timeFormat, props.dateFormat]);

  return (
    <div className={props.enableAdaptiveUI ? "e-bigger" : ""}>
      <ScheduleComponent
        ref={scheduleRef}
        readonly={true}
        enableRtl={props.enableRtl}
        enableAdaptiveUI={props.enableAdaptiveUI}
        width={props.width}
        height={props.height}
        selectedDate={resetTime(props.selectedDate)}
        currentView={props.currentView}
        timezone={props.timeZone}
        minDate={props.minDate}
        maxDate={props.maxDate}
        timeFormat={props.timeFormat}
        dateFormat={props.dateFormat}
        startHour={props.startHour}
        endHour={props.endHour}
        firstDayOfWeek={props.firstDayOfWeek}
        showQuickInfo={props.showQuickInfo}
        showHeaderBar={props.showHeaderBar}
        showWeekend={props.showWeekend}
        showWeekNumber={props.showWeekNumber}
        showTimeIndicator={props.showTimeIndicator}
        rowAutoHeight={props.rowAutoHeight}
        views={props.scheduleConfig?.views}
        group={props.scheduleConfig?.group}
        workDays={props.scheduleConfig?.workDays}
        workHours={props.scheduleConfig?.workHours}
        timeScale={props.scheduleConfig?.timeScale}
        resources={props.scheduleConfig?.resources}
        headerRows={props.scheduleConfig?.headerRows}
        eventSettings={{
          ...props.scheduleConfig?.eventSettings,
          dataSource: props.dataSource
        }}
      >
        <Inject
          services={[
            Day,
            Week,
            WorkWeek,
            Month,
            Year,
            Agenda,
            MonthAgenda,
            TimelineMonth,
            TimelineYear,
            TimelineViews
          ]}
        />
      </ScheduleComponent>
    </div>
  );
});

SfScheduleComponent.displayName = "SfScheduleComponent";
