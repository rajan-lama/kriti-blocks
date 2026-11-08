import { Button, TextControl } from '@wordpress/components';
import { trash } from '@wordpress/icons';
import { DragDropContext, Droppable, Draggable } from 'react-dnd';

export default function Repeater({
  items,
  setItems,
  fields,
  label = 'Add Item',
}) {
  // Add new item
  const addItem = () => {
    const newItem = {};
    fields.forEach((field) => {
      newItem[field.name] = '';
    });
    setItems([...items, newItem]);
  };

  // Remove item
  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Update field
  const updateField = (index, name, value) => {
    const newItems = [...items];
    newItems[index][name] = value;
    setItems(newItems);
  };

  // Drag & drop reorder
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reordered = Array.from(items);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    setItems(reordered);
  };

  return (
    <div className="repeater">
      <Button isPrimary onClick={addItem}>
        {label}
      </Button>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="repeater">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {items.map((item, index) => (
                <Draggable
                  key={index}
                  draggableId={index.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        border: '1px solid #ddd',
                        padding: '10px',
                        marginBottom: '10px',
                        background: '#fff',
                        ...provided.draggableProps.style,
                      }}
                    >
                      <div {...provided.dragHandleProps}>☰ Drag</div>

                      {fields.map((field) => (
                        <TextControl
                          key={field.name}
                          label={field.label}
                          value={item[field.name]}
                          onChange={(val) =>
                            updateField(index, field.name, val)
                          }
                        />
                      ))}

                      <Button
                        icon={trash}
                        isDestructive
                        onClick={() => removeItem(index)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
