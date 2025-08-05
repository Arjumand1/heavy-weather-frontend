<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="max-width: 600px; width: 100%;">
      <header class="text-center q-mb-lg">
        <h1 class="text-h3 q-my-none text-weight-light text-dark">Heavy Weather</h1>
        <p class="text-subtitle1 text-grey q-mb-lg">Welcome back, {{ authStore.user?.first_name }} {{
          authStore.user?.last_name }}</p>

        <q-btn color="primary" icon="add" label="Add New Task" @click="showAddDialog = true" class="q-mb-md"
          unelevated />
      </header>

      <section v-if="tasks.length > 0">
        <div class="text-center q-mb-md">
          <q-checkbox v-model="allCompleted" @update:model-value="toggleAll" label="Mark all tasks as complete" dense
            class="text-primary" />
        </div>

        <div class="q-mb-md">
          <q-tabs v-model="currentFilter" dense class="text-grey" active-color="primary" indicator-color="primary">
            <q-tab name="all" label="All" />
            <q-tab name="active" label="Active" />
            <q-tab name="completed" label="Completed" />
          </q-tabs>
        </div>

        <q-list bordered separator class="rounded-borders">
          <q-item v-for="task in filteredTasks" :key="task.entity_id" :class="{ 'bg-grey-1': task.completed }">
            <q-item-section side>
              <q-checkbox v-model="task.completed" @update:model-value="toggleTask(task)" color="primary">
                <q-tooltip>Mark as {{ task.completed ? 'incomplete' : 'complete' }}</q-tooltip>
              </q-checkbox>
            </q-item-section>

            <q-item-section @click="viewTaskDetails(task)" class="cursor-pointer">
              <div class="text-subtitle1 q-py-xs" :class="{ 'text-strike text-grey-6': task.completed }">
                {{ task.title }}
              </div>
              <div v-if="task.description" class="text-caption text-grey-7 q-mt-xs">
                {{ task.description.length > 50 ? task.description.substring(0, 50) + '...' : task.description }}
              </div>
              <q-tooltip v-if="task.description && task.description.length > 50">
                {{ task.description }}
              </q-tooltip>
            </q-item-section>

            <q-item-section side class="row items-center">
              <q-btn icon="edit" flat round dense color="primary" @click="startEdit(task)" class="q-mr-xs">
                <q-tooltip>Edit Task</q-tooltip>
              </q-btn>
              <q-btn icon="delete" flat round dense color="negative" @click="deleteTask(task)">
                <q-tooltip>Delete Task</q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </section>

      <footer v-if="tasks.length > 0" class="flex justify-between items-center q-mt-md q-py-md q-border-t">
        <span class="text-grey-7">
          <strong>{{ activeCount }}</strong>
          {{ activeCount === 1 ? 'item' : 'items' }} left
        </span>

        <q-btn v-if="completedCount > 0" @click="clearCompleted" flat dense color="negative">
          Clear completed ({{ completedCount }})
        </q-btn>
      </footer>

      <div v-if="tasks.length === 0" class="text-center q-pa-xl">
        <q-icon name="task_alt" size="4rem" color="grey-5" />
        <p class="text-subtitle1 text-grey-6 q-mt-md">No tasks yet. Add one above to get started!</p>
      </div>
    </div>
  </q-page>
  <!-- Help tooltip to explain actions -->
  <q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-btn round color="primary" icon="help">
      <q-tooltip anchor="center left" self="center right" max-width="300px">
        <div class="text-body2">
          <div class="q-mb-sm">• Check the box to mark a task as complete</div>
          <div class="q-mb-sm">• Click the edit icon to modify a task</div>
          <div>• Click the delete icon to remove a task</div>
        </div>
      </q-tooltip>
    </q-btn>
  </q-page-sticky>

  <!-- Add Task Dialog -->
  <q-dialog v-model="showAddDialog" persistent>
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">Add New Task</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input v-model="newTaskTitle" label="Title *" autofocus @keyup.enter="addNewTask()" class="q-mb-md"
          outlined />
        <q-input v-model="newTaskDescription" label="Description (optional)" type="textarea" rows="3" outlined />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="negative" v-close-popup @click="cancelAdd" />
        <q-btn flat label="Add Task" color="primary" @click="addNewTask" :disable="!newTaskTitle.trim()" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Task Details Dialog -->
  <q-dialog v-model="showDetailsDialog" persistent>
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">Task Details</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="q-mb-md">
          <div class="text-subtitle2 text-grey-7 q-mb-xs">Title</div>
          <div class="text-body1">{{ selectedTask?.title }}</div>
        </div>

        <div v-if="selectedTask?.description" class="q-mb-md">
          <div class="text-subtitle2 text-grey-7 q-mb-xs">Description</div>
          <div class="text-body1">{{ selectedTask?.description }}</div>
        </div>

        <div class="q-mb-md">
          <div class="text-subtitle2 text-grey-7 q-mb-xs">Status</div>
          <q-chip :color="selectedTask?.completed ? 'positive' : 'orange'"
            :icon="selectedTask?.completed ? 'check_circle' : 'radio_button_unchecked'" text-color="white">
            {{ selectedTask?.completed ? 'Completed' : 'Active' }}
          </q-chip>
        </div>

        <div v-if="selectedTask?.completed_at" class="q-mb-md">
          <div class="text-subtitle2 text-grey-7 q-mb-xs">Completed At</div>
          <div class="text-body2">{{ formatDate(selectedTask.completed_at) }}</div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Edit" color="primary" @click="editFromDetails" />
        <q-btn flat label="Close" color="negative" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Edit Task Dialog -->
  <q-dialog v-model="showEditDialog" persistent>
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">Edit Task</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input v-model="editTaskTitle" label="Title *" autofocus @keyup.enter="saveEdit()" class="q-mb-md" outlined />
        <q-input v-model="editTaskDescription" label="Description (optional)" type="textarea" rows="3" outlined />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="negative" v-close-popup @click="cancelEdit" />
        <q-btn flat label="Save" color="primary" @click="saveEdit" :disable="!editTaskTitle.trim()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  background-color: rgba(25, 118, 210, 0.04);
  border-radius: 4px;
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from 'stores/auth'
import { useTaskStore } from 'stores/tasks'

