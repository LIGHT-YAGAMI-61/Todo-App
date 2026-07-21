console.log("THIS FILE IS RUNNING");

import { motion } from "framer-motion";


function formatDate(dateString) {
  const taskDate = new Date(dateString) ; 
  const now = new Date() ; 

  const diffTime = taskDate.setHours(0 , 0 , 0 , 0) - now.setHours(0 , 0 , 0 ,0) ;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) ; 

  if( diffDays === 0 ) return "Today" ; 
  if ( diffDays === 1) return "Tommorrow" ; 
  if ( diffDays === -1 ) return "Yesterday" ; 

  if ( diffDays < 0 ) return `${Math.abs(diffDays)}d ago` ; 
  if ( diffDays > 0 && diffDays <= 7) return `In ${diffDays}d` ; 
  
  return taskDate.toLocaleDateString("en-US" , {
    month : "short" , 
    day : "numeric" ,  
  }) ; 
}


function TodoItem({ todo, index, onDelete, onEdit , onToggle , editText , editingIndex , setEditText , setEditingIndex }) {
     console.log(todo);


     const CATEGORY_COLORS = {
                        work: "#3b82f6",
                        personal: "#a855f7",
                        health: "#22c55e",
                        study: "#f59e0b",
                      };

      const isOverdue = (date) => {
          if (!date) return false;
          return new Date(date) < new Date();
        };



          return (

   <li>
   <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        whileHover={{ scale: 1.02 }}
        style={{
          borderLeft: `3px solid ${
            CATEGORY_COLORS[todo.category?.toLowerCase()] || "#3b82f6" 
          }`
        }}

        className="group flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-xl mb-2 hover:bg-white/10 hover:scale-[1.01] transition"
      >

        {/* CHECKBOX */}
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(index)}
          className="cursor-pointer scale-110 accent-blue-500"
        />

        {/* TEXT / EDIT */}
        <div className="flex-1">
          {editingIndex === index ? (
            <input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={() => {
                onEdit(index, editText);
                setEditingIndex(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onEdit(index, editText);
                  setEditingIndex(null);
                }
                if (e.key === "Escape") {
                  setEditingIndex(null);
                }
              }}
              autoFocus
              className="bg-gray-800 border border-blue-400 px-2 py-1 rounded outline-none w-full"
            />
          ) : (
            <p
              className={`text-sm font-medium tracking-tight  ${
                todo.completed
                  ? "line-through text-gray-400"
                  : "text-white/90"
              }`}
              onClick={() => {
                setEditingIndex(index);
                setEditText(todo.text);
              }}
            >
              {todo.text}
            </p>
          )}
        </div>

              {/* RIGHT SIDE (metadata + delete) */}
            <div className="flex items-center gap-2 text-xs">

              {/* CATEGORY */}
              <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    todo.category === "work"
                      ? "bg-blue-500/20 text-blue-300"
                      : todo.category === "personal"
                      ? "bg-pink-500/20 text-pink-300"
                      : todo.category === "health"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-yellow-500/20 text-purple-300"
                  }`}
                >
                  {todo.category}
                </span>

              {/* PRIORITY */}
              <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    todo.priority === "low"
                      ? "bg-green-500/20 text-green-300"
                      : todo.priority === "medium"
                      ? "bg-yellow-500/20 text-yellow-300"
                      : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {todo.priority}
                </span>

              {/* DATE */}
              {todo.date && (
                <span className="text-white/40 text-xs">
                  {formatDate(todo.date)}
                </span>
              )}

              {/* OVERDUE */}
              {isOverdue(todo.date) && (
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                  overdue
                </span>
              )}

              {/* DELETE */}
              <button
                className="opacity-0 group-hover:opacity-100 text-red-400 transition"
                onClick={() => onDelete(index)}
              >
                Delete
              </button>

            </div>

</motion.div>
    </li>
  );
}

export default TodoItem;