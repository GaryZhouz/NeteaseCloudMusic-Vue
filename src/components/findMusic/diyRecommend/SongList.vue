<template>
    <el-container style="margin-bottom: 55px;">

        <el-header height="220px;">
            <el-row>
                <!--歌单图标-->
                <img :src="currentSongList.coverImgUrl" style="width: 220px;height: 220px;"/>

                <!--右侧歌曲信息-->
                <div style="float:right;color: gray">
                    <div style="opacity: 0.6">
                        <p>歌曲数 | 播放量</p>
                        <p style="float:right;margin: 0">{{currentSongList.trackCount}} |
                            {{(currentSongList.playCount/10000).toFixed(0)}}万</p>
                    </div>
                </div>

                <!--标签及名字-->
                <el-tag type="danger" style="background-color: white;position: absolute;top: 0;left: 240px;">精品歌单
                </el-tag>
                <h2 style="position: absolute;top: -20px;left: 320px;font-weight: 400">{{currentSongList.name}}</h2>

                <!--作者信息-->
                <img :src="currentSongList.creator.avatarUrl"
                     style="width: 35px;height: 35px;border-radius:15px;position: absolute;top: 50px;left: 15%;">
                <span style="position:absolute;top: 57px;left: 18%;">{{currentSongList.creator.nickname}}</span>
                <span style="position:absolute;top: 57px;left: 27%;opacity: 0.7;">{{currentSongList.createTime | dateFormat}}创建</span>


                <!--按钮组-->
                <el-button type="danger" size="mini" icon="el-icon-video-play"
                           style="position:absolute;top: 100px;left: 240px;"
                           @click="setSongListInfo(playList,playList[0])">
                    播放全部
                </el-button>

                <el-button icon="el-icon-folder-add" size="mini" @click="subscripe(currentSongList.id)"
                           style="position: absolute;top: 100px;left: 340px;color: black">
                    收藏({{currentSongList.subscribedCount}})
                </el-button>

                <el-button icon="el-icon-share" size="mini"
                           style="position: absolute;top: 100px;left: 480px;color: black">
                    分享({{currentSongList.shareCount}})
                </el-button>

                <!--标签信息-->
                <span style="position: absolute;top: 150px;left: 240px;">
                    标签: <span style="color: rgb(12,115,194);cursor: pointer"
                              v-for="(item,index) in currentSongList.tags">{{index+1 === currentSongList.tags.length ? item : item+' / '}}</span>
                </span>

                <!--简介信息-->
                <el-collapse style="position: absolute;top: 180px;left: 240px;border: none;z-index: 999">
                    <el-collapse-item :title="'简介: ' + (currentSongList.description + '').substr(0,26) + '...' ">
                        <p>{{currentSongList.description}}</p>
                    </el-collapse-item>
                </el-collapse>
            </el-row>

        </el-header>

        <el-main>

            <el-menu default-active="1" class="el-menu-demo" mode="horizontal" style="width: 280px;">
                <el-menu-item index="1" @click="toMusicListPage">歌曲列表</el-menu-item>
                <el-menu-item index="2" @click="toCommentPage">评论({{currentSongList.commentCount}})</el-menu-item>
            </el-menu>

            <router-view ref="child" @setSongListInfo="setSongListInfo"></router-view>
        </el-main>

    </el-container>
</template>

<script>
    export default {
        data() {
            return {
                //前一个组件传递过来的值 放入localStorage保存
                currentId: this.$route.params.id ? this.$route.params.id : window.localStorage.getItem('currentId'),
                //当前歌单信息
                currentSongList: {
                    //创建人信息
                    creator: {
                        avatarUrl: '',
                        nickname: '',
                    },
                    trackIds: []
                },
                //传递给下一个组件的所有歌曲id查询信息
                queryIds: '',
                //当前歌单所有歌曲id信息
                playList: window.localStorage.getItem('playList') === null ? [] : window.localStorage.getItem('playList').split(',')
            }
        },
        created() {
            this.getSongListInfo();
            //注册监听的事件 在main.js中定义了
            window.addEventListener('setItem', () => {
                //这里是为了从主页进入的歌单 页面不进行变化 所以加一个localstorage监听器 监听当前歌单变化
                //如果有变化直接就重新查询数据 替换掉之前的数据  实现刷新页面
                this.currentId = parseInt(localStorage.getItem('currentId'))
                //重新加载数据(暂有BUG未修)
                this.getSongListInfo()

            })
        },
        mounted() {
            //把上一个页面传递来的参数放入localstorage 防止页面刷新 参数没了
            window.localStorage.setItem('currentId', this.currentId);
        },
        methods: {
            //获取歌单信息并处理歌单所有歌曲数据
            getSongListInfo() {
                this.$http.get('playlist/detail', {params: {id: this.currentId}}).then(res => {
                    this.currentSongList = res.data.playlist
                    //等待数据赋值后,马上自执行一次路由跳转加载子组件
                    const href = window.location.href;
                    if (href.substring(href.lastIndexOf('/'), href.length) !== '/musicPage') {//如果为自跳转则执行
                        this.toMusicListPage()
                    }
                })
            },
            //路由跳转并携带歌单ids数组参数
            toMusicListPage() {
                var queryIds = ''
                this.currentSongList.trackIds.forEach(item => {
                    queryIds += item.id + ','
                })
                this.$router.push({
                    name: 'musicPage',
                    params: {
                        ids: queryIds.substr(0, queryIds.length - 1)
                    }
                })
            },
            //路由跳转携带参数
            toCommentPage() {
                this.$router.push('/comment/' + this.currentId);
            },
            //子组件传递来的歌单所有歌曲id信息,和当前播放的音乐的id
            setSongListInfo(songList, curId) {
                this.playList = songList
                this.$emit('setSongListInfo', songList, curId);
            },
            //收藏歌单
            subscripe(id) {
                this.$http.get('playlist/subscribe', {params: {id: id, t: 1}}).then(res => {
                    console.log(res)
                    if (res.data.code === 200) {
                        return this.$message.success('收藏成功,数据同步需要时间!')
                    } else {
                        return this.$message.info('收藏失败!')
                    }
                })
            }
        },
    }
</script>

<style lang="less" scoped>
    .el-button {
        border-radius: 5px;
        color: white;
    }

    .el-menu.el-menu--horizontal {
        border-bottom: 0px;
    }

    .el-menu-item.is-active {
        color: black;
        border-bottom: 2px solid red !important;
    }
</style>
