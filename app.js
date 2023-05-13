const { Component, mount, xml, useState } = owl;

class Task extends Component {
  static template = xml`
  <li t-attf-style="background-color:#{props.task.color}" class="d-flex align-items-center justify-content-between border-bottom p-3 border rounded mb-2">
    <div class="form-check form-switch fs-5 name-dark">
      <input type="checkbox" class="form-check-input" t-model="props.task.isCompleted" role="switch" 
        t-att-id="props.task.id"/>
      <label t-att-for="props.task.id" t-attf-style="text-decoration: #{props.task.isCompleted ? 'line-through' : 'none'};">
        <t t-esc="props.task.name"/>
      </label>
    </div>
    <div>
      <button class="btn btn-primary me-2" t-on-click="() => props.onEdit(props.task)"><i class="bi bi-pencil"></i></button>
      <button class="btn btn-danger" t-on-click="() => props.onDelete(props.task)"><i class="bi bi-trash"></i></button>
    </div>
  </li>
  `

  // use to get the states from parent component
  static props = ["task", "onEdit", "onDelete"];
}

class Root extends Component {
  static template = xml`
  <div class="m-0 p-4 bg-white rounded">
    <div class="input-group-lg bg-white rounded border d-flex w-100 align-items-center">
      <input type="text" class="form-control-lg fs-5 flex-fill border-0" placeholder="Add your new task" aria-label="Add your new task"
       t-att-value="state.name" t-model="state.name" aria-describedby="button-addon2"/>
      <input type="color" class="form-control-lg border-0 bg-white m-0 form-control-color" t-att-value="state.color"
       t-model="state.color" title="Choose your color"/>
      <button class="btn btn-primary" type="button" t-on-click="addTask"><i t-attf-class="bi fs-3 #{state.isEditing ? 'bi-check-lg' : 'bi-plus-lg'}"></i></button>
    </div>
    
    <ul class="tasks d-flex flex-column p-0 mt-5">
      <t t-foreach="tasks" t-as="task" t-key="task.id">
        <Task task="task" onEdit.bind="editTask" onDelete.bind="deleteTask"/>
      </t>
    </ul>
  </div>
  `

  static components = { Task };

  setup() {
    this.state = useState({
      name: "",
      color: "#563d7c",
      isCompleted: false,
      isEditing: false,
      taskId: null,
    });
    this.tasks = useState([
      {id:1, name:"Task 1", color:"#fff000", isCompleted: false},
      {id:2, name:"Task 2", color:"#fff000", isCompleted: true},
      {id:3, name:"Task 3", color:"#fff000", isCompleted: false},
    ]);
  }

  addTask() {
    if (!this.state.name) {
      alert("Please enter a task name");
      return;
    }
    if (this.state.isEditing) {
      const task = this.tasks.find((t) => t.id === this.state.taskId);
      task.name = this.state.name;
      task.color = this.state.color;
      this.state.isEditing = false;
    } else {
      const id = Math.random().toString().substring(2, 12);
      this.tasks.push({
        id,
        name: this.state.name,
        color: this.state.color,
        isCompleted: false,
      });
    }
    this.state.name = "";
  }

  editTask(task) {
    this.state.name = task.name;
    this.state.color = task.color;
    this.state.isEditing = true;
    this.state.taskId = task.id;
  }

  deleteTask(task) {
    this.tasks = this.tasks.filter((t) => t.id !== task.id);
  }

}

mount(Root, document.getElementById("root"));