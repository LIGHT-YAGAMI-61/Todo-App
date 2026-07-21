import { useState } from "react";
import TodoItem from "./TodoItem";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import { AnimatePresence } from "framer-motion";

function TodoList({ todos, onDelete, onEdit , onToggle , onReorder , filter }) {
    
    const [editingIndex , setEditingIndex ] = useState(null) ; 
    const [editText , setEditText ] = useState("") ; 

      const filteredTodos = todos.filter(todo => {
        if ( filter === "active" ) return !todo.completed ; 
        if ( filter === "completd" ) return todo.completd ; 
        return true ; 
      })

              const getItemStyle = (style, snapshot) => {
            if (!style) return {};

            return {
              ...style,
              transform: snapshot.isDragging
                ? style.transform?.replace(/translate\(([^,]+),/, "translate(0,")
                : style.transform,
            };
          };

  return (
    <DragDropContext 
            onDragEnd={(result) => {
          if (!result.destination) return;

          const sourceIndex = result.source.index;
          const destIndex = result.destination.index;

          const visibleTodos = filteredTodos;

          const movedItem = visibleTodos[sourceIndex];

          const newTodos = [...todos];

          // remove from original list
          const oldIndex = newTodos.findIndex(t => t.id === movedItem.id);
          newTodos.splice(oldIndex, 1);

          // insert at new position (based on visible list)
          const targetId = visibleTodos[destIndex]?.id;
          const newIndex = targetId
            ? newTodos.findIndex(t => t.id === targetId)
            : newTodos.length;

          newTodos.splice(newIndex, 0, movedItem);

          onReorder(newTodos);
        }}
    >

    
    <Droppable droppableId= "todos" > 
    {(provided) => (
      <ul 
      {...provided.droppableProps}
      ref={provided.innerRef} 
      >

                {todos.length === 0 && (
          <p className="text-center text-gray-400 mt-4">
            No todos yet. Add something 🚀
          </p>
        )}

      
        {filteredTodos.map((todo , index) => (
          <Draggable
          key={todo.id} 
          draggableId={String(todo.id)}
          index={index} 
          >
            {(provided , snapshot) => (
              <AnimatePresence>
              <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
             style={{
                  ...getItemStyle(provided.draggableProps.style, snapshot),
                }}
              className={` w-full transition-all  duration-200 ${
                snapshot.isDragging
                ? "bg-gray-600  shadow-2xl"
                : ""
              }` }
              >
                
                <TodoItem 
                todo={todo}
                index={index}
                editingIndex={editingIndex}
                setEditingIndex={setEditingIndex}
                editText={editText} 
                setEditText={setEditText}
                onDelete={onDelete} 
                onEdit={onEdit} 
                onToggle={onToggle}
                />
              </div>
              </AnimatePresence>
            )}
            
          </Draggable>
        ))}
        
        {provided.placeholder}
      </ul>
    )}
    
      </Droppable>
    </DragDropContext>
  );
}

export default TodoList;