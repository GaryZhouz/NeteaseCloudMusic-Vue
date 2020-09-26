<template>
    <el-container>
        <el-header style="border-bottom: 1px solid rgb(230,230,230)" height="150px;">
            <el-menu default-active="/videoPage" :router="true" mode="horizontal" style="margin: 0 auto;width: 320px;">
                <el-menu-item index="/videoPage">视频</el-menu-item>
                <el-menu-item index="/mvPage">MV</el-menu-item>
            </el-menu>
        </el-header>

        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "Video"
    }
</script>

<style lang="less" scoped>

    .el-menu.el-menu--horizontal {
        border-bottom: 0px;
    }

    .el-menu-item.is-active {
        color: black;
        border-bottom: 2px solid red !important;
    }
</style>
