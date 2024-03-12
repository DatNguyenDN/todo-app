import { useEffect, useState } from "react";

function App() {
  const [todo, setTodo] = useState("");
  const [todolist, setTodoList] = useState([]);

  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [completed, setCompleted] = useState(0);

  const [completedList, setCompletedList] = useState([]);

  const handleAdd = () => {
    const newTodo = {
      index: todolist.length + 1,
      todo,
    };
    if (newTodo.todo === "") return;
    setTodoList([...todolist, todo]);
    setTodo("");
  };

  const handleDelete = (deleteItem) => {
    const updateList = todolist.filter((todo) => todo.index !== deleteItem);
    setTodoList(updateList);
  };

  const handleEdit = (value, index) => {
    setIsEdit(true);
    setTodo(value);
    setEditIndex(index);
  };

  const submitEdit = () => {
    const updateList = [...todolist];
    updateList[editIndex] = { ...updateList[editIndex], todo };
    setTodoList(updateList);
    setTodo("");
    setIsEdit(false);
  };

  console.log(completedList);

  const handleCompleted = (completedTodo) => {
    let updatedList = [...completedList];
    if (!updatedList.includes(completedTodo)) {
      updatedList.push(completedTodo);
      setCompleted((prev) => prev + 1);
    } else {
      updatedList = updatedList.filter((item) => item !== completedTodo);
      setCompleted((prev) => prev - 1);
    }
    setCompletedList(updatedList);
  };

  //save
  useEffect(() => {
    localStorage.setItem("todo-list", JSON.stringify(todolist));
  }, [todolist]);

  //load
  useEffect(() => {
    const savedList = JSON.parse(localStorage.getItem("todo-list"));
    if (savedList) setTodoList(savedList);
  }, []);

  const handleSortCompleted = () => {
    let updateList = [];
    if (completedList.length === 0) return;
    else {
      updateList = todolist.filter((item) => completedList.includes(item));
      setTodoList(updateList);
    }
  };

  const handleSortUnCompleted = () => {
    let updateList = [];
    if (completedList.length === 0) return;
    else {
      updateList = todolist.filter((item) => !completedList.includes(item));
      setTodoList(updateList);
    }
  };

  return (
    <div className=" p-[5%] flex flex-col justify-center  items-center">
      <div className="flex gap-5 p-5">
        <input
          className="border"
          type="text"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <button
          className="bg-yellow-400 p-3 text-xl"
          onClick={isEdit ? submitEdit : handleAdd}
        >
          {isEdit ? "Update" : "Add"}
        </button>
      </div>

      <div className="p-5 mb-5">
        <ul>
          {todolist.map((todo) => {
            return (
              <li key={todo} className="flex justify-start gap-5">
                <input
                  type="checkbox"
                  id={todo}
                  className="after:line-through"
                  onChange={() => handleCompleted(todo)}
                />
                {todo}
                <button
                  className="bg-yellow-400  text-md"
                  onClick={() => handleDelete(todo)}
                >
                  Deleted
                </button>
                <button
                  className="bg-green-400"
                  onClick={() => handleEdit(todo)}
                >
                  Edit
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <h1>Total Tasks: {todolist.length}</h1>
      <h1>Completed: {completed}</h1>
      <div>
        <div className="flex flex-col">
          <button onClick={handleSortCompleted}>Sort by completed</button>
          <button onClick={handleSortUnCompleted}>Sort by Uncompleted</button>
        </div>
      </div>
    </div>
  );
}

export default App;
