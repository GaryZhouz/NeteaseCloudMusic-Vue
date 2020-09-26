<template>
    <el-container :key="this.$route.params.data">

        <el-header style="border-bottom: 1px solid rgb(230,230,230)" height="150px;">
            <el-menu :default-active="/searchBySong/+`${this.$route.params.data}`" :router="true" mode="horizontal" style="margin: 0 auto;width: 420px;">
                <el-menu-item :index="/searchBySong/+`${this.$route.params.data}`" ref="songClick">单曲</el-menu-item>
                <el-menu-item :index="/searchBySinger/+`${this.$route.params.data}`">歌手</el-menu-item>
                <el-menu-item :index="/searchByVideo/+`${this.$route.params.data}`">视频</el-menu-item>
                <el-menu-item :index="/searchByPlayList/+`${this.$route.params.data}`">歌单</el-menu-item>
            </el-menu>
        </el-header>

        <el-main>
            <router-view ref="child" @setMusicUrl="setMusicUrl"></router-view>
        </el-main>

    </el-container>
</template>

<script>
    export default {
        data() {
            return {
                //当前搜索的字幕
                searchData: decodeURIComponent(this.$route.params.data),
            }
        },
        created() {
            this.toSingSearchPage()
        },
        //decodeURIComponent参数解码
        methods: {
            toSingSearchPage() {
                this.searchData = this.$route.params.data
                //等待数据赋值后,马上自执行一次路由跳转加载子组件
                const href = window.location.href;
                if (href.substring(href.indexOf('#/') + 1, href.length) === '/search/' + encodeURIComponent(this.$route.params.data)) {//如果为自跳转则执行
                    this.$router.push('/searchBySong/' + decodeURIComponent(this.$route.params.data));
                }
            },
            //调用父类方法
            setMusicUrl(url,detail) {
                this.$emit('setMusicUrl', url,detail)
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
