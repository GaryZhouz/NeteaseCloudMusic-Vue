import Vue from 'vue'
import {
    Message,
    Container,
    Header,
    Aside,
    Main,
    MessageBox,
    Footer,
    Button,
    Input,
    MenuItem,
    Menu,
    MenuItemGroup,
    Carousel,
    CarouselItem,
    Image,
    Card,
    Row,
    Col,
    Tag,
    Slider,
    Collapse,
    CollapseItem,
    Table,
    TableColumn,
    Pagination,
    Dialog,
    FormItem,
    Form,Popover
} from 'element-ui'

Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Button)
Vue.use(Input)
Vue.use(MenuItemGroup)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Carousel)
Vue.use(Image)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(CarouselItem)
Vue.use(Tag)
Vue.use(Slider)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(TableColumn)
Vue.use(Table)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Popover)

//原型链挂载
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
