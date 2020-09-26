<template>
    <el-container style="margin-bottom: 55px;">
        <el-header>
            <p>
                热门标签:
                <span id="cats" v-for="(item,index) in hotMusicListTags" :class="'cat'+index" @click="changeMusicListCat(item.name,index)"
                      style="margin-left: 25px;cursor: pointer;">{{item.name}}</span>
            </p>
        </el-header>

        <el-main>

            <el-row :gutter="10">

                <el-col :span="4" v-for="(item,index) in goodMusicList" style="margin-top: 20px;position:relative;"
                        :key="index">

                    <!--播放量-->
                    <div style="background: rgba(128,128,128,0.2);color: white;
                                    width: 96%;position:absolute;z-index: 10;">
                        <div style="float:right;">
                            <i class="el-icon-headset" style="margin-right: 5px;"></i>
                            {{item.playCount >= 10000 ? (item.playCount/10000).toFixed(0)+'万' : item.playCount}}
                        </div>

                    </div>

                    <div>
                        <el-image :src="item.coverImgUrl" @click="toSongListPage(item.id)"
                                  style="box-shadow: 0 0 2px 2px gray;border-radius: 10px;cursor: pointer">
                        </el-image>
                    </div>


                    <h1 @click="toSongListPage(item.id)" style="cursor:pointer;">{{item.name}}</h1>

                </el-col>
            </el-row>
            <!--分页-->
            <el-pagination
                    layout="prev, pager, next"  :page-size="queryInfo.limit"
                    :total="goodMusicListTotal" @current-change="handleCurrentChange">
            </el-pagination>

        </el-main>
    </el-container>

</template>

<script>
    export default {
        data() {
            return {
                //精品歌单分类查询条件
                queryInfo: {
                    cat: '全部',
                    limit: 24,
                    offset: 0,
                },
                //热门歌单分类标签
                hotMusicListTags: [],
                //精品歌单的列表
                goodMusicList: [],
                //精品歌单的总数
                goodMusicListTotal: 0,
                //上一次被点击过的分类标签
                prevClickCat: ''
            }
        },
        created() {
            //获取热门歌单标签信息
            this.getHotMusicListTags()
            //获取精品歌单
            this.getGoodMusicList()
        },
        methods: {
            //获取热门歌单标签信息
            getHotMusicListTags() {
                this.$http.get('playlist/hot').then(res => {
                    this.hotMusicListTags = res.data.tags
                })
            },
            //获取精品歌单
            getGoodMusicList() {
                this.$http.get('/top/playlist', {params: this.queryInfo}).then(res => {
                    this.goodMusicList = res.data.playlists
                    this.goodMusicListTotal = res.data.total
                })
            },
            //分页插件页数改变
            handleCurrentChange(newPage) {
                this.queryInfo.offset = (newPage - 1) * this.queryInfo.limit
                this.getGoodMusicList();
            },
            //点击歌单跳转界面
            toSongListPage(id) {
                this.$router.push('/songlist/' + id)
            },
            //点击标签筛选(index+jquery辅助我们切换点击后的文本的样式)
            changeMusicListCat(newCat,index) {
                //说明是点击上一次选中的标签,所以取消查询信息
                if (this.prevClickCat === 'cat'+index){
                    this.$('.activeCat').eq(0).attr('class',this.prevClickCat);
                    this.queryInfo.cat = '全部'
                    this.getGoodMusicList()
                }
                //设置查询条件的标签筛选
                this.queryInfo.cat = newCat
                //还原上一个被点击标签的类名
                this.$('.activeCat').eq(0).attr('class',this.prevClickCat);
                //防止多个标签高亮(设置上一个被点击的标签的name属性 以便于还原)
                if (this.prevClickCat !== 'cat'+index) {
                    this.prevClickCat = 'cat'+index
                }
                //设置新被点击的标签的类名
                this.$('.cat'+index).attr('class','activeCat')
                this.getGoodMusicList()
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

    #cats:hover {
        color: red
    }

    /*被点击的分类标签类名变成这个*/
    .activeCat{
        color: red;
    }
</style>
