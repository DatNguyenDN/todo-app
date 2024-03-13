import { useEffect, useState } from "react";

function App() {
  const [items, setItems] = useState([]);

  const handleAdd = (item) => {
    setItems((items) => [...items, item]);
  };

  const handleDelete = (id) => {
    setItems((items) => items.filter((item) => item.id !== id));
  };

  const toggleItem = (id) => {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleEdit = (id) => {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, isEdit: true } : { ...item, isEdit: false }
      )
    );
  };

  const submitEdit = (id, newValue) => {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, desc: newValue, isEdit: false } : item
      )
    );
  };

  //load
  useEffect(() => {
    const savedList = JSON.parse(localStorage.getItem("items-list"));
    if (savedList) setItems(savedList);
  }, []);

  //save
  useEffect(() => {
    localStorage.setItem("items-list", JSON.stringify(items));
  }, [items]);

  return (
    <div className="p-20 h-100vh w-full flex flex-col justify-center items-center ">
      <Form onAdd={handleAdd} />
      <ItemList
        items={items}
        onDelete={handleDelete}
        onToggle={toggleItem}
        onEdit={handleEdit}
        onSubmitEdit={submitEdit}
      />
    </div>
  );
}

export default App;

function Form({ onAdd }) {
  const [input, setInput] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    if (input === "") return;
    const newItem = {
      id: Math.random(1),
      desc: input,
      completed: false,
    };
    onAdd(newItem);
    console.log(newItem);
    setInput("");
  }
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          className="bg-blue-500 p-2 mr-10 rounded-xl  text-center"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-emerald-500 p-2 rounded-xl text-white"
          type="submit"
        >
          Add
        </button>
      </form>
    </>
  );
}

function ItemList({ items, onDelete, onToggle, onEdit, onSubmitEdit }) {
  const [sort, setSort] = useState("all");
  console.log(items);

  let sortItems;
  if (sort === "all") {
    sortItems = items;
  }
  if (sort === "completed") {
    sortItems = items.filter((item) => item.completed);
  }
  if (sort === "uncompleted") {
    sortItems = items.filter((items) => !items.completed);
  }
  return (
    <div>
      <ul>
        {sortItems.map((item) => (
          <Item
            key={item.id}
            item={item}
            onDelete={onDelete}
            onToggle={onToggle}
            onEdit={onEdit}
            onSubmitEdit={onSubmitEdit}
          />
        ))}
      </ul>
      <div className="mt-10">
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="uncompleted">Un Completed</option>
        </select>
      </div>
    </div>
  );
}

function Item({ item, onDelete, onToggle, onEdit, onSubmitEdit }) {
  const [editValue, setEditValue] = useState(item.desc);

  const handleSaveEdit = () => {
    onSubmitEdit(item.id, editValue);
  };

  return (
    <div className="mt-5">
      <li className={item.completed ? "line-through flex gap-5" : "flex gap-5"}>
        <input
          type="checkbox"
          checked={item.completed}
          onChange={() => onToggle(item.id)}
        />
        {item.isEdit ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="bg-pink-300 rounded-xl p-2 text-center"
          />
        ) : (
          item.desc
        )}
        <button
          onClick={() => (item.isEdit ? handleSaveEdit() : onEdit(item.id))}
        >
          {item.isEdit ? "Save" : "Edit"}
        </button>
        <button onClick={() => onDelete(item.id)}>Delete</button>
      </li>
    </div>
  );
}
