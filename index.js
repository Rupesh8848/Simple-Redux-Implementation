function createStore(reducer) {
  /*
      The store should have 4 parts:
      1. The State
      2. Get the state
      3. Listen to changes on the state
      4. update state
      */

  let state;
  let listeners = [];
  const getState = () => state;

  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners.filter((l) => l !== listener);
    };
  };

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((listener) => listener());
  };

  return { getState, subscribe, dispatch };
}
goalBtn;
const ADD_TODO = "ADD_TODO";
const REMOVE_TODO = "REMOVE_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const ADD_GOAL = "ADD_GOAL";
const REMOVE_GOAL = "REMOVE_GOAL";

// action creators
const addTodoAction = (todo) => {
  return {
    type: ADD_TODO,
    todo,
  };
};

const removeTodoAction = (id) => {
  return {
    type: REMOVE_TODO,
    id,
  };
};

const toggleTodoAction = (id) => ({
  type: TOGGLE_TODO,
  id,
});

const addGoalAction = (goal) => ({
  type: ADD_GOAL,
  goal,
});

const removeGoalAction = (id) => ({
  type: REMOVE_GOAL,
  id,
});

//reducer function
function todos(state = [], action) {
  if (action.type === ADD_TODO) {
    return state.concat([action.todo]);
  } else if (action.type === REMOVE_TODO) {
    return state.filter((todo) => todo.id !== action.id);
  } else if (action.type === TOGGLE_TODO) {
    console.log("Action: ", action);
    return state.map((todo) =>
      todo.id !== action.id
        ? todo
        : Object.assign({}, todo, { complete: !todo.complete })
    );
  } else {
    return state;
  }
}

function goals(state = [], action) {
  switch (action.type) {
    case ADD_GOAL:
      return state.concat([action.goal]);

    case REMOVE_GOAL:
      return state.filter((goal) => goal.id !== action.id);

    default:
      return state;
  }
}

// combine reducer
function app(state = {}, action) {
  return {
    todos: todos(state.todos, action),
    goals: goals(state.goals, action),
  };
}

function guidGenerator() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}

const store = createStore(app);

function creatAndPaintUIWithLi(
  listItem,
  removeButtonCallback,
  addEventListenerCallback
) {
  const li = document.createElement("li");
  li.textContent = listItem.name;
  li.appendChild(createRemoveButton(removeButtonCallback));
  if (addEventListenerCallback) {
    li.addEventListener("click", addEventListenerCallback);
  }
  if (listItem.complete) {
    li.style.textDecoration = "line-through";
  }
  return li;
}

store.subscribe(() => {
  // clear ui and then re add all todos to DOM
  document.getElementById("todos").innerHTML = "";
  store.getState().todos.forEach((todo) => {
    const addEventListenerCallback = () => {
      console.log("Callback called", todo.id);
      store.dispatch(toggleTodoAction(todo.id));
    };

    const removeButtonCallback = () => {
      store.dispatch(removeTodoAction(todo.id));
    };
    const li = creatAndPaintUIWithLi(
      todo,
      removeButtonCallback,
      addEventListenerCallback
    );
    document.getElementById("todos").appendChild(li);
  });

  // clear ui and then re add all goals to DOM
  document.getElementById("goals").innerHTML = "";
  store.getState().goals.forEach((goal) => {
    const removeButtonCallback = () => {
      store.dispatch(removeGoalAction(goal.id));
    };
    const li = creatAndPaintUIWithLi(goal, removeButtonCallback);
    document.getElementById("goals").appendChild(li);
  });

  console.log("The state of store: ", store.getState());

  document.getElementById("todos").childNodes.forEach((childNode) => {
    console.log(childNode);
  });
});

document.getElementById("todoBtn").addEventListener("click", () => {
  store.dispatch(
    addTodoAction({
      id: guidGenerator(),
      name: document.getElementById("todo").value,
      complete: false,
    })
  );
});

document.getElementById("goalBtn").addEventListener("click", () => {
  store.dispatch(
    addGoalAction({
      id: guidGenerator(),
      name: document.getElementById("goal").value,
      complete: false,
    })
  );
});

function createRemoveButton(onClick) {
  const button = document.createElement("button");
  button.innerText = "X";
  button.addEventListener("click", onClick);
  return button;
}
