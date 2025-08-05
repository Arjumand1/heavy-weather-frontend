import { defineStore, acceptHMRUpdate } from 'pinia'
import { Notify } from 'quasar'
import axios from 'config/axios'

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
  }),

  getters: {
    allTasks: (state) => state.tasks,

    activeTasks: (state) => state.tasks.filter((task) => !task.completed),

    completedTasks: (state) => state.tasks.filter((task) => task.completed),

    activeCount: (state) => state.tasks.filter((task) => !task.completed).length,

    completedCount: (state) => state.tasks.filter((task) => task.completed).length,

    areAllCompleted: (state) =>
      state.tasks.length > 0 && state.tasks.every((task) => task.completed),
  },

  actions: {
    // Fetch all tasks
    async fetchTasks() {
      try {
        const response = await axios.get('/tasks')
        if (response.data?.success) {
          this.tasks = response.data.tasks || []
          return this.tasks
        }
        return []
      } catch (error) {
        console.error('Error fetching tasks:', error)
        Notify.create({
          message: 'Failed to fetch tasks',
          color: 'negative',
          position: 'top',
        })
        return []
      }
    },

    // Add a new task
    async addTask(title, description = '') {
      if (!title.trim()) return null

      try {
        const response = await axios.post('/tasks', {
          title: title.trim(),
          description: description.trim(),
        })

        if (response.data?.success) {
          this.tasks.push(response.data.task)
          Notify.create({
            message: 'Task added successfully',
            color: 'positive',
            position: 'top',
          })
          return response.data.task
        }
        return null
      } catch (error) {
        console.error('Error adding task:', error)
        Notify.create({
          message: 'Failed to add task',
          color: 'negative',
          position: 'top',
        })
        return null
      }
    },

    // Toggle task completion status
    async toggleTask(task) {
      try {
        const response = await axios.put(`/tasks/${task.entity_id}`, {
          completed: task.completed,
        })

        if (response.data?.success) {
          // Update the task in our local array
          const index = this.tasks.findIndex((t) => t.entity_id === task.entity_id)
          if (index !== -1) {
            this.tasks[index] = { ...this.tasks[index], ...response.data.task }
          }
          return true
        }
        return false
      } catch (error) {
        // Revert the change
        const index = this.tasks.findIndex((t) => t.entity_id === task.entity_id)
        if (index !== -1) {
          this.tasks[index].completed = !this.tasks[index].completed
        }

        console.error('Error updating task:', error)
        Notify.create({
          message: 'Failed to update task',
          color: 'negative',
          position: 'top',
        })
        return false
      }
    },

    // Delete a task
    async deleteTask(task) {
      try {
        const response = await axios.delete(`/tasks/${task.entity_id}`)

        if (response.data?.success) {
          const index = this.tasks.findIndex((t) => t.entity_id === task.entity_id)
          if (index !== -1) {
            this.tasks.splice(index, 1)
          }
          Notify.create({
            message: 'Task deleted successfully',
            color: 'positive',
            position: 'top',
          })
          return true
        }
        return false
      } catch (error) {
        console.error('Error deleting task:', error)
        Notify.create({
          message: 'Failed to delete task',
          color: 'negative',
          position: 'top',
        })
        return false
      }
    },

    // Update task
    async updateTask(task, updates) {
      if (updates.title && !updates.title.trim()) return false

      try {
        const response = await axios.put(`/tasks/${task.entity_id}`, updates)

        if (response.data?.success) {
          const index = this.tasks.findIndex((t) => t.entity_id === task.entity_id)
          if (index !== -1) {
            this.tasks[index] = { ...this.tasks[index], ...response.data.task }
          }
          Notify.create({
            message: 'Task updated successfully',
            color: 'positive',
            position: 'top',
          })
          return true
        }
        return false
      } catch (error) {
        console.error('Error updating task:', error)
        Notify.create({
          message: 'Failed to update task',
          color: 'negative',
          position: 'top',
        })
        return false
      }
    },

    // Legacy method for backward compatibility
    async updateTaskTitle(task, newTitle) {
      return this.updateTask(task, { title: newTitle.trim() })
    },

    // Toggle all tasks' completion status
    async toggleAll(value) {
      const tasksToToggle = this.tasks.filter((task) => task.completed !== value)
      let allSuccessful = true

      for (const task of tasksToToggle) {
        const originalStatus = task.completed
        task.completed = value

        const success = await this.toggleTask(task)

        if (!success) {
          task.completed = originalStatus
          allSuccessful = false
        }
      }

      return allSuccessful
    },

    // Clear completed tasks
    async clearCompleted() {
      const completedTasks = [...this.tasks.filter((task) => task.completed)]
      let allSuccessful = true

      for (const task of completedTasks) {
        const success = await this.deleteTask(task)
        if (!success) {
          allSuccessful = false
        }
      }

      return allSuccessful
    },
  },
})

// Hot Module Replacement support
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTaskStore, import.meta.hot))
}
