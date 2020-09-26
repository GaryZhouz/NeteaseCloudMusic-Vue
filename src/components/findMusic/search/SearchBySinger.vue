<template>
    <div style="margin-bottom: 75px;">
        <el-row v-for="(item,index) in singerList" style="margin-top: 25px;">
            <el-col :span="12" :offset="6" @click.native="toSingerPage(item.id)"
                    :style="index % 2 === 0 ? 'background: rgb(245,245,247)' : ''">
                <el-image :src="item.picUrl" style="width: 100px;height: 100px;"></el-image>
                <span style="position: absolute;top: 40%">{{item.name}}</span>
            </el-col>
        </el-row>
        <!--分页-->
        <el-pagination style="display: block;width: 20%;margin: 15px auto"
                layout="prev, pager, next" :page-size="queryInfo.limit"
                :total="singerTotal" @current-change="handleCurrentChange">
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
                    limit: 30,
                    offset: 0,
                    type: 100
                    /* type
                        默认为1
                        1: 单曲 100:歌手 1000:歌单 1014:视频
                    */
                },
                //查询结果总数
                singerTotal: 0,
                //歌曲数的结果集
                singerList: [],
            }
        },
        created() {
            this.getSingerResult()
        },
        methods: {
            //查询搜索的歌手结果集
            getSingerResult() {
                this.$http.get('/search', {params: this.queryInfo}).then(res => {
                    this.singerList = res.data.result.artists
                    this.singerTotal = res.data.result.artistCount
                })
            },
            //跳转歌手页
            toSingerPage(id) {
                this.$router.push('/singer/' + id)
            },
            //分页插件页数改变
            handleCurrentChange(newPage) {
                this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit
                if (this.queryInfo.offset >= this.songTotal) this.queryInfo.offset = this.songTotal
                this.getSingerResult();
            },
        }
    }
</script>

<style lang="less" scoped>
    .el-col:hover {
        background-color: rgb(235, 236, 237) !important;
        cursor: pointer;
    }
</style>
