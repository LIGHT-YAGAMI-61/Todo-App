import { useState , useEffect } from "react";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import CommandPalette from "./components/CommandPlaette";


function App() {

   


    const [filter , setFilter] = useState("all") ; 

     const [input, setInput] = useState("");
    const [showModal , setShowModal] = useState(false) ; 
    const [selectedCategory, setSelectedCategory] = useState("work");
    const [selectedPriority, setSelectedPriority] = useState("medium");



  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem("todos");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  useEffect(() => {
    localStorage.setItem("todos" , JSON.stringify(todos)) ; 
  } , [todos]) ; 


    const handleReorder = (newTodos) => {
      setTodos(newTodos) ; 
    } ; 


    const filteredTodos = todos.filter(todo => {
      if ( filter === "active" ) return !todo.completed ; 
      if ( filter === "completed" ) return todo.completed ; 
      return true  ; 
    })

  const  handleToggle = (id) => {
    const updated = todos.map((todos , i) =>  
    i === id ? {...todos , completed : !todos.completed } : todos 
  ) ; 

    setTodos(updated) 
  } 

    const addTodo = () => {
      if (!input.trim()) return;

      const newTodo = {
        text: input,
        completed: false,
        category: selectedCategory,
        priority: selectedPriority,
        date: new Date().toISOString(),
            };

        // setTodos([newTodo, ...todos]);
        // setInput("");
        setTodos((prev) => [...prev , newTodo]) ; 
        setInput("") ; 
        setShowModal(false) ; 
      };

  const handleDelete = (id) => {
    setTodos(todos.filter((_, i) => i !== id));
  };

    const handleEdit = ( id , newText ) => {
      const updated = todos.map((todo , i) => 
      i === id ? {...todo , text : newText } : todo 
     ) ; 

     setTodos(updated) ; 
    }


        //  ********  DERIVED  VALUES FOR DASHBOARD *******************


    const hour = new Date().getHours();

          const greeting =
            hour < 12
              ? "Good morning"
              : hour < 18
              ? "Good afternoon"
              : "Good evening";
                

              const completedTodos = todos.filter(
                  (todo) => todo.completed
                );

               const progress =
                    todos.length === 0
                      ? 0
                      : Math.round((completedTodos.length / todos.length) * 100);

                  const getCategoryPercent = (name) => {
                    const categoryTodos = todos.filter(
                      (todo) => todo.category === name
                    );

                    if (categoryTodos.length === 0) return 0;

                    const done = categoryTodos.filter(
                      (todo) => todo.completed
                    ).length;

                    return Math.round((done / categoryTodos.length) * 100);
                  };

                  const workPercent = getCategoryPercent("work");
                  const personalPercent = getCategoryPercent("personal");
                  const healthPercent = getCategoryPercent("health");
                  const studyPercent = getCategoryPercent("study");



  return (

                

    <div className="min-h-screen flex bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white">
      { /* SIDEBAR     */}
       <div className="w-64 border-r border-white/10 p-4 hidden md:block">
    <h2 className="text-lg font-semibold mb-6">Workspace</h2>

    <div className="space-y-3 text-sm text-gray-400">
      {[
    { label: "All Todos",
       value: "all" 
      },
    { 
      label: "Active"
      , value: "active" 
    },
    { 
      label: "Completed",
       value: "completed" 
      },
  ].map((item) => (
    <div
      key={item.label}
      onClick={() => setFilter(item.value)}
      className={`px-3 py-2 rounded-lg cursor-pointer transition flex justify-between items-center ${
        filter === item.value
          ? "bg-blue-500/20 border border-blue-400/30 text-white"
          : "text-gray-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span>{item.label}</span>

      {/* OPTIONAL COUNT */}
      <span className="text-xs opacity-60">
        {item.value === "all"
          ? todos.length
          : item.value === "active"
          ? todos.filter(t => !t.completed).length
          : todos.filter(t => t.completed).length}
      </span>
    </div>
  ))}

    </div>
  </div>
    
            <div className="flex-1 p-10 space-y-8 overflow-y-auto">

                <div>
                  <h1 className="text-2xl font-semibold">Good morning 👋</h1>
                  <p className="text-white/60">
                      {new Date().toLocaleDateString("en-US" , {
                        weekday:"long" , 
                        month: "long" , 
                        day: "numeric" , 
                      })}
                  </p>
                </div>
          
       

            

          
               

           
                        


                <div className="space-y-4 mb-8 "> 

                <TodoInput 
                addTodo={addTodo}
                setShowModal={setShowModal}
                />
      
                  


                        <button
              onClick={() => setTodos(todos.filter(t => !t.completed))}
              className="bg-red-500 px-3 py-1 rounded mb-4 hover:bg-red-700 active: transition"
            >
              Clear Completed
            </button>
                
              <div className="grid grid-cols-4 gap-4 mb-8">



                         <div className="bg-white/5 border border-white/10 rounded-2xl p-6 col-span-3">

                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-lg font-semibold text-white">
                            Overall Progress
                          </h2>

                          <span className="text-sm text-white/60">
                            {progress}%
                          </span>
                        </div>

                        {/* Main Progress Bar */}
                        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>

                        {/* Summary */}
                        <div className="flex justify-between text-sm text-white/50 mb-5">
                          <span>{completedTodos.length} tasks done</span>
                          <span>{todos.length} total</span>
                        </div>

                        {/* Category Breakdown */}
                        <div className="space-y-3">

                          {/* Work */}
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-blue-400">Work</span>
                              <span className="text-white/50">
                                {workPercent}%
                              </span>
                            </div>

                            <div className="h-2 bg-white/10 rounded-full">
                              <div
                                className="h-full bg-blue-400 rounded-full"
                                style={{ width: `${workPercent}%` }}
                              />
                            </div>
                          </div>

                          {/* Personal */}
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-pink-400">Personal</span>
                              <span className="text-white/50">
                                {personalPercent}%
                              </span>
                            </div>

                            <div className="h-2 bg-white/10 rounded-full">
                              <div
                                className="h-full bg-pink-400 rounded-full"
                                style={{ width: `${personalPercent}%` }}
                              />
                            </div>
                          </div>

                          {/* Health */}
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-green-400">Health</span>
                              <span className="text-white/50">
                                {healthPercent}%
                              </span>
                            </div>

                            <div className="h-2 bg-white/10 rounded-full">
                              <div
                                className="h-full bg-green-400 rounded-full"
                                style={{ width: `${healthPercent}%` }}
                              />
                            </div>
                          </div>

                          {/* Study */}
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-yellow-400">Study</span>
                              <span className="text-white/50">
                                {studyPercent}%
                              </span>
                            </div>

                            <div className="h-2 bg-white/10 rounded-full">
                              <div
                                className="h-full bg-yellow-400 rounded-full"
                                style={{ width: `${studyPercent}%` }}
                              />
                            </div>
                          </div>

                        </div>
                      </div>



                  <div className="p-4 rounded-xl bg-white/5">
                    <p className="text-sm text-gray-400">Completed</p>
                    <h2 className="text-2xl font-bold">
                      {todos.filter(t => t.completed).length}
                    </h2>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5">
                    <p className="text-sm text-gray-400">Pending</p>
                    <h2 className="text-2xl font-bold">
                      {todos.filter(t => !t.completed).length}
                    </h2>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5">
                    <p className="text-sm text-gray-400">Total</p>
                    <h2 className="text-2xl font-bold">
                      {todos.length}
                    </h2>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5">
                    <p className="text-sm text-gray-400">Progress</p>
                    <h2 className="text-2xl font-bold">
                      {Math.round(
                        (todos.filter(t => t.completed).length / (todos.length || 1)) * 100
                      )}%
                    </h2>
                  </div>

                </div>

                      <h2 className="text-lg font-semibold">Recent Tasks</h2>

      <TodoList
        todos={filteredTodos}
        filter={filter}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onToggle={handleToggle}
        onReorder={handleReorder}
        />
        </div>
      
       <CommandPalette 
       todos={todos} 
       addTodo={addTodo} 
       setFilter={setFilter}
       clearCompleted={() => 
        setTodos(todos.filter(t => !t.completed))
       }
       />

       
    </div>



    {showModal && (
          
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

              <div className="w-full max-w-md bg-[#171925] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5">

                {/* Header */}
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">New Task</h2>

                  <button
                    onClick={() => setShowModal(false)}
                    className="text-white/50 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                {/* Task Name */}
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Task name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                />

                {/* Row */}
                <div className="grid grid-cols-2 gap-3">

                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 "
                  >
                    <option 
                    className=" font-bold bg-blue-400"
                    value="work">Work</option>
                    <option
                    className="font-bold bg-pink-400"
                    value="personal">Personal</option>
                    <option 
                    className="font-bold bg-green-500"
                    value="health">Health</option>
                    <option 
                    className="font-bold bg-yellow-600"
                    value="study">Study</option>
                  </select>

                  <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className={`rounded-xl px-4 py-3 border border-white/10 bg-white/5 font-medium
                  ${
                    selectedPriority === "low"
                      ? "text-green-400"
                      : selectedPriority === "medium"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  <option value="low" className="text-green-400 bg-[#1b1d2a]">
                    Low
                  </option>

                  <option value="medium" className="text-yellow-400 bg-[#1b1d2a]">
                    Medium
                  </option>

                  <option value="high" className="text-red-400 bg-[#1b1d2a]">
                    High
                  </option>
                </select>

                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 pt-2">

                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl border border-white/10 text-white/70 hover:bg-white/5"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={addTodo}
                    className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600"
                  >
                    Add Task
                  </button>

                </div>

              </div>
            </div>
          )}


  </div>
  
  );
}


export default App;