<template>
    <div style="margin-bottom: 75px;">
        <el-row :gutter="10">

            <el-col :span="4" v-for="(item,index) in videoList" style="margin-top: 20px;position:relative;"
                    :key="index">

                <!--播放量-->
                <div style="background: rgba(128,128,128,0.2);color: white;
                                    width: 96%;position:absolute;z-index: 10;">
                    <div style="float:right;">
                        <i class="el-icon-headset" style="margin-right: 5px;"></i>
                        {{item.playTime >= 10000 ? (item.playTime/10000).toFixed(0)+'万' :
                        item.playTime}}
                    </div>

                </div>

                <div>
                    <el-image :src="item.coverUrl" @click="toVideoPage(item.vid)"
                              style="box-shadow: 0 0 2px 2px gray;border-radius: 10px;cursor: pointer">
                    </el-image>
                </div>


                <h1 @click="toVideoPage(item.vid)" style="cursor:pointer;">{{item.title}}</h1>

            </el-col>
        </el-row>
        <!--分页-->
        <el-pagination style="display: block;width: 20%;margin: 15px auto"
                       layout="prev, pager, next" :page-size="queryInfo.limit"
                       :total="videoTotal" @current-change="handleCurrentChange">
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
                    type: 1014
                    /* type
                        默认为1
                        1: 单曲 100:歌手 1000:歌单 1014:视频
                    */
                },
                //查询结果总数
                videoTotal: 0,
                //歌曲数的结果集
                videoList: [],
            }
        },
        created() {
            this.getVideoResult()
        },
        methods: {
            //查询搜索的视频结果集
            getVideoResult() {
                this.$http.get('/search', {params: this.queryInfo}).then(res => {
                    this.videoList = res.data.result.videos
                    this.videoTotal = res.data.result.videoCount
                })
            },
            //跳转视频播放页
            toVideoPage(id) {
                if (id.match(/\D/)!=null) {
                    this.$router.push('/videoPlay/' + id);
                } else {
                    this.$router.push('/toVideoPage/' + id);
                }
            },
            //分页插件页数改变
            handleCurrentChange(newPage) {
                this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit
                if (this.queryInfo.offset >= this.songTotal) this.queryInfo.offset = this.songTotal
                this.getVideoResult();
            },
        }
    }
</script>

<style lang="less" scoped>
    [class*=el-col-] {
        display: inline-block;
        float: none;
    }

    h1 {
        font-weight: 500;
    }
</style>
