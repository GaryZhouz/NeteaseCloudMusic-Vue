<template>
    <el-container style="height: 100%">

        <!--头部区域-->
        <el-header>
            <img src="imgs/logo.png" alt="" class="logo">
            <span>魔音灌耳</span>

            <!--头部搜索区域-->
            <el-input placeholder="搜索单曲,歌手,视频,歌单" v-model="searchData" size="mini" suffix-icon="el-icon-search">
                <el-button slot="suffix" class="searchBtn" size="mini" @click="toSearchPage"></el-button>
            </el-input>

            <!--右侧登录区域-->
            <div class="rightContainer" style="display: flex">
                <img v-if="currentUserInfo === null" src="imgs/userIcon.png" class="userIcon">
                <img v-else :src="currentUserInfo.avatarUrl" class="userIcon">

                <span v-if="currentUserInfo === null" style="cursor:pointer;" @click="handleLogin">
                    未登录
                </span>

                <span v-else>
                    {{currentUserInfo.nickname}}
                </span>
                <el-button type="danger" @click="logout" v-if="currentUserInfo !== null" size="mini"
                           style="height: 50%;margin-top: 10px;margin-left: 5px;">
                    退出
                </el-button>
            </div>

        </el-header>

        <!--主体区域-->
        <el-container>
            <!--侧边栏-->
            <el-aside width="210px">

                <el-menu default-active="/findMusic" :router="true">
                    <el-menu-item-group>
                        <template slot="title">推荐</template>
                        <el-menu-item index="/findMusic">发现音乐</el-menu-item>
                        <el-menu-item index="/video">视频</el-menu-item>
                    </el-menu-item-group>

                    <el-menu-item-group>
                        <template slot="title">我的音乐</template>
                        <el-menu-item index="/cloudMusic">我的音乐云盘</el-menu-item>
                    </el-menu-item-group>

                    <el-menu-item-group>
                        <template slot="title">创建的歌单</template>
                        <el-menu-item :index="'/songlist/'+item.id" @click="changePlaylistId(item.id)"
                                      v-for="item in currentUserPlayList"
                                      v-if="!item.subscribed">{{item.name}}
                        </el-menu-item>
                    </el-menu-item-group>

                    <el-menu-item-group>
                        <template slot="title">收藏的歌单</template>
                        <el-menu-item :index="'/songlist/'+item.id" @click="changePlaylistId(item.id)"
                                      v-for="item in currentUserPlayList"
                                      v-if="item.subscribed">{{item.name}}
                        </el-menu-item>
                    </el-menu-item-group>

                </el-menu>

            </el-aside>

            <el-container>
                <el-main>
                    <!--
                        setMusicUrl:设置当前需要播放的url连接,子路由(DiyRecommend.vue)的banner调用传递url
                        setSongListInfo:设置当前歌单信息,子路由(MusicListTable.vue)的点击事件传递歌单信息
                        musicDuration给子组件传递值  子组件prop接收
                        curId给子组件传值
                    -->
                    <router-view ref="child" @setMusicUrl="setMusicUrl" :musicDuration="musicDuration"
                                 @refreshPrivatePlaylist="getUserPrivatePlayList"
                                 :isPlay="isPlay" :curId="curId" @setSongListInfo="setSongListInfo"></router-view>
                </el-main>
            </el-container>
        </el-container>

        <el-footer style="position:fixed;bottom: 0;width:100%;z-index: 100" height="150px;">

            <!--底部播放信息显示-->
            <el-row style="width: 209px;background-color: white">
                <el-col :span="8">
                    <!--点击左下角角标 跳转歌曲详情界面-->
                    <img :src="music.al.picUrl" alt="" @click="toMusicDetailPage"
                         style="width: 60px;height: 63px;cursor:pointer;">
                </el-col>
                <el-col :span="16">
                    <p style="height: 8px;font-size: 10px;">{{music.name}}</p>
                    <br>
                    <span style="color: gray;font-size: 10px;">{{music.ar[0].name}}</span>
                </el-col>
            </el-row>


            <el-row style="margin-top: 10px;border-top: 1px solid rgb(230,230,230);background-color: white">
                <el-col :span="2.5">
                    <img src="imgs/prev.png" @click="changePrevMusic" alt=""
                         style="border-radius: 100%;cursor: pointer;">

                    <img v-if="isPlay" src="imgs/pauseMusic.png" alt="" @click="playMusic"
                         style="border-radius: 100%;cursor: pointer;margin-left: 25px;width: 40px;height: 40px;">

                    <img v-else src="imgs/playMusic.png" alt="" @click="playMusic"
                         style="border-radius: 100%;cursor: pointer;margin-left: 25px;width: 40px;height: 40px;">

                    <img src="imgs/next.png" alt="" @click="changeNextMusic"
                         style="border-radius: 100%;cursor: pointer;margin-left: 25px;">
                </el-col>
                <el-col :span="15" :offset="1">

                    <!--秒数通过 过滤器处理成看得懂的样式-->
                    <span style="position:absolute;top: 9px;">{{this.musicDuration | timeFormat}}</span>

                    <!--音乐播放进度条-->
                    <el-slider v-model="musicDuration" :max="totalDuration" @change="musicDurationChange"
                               :show-tooltip="false"></el-slider>

                    <span style="position:absolute;left: 71%;bottom: 25%">{{totalDuration | timeFormat}}</span>
                </el-col>

                <el-col :span="5">
                    <!--音量控制-->
                    <img src="imgs/laba.png" v-if="musicVolume!==0" alt="" @click="silence" class="laba">

                    <img src="imgs/shutUp.png" v-else alt="" @click="silence" class="laba">

                    <img src="imgs/songList.png" alt="" @click="showRightPlayList"
                         style="position: absolute;top: 10px;right: 9%;cursor:pointer;">

                    <el-slider v-model="musicVolume" :show-tooltip="false" style="width: 40%"
                               @change="musicVolumeChange">
                    </el-slider>

                </el-col>
            </el-row>

            <audio :src="musicUrl" autoplay class="playMusicAudio"></audio>
        </el-footer>

        <!--歌单列表的右下角弹窗显示-->
        <el-dialog :modal="false" :show-close="false"
                   title="播放列表"
                   :visible.sync="showRightPlayListDialog"
                   width="30%"
                   center>
            <el-table :data="currentMusicListInfo" ref="playTable" highlight-current-row border stripe
                      style="cursor: context-menu;" @row-dblclick="playRightMusicList">

                <el-table-column label="#" type="index">
                    <template scope="scope">
                        <img v-if="curId === scope.row.id" src="imgs/isPlay.png" alt="">
                        <p v-else>{{scope.$index+1}}</p>
                    </template>
                </el-table-column>

                <el-table-column v-if="false" label="id" prop="id"></el-table-column>

                <el-table-column label="音乐标题" prop="name"></el-table-column>

                <el-table-column label="歌手" prop="ar[0].name"></el-table-column>

                <el-table-column label="专辑名" prop="al.name"></el-table-column>

                <el-table-column label="时长" prop="dt" width="80px;"></el-table-column>

            </el-table>


        </el-dialog>

        <!--登录界面的弹出-->
        <el-dialog
                :visible.sync="loginDialogVisible"
                width="30%" @close="handleLoginDialogClosed">
            <div>
                <img src="imgs/phone.png" style="display: block;margin: 0 auto" alt="">
                <el-form :model="loginInfo" :rules="loginInfoRules" ref="loginInfoRuleForm" style="margin-top: 25px;">

                    <el-form-item prop="phone">
                        <el-input style="display: block;margin:0 auto;width: 60%" prefix-icon="el-icon-user"
                                  v-model="loginInfo.phone" placeholder="请输入手机号"></el-input>

                    </el-form-item>

                    <el-form-item prop="password">
                        <el-input style="display: block;margin:0 auto;width: 60%" show-password
                                  prefix-icon="el-icon-lock" v-model="loginInfo.password" type="password"
                                  placeholder="请输入密码"></el-input>
                    </el-form-item>
                </el-form>
                <el-button @click="loginMusic" type="danger"
                           style="background-color: red;width: 60%;display: block;margin: 0 auto">登录
                </el-button>
            </div>

        </el-dialog>
    </el-container>

