<template>
  <div>
    <b-navbar toggleable="sm" type="dark" fixed="top">
      <b-navbar-brand href="/">PublicTransport.is</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        
        <b-navbar-nav class="ml-auto">

          <b-nav-item href="https://cyclingiceland.is/wp-content/uploads/2019/02/CI2018_Cycling_in_Iceland_Infotext_EN_20June2018.pdf" target="_blank">By bike</b-nav-item>
          <b-nav-item href="/about">About</b-nav-item>


        <b-nav-item-dropdown text="Download PDF" right>
          <b-dropdown-item href="/pt2019_en.pdf" target="_blank">EN PDF</b-dropdown-item>
          <b-dropdown-item href="/pt2019_de.pdf" target="_blank">DE PDF</b-dropdown-item>
          <b-dropdown-item href="/pt2019_is.pdf" target="_blank">IS PDF</b-dropdown-item>
        </b-nav-item-dropdown>

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

    .nav-link.nav-link {
      color: white;
      &:hover {
        color: white;
        text-decoration: underline;
      }
    }
  }
</style>
