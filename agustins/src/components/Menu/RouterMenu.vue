<template>
    <Menu :model="items" />
  </template>
  
  <script lang="ts" setup>
  import Menu from "primevue/menu";
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  
  const items = ref([
    {
      label: "Infantil",
      icon: "pi pi-plus",
      command: () => {
        router.push("/infantil");
      }
    },
    {
      label: "Petits",
      icon: "pi pi-search",
      command: () => {
        router.push("/petits");
      }
    },
    {
      label: "Mitjans",
      icon: "pi pi-cog",
      command: () => {
        router.push("/mitjans");
      }
    },
    {
      label: "Grans",
      icon: "pi pi-sign-out",
      command: () => {
        router.push("/grans");
      }
    },
    {
      label: "Joves",
      icon: "pi pi-sign-out",
      command: () => {
        router.push("/joves");
      }
    },
  ]);
  </script>