const authStore = useAuthStore()
const taskStore = useTaskStore()

// Reactive data
const currentFilter = ref('all')

// Add task dialog
const showAddDialog = ref(false)
const newTaskTitle = ref('')
const newTaskDescription = ref('')

// Task details dialog
const showDetailsDialog = ref(false)
const selectedTask = ref(null)

// Edit task dialog
const editingTask = ref(null)
const editTaskTitle = ref('')
const editTaskDescription = ref('')
const showEditDialog = ref(false)

// Computed properties
const tasks = computed(() => taskStore.allTasks)

const filteredTasks = computed(() => {
  switch (currentFilter.value) {
    case 'active':
      return taskStore.activeTasks
    case 'completed':
      return taskStore.completedTasks
    default:
      return taskStore.allTasks
  }
})

const activeCount = computed(() => taskStore.activeCount)
const completedCount = computed(() => taskStore.completedCount)

const allCompleted = computed({
  get() {
    return taskStore.areAllCompleted
  },
  set() {
    // This will be handled by toggleAll method
  }
})

// Methods
const fetchTasks = async () => {
  await taskStore.fetchTasks()
}

const addNewTask = async () => {
  if (!newTaskTitle.value.trim()) return

  const result = await taskStore.addTask(newTaskTitle.value, newTaskDescription.value)
  if (result) {
    showAddDialog.value = false
    newTaskTitle.value = ''
    newTaskDescription.value = ''
  }
}

const cancelAdd = () => {
  showAddDialog.value = false
  newTaskTitle.value = ''
  newTaskDescription.value = ''
}

const viewTaskDetails = (task) => {
  selectedTask.value = task
  showDetailsDialog.value = true
}

const editFromDetails = () => {
  showDetailsDialog.value = false
  startEdit(selectedTask.value)
}

const toggleTask = async (task) => {
  await taskStore.toggleTask(task)
}

const deleteTask = async (task) => {
  await taskStore.deleteTask(task)
}

const startEdit = (task) => {
  editingTask.value = task.entity_id
  editTaskTitle.value = task.title
  editTaskDescription.value = task.description || ''
  showEditDialog.value = true
}

const saveEdit = async () => {
  if (!editTaskTitle.value.trim()) return

  const task = tasks.value.find(t => t.entity_id === editingTask.value)
  if (task) {
    const updates = {
      title: editTaskTitle.value.trim(),
      description: editTaskDescription.value.trim()
    }
    await taskStore.updateTask(task, updates)
    showEditDialog.value = false
    editingTask.value = null
    editTaskTitle.value = ''
    editTaskDescription.value = ''
  }
}

const cancelEdit = () => {
  editingTask.value = null
  editTaskTitle.value = ''
  editTaskDescription.value = ''
  showEditDialog.value = false
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString()
}

const toggleAll = async (value) => {
  await taskStore.toggleAll(value)
}

const clearCompleted = async () => {
  await taskStore.clearCompleted()
}

// Lifecycle
onMounted(() => {
  fetchTasks()
})
</script>
