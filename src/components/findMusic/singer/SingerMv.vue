<template>
    <div style="margin-top: 25px;margin-bottom: 55px;">
        <el-row>

            <el-col :span="6" :offset="2" v-for="(item,index) in singerMvList"
                    style="margin-top: 20px;position:relative;"
                    :key="index">

                <!--播放量-->
                <div style="background: rgba(128,128,128,0.2);color: white;
                                    width: 99%;position:absolute;z-index: 10;">
                    <div style="float:right;">
                        <i class="el-icon-headset" style="margin-right: 5px;"></i>
                        {{item.playCount >= 10000 ? (item.playCount/10000).toFixed(0)+'万' : item.playCount}}
                    </div>

                </div>

                <div>
                    <el-image :src="item.imgurl" @click="toMvPage(item.id)"
                              style="box-shadow: 0 0 2px 2px gray;border-radius: 10px;cursor: pointer">
                    </el-image>
                </div>


                <h1 @click="toMvPage(item.id)" style="cursor:pointer;">{{item.name}}</h1>

            </el-col>

        </el-row>
        <!--分页-->
        <el-pagination background :page-size="queryInfo.limit"
                layout="prev, next" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                //当前歌手id
                singerId: this.$route.params.id,
                //查询条件
                queryInfo: {
                    id: this.$route.params.id,
                    limit: 9,
                    offset: 0
                },
                //当前歌手mv信息
                singerMvList: []
            }
        },
        created() {
            //查询当前歌手mv的信息
            this.getCurrentSingerMv()
        },
        methods: {
            //查询当前歌手mv的信息
            getCurrentSingerMv() {
                this.$http.get('artist/mv', {params: this.queryInfo}).then(res => {
                    this.singerMvList = res.data.mvs
                })
            },
            //分页插件页数改变
            handleCurrentChange(newPage) {
                this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit
                this.getCurrentSingerMv();
            },
            //跳转mv界面
            toMvPage(mvId) {
                this.$router.push('/toVideoPage/'+mvId)
            }
        }
    }
</script>

<style scoped>

</style>
