<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="toggleLeftDrawer"
        v-if="authStore.isAuthenticated"
      />

      <q-toolbar-title> Heavy Weather </q-toolbar-title>

      <div class="q-mr-md text-caption text-grey-5">v{{ version }}</div>

      <div v-if="authStore.isAuthenticated" class="cursor-pointer">
        Logged in as
        <b>{{ authStore.user.first_name }} {{ authStore.user.last_name }}</b>
        <q-icon size="xs" name="arrow_drop_down" />
        <q-menu fir anchor="bottom right" self="top right">
          <q-list style="min-width: 150px">
            <q-item clickable v-close-popup @click="showProfileDialog = true">
              <q-item-section>
                <q-item-label>Edit Profile</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="person" />
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup @click="authStore.logout()">
              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="logout" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
    </q-toolbar>
  </q-header>

  <q-drawer v-if="authStore.isAuthenticated" v-model="leftDrawerOpen" show-if-above bordered>
    <q-list>
      <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
    </q-list>
  </q-drawer>

  <!-- Profile Edit Dialog -->
  <q-dialog v-model="showProfileDialog">
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">Edit Profile</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit="updateProfile" class="q-gutter-md">
          <q-input
            v-model="profileForm.first_name"
            label="First Name"
            filled
            :rules="[val => val && val.length > 0 || 'First name is required']"
          />
          
          <q-input
            v-model="profileForm.last_name"
            label="Last Name"
            filled
            :rules="[val => val && val.length > 0 || 'Last name is required']"
          />

          <div class="row justify-end q-mt-md">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn 
              type="submit" 
              label="Save" 
              color="primary" 
              :loading="updatingProfile"
              class="q-ml-sm"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>


<script setup>
import { ref, reactive, watch } from 'vue'
import { useAuthStore } from 'stores/auth'
import versionData from '@/version.json'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Tasks',
    icon: 'task_alt',
    link: '/',
  },
]

const authStore = useAuthStore()
const version = versionData.version

const leftDrawerOpen = ref(false)
const showProfileDialog = ref(false)
const updatingProfile = ref(false)

const profileForm = reactive({
  first_name: '',
  last_name: ''
})

// Watch for dialog open to populate form
watch(showProfileDialog, (isOpen) => {
  if (isOpen && authStore.user) {
    profileForm.first_name = authStore.user.first_name || ''
    profileForm.last_name = authStore.user.last_name || ''
  }
})

const updateProfile = async () => {
  updatingProfile.value = true
  
  try {
    const success = await authStore.updateProfile({
      first_name: profileForm.first_name,
      last_name: profileForm.last_name
    })
    
    if (success) {
      showProfileDialog.value = false
    }
  } finally {
    updatingProfile.value = false
  }
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>