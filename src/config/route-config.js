import { DesktopOutlined, CloudServerOutlined, ConsoleSqlOutlined, DashboardOutlined, ToolOutlined, SettingOutlined, AlertOutlined, ReconciliationOutlined, AppstoreOutlined, PieChartFilled, PieChartOutlined, ProfileOutlined, FileWordOutlined, FileTextOutlined , BarChartOutlined, WhatsAppOutlined, ExclamationCircleOutlined, IeOutlined, SketchOutlined } from '@ant-design/icons';

const MenuList = [
    {
        title: '工作台', // 菜单标题名称
        key: '/workbench', // 对应的path
        icon: DesktopOutlined  // 图标名称
    },
    {
        title: '主机管理', // 菜单标题名称
        key: '/host', // 对应的path
        icon: CloudServerOutlined // 图标名称
    },
    {
        title: '批量执行', // 菜单标题名称
        key: '/home', // 对应的path
        icon: ConsoleSqlOutlined, // 图标名称,
        children: [ // 子菜单列表
            {
                title: '执行任务',
                key: '/task',
                icon: 'bars'
            },
            {
                title: '模板管理',
                key: '/analysis',
                icon: 'bars'
            }
        ]
    },
    {
        title: '应用发布',
        key: '/app-release',
        icon: AppstoreOutlined ,
        children: [ // 子菜单列表
            {
                title: '应用管理',
                key: '/app-manage',
                icon: 'bars'
            },
            {
                title: '发布申请',
                key: '/release-app',
                icon: 'bars'
            }
        ]
    },
    {
        title: '任务计划', // 菜单标题名称
        key: '/plan', // 对应的path
        icon: ReconciliationOutlined // 图标名称
    },
    {
        title: '配置中心',
        key: '/config-center',
        icon: ToolOutlined,
        children: [
            {
                title: '环境管理',
                key: '/environment-control',
                icon: 'bar-chart'
            },
            {
                title: '服务配置 ',
                key: '/service-config',
                icon: 'line-chart'
            },
            {
                title: '应用配置 ',
                key: '/app-config',
                icon: 'line-chart'
            }
        ]
    },
    {
        title: '监控中心', // 菜单标题名称
        key: '/monitor', // 对应的path
        icon: DashboardOutlined  // 图标名称
    },
    {
        title: '问题管理', // 菜单标题名称
        key: '/question', // 对应的path
        icon: DashboardOutlined  // 图标名称
    },
    {
        title: '报警中心',
        key: '/feedback',
        icon: AlertOutlined,
        children: [
            {
                title: '报警历史',
                key: '/modal1',
                icon: 'bar-chart'
            },
            {
                title: '报警联系人',
                key: '/notification',
                icon: 'line-chart'
            },
            {
                title: '报警联系组',
                key: '/notification',
                icon: 'line-chart'
            }
        ]
    },
    {
        title: '系统管理',
        key: '/charts',
        icon: SettingOutlined,
        children: [
            {
                title: '账户管理',
                key: '/bar',
                icon: 'bar-chart'
            },
            {
                title: '角色管理',
                key: '/line',
                icon: 'line-chart'
            },
            {
                title: '系统设置',
                key: '/config',
                icon: 'pie-chart'
            }
        ]
    }
]

export default MenuList