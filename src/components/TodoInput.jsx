import { useState } from "react";

function TodoInput({ addTodo , setShowModal }) {
  const [text, setText] = useState("");
    
  const handleAdd = () => {
    if (!text.trim()) return;
    addTodo(text);
    setText("");
  };

  return (
    <div className="flex gap-3 mb-4 ">

        <h1 className="text-2xl font-semibold mb-6">Todo</h1>
        <div className="mb-6">
     <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
        className="flex w-full gap-2"
      > 


          <button
                onClick={() => {
                  addTodo() ; 
                  setShowModal(true)}}
                className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                + Add Task
              </button>
      

        </form>
        </div>
    </div>
   
  );
   
}

export default TodoInput;