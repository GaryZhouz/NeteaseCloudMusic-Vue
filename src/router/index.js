import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../components/Main'
import FindMusic from "../components/findMusic/diyRecommend/FindMusic";
import DiyRecommend from "../components/findMusic/diyRecommend/DiyRecommend";
import SongList from "../components/findMusic/diyRecommend/SongList";
import MusicListTable from "../components/findMusic/diyRecommend/MusicListTable";
import CommentPage from "../components/findMusic/diyRecommend/CommentPage";
import VideoPage from "../components/findMusic/diyRecommend/VideoPage";
import MusicListPage from "../components/findMusic/musicList/MusicListPage";
import MusicRank from "../components/findMusic/rank/MusicRank";
import SingerListPage from "../components/findMusic/singer/SingerListPage";
import SingerDetail from "../components/findMusic/singer/SingerDetail";
import SingerAlbum from "../components/findMusic/singer/SingerAlbum";
import SingerMv from "../components/findMusic/singer/SingerMv";
import SingerDesc from "../components/findMusic/singer/SingerDesc";
import NewMusic from "../components/findMusic/newMusic/NewMusic";
import PlayMusicDetailPage from "../components/findMusic/PlayMusicPage/PlayMusicDetailPage";
import Video from "../components/findMusic/video/Video";
import VideoListTable from "../components/findMusic/video/VideoListTable";
import VideoPlayPage from "../components/findMusic/video/VideoPlayPage";
import MvListTable from "../components/findMusic/video/MvListTable";
import CloudMusic from "../components/findMusic/cloud/CloudMusic";
import SearchPage from "../components/findMusic/search/SearchPage";
import SearchBySong from "../components/findMusic/search/SearchBySong";
import SearchBySinger from "../components/findMusic/search/SearchBySinger";
import SearchByVideo from "../components/findMusic/search/SearchByVideo";
import SearchByPlayList from "../components/findMusic/search/SearchByPlayList";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: Main,
        redirect: '/findMusic',
        //默认是发现音乐界面
        children: [
            {
                path: '/findMusic',
                component: FindMusic,
                redirect: '/diyRecommend',
                //右侧的个性推荐菜单
                children: [
                    //个性推荐
                    {path: '/diyRecommend', component: DiyRecommend},
                    //歌单模块
                    {path: '/musicListPage', component: MusicListPage},
                    //排行榜模块
                    {path: '/musicRank', component: MusicRank},
                    //歌手表格模块
                    {path: '/singerList', component: SingerListPage},
                    //最新音乐模块
                    {path: '/newMusicList', component: NewMusic},
                ]
            },
            //点击跳转到歌单页面
            {
                path: '/songlist/:id',
                component: SongList,
                //歌单页面中的子组件(歌曲列表,评论,收藏)
                children: [//隐式传参声明的name
                    {name: 'musicPage', path: '/musicPage', component: MusicListTable},
                    //评论模块子组件
                    {path: '/comment/:id', component: CommentPage}
                ]
            },
            //跳转mv视频模块
            {
                path: '/toVideoPage/:id', component: VideoPage
            },
            //歌手详情页面
            {
                path: '/singer/:id',
                component: SingerDetail,
                redirect: '/album/:id',
                children: [
                    //歌手专辑页
                    {path: '/album/:id', component: SingerAlbum},
                    //歌手推荐MV页面
                    {path: '/singerMv/:id', component: SingerMv},
                    //歌手详细页面
                    {path: '/singerDesc/:id', component: SingerDesc}
                ]
            },
            //播放的详情页,歌词等等
            {
                path: 'musicDetail/:id',
                component: PlayMusicDetailPage
            },
            //视频模块
            {
                path: '/video',
                component: Video,
                redirect: '/videoPage',
                children: [
                    {
                        //视频推荐
                        path: '/videoPage',
                        component: VideoListTable
                    },
                    {
                        path: '/mvPage',
                        component: MvListTable
                    }
                ]
            },
            //视频播放页
            {
                path: 'videoPlay/:id',
                component: VideoPlayPage
            },
            //音乐云盘
            {
                path: '/cloudMusic',
                component: CloudMusic
            },
            //搜索结果页
            {
                path: '/search/:data',
                component: SearchPage,
                children: [
                    {
                        path: '/searchBySong/:data',
                        component: SearchBySong
                    },
                    {
                        path: '/searchBySinger/:data',
                        component: SearchBySinger
                    },
                    {
                        path: '/searchByVideo/:data',
                        component: SearchByVideo
                    },
                    {
                        path: '/searchByPlayList/:data',
                        component: SearchByPlayList
                    },
                ]
            }
        ]
    }
]

const router = new VueRouter({
    routes
})

export default router
