import { Draggable, Panel, PanelBody } from '@wordpress/components';
import { Icon, more } from '@wordpress/icons';

const MyDraggable = ({ onDragStart, onDragEnd }) => (
  <div id="draggable-panel">
    <Panel header="Draggable panel">
      <PanelBody>
        <Draggable
          elementId="draggable-panel"
          transferData={{}}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          {({ onDraggableStart, onDraggableEnd }) => (
            <div
              className="example-drag-handle"
              draggable
              onDragStart={onDraggableStart}
              onDragEnd={onDraggableEnd}
            >
              <Icon icon={more} />
            </div>
          )}
        </Draggable>
      </PanelBody>
    </Panel>
  </div>
);
export default MyDraggable;
