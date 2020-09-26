<template>
    <el-container style="margin-bottom: 55px;">
        <el-header style="height: 80px;">
            <p>
                地区:
                <span id="areas" v-for="(item,index) in areas" :class="index===0? 'isActive' : 'area'+item.id"
                      @click="changeAreas(item.id,item.name)"
                      style="margin-left: 25px;cursor: pointer;">{{item.name}}</span>
            </p>
            <p>
                分类:
                <span id="types" v-for="(item,index) in types"
                      :class="index===0? 'isActiveByTypes' : 'type'+item.id"
                      @click="changeTypes(item.id,item.name)"
                      style="margin-left: 25px;cursor: pointer;">{{item.name}}</span>

            </p>
            <p>
                排序:
                <span id="order" v-for="(item,index) in order"
                      :class="index===0? 'isActiveByOrder' : 'order'+item.id"
                      @click="changeOrder(item.id,item.name)"
                      style="margin-left: 25px;cursor: pointer;">{{item.name}}</span>
            </p>
        </el-header>

        <el-main style="margin-top: 25px;">

            <el-row :gutter="10">

                <el-col :span="4" v-for="(item,index) in mvList" style="margin-top: 20px;position:relative;"
                        :key="index">

                    <div>
                        <el-image :src="item.cover" @click="toMvPage(item.id)"
                                  style="box-shadow: 0 0 2px 2px gray;border-radius: 10px;cursor: pointer">
                        </el-image>
                    </div>
                    <!--播放量-->
                    <div style="background: rgba(128,128,128,0.2);color: white;
                                    width: 96%;position:absolute;top:0;z-index: 10;">
                        <div style="float:right;">
                            <i class="el-icon-headset" style="margin-right: 5px;"></i>
                            {{item.playCount >= 10000 ? (item.playCount/10000).toFixed(0)+'万' :
                            item.playCount}}
                        </div>

                    </div>

                    <h1 @click="toMvPage(item.id)" style="cursor:pointer;">{{item.name}}</h1>

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
                //分类查询条件
                queryInfo: {
                    type: '全部',
                    area: '全部',
                    order: '上升最快',
                    limit: 12,
                    offset: 0,
                },
                //类型分类标签
                types: [
                    {id: -1, name: '全部'},
                    {id: 1, name: '官方版'},
                    {id: 2, name: '原生'},
                    {id: 3, name: '现场版'},
                    {id: 4, name: '网易出品'}
                ],
                //地区分类
                areas: [
                    {id: -1, name: '全部'},
                    {id: 7, name: '内地'},
                    {id: 96, name: '港台'},
                    {id: 8, name: '欧美'},
                    {id: 16, name: '日本'},
                    {id: 0, name: '韩国'}
                ],
                //排序数据
                order: [
                    {id: 1, name: '上升最快'},
                    {id: 2, name: '最热'},
                    {id: 3, name: '最新'}
                ],
                //mv数据
                mvList: [],
                //上一次点击的语种分类(默认的是type-1)
                prevClickArea: 'area-1',
                //上一次点击的语种分类(默认的是type-1)
                prevClickType: 'type-1',
                //上一次点击的语种分类(默认的是type-1)
                prevClickOrder: 'order1'
            }
        },
        created() {
            //获取歌手数据
            this.getMvList()
        },
        methods: {
            //获取Mv数据
            getMvList() {
                this.$http.get('/mv/all', {params: this.queryInfo}).then(res => {
                    this.mvList = res.data.data
                    console.log(this.mvList)
                })
            },
            //分页插件页数改变
            handleCurrentChange(newPage) {
                this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit
                this.getMvList();
            },
            //改变地区分类
            changeAreas(areaId, areaName) {
                //撤销上一次被选中的标签的样式
                this.$('.isActive').eq(0).attr('class', this.prevClickArea)
                //这次点击的标签高亮
                this.$('.area' + areaId).eq(0).attr('class', 'isActive')
                //赋值存储
                this.prevClickArea = 'area' + areaId
                //修改查询条件
                this.queryInfo.area = areaName
                this.getMvList()
            },
            //改变mv分类
            changeTypes(typeId, typeName) {
                //撤销上一次被选中的标签的样式
                this.$('.isActiveByTypes').eq(0).attr('class', this.prevClickType)
                //这次点击的标签高亮
                this.$('.type' + typeId).eq(0).attr('class', 'isActiveByTypes')
                //赋值存储
                this.prevClickType = 'type' + typeId
                //修改查询条件
                this.queryInfo.type = typeName
                this.getMvList()
            },
            //改变排序
            changeOrder(orderId, orderName) {
                //撤销上一次被选中的标签的样式
                this.$('.isActiveByOrder').eq(0).attr('class', this.prevClickOrder)
                //这次点击的标签高亮
                this.$('.order' + orderId).eq(0).attr('class', 'isActiveByOrder')
                //赋值存储
                this.prevClickOrder = 'order' + orderId
                //修改查询条件
                this.queryInfo.order = orderName
                this.getMvList()
            },
            //跳转歌手详情页
            toMvPage(id) {
                this.$router.push('/toVideoPage/' + id);
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

    #types:hover, #areas:hover, #order:hover {
        color: red;
    }

    .isActive, .isActiveByTypes, .isActiveByOrder {
        color: red;
    }
</style>
