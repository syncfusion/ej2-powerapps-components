import { SpreadsheetComponent, BeforeSaveEventArgs, getStartEvent } from "@syncfusion/ej2-react-spreadsheet";
import { formatUnit, EventHandler } from '@syncfusion/ej2-base';
import * as React from "react";
import { ISfSpreadsheet } from './types';

let isSpreadsheetCreated: boolean = false;
let resizing: boolean = false;
let refreshSpreadsheet: boolean = false;

/**
 * Renders SfSpreadsheetComponent component.
 *
 * @param {ISfSpreadsheet} props - The props for the Spreadsheet component.
 * @returns {JSX.Element} - The rendered Spreadsheet component.
 */
export const SfSpreadsheetComponent: React.FC<ISfSpreadsheet> = React.memo((props: ISfSpreadsheet) => {
  const spreadsheetRef = React.useRef<SpreadsheetComponent>(null);
  //check DataSource is added or not
  const noDataSource: boolean = props.dataSource.length === 0 || props.dataSource.every(item => item.name === 'val' && item.telephone1 === 'val');

  // Async function to fetch data for the spreadsheet, either from a URL or base64 string.
  const fetchData = async () => {
    if (noDataSource && props.documentPath != "" && props.allowOpen) {
      try {
        // Check if documentPath is a URL
        const isURL = props.documentPath.startsWith('http') || props.documentPath.startsWith('https') || props.documentPath.startsWith('appres');
        let spreadsheet = spreadsheetRef?.current;

        if (isURL) {
          // Fetch file from URL
          const response = await fetch(props.documentPath);
          const fileBlob = await response.blob();
          const file = new File([fileBlob], 'Sample.xlsx');

          // Open the spreadsheet with fetched file
          if (spreadsheet) {
            spreadsheet.open({ file });
          }
        } else {
          const base64 = props.documentPath;  // Assuming documentPath contains base64 string
          const byteCharacters = atob(base64);
          const byteNumbers = new Array(byteCharacters.length);

          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);
          const fileBlob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const file = new File([fileBlob], 'Sample.xlsx');

          // Open the spreadsheet with base64 file
          if (spreadsheet) {
            spreadsheet.open({ file });
          }
        }
      } catch (error) {
        console.error("Error fetching file Spreadsheet:", error);
      }
    }
  };

  // Effect to refresh the Spreadsheet when documentPath changes
  React.useEffect(() => {
    if (isSpreadsheetCreated && spreadsheetRef?.current) {
      // documentPath is empty then need to render empty work sheet
      if (props.documentPath === "") {
        spreadsheetRef.current?.refresh(true);
      }
      fetchData();
    }
  }, [props.documentPath]);

  // Effect to update the Spreadsheet's data source
  React.useEffect(() => {
    if (isSpreadsheetCreated && spreadsheetRef?.current) {
      if (!noDataSource) {
        updateDataSource();
      }
    }
  }, [props.dataSource]);

  // Effect to set layout properties and adjust the Spreadsheet's size when width or height changes
  React.useEffect(() => {
    if (isSpreadsheetCreated && spreadsheetRef?.current) {
      setLayoutProperties();
      performResize();
    }
  }, [props.width, props.height]);

  //  Effect to refresh the Spreadsheet when specific props are updated
  React.useEffect(() => {
    if (isSpreadsheetCreated && spreadsheetRef?.current) {
      spreadsheetRef.current.refresh();
      hideEditing();
    }
  }, [props.allowOpen, props.allowPrint, props.allowFiltering, props.allowSorting, props.selectionMode]);

  // Effect to control editing features visibility in the Spreadsheet when the showRibbon property changes
  React.useEffect(() => {
    if (isSpreadsheetCreated && spreadsheetRef?.current && props.showRibbon) {
      hideEditing();
    }
  }, [props.showRibbon]);

  // Function to update the Spreadsheet's data source, with handling for resizing events
  const updateDataSource = () => {
    if (resizing) {
      refreshSpreadsheet = true;
    } else {
      resizing = true;
      refreshSpreadsheet = false;
      const spreadsheet: any = spreadsheetRef?.current;
      spreadsheet.dataBound = () => {
        spreadsheet.dataBound = undefined;
        resizing = false;
        if (refreshSpreadsheet) {
          refreshSpreadsheet = false;
          updateDataSource();
        }
      };
      spreadsheet.sheets = [{ ranges: [{ dataSource: props.dataSource }] }];
      spreadsheet.dataBind();
    }
  };

  // Function to handle resizing the Spreadsheet component, with checks to prevent redundant resizing
  const performResize = () => {
    if (resizing) {
      refreshSpreadsheet = true;
    } else {
      resizing = true;
      refreshSpreadsheet = false;
      const spreadsheet: any = spreadsheetRef?.current;
      spreadsheet.dataBound = () => {
        spreadsheet.dataBound = undefined;
        resizing = false;
        if (refreshSpreadsheet) {
          refreshSpreadsheet = false;
          performResize();
        }
      };
      spreadsheet.resize();
    }
  };

  // Sets the layout properties of the spreadsheet component based on the provided height and width props.
  const setLayoutProperties = () => {
    const spreadsheet: any = spreadsheetRef?.current;
    if (props.height) {
      spreadsheet.element.style.height = formatUnit(props.height);
    }
    if (props.width) {
      spreadsheet.element.style.width = formatUnit(props.width);
    }
    spreadsheet.setProperties(
      {
        height: props.height,
        width: props.width,
      }, true);
  };

  /**
   * Hides specific editing options in the spreadsheet component by 
   * hiding ribbon tabs and toolbar items to limit user editing capabilities.
   */
  const hideEditing = () => {
    if (spreadsheetRef.current) {
      spreadsheetRef.current.hideRibbonTabs(['Formulas', 'Data', 'Insert']);
      spreadsheetRef.current.hideToolbarItems('Home', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 26, 27, 28, 29, 31]);
    }
  };

  // This function hides specific file menu items to restrict user access to certain features.
  const fileMenuBeforeOpen = () => {
    if (spreadsheetRef.current) {
      spreadsheetRef.current.hideFileMenuItems(['New']);
    }
  };

  // This function checks the vertical scale of the spreadsheet and adjusts the sheet panel size if the scale has changed.
  const mouseDownHandler = () => {
    const spreadsheet: any = spreadsheetRef?.current;
    if (spreadsheet) {
      const scaleY: number = spreadsheet.element.offsetHeight / spreadsheet.element.getBoundingClientRect().height;
      if (scaleY !== spreadsheet.viewport.scaleY) {
        spreadsheet.renderModule.setSheetPanelSize();
      }
    }
  };

  // This function adds the mouse down event listener to the sheet element
  const bindMouseDownEventHandler: () => void = () => {
    if (!props.isTestHarness) {
      const spreadsheet: any = spreadsheetRef?.current;
      if (spreadsheet) {
        const target: HTMLElement = spreadsheet.element.querySelector('.e-sheet');
        if (target) {
          EventHandler.add(target, getStartEvent(), mouseDownHandler, spreadsheet);
        }
      }
    }
  };

  /**
   * Handles the event when the spreadsheet component is created.
   * This function sets the layout properties, hides editing options, 
   * determines the appropriate update function based on the data source,
   * and triggers a resize of the spreadsheet.
   */
  const createdHandler = () => {
    const spreadsheet: any = spreadsheetRef?.current;
    spreadsheet.enableScaling = true;
    setLayoutProperties();
    hideEditing();
    let updateFnAfterResize: Function;
    if (noDataSource) {
      updateFnAfterResize = fetchData;
    } else {
      updateFnAfterResize = updateDataSource;
    }
    spreadsheet.dataBound = () => {
      spreadsheet.dataBound = undefined;
      isSpreadsheetCreated = true;
      updateFnAfterResize();
    };
    spreadsheet.resize();
  };

  // This function modifies the save behavior to perform a partial post instead of a full post.
  const beforeSaveHandler = (args: BeforeSaveEventArgs) => {
    args.isFullPost = false;
  };

  return (
    <SpreadsheetComponent
      ref={spreadsheetRef}
      openUrl={"https://services.syncfusion.com/react/production/api/spreadsheet/open"}
      saveUrl={"https://services.syncfusion.com/react/production/api/spreadsheet/save"}
      allowAutoFill={false}
      allowEditing={false}
      allowInsert={false}
      enableContextMenu={false}
      enableKeyboardShortcut={false}
      allowFindAndReplace={false}
      allowFiltering={props.allowFiltering}
      allowFreezePane={props.allowFreezePane}
      allowOpen={props.allowOpen}
      allowPrint={props.allowPrint}
      allowResizing={props.allowResizing}
      allowSave={props.allowSave}
      allowSorting={props.allowSorting}
      allowWrap={props.allowWrap}
      enableRtl={props.enableRtl}
      scrollSettings={{
        isFinite: true
      }}
      showAggregate={props.showAggregate}
      showFormulaBar={props.showFormulaBar}
      showRibbon={props.showRibbon}
      showSheetTabs={props.showSheetTabs}
      selectionSettings={{ mode: props.selectionMode }}
      created={createdHandler}
      fileMenuBeforeOpen={fileMenuBeforeOpen}
      beforeSave={beforeSaveHandler}
      beforeDataBound={bindMouseDownEventHandler}
    >
    </SpreadsheetComponent>
  );
});

SfSpreadsheetComponent.displayName = "SfSpreadsheetComponent";
