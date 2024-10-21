# Syncfusion PowerApps Schedule Code Component API Reference

Below are the list of public APIs available in Schedule PowerApps code component.

## Properties

### DataSource (DataSet)

Defines the data source for the Schedule code component. It specifies the `dataset` that the Schedule retrieves its data.

### ScheduleConfig (SingleLine.Text)

The configuration settings for the Schedule code component in JSON format. It specifies the `scheduleConfig` of the Schedule. The following properties are available in the `scheduleConfig` object.

- `workDays`: Specifies the working days of the week.
- `workHours`: Specifies the working hours of the day.
- `timeScale`: Specifies the time scale for the Schedule.
- `views`: Specifies the views of the Schedule.
- `group`: Specifies the group of the Schedule.
- `headerRows`: Specifies the header rows of the Schedule.
- `resources`: Specifies the resources of the Schedule.
- `eventSettings`: Specifies the event settings of the Schedule.

> [!NOTE]
> The `scheduleConfig` property is not mandatory. If you want to customize the Schedule code component, you can use this property to set the configuration settings. Use the JSON format to set the configuration. Checkout the [Schedule documentation](https://ej2.syncfusion.com/react/documentation/schedule/getting-started) for more details on the configuration settings.

### CurrentView (Enum)

To set the active view on the scheduler, use the currentView property which initially loads the specified view option. Possible values are `Day`, `Week`, `WorkWeek`, `Month`, `Agenda`, `MonthAgenda`, `TimelineDay`, `TimelineWeek`, `TimelineWorkWeek`, `TimelineMonth`.

Default value is `Week`.

### FirstDayOfWeek (Enum)

The firstDayOfWeek property allows you to set the first day of the week in the Schedule. Possible values are `Sunday`, `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`.

Default value is `Sunday`.

### SelectedDate (DateTime)

The selectedDate property in the Schedule marks the active date, typically defaulting to the current system date.

Default value is `""`.

### TimeZone (SingleLine.Text)

Assigning specific timezones to schedules ensures accurate event display; initially processed with the system timezone, it's advisable to set a specific timezone when binding to remote data services for consistent event timing, accepting valid [IANA](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) timezone names.

Default value is `""`.

### MinDate (SingleLine.Text)

The minDate property restricts the Schedule from rendering events before the specified date.

Default value is `"1900/01/01"`.

### MaxDate (SingleLine.Text)

The maxDate property restricts the Schedule from rendering events after the specified date.

Default value is `"2099/12/31"`.

### TimeFormat (SingleLine.Text)

The timeFormat property allows you to set the time format in the Schedule.

Default value is `""`.

### DateFormat (SingleLine.Text)

The dateFormat property allows you to set the date format in the Schedule.

Default value is `""`.

### StartHour (SingleLine.Text)

The startHour property allows you to set the start hour in the Schedule.

Default value is `"00:00"`.

### EndHour (SingleLine.Text)

The endHour property allows you to set the end hour in the Schedule.

Default value is `"24:00"`.

### ShowQuickInfo (TwoOptions)

The quick popup with cell or event details appears on single click, defaulting to 'true'.

Default value is `true`.

### ShowHeaderBar (TwoOptions)

When set to false, hides the Schedule's header bar from the UI, which typically includes date and view navigation options, allowing users to add custom items.

Default value is `true`.

### ShowWeekend (TwoOptions)

The showWeekend property allows you to show or hide the weekends in the Schedule.

Default value is `true`.

### ShowWeekNumber (TwoOptions)

The showWeekNumber property allows you to show or hide the week number in the Schedule.

Default value is `false`.

### ShowTimeIndicator (TwoOptions)

The showTimeIndicator property allows you to show or hide the current time indicator in the Schedule.

Default value is `false`.

### RowAutoHeight (TwoOptions)

The rowAutoHeight property allows the Schedule to automatically adjust the row height based on the event count.

Default value is `false`.

### Event Name (SingleLine.Text)

Defines the event name for the Schedule code component. It specifies the `event` of the Schedule. Possible value is `onError`.

### OnError (SingleLine.Text)

Outputs error message when onError is triggered. Use below PowerFx code in the **onChange** property to notify the error message in the canvas application.

```
If(
    Self.EventName="onError",
    Notify(Self.OnError, NotificationType.Error)
)
```
