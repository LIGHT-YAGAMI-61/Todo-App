import { useEffect , useState , useRef } from "react";

console.log("CommandPalette mounted");

           

function CommandPalette({ todos , addTodo , setFilter , clearCompleted }) {

     const [selectedIndex, setSelectedIndex] = useState(0);
        
    const [open , setOpen ] = useState(false) ; 
    const [input , setInput ] = useState("") ; 

    useEffect(() => {
        const handleKey = (e) => {
                console.log("KEY PRESSED:", e.key);

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setOpen(prev => !prev);
                    }

                    // CLOSE WITH ESC 
                    if ( e.key === "Escape") {
                        setOpen(false) ; 
                    }
                };

        window.addEventListener("keydown" , handleKey ) ; 
        return () => window.removeEventListener("keydown" , handleKey) ; 
    } , [] ) ; 

    useEffect(() => {
            setSelectedIndex(0);
            }, [input]);

    useEffect(() => {
        if (open) {
            setInput("") ; 
            setSelectedIndex(0) ; 
        }
    } , [open] ) ; 

    
        const itemRefs = useRef([]) ; 
         useEffect(() => {
            itemRefs.current[selectedIndex]?.scrollIntoView({
                block : "nearest" , 
            }) ; 
         } , [selectedIndex] ) ; 
    
        const inputRef = useRef();
        useEffect(() => {
            if (open) {
                inputRef.current?.focus();
            }
            }, [open]);

                if ( !open ) return null ; 

    const filtered = todos.filter(t =>
        (t.text || "").toLowerCase().includes(input.toLowerCase())
        );
        
                
            const commands = [
                {
                    sections : "Action" , 
                    items : [
                        {
                            label : "Add Todo" , 
                            action : () => {
                               if ( input.trim()) { 
                                addTodo(input) ;
                                setInput("") 
                                setOpen(false) ; 
                            }
                        }
                      } , 
                      {
                        label : "Clear Completed" , 
                        action : clearCompleted
                      }
                    ]
                } , 
                {
                    section : "Navigation" , 
                    items : [
                        {
                            label : "All Todos" , 
                            action : () => setFilter("all") 
                        } , 
                        {
                            label : "Active Todos" , 
                            action : () => setFilter("active") 
                        } , 
                    ]
                }
            ] ; 
            

                    const flatCommands = commands.flatMap(section => section.items);

    return (
        <div 
        className={`fixed inset-0 bg-block/50 flex items-start justify-center pt-40 z-50 transition-opacity duration-200 ${
            open ? "opacity-100" : "opacity-0 pointer-events-none" 
        }`}
        onClick={() => setOpen(false)}
        >
        <div
        className={`w-full max-w-lg bg-gray-900 p-4 rounded-xl shadow-lg transform transition-all duration-200 ${
            open ? "scale-100 opacity-100" : "scale-95 opacity-0" 
        }`}
        onClick={(e) => e.stopPropagation()} 
        >

            <input 
            className="w-full bg-transparent border-b border-gray-600 outline-none p-2"
            placeholder="Type a command..."
            value={input} 
            ref={inputRef}
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e) => {

                        // ⬇️ DOWN
                        if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setSelectedIndex(prev => {
                                const next = prev + 1 ; 
                                return next >= flatCommands.length ? prev : next ; 
                            } 
                            );
                        }


                        // ⬆️ UP
                        if (e.key === "ArrowUp") {
                            e.preventDefault();
                            setSelectedIndex(prev =>  {
                                const next = prev - 1 ;  
                                return next < 0 ? 0 : next ; 
                            }
                            );
                        }

                        // ⏎ ENTER
                       if (e.key === "Enter") {
                            const cmd = flatCommands[selectedIndex] ; 
                                
                            // Priority 1 : execute command
                                if ( cmd ) {
                                    cmd.action() ; 
                                    setOpen(false) ; 
                                    return ; 
                                }

                            // ✅ If user typed something → ADD
                            if (input.trim()) {
                                addTodo(input);
                                setInput("");
                                setOpen(false);
                                return;
                            }

                            // ✅ Otherwise select existing
                            
                        }
                    }}
             />

            <div className="mt-4 max-h-60 overflow-y-auto space-y-1">

            {filtered.length === 0 && (
                <p className="text-sm text-gray-500 px-2">
                No results found
                </p>
            )}


            {commands.map((section, sIndex) => (
                    <div key={section.section} className="mb-2">

                        {/* SECTION TITLE */}
                        <p className="text-xs text-gray-400 px-3 py-1">
                        {section.section}
                        </p>

                        {/* ITEMS */}
                        {section.items.map((item, i) => {

                        // calculate global index
                        const index =
                            commands
                            .slice(0, sIndex)
                            .reduce((acc, s) => acc + s.items.length, 0) + i;

                        return (
                            <div
                            key={item.label}
                            onClick={item.action}
                            className={`px-3 py-2 text-sm rounded cursor-pointer transition ${
                                selectedIndex === index
                                ? "bg-blue-500/20 text-white border border-blue-400/30"
                                : "text-gray-400 hover:text-white/5"
                            }`}
                            >
                            {item.label}
                            </div>
                        );
                        })}
                    </div>
                    ))}


            </div>
        </div>
        </div>
    ) ; 
}

export default CommandPalette ; 