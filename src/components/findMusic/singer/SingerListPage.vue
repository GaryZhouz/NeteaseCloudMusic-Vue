<template>
    <el-container style="margin-bottom: 55px;">
        <el-header style="height: 80px;">
            <p>
                语种:
                <span id="areas" v-for="(item,index) in singerLanguage" :class="index===0? 'isActive' : 'area'+item.id"
                      @click="changeMusicListTypes(item.id)"
                      style="margin-left: 25px;cursor: pointer;">{{item.name}}</span>
            </p>
            <p>
                分类:
                <span id="types" v-for="(item,index) in singerType"
                      :class="index===0? 'isActiveByTypes' : 'type'+item.id"
                      @click="changeMusicListSex(item.id)"
                      style="margin-left: 25px;cursor: pointer;">{{item.name}}</span>

                <!--                @click="changeMusicListCat(item.name,index)"-->
            </p>
        </el-header>

        <el-main>

            <el-row :gutter="10">

                <el-col :span="4" v-for="(item,index) in singerList" style="margin-top: 20px;position:relative;"
                        :key="index">

                    <div>
                        <el-image :src="item.img1v1Url" @click="toSingerDetailPage(item.id)"
                                  style="box-shadow: 0 0 2px 2px gray;border-radius: 10px;cursor: pointer">
                        </el-image>
                    </div>


                    <h1 @click="toSingerDetailPage(item.id)" style="cursor:pointer;">{{item.name}}</h1>

                </el-col>
            </el-row>
            <!--分页-->
            <el-pagination background
                           layout="prev,next"  :page-size="queryInfo.limit"
                           @current-change="handleCurrentChange">
            </el-pagination>

        </el-main>
    </el-container>
</template>

<script>
    export default {
        data() {
            return {
                //歌手分类查询条件
                queryInfo: {
                    type: -1,
                    area: -1,
                    limit: 12,
                    offset: 0,
                },
                //歌手类型分类标签
                singerType: [
                    {id: -1, name: '全部'},
                    {id: 1, name: '男歌手'},
                    {id: 2, name: '女歌手'},
                    {id: 3, name: '乐队'}
                ],
                //歌手语种分类
                singerLanguage: [
                    {id: -1, name: '全部'},
                    {id: 7, name: '华语'},
                    {id: 96, name: '欧美'},
                    {id: 8, name: '日本'},
                    {id: 16, name: '韩国'},
                    {id: 0, name: '其他'}
                ],
                //歌手数据
                singerList: [],
                //上一次点击的语种分类(默认的是type-1)
                prevClickArea: 'area-1',
                //上一次点击的语种分类(默认的是type-1)
                prevClickType: 'type-1'
            }
        },
        created() {
            //获取歌手数据
            this.getSingerList()
        },
        methods: {
            //获取歌手数据
            getSingerList() {
                this.$http.get('artist/list', {params: this.queryInfo}).then(res => {
                    this.singerList = res.data.artists
                })
            },
            //分页插件页数改变
            handleCurrentChange(newPage) {
                this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit
                this.getSingerList();
            },
            //改变语种分类
            changeMusicListTypes(areaId) {
                //撤销上一次被选中的标签的样式
                this.$('.isActive').eq(0).attr('class', this.prevClickArea)
                //这次点击的标签高亮
                this.$('.area' + areaId).eq(0).attr('class', 'isActive')
                //赋值存储
                this.prevClickArea = 'area'+areaId
                //修改查询条件
                this.queryInfo.area = areaId
                this.getSingerList()
            },
            //改变歌手性别分类
            changeMusicListSex(typeId) {
                //撤销上一次被选中的标签的样式
                this.$('.isActiveByTypes').eq(0).attr('class', this.prevClickType)
                //这次点击的标签高亮
                this.$('.type' + typeId).eq(0).attr('class', 'isActiveByTypes')
                //赋值存储
                this.prevClickType = 'type'+typeId
                //修改查询条件
                this.queryInfo.type = typeId
                this.getSingerList()
            },
            //跳转歌手详情页
            toSingerDetailPage(id) {
                this.$router.push('/singer/'+id);
            }
        }
    }
</script>

<style lang="less" scoped>
    #types:hover, #areas:hover {
        color: red;
    }

    .isActive, .isActiveByTypes {
        color: red;
    }
</style>
