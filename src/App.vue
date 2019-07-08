<template>
    <div class="layout-w">
      <transition name="fade" mode="out-in">
          <router-view></router-view>
      </transition>
    </div>
</template>

<style lang="scss" scoped>

  .layout-w {
    min-height: 100vh;
    background-color: red;
  }
</style>
