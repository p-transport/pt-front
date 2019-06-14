<template>
  <div>
    <b-navbar type="dark">
      <b-navbar-brand href="/">Public Transport Iceland</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        
        <b-navbar-nav class="ml-auto">
          <b-nav-item href="/about">About</b-nav-item>
          <b-nav-item target="_blank" href="/PT-2019-enska-vefsidur-mai-2019-.pdf">Download PDF</b-nav-item>
        </b-navbar-nav>

      </b-collapse>

    </b-navbar>
    <nuxt />
  </div>
</template>

<style lang="scss">
  .navbar {
    background-color: #A10B0B;
    
    .navbar-brand {
      font-weight: bold;
    }
  }
</style>
