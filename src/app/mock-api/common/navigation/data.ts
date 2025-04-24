/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';
import { isDisabled } from '../utilities';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'mca_details',
        title: 'MCA',
        type: 'basic',
        icon: 'business',
        link: '/mca/mca-list',
    },
    {
        id: 'gst_details',
        title: 'GST',
        type: 'basic',
        icon: 'fact_check',
        link: '/gst/gst-list',
    },
    {
        id: 'ai_research_api',
        title: 'MEDIA RESEARCH',
        type: 'basic',
        icon: 'search',
        link: '/ai-research',
        disabled: isDisabled(),
    },
    {
        id: 'custom_report',
        title: 'CUSTOM REPORT',
        type: 'basic',
        icon: 'report',
        link: '/custom-report',
        disabled: isDisabled()
    },
    {
        id: 'user_details',
        title: 'USER',
        type: 'basic',
        icon: 'person_add',
        link: '/user/user-list',
        disabled: isDisabled(),
    },
    {
        id: 'Settings',
        title: 'SETTINGS',
        type: 'collapsable',
        icon: 'settings',
        disabled: isDisabled(),
        children: [
            {
                id: 'setting_list',
                title: 'GENERAL',
                type: 'basic',
                icon: 'tune',
                link: '/setting/setting-list',
                disabled: isDisabled()
            },
            {
                id: 'research_setting',
                title: 'RESEARCH',
                type: 'basic',
                icon: 'analytics',
                link: '/research-settings',
                disabled: isDisabled()
            },
            {
                id: 'prompt_setting',
                title: 'PROMPT',
                type: 'basic',
                icon: 'chat',
                link: '/prompt-settings',
                disabled: isDisabled()
            },
            {
                id: 'adverse_media_setting',
                title: 'ADVERSE MEDIA PROMPT',
                type: 'basic',
                icon: 'chat',
                link: '/adverse-media',
                disabled: isDisabled()
            },
        ],
    },
    {
        id: 'gipi_api',
        title: 'GIPI Api',
        type: 'basic',
        icon: 'api',
        link: '/gipi/gipi-api',
        disabled: isDisabled(),
    },
    {
        id: 'sanction_list',
        title: 'SANCTION SEARCH',
        type: 'basic',
        icon: 'search',
        link: '/sanctions/sanction-list',
        disabled: isDisabled(),
    },
    {
        id: 'sanction_uploader',
        title: 'SANCTIONS UPLOADER',
        type: 'basic',
        icon: 'cloud_upload',
        link: '/sanctions/sanction-uploader',
        disabled: isDisabled(),
    },
    {
        id: 'file_manager',
        title: 'FILE MANAGER',
        type: 'basic',
        icon: 'list',
        link: '/files/file-manager',
        disabled: isDisabled(),
    },
    {
        id   : 'karza',
        title: 'Karza',
        type : 'collapsable',
        icon : 'api',
        disabled: isDisabled(),
        children: [
            {
                id : 'entity',
                title: 'Entity',
                type : 'basic',
                icon : 'add_business',
                link : '/entity/search',
                disabled: isDisabled(),
            },
            {
                id : 'litigation_bi',
                title: 'Litigation BI',
                type : 'basic',
                icon : 'business_center',
                link : '/litigation-bi/litigation-bi',
                disabled: isDisabled(),
            },
            {
                id : 'litigation_bi_settings',
                title: 'Litigation BI Settings',
                type : 'basic',
                icon : 'settings',
                link : '/karza-settings',
                disabled: isDisabled(),
            },
            {
                id : 'ubo',
                title: 'Ultimate Beneficial Owner Identification',
                type : 'basic',
                icon : 'account_circle',
                link : '/ubo/ubo',
                disabled: isDisabled(),
            },
            {
                id : 'sbo',
                title: 'Significant Beneficial Ownership',
                type : 'basic',
                icon : 'verified_user',
                link : '/sbo/sbo',
                disabled: isDisabled(),
            },
            {
                id : 'director_details',
                title: 'Director Details',
                type : 'basic',
                icon : 'admin_panel_settings',
                link : '/director/director',
                disabled: isDisabled(),
            },
            {
                id : 'peer_comparison',
                title: 'Peer Comparison',
                type : 'basic',
                icon : 'compare',
                link : '/peer-comparison/peer-comparison',
                disabled: isDisabled(),
            },
            {
                id : 'basic_udyam_details',
                title: 'Basic Udyam Details',
                type : 'basic',
                icon : 'details',
                link : '/basic-udyam/basic-udyam',
                disabled: isDisabled(),
            },
            {
                id : 'financial_summary_llp',
                title: 'Financial Summary LLP',
                type : 'basic',
                icon : 'payments',
                link : '/llp/llp',
                disabled: isDisabled(),
            },
            {
                id : 'pep',
                title: 'PEP Details',
                type : 'basic',
                icon : 'policy',
                link : '/pep/pep',
                disabled: isDisabled(),
            },
            {
                id : 'aml',
                title: 'AML Sanctions Screenings',
                type : 'basic',
                icon : 'web',
                link : '/aml/aml',
                disabled: isDisabled(),
            },
            {
                id : 'logs',
                title: 'Logs',
                type : 'basic',
                icon : 'visibility',
                link : '/karza-logs',
                disabled: isDisabled(),
            }
        ]
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
