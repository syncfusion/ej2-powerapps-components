import * as React from 'react';

interface INoConfigData {
  resources: ComponentFramework.Resources;
}

/**
 * Represents NoConfigData component that is rendered when there is GanttConfig data not available.
 */
export const NoConfigData: React.FC<INoConfigData> = React.memo((props: INoConfigData) => {
  let message = props.resources.getString("NoConfigData_Message");
  return (
    <div id='NoConfigData'>
      <img src="https://ej2.syncfusion.com/react/demos/src/grid/images/emptyRecordTemplate.svg" alt="No Config Data" />
      <h3>{message}</h3>
    </div>
  );
});

NoConfigData.displayName = 'NoConfigData';
