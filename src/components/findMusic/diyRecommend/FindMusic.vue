<template>
    <el-container>

        <el-header style="border-bottom: 1px solid rgb(230,230,230)" height="150px;">
            <el-menu default-active="/diyRecommend" :router="true" mode="horizontal" style="margin: 0 auto;width: 420px;">
                <el-menu-item index="/diyRecommend">个性推荐</el-menu-item>
                <el-menu-item index="/musicListPage">歌单</el-menu-item>
                <el-menu-item index="/musicRank">排行榜</el-menu-item>
                <el-menu-item index="/singerList">歌手</el-menu-item>
                <el-menu-item index="/newMusicList">最新音乐</el-menu-item>
            </el-menu>
        </el-header>

        <el-main>
            <router-view ref="child" @setParentMusicUrl="setParentMusicUrl" @setSongListInfo="setSongListInfo"></router-view>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        data() {
            return {}
        },
        methods: {
            //调用父组价设置音乐url
            setParentMusicUrl(url,detail) {
                this.$emit('setMusicUrl',url,detail)
            },
            //调用父组件设置歌单信息, 跟当前曲目
            setSongListInfo(playlist,musicId){
                this.$emit('setSongListInfo', playlist, musicId)
            }
        }
    }
</script>

<style lang="less" scoped>
    .topBar {
        margin: 0 auto;
        width: 700px;

        span {
            margin-left: 40px;
            cursor: pointer;
        }

        span:hover {
            color: red;
        }

        span:visited {
            border-bottom: 1px solid red;
        }
    }

    .el-menu.el-menu--horizontal {
        border-bottom: 0px;
    }

    .el-menu-item.is-active {
        color: black;
        border-bottom: 2px solid red !important;
    }
</style>