</template>

<script>
import SearchPage from "./findMusic/search/SearchPage";
    export default {
        data() {
            return {
                //播放音乐的链接
                musicUrl: '',
                //当前音乐详情对象
                music: {
                    name,
                    al: {
                        picUrl: ''
                    },
                    ar: [
                        {
                            name: ''
                        }
                    ]
                },
                //当前音乐的进度条
                musicDuration: 0,
                //当前音乐的id
                curId: 0,
                //总进度条
                totalDuration: 0,
                //音乐的音量
                musicVolume: 20,
                //默认是否在播放
                isPlay: false,
                //播放列表
                playListInfo: window.localStorage.getItem('playList') === null ? [] : window.localStorage.getItem('playList').split(','),
                //当前播放的歌单的所有歌曲的url和其他信息
                currentMusicListInfo: [],
                //当前播放的歌单的id
                songListInfo: [],
                // 展示右边的歌单对话框
                showRightPlayListDialog: false,
                //展示登录的对话框
                loginDialogVisible: false,
                //登录的信息
                loginInfo: {
                    phone: '',
                    password: ''
                },
                //登录的校验规则
                loginInfoRules: {
                    phone: [
                        {required: true, message: ' ', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: ' ', trigger: 'blur'}
                    ]
                },
                //当前用户的用户信息
                currentUserInfo: window.localStorage.getItem('currentUserInfo') === 'null' ? null : JSON.parse(window.localStorage.getItem('currentUserInfo')),
                //当前用户的歌单
                currentUserPlayList: [],
                //搜索条件
                searchData: '前前前世'
            }
        },
        watch: {
            //监听组件中的当前音乐id的变化 放入localstorage中供给各个组件使用
            curId(newVal) {
                // window.localStorage.setItem('curPlayMusicId',newVal);
                //使用定义好的方法设置新的localstorage中的值 main.js中定义
                this.resetSetItem('curPlayMusicId', newVal);
            }
        },
        created() {
            //用户已登录
            if (this.currentUserInfo !== null) {
                this.getUserPrivatePlayList()
            }
        },
        methods: {
            //设置当前播放url
            setMusicUrl(mUrl, detail) {
                //设置关于音乐的链接和歌曲信息
                this.musicUrl = mUrl
                this.music = detail
                this.curId = detail.id
                //将当前轮播图传来的歌曲id放入歌单中
                this.playListInfo.push(detail.id)

                this.setAudioTagsInfo()
            },
            //设置audio的各种信息
            setAudioTagsInfo() {
                let audio = this.$('.playMusicAudio')[0]

                //监听audio的timeUpdate事件
                audio.addEventListener("timeupdate", () => {
                    //获取歌曲的总长度 example: 257s
                    this.totalDuration = audio.duration
                    //获取歌曲时间
                    this.musicDuration = audio.currentTime

                    //当前歌曲播放完毕自动播放下一首
                    if (audio.currentTime >= audio.duration) {
                        this.changeNextMusic()
                    }
                });
                //更新音乐播放状态
                this.isPlay = true
            },
            //音乐进度条值变化的方法
            musicDurationChange() {
                if (this.totalDuration === 0) return
                let audio = this.$('.playMusicAudio')[0]
                audio.currentTime = this.musicDuration
            },
            //音量变化
            musicVolumeChange() {
                this.volumeChange(this.musicVolume / 100)
            },
            //改变音量的函数
            volumeChange(sum) {
                let audio = this.$('.playMusicAudio')[0]
                audio.volume = sum
            },
            //静音和改变图标
            silence() {
                if (this.musicVolume !== 0) {
                    this.volumeChange(0)
                    this.musicVolume = 0
                } else {
                    this.volumeChange(0.2)
                    this.musicVolume = 20
                }

            },
            //控制暂停播放
            playMusic() {
                var audio = this.$('.playMusicAudio')[0]
                if (this.musicUrl !== '') {
                    if (!audio.paused) {
                        audio.pause()
                    } else {
                        audio.play()
                    }
                    this.isPlay = !this.isPlay
                }
            },
            //接受子路由传递过来的歌单信息
            async setSongListInfo(songList, curId) {
                this.playListInfo = songList
                //将当前歌单信息放入localStorage
                window.localStorage.setItem('playList', songList)

                //设置当前歌单点击需要播放的音乐链接
                const res = await this.$http.get('song/url', {params: {id: curId}})

                if (res.data.data[0].url === null) {
                    this.$message.info('当前歌曲暂不可用,已为您自动跳过')
                    this.curId = curId
                    this.changeNextMusic()
                } else {
                    this.musicUrl = res.data.data[0].url
                    //设置当前歌单的详细信息
                    this.$http.get('song/detail', {params: {ids: curId}}).then(res => {
                        this.music = res.data.songs[0]
                    })
                    //设置当前播放音乐的id
                    this.curId = curId
                    //设置audio的各种信息
                    this.setAudioTagsInfo()
                }
            },
            //根据id获取音乐详情
            getMusicDetail(musicId) {
                this.$http.get('song/detail', {params: {ids: musicId}}).then(res => {
                    this.music = res.data.songs[0]
                })
            },
            //根据id获取音乐url
            getMusicUrl(musicId) {
                this.$http.get('song/url', {params: {id: musicId}}).then(res => {
                    this.musicUrl = res.data.data[0].url
                })
            },
            //切换下一首歌
            changeNextMusic() {
                const nextOne = this.playListInfo[this.playListInfo.findIndex(target => {
                    return target === this.curId
                }) + 1];
                this.setSongListInfo(this.playListInfo, nextOne)
            },
            //切换上一首歌
            changePrevMusic() {
                const prevOne = this.playListInfo[this.playListInfo.findIndex(target => {
                    return target === this.curId
                }) - 1];
                this.setSongListInfo(this.playListInfo, prevOne)
            },
            //点击右下角图标展示右侧的歌单信息
            showRightPlayList() {
                this.showRightPlayListDialog = true
                //处理歌单所有歌曲信息的查询(根据id)
                this.$http.get('song/detail', {params: {ids: window.localStorage.getItem('playList')}}).then(res => {
                    this.currentMusicListInfo = res.data.songs
                    //处理时长数据
                    this.currentMusicListInfo.forEach(item => {
                        const dt = new Date(item.dt)
                        const mm = (dt.getMinutes() + '').padStart(2, '0')
                        const ss = (dt.getSeconds() + '').padStart(2, '0')

                        item.dt = mm + ':' + ss
                    })
                })
            },
            //表单的双击事件
            playRightMusicList(row) {
                //右下角点击事件生效  播放该音乐
                this.setSongListInfo(this.playListInfo, row.id)
            },
            //跳转音乐播放详情界面
            toMusicDetailPage() {
                this.$router.push('/musicDetail/' + this.curId);
            },
            //点击未登录按钮
            handleLogin() {
                this.loginDialogVisible = true
            },
            //点击登录
            loginMusic() {
                this.$refs.loginInfoRuleForm.validate(valid => {
                    if (!valid) return this.$message.error('请填写正确的信息')
                    this.$http.get('login/cellphone', {params: this.loginInfo}).then(res => {
                        if (res.status !== 200) return this.$message.error('登陆失败,请检查登录信息!')
                        //保存cookie的信息
                        window.localStorage.setItem('musicCookie', res.data.cookie)
                        //保存用户信息,退出时删除
                        window.localStorage.setItem('currentUserInfo', JSON.stringify(res.data.profile))
                        //放入用户的信息
                        this.currentUserInfo = res.data.profile

                        this.getUserPrivatePlayList()

                        //隐藏弹窗
                        this.loginDialogVisible = false
                    })
                })
            },
            //查询用户私人歌单
            getUserPrivatePlayList() {
                this.$http.get('user/playlist', {params: {uid: this.currentUserInfo.userId}}).then(r => {
                    this.currentUserPlayList = r.data.playlist
                })
            },
            //重设登录框的表单信息
            handleLoginDialogClosed() {
                this.$refs.loginInfoRuleForm.resetFields();
            },
            //退出登录
            logout() {
                this.$http.get('logout').then(res => {
                    //当前用户信息设置为null
                    this.currentUserInfo = null
                    //存储用户信息的localstorage设置为null
                    window.localStorage.setItem('currentUserInfo', null)
                    //查询出来的用户私人歌单设置为空
                    this.currentUserPlayList = []
                })
            },
            //点击切换当前用户歌单的歌单id
            changePlaylistId(playListId) {
                //让歌单页面可以识别到歌单切换
                //使用自定义的设置我们的localstorage 以便于后面的组件可以监听
                this.resetSetItem('currentId', playListId);
            },
            //跳转搜索页面
            toSearchPage() {
                if (this.searchData.trim() !== '') {//搜索条件不为空
                    //encodeURIComponent参数转换 应对中文参数
                    this.$router.replace('/search/' + encodeURIComponent(this.searchData))
                    //调用子类的方法 实现搜索响应式
                    this.$refs.child.toSingSearchPage()
                }
            }
        },
        components: {
            child: SearchPage
        },

    }
