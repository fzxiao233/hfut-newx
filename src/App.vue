<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="info" class="navbar">
      <b-navbar-brand href="#"><img src="./assets/NEWX.png" height="30" alt="NEWX"></b-navbar-brand>
      <b-collapse is-nav>
        <b-navbar-nav>
          <b-nav-item><router-link to="/select">查询</router-link></b-nav-item>
          <b-nav-item><router-link to="/newx">NEWX</router-link></b-nav-item>
          <b-nav-item><router-link to="/curriculum">课表</router-link></b-nav-item>
          <b-nav-item><router-link to="/feedback">反馈</router-link></b-nav-item>
          <b-nav-item><router-link to="/my">我的</router-link></b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view/>
  </div>
</template>


<style lang="scss">
  .navbar {
    margin-bottom: 60px;
  }
  a {
    color: white!important;
    :hover {
      text-decoration: none!important;
    }

  }
</style>
