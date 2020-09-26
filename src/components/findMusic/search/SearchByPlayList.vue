<template>
    <div style="margin-bottom: 75px;">
        <el-row v-for="(item,index) in playList" style="margin-top: 25px;">
            <el-col :span="18" :offset="4" @click.native="toPlayListPage(item.id)"
                    :style="index % 2 === 0 ? 'background: rgb(245,245,247)' : ''">
                <el-image :src="item.coverImgUrl" style="width: 100px;height: 100px;"></el-image>
                <span style="position: absolute;top: 40%">{{item.name}}</span>
                <span style="position: absolute;top: 40%;left: 50%">{{item.trackCount}}首</span>
                <span style="position: absolute;top: 40%;left: 70%">by {{item.creator.nickname}}</span>
            </el-col>
        </el-row>
        <!--分页-->
        <el-pagination style="display: block;width: 20%;margin: 15px auto"
                       layout="prev, pager, next" :page-size="queryInfo.limit"
                       :total="playListTotal" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                searchData: decodeURIComponent(this.$route.params.data),
                //当前的搜索条件
                queryInfo: {
                    keywords: this.$route.params.data,
                    limit: 12,
                    offset: 0,
                    type: 1000
                    /* type
                        默认为1
                        1: 单曲 100:歌手 1000:歌单 1014:视频
                    */
                },
                //查询结果总数
                playListTotal: 0,
                //歌曲数的结果集
                playList: [],
            }
        },
        created() {
            this.getPlayListResult()
        },
        methods: {
            //查询搜索的歌手结果集
            getPlayListResult() {
                this.$http.get('/search', {params: this.queryInfo}).then(res => {
                    this.playList = res.data.result.playlists
                    this.playListTotal = res.data.result.playlistCount
                })
            },
            //分页插件页数改变
            handleCurrentChange(newPage) {
                this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit
                if (this.queryInfo.offset >= this.songTotal) this.queryInfo.offset = this.songTotal
                this.getPlayListResult();
            },
            //跳转歌单页面
            toPlayListPage(id) {
                this.$router.push('/songlist/'+id)
            }
        }
    }
</script>

<style lang="less" scoped>
    .el-col:hover {
        background-color: rgb(235, 236, 237) !important;
        cursor: pointer;
    }
</style>