</script>


<style lang="less" scoped>
    .el-header {
        background: rgb(198, 47, 47);
        height: 50px;
        display: flex;

        .logo {
            width: 25px;
            height: 25px;
            margin: 15px 10px;
            border-radius: 100px;
        }

        span {
            font-size: 20px;
            font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
            font-weight: 500;
            margin-top: 15px;
            color: white;
        }

        .el-input {
            width: 275px;
        }

        /deep/ .el-input__inner {
            opacity: 0.4;
            margin-top: 15px;
            margin-left: 50px;
            width: 225px;
            height: 25px;
            border-radius: 12px;
        }

        .searchBtn {
            opacity: 0;
            position: absolute;
            float: right;
            width: 1px;
            height: 24px;
            left: -3px;
            margin-top: 15px !important;
            border-radius: 60%;
        }
    }

    .rightContainer {
        margin-left: auto;

        span {
            font-size: 17px;
            color: white;
        }

        .userIcon {
            width: 30px;
            height: 30px;
            border-radius: 60%;
            margin-top: 13px;
            margin-right: 10px;
        }
    }

    /deep/ .el-menu-item-group__title {
        padding-left: 5px !important;
        margin-top: 7px;
    }

    .el-menu-item {
        height: 45px;
        line-height: 3.45em;
    }

    .el-menu-item.is-active {
        color: black;
        border-left: 2px solid red !important;
    }

    .el-menu {
        height: 92%;
    }

    .el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow:hover {
        box-shadow: 0 0 0 0;

    }

    /deep/ .el-card__body {
        padding: 0 !important;
    }

    /deep/ .el-slider__button {
        border: 2px solid rgb(198, 47, 47) !important;
    }

    /deep/ .el-slider__button {
        width: 10px !important;
        height: 10px !important;
    }

    /deep/ .el-slider__bar {
        background-color: rgb(198, 47, 47);
    }

    .el-slider {
        width: 80%;
        margin: 0 auto;
    }

    .laba {
        position: absolute;
        top: 6px;
        right: 20%;
        cursor: pointer
    }

    .el-footer {
        padding: 0;
    }

    /deep/ .el-dialog--center {
        text-align: end;
        float: right;
    }

    /deep/ .el-dialog__title {
        float: left;
    }
</style>
