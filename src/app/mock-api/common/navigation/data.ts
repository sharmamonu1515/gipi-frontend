/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';
import { isDisabled } from '../utilities';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'mca_details',
        title: 'MCA',
        type : 'basic',
        icon : 'business',
        link : '/mca/mca-list'
    },
    {
        id   : 'gst_details',
        title: 'GST',
        type : 'basic',
        icon : 'fact_check',
        link : '/gst/gst-list'
    },
    {
        id: 'ai_research_api',
        title: 'MEDIA RESEARCH',
        type: 'basic',
        icon: 'search',
        link: '/ai-research',
    },
    {
        id: 'research_setting',
        title: 'RESEARCH SETTING',
        type: 'basic',
        icon: 'settings',
        link: '/ai-research/setting',
    },
    {
        id: 'custom_report',
        title: 'CUSTOM REPORT',
        type: 'basic',
        icon: 'report',
        link: '/custom-report',
    },
    {
        id   : 'user_details',
        title: 'USER',
        type : 'basic',
        icon : 'person_add',
        link : '/user/user-list',
        disabled: isDisabled()
    },
    {
        id   : 'setting_list',
        title: 'SETTING',
        type : 'basic',
        icon : 'settings',
        link : '/setting/setting-list',
        disabled: isDisabled()
    },
    {
        id   : 'gipi_api',
        title: 'GIPI Api',
        type : 'basic',
        icon : 'api',
        link : '/gipi/gipi-api',
        disabled: isDisabled()
    },
    {
        id   : 'litigation_bi_api',
        title: 'Litigation BI',
        type : 'basic',
        icon : 'api',
        link : '/litigation-bi/litigation-bi-list',
        disabled: isDisabled()
    },{
        id   : 'sanction_list',
        title: 'SANCTION SEARCH',
        type : 'basic',
        icon : 'api',
        link : '/sanctions/sanction-list',
        disabled: isDisabled()
    }
    ,{
        id   : 'sanction_uploader',
        title: 'SANCTIONS UPLOADER',
        type : 'basic',
        icon : 'api',
        link : '/sanctions/sanction-uploader',
        disabled: isDisabled()
    },{
        id   : 'file_manager',
        title: 'FILE MANAGER',
        type : 'basic',
        icon : 'api',
        link : '/files/file-manager',
        disabled: isDisabled()
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
