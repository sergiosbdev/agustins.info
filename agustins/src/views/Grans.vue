<template>
  <div class="max-w-4xl mx-auto p-6 bg-white">
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-3xl font-bold text-gray-900">
          {{ 'Graaans' }}
        </h1>
      </div>
      
    </div>

    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="grid grid-cols-7 bg-gray-100">
        <div 
          v-for="day in dayNames" 
          :key="day" 
          class="p-3 text-center font-semibold text-gray-700 border-b border-gray-200"
        >
          {{ day }}
        </div>
      </div>

      <div class="grid grid-cols-7">
        <div 
          v-for="i in firstDayOfMonth" 
          :key="`empty-${i}`" 
          class="h-24 bg-gray-50 border border-gray-200"
        ></div>
        
        <div
          v-for="position in daysInMonth"
          :key="`pos-${position}`"
          :class="[
            'h-24 border border-gray-200 p-1 relative cursor-pointer transition-all hover:bg-gray-50',
            isToday(dayPositions[position]) ? 'bg-blue-50 border-blue-300' : 'bg-white',
            draggedDay === dayPositions[position] ? 'ring-2 ring-blue-400' : ''
          ]"
          @dragover.prevent="handleDragOver"
          @drop="handleDrop($event, position)"
        >
          <!-- Draggable day number -->
          <div
            :class="[
              'text-lg font-bold cursor-move select-none transition-transform hover:scale-110',
              isToday(dayPositions[position]) ? 'text-blue-600' : 'text-gray-900',
              draggedDay === dayPositions[position] ? 'transform scale-95' : ''
            ]"
            draggable="true"
            @dragstart="handleDragStart($event, dayPositions[position])"
            @dragend="handleDragEnd"
          >
            {{ dayPositions[position] }}
          </div>
          
          <!-- Events stay with their original day numbers -->
          <div
            v-if="events[dayPositions[position]]"
            :class="[
              events[dayPositions[position]].color,
              'text-white text-xs p-1 rounded mt-1 shadow-sm pointer-events-none select-none'
            ]"
          >
            {{ events[dayPositions[position]].title }}
          </div>
          
          <!-- Add event button -->
          <button
            v-if="!events[dayPositions[position]]"
            class="absolute bottom-1 right-1 text-gray-400 hover:text-gray-600 text-xs opacity-0 hover:opacity-100 transition-opacity"
            @click.stop="addEvent(dayPositions[position])"
          >
            + Event
          </button>
          
          <!-- Remove event button -->
          <button
            v-if="events[dayPositions[position]]"
            class="absolute top-1 right-1 text-red-400 hover:text-red-600 text-xs opacity-0 hover:opacity-100 transition-opacity"
            @click.stop="removeEvent(dayPositions[position])"
          >
            ×
          </button>
        </div>
      </div>
    </div>

    <!-- Position Status -->
    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 class="text-lg font-semibold text-gray-800 mb-3">Day Positions</h3>
      <div class="text-sm text-gray-600 mb-2">
        Current order: {{ getCurrentOrder }}
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <div
          v-for="[day, event] in Object.entries(events)"
          :key="day"
          class="flex items-center space-x-2"
        >
          <div :class="[event.color, 'w-4 h-4 rounded']"></div>
          <span class="text-sm text-gray-700">
            Day {{ day }}: {{ event.title }}
          </span>
        </div>
      </div>
      <p v-if="Object.keys(events).length === 0" class="text-gray-500 text-sm">
        No events scheduled
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Event {
  title: string
  color: string
}

const currentDate = ref(new Date())
const events = ref<Record<number, Event>>({
  1: { title: 'Team Meeting', color: 'bg-blue-500' },
  15: { title: 'Project Deadline', color: 'bg-red-500' },
  22: { title: 'Birthday Party', color: 'bg-green-500' },
  28: { title: 'Conference', color: 'bg-purple-500' }
})

const dayPositions = ref<Record<number, number>>({})
const draggedDay = ref<number | null>(null)

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const daysInMonth = computed(() => {
  const start = new Date(currentDate.value.getFullYear(), 5, 23) // 23 de junio
  const end = new Date(currentDate.value.getFullYear(), 6, 18) // 18 de julio
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  console.log("days",days);
  return days
})

const firstDayOfMonth = computed(() => 
  new Date(currentDate.value.getFullYear(), 5, 23).getDay() // 23 de junio
)

const getCurrentOrder = computed(() => {
  return Object.keys(dayPositions.value)
    .sort((a, b) => Number(a) - Number(b))
    .map(pos => dayPositions.value[Number(pos)])
    .join(', ')
})

// Initialize day positions when month changes
watch([currentDate, daysInMonth], () => {
  const initialPositions: Record<number, number> = {}
  for (let i = 1; i <= daysInMonth.value; i++) {
    initialPositions[i] = i
  }
  dayPositions.value = initialPositions
}, { immediate: true })

const isToday = (dayNumber: number): boolean => {
  const today = new Date()
  return today.getDate() === dayNumber && 
         today.getMonth() === currentDate.value.getMonth() && 
         today.getFullYear() === currentDate.value.getFullYear()
}

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const handleDragStart = (e: DragEvent, dayNumber: number) => {
  draggedDay.value = dayNumber
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
  }
  if (e.target instanceof HTMLElement) {
    e.target.style.opacity = '0.5'
  }
}

const handleDragEnd = (e: DragEvent) => {
  if (e.target instanceof HTMLElement) {
    e.target.style.opacity = '1'
  }
  draggedDay.value = null
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'
  }
}

const handleDrop = (e: DragEvent, targetPosition: number) => {
  e.preventDefault()
  
  if (draggedDay.value !== null && targetPosition >= 1 && targetPosition <= daysInMonth.value) {
    const newPositions = { ...dayPositions.value }
    
    // Find current position of dragged day
    const currentPos = Object.keys(newPositions).find(pos => 
      newPositions[Number(pos)] === draggedDay.value
    )
    
    if (currentPos) {
      // Find what day is currently at target position
      const dayAtTarget = newPositions[targetPosition]
      
      // Swap the positions
      newPositions[Number(currentPos)] = dayAtTarget
      newPositions[targetPosition] = draggedDay.value
      
      dayPositions.value = newPositions
    }
  }
}

const resetCalendar = () => {
  const resetPositions: Record<number, number> = {}
  for (let i = 1; i <= daysInMonth.value; i++) {
    resetPositions[i] = i
  }
  dayPositions.value = resetPositions
}

const randomizeCalendar = () => {
  const days = Array.from({ length: daysInMonth.value }, (_, i) => i + 1)
  const shuffled = [...days].sort(() => Math.random() - 0.5)
  
  const randomPositions: Record<number, number> = {}
  for (let i = 1; i <= daysInMonth.value; i++) {
    randomPositions[i] = shuffled[i - 1]
  }
  dayPositions.value = randomPositions
}

const addEvent = (originalDay: number) => {
  const title = prompt('Enter event title:')
  if (title) {
    const colors = ['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500']
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    events.value = {
      ...events.value,
      [originalDay]: { title, color: randomColor }
    }
  }
}

const removeEvent = (originalDay: number) => {
  const newEvents = { ...events.value }
  delete newEvents[originalDay]
  events.value = newEvents
}
</script>