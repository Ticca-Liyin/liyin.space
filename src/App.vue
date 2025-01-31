<script setup>
// import { RouterView } from 'vue-router'

</script>

<template>
  <RouterView />
</template>

<style>
* {
    padding: 0;
    margin: 0;
}
a {
    text-decoration: none;
}
body {
  /* height: 100%;
  overflow: hidden; */
}
:focus-visible {
    /* outline: none; */
}

.el-dialog::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}   
.el-dialog::-webkit-scrollbar-track {
    background-color: transparent;
}
.el-dialog::-webkit-scrollbar-thumb {
    background-color: rgba(139, 139, 139, 0.4);
    border-radius: 10px;
}
.el-dialog::-webkit-scrollbar-button {
    display: none;
}
</style>
