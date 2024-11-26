import { KanbanComponent, DialogEventArgs } from '@syncfusion/ej2-react-kanban';
import * as React from "react";
import { ISfKanban } from './types';
import "./styles/theme.css"

/**
 * Renders SfKanban component.
 *
 * @param {ISfKanban} props - The props for the Kanban component.
 * @returns {JSX.Element} - The rendered Kanban component.
 */
export const SfKanbanComponent: React.FC<ISfKanban> = React.memo((props: ISfKanban) => {

  const kanbanRef = React.useRef<KanbanComponent>(null);
  // It prevent to open a dialog on card double-click
  const dialogOpen = (args: DialogEventArgs): void => {
    args.cancel = true;
  }

  // Effect to refresh the Kanban when specific props are updated
  React.useEffect(() => {
    if (kanbanRef.current) {
      kanbanRef.current.refresh();
    }
  }, [props.keyField, props.cardHeight])

  return (
    <KanbanComponent
      ref={kanbanRef}
      width={props.width}
      height={props.height}
      dataSource={props.dataSource}
      enableRtl={props.enableRtl}
      enableTooltip={props.enableTooltip}
      cardHeight={props.cardHeight}
      cssClass={props.cssClass}
      keyField={props.keyField}
      allowDragAndDrop={false}
      cardSettings={props.kanbanConfig?.cardSettings ?? {}}
      columns={props.kanbanConfig?.columns?.map(column => ({
        headerText: column?.headerText,
        keyField: column?.keyField,
        allowToggle: column?.allowToggle,
        isExpanded: column?.isExpanded,
        showItemCount: column?.showItemCount
      }))}
      sortSettings={{
        direction: props.kanbanConfig?.sortSettings?.direction,
        field: props.kanbanConfig?.sortSettings?.field,
        sortBy: props.kanbanConfig?.sortSettings?.sortBy
      }}
      stackedHeaders={props.kanbanConfig?.stackedHeaders}
      swimlaneSettings={{
        enableFrozenRows: props.kanbanConfig?.swimlaneSettings?.enableFrozenRows,
        keyField: props.kanbanConfig?.swimlaneSettings?.keyField,
        showEmptyRow: props.kanbanConfig?.swimlaneSettings?.showEmptyRow,
        showItemCount: props.kanbanConfig?.swimlaneSettings?.showItemCount,
        showUnassignedRow: props.kanbanConfig?.swimlaneSettings?.showUnassignedRow,
        sortDirection: props.kanbanConfig?.swimlaneSettings?.sortDirection,
        textField: props.kanbanConfig?.swimlaneSettings?.textField
      }}
      dialogOpen={dialogOpen}
    >
    </KanbanComponent>
  );
});

SfKanbanComponent.displayName = "SfKanbanComponent";