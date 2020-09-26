<template>
    <el-container style="margin-bottom: 55px;">
        <el-header>
            <el-button @click="showTagDialog">全部分类</el-button>

            <el-dialog title="全部标签" :visible.sync="tagDialogTableVisible" :modal="false"
                       style="position: absolute;top: 70px;left: -280px;">
                <el-tag v-for="item in tags" @click="changeTag(item.id)" class="tag"
                        :style="item.id===queryInfo.id ?'color: red' : 'blue'">
                    {{item.name}}
                </el-tag>
            </el-dialog>

        </el-header>

        <el-main>

            <el-row :gutter="10">

                <el-col :span="4" v-for="(item,index) in videoList" style="margin-top: 20px;position:relative;"
                        :key="index">

                    <!--播放量-->
                    <div style="background: rgba(128,128,128,0.2);color: white;
                                    width: 96%;position:absolute;z-index: 10;">
                        <div style="float:right;">
                            <i class="el-icon-headset" style="margin-right: 5px;"></i>
                            {{item.data.playTime >= 10000 ? (item.data.playTime/10000).toFixed(0)+'万' :
                            item.data.playTime}}
                        </div>

                    </div>

                    <div>
                        <el-image :src="item.data.coverUrl" @click="toVideoPage(item.data.vid)"
                                  style="box-shadow: 0 0 2px 2px gray;border-radius: 10px;cursor: pointer">
                        </el-image>
                    </div>


                    <h1 @click="toVideoPage(item.data.vid)" style="cursor:pointer;">{{item.data.title}}</h1>

                </el-col>
            </el-row>
            <!--分页-->
            <el-pagination
                    layout="prev, next" @current-change="handleCurrentChange">
            </el-pagination>

        </el-main>
    </el-container>

</template>

<script>
    export default {
        data() {
            return {
                //视频标签信息
                tags: [],
                tagDialogTableVisible: false,
                //查询视频条件
                queryInfo: {
                    id: 58100,
                    offset: 0
                },
                //视频列表
                videoList: [
                    {
                        data: {
                            title: ''
                        }
                    }
                ]
            }
        },
        created() {
            //获取视频标签
            this.getVideoTags()
            //获取视频信息
            this.getVideoList()
        },
        methods: {
            getVideoTags() {
                this.$http.get('video/group/list').then(res => {
                    this.tags = res.data.data
                })
            },
            showTagDialog() {
                this.tagDialogTableVisible = true
            },
            getVideoList() {
                if (window.localStorage.getItem('currentUserInfo') === 'null') {
                    return this.$message.error('需要登录获取视频数据!')
                }

                this.$http.get('video/group', {params: this.queryInfo}).then(res => {
                    this.videoList = res.data.datas
                })
            },
            //跳转视频播放页
            toVideoPage(id) {
                this.$router.push('videoPlay/' + id);
            },
            //处理页面
            handleCurrentChange(newPage) {
                this.queryInfo.offset += 8
                this.getVideoList()
            },
            //切换标签
            changeTag(tagId) {
                this.queryInfo.id = tagId
                this.getVideoList()
                this.tagDialogTableVisible = false
            }
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

    .tag {
        cursor: pointer;
        margin-left: 15px;
        margin-top: 15px;
        background-color: white;
    }
</style>
