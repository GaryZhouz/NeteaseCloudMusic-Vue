<template>

    <el-container>
        <el-header height="180px;">
            <div style="background-color: rgb(240,240,242);height: 130px;margin-top: 25px;">
                <el-input v-model="comment" type="text" show-word-limit maxlength="120" size="medium"
                          style="display: inline-block;width: 98%;margin: 15px 15px;">
                </el-input>
                <el-button size="mini" style="float:right;margin-right: 14px;" @click="sendComment">评论</el-button>
            </div>
        </el-header>

        <el-main style="margin-top: 25px;margin-bottom: 35px;">

            <h4 style="font-weight: 300" v-if="queryInfo.offset === 0">精彩评论</h4>
            <!--精彩评论的信息-->
            <div v-for="item in hotCommentList"
                 style="position: relative;border-top: 2px solid rgb(240,240,242);
                 border-bottom: 1px solid rgb(240,240,242);padding: 15px 0;font-size: 15px;">

                <div>
                    <!--用户头像-->
                    <img :src="item.user.avatarUrl" alt=""
                         style="display: inline;width: 50px;height: 50px;border-radius: 25px;">

                    <!--评论信息-->
                    <div style="margin-left: 60px;margin-top: -60px;">
                        <p><span style="color: #4d99de;">{{item.user.nickname}}</span>: {{item.content}}</p>

                        <br v-if="item.beReplied.length > 0">
                        <!--子评论-->
                        <div v-if="item.beReplied.length > 0"
                             style="background-color: rgb(241,241,244);padding: 5px 5px;">
                            <p v-for="citem in item.beReplied"><span
                                    style="color: #4d99de;">{{citem.user.nickname}}</span>: {{citem.content}}</p>
                        </div>

                        <p style="display:block;font-size: 13px;color: gray;opacity: 0.7">{{item.time | dateFormat}}</p>
                    </div>
                </div>
            </div>


            <h4 style="font-weight: 300;margin-top: 25px;">最新评论({{total}})</h4>
            <!--所有评论的信息-->
            <div v-for="item in commentList"
                 style="position: relative;border-top: 2px solid rgb(240,240,242);
                 border-bottom: 1px solid rgb(240,240,242);padding: 15px 0;font-size: 15px;">

                <div>
                    <!--用户头像-->
                    <img :src="item.user.avatarUrl" alt=""
                         style="display: inline;width: 50px;height: 50px;border-radius: 25px;">

                    <!--评论信息-->
                    <div style="margin-left: 60px;margin-top: -60px;">
                        <p><span style="color: #4d99de;">{{item.user.nickname}}</span>: {{item.content}}</p>

                        <br v-if="item.beReplied.length > 0">
                        <!--子评论-->
                        <div v-if="item.beReplied.length > 0"
                             style="background-color: rgb(241,241,244);padding: 5px 5px;">
                            <p v-for="citem in item.beReplied"><span
                                    style="color: #4d99de;">@{{citem.user.nickname}}</span>: {{citem.content}}</p>
                        </div>

                        <p style="display:block;font-size: 13px;color: gray;opacity: 0.7">{{item.time | dateFormat}}</p>
                    </div>
                </div>
            </div>

            <!--分页-->
            <el-pagination
                    layout="prev, pager, next" :page-size="queryInfo.limit"
                    :total="total" @current-change="handleCurrentChange">
            </el-pagination>
        </el-main>

    </el-container>

</template>

<script>
    export default {
        data() {
            return {
                queryInfo: {
                    id: this.$route.params.id,
                    limit: 10,
                    offset: 0,
                },
                //当前歌单的id
                currentId: this.$route.params.id,
                //所有评论列表
                commentList: [],
                //最热评论列表
                hotCommentList: [],
                //评论总数
                total: 0,
                //输入的评论信息
                comment: ''
            }
        },
        created() {
            //获取评论列表
            this.getCommentList()
        },
        methods: {
            //获取评论列表
            getCommentList() {
                this.$http.get('comment/playlist', {params: this.queryInfo}).then(res => {
                    if (res.data.code !== 200) return this.$message.error('获取评论数据失败!')
                    this.commentList = res.data.comments
                    this.hotCommentList = res.data.hotComments
                    this.total = res.data.total
                })
            },
            //分页插件页数改变
            handleCurrentChange(newPage) {
                this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit
                this.getCommentList();
            },
            //发送评论
            sendComment() {
                this.$http.get('comment', {
                    params: {
                        t: 1,
                        type: 2,
                        id: this.currentId,
                        content: this.comment
                    }
                }).then(res => {
                    console.log(res)
                    if (res.data.code !== 200) return this.$message.error('用户未登录,或遇未知错误')
                    this.getCommentList()
                    this.$message.success('评论成功!数据同步可能会耗时!')
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    /deep/ .el-input--medium .el-input__inner {
        height: 60px !important;
    }

    p {
        margin: 5px 0;
    }
</style>
