import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    {path: '', pathMatch : 'full', redirectTo: 'mca/mca-list'},

    // Redirect signed in user to the '/example'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'mca/mca-list'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)},
            {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule)}
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule)}
        ]
    },

    // Landing routes
    {
        path: '',
        component  : LayoutComponent,
        data: {
            layout: 'empty'
        },
        children   : [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule)},
        ]
    },

    // Admin routes
    {
        path       : '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [
            {path: 'mca', loadChildren: () => import('app/modules/admin/example/example.module').then(m => m.ExampleModule)},
            {path: 'mca-individual', loadChildren: () => import('app/modules/admin/mca-details/mca-details.module').then(m => m.McaDetailsModule)},
            {path: 'gst', loadChildren: () => import('app/modules/admin/gst/gst.module').then(m => m.GstModule)},
            {path: 'setting', loadChildren: () => import('app/modules/admin/setting-list/setting-list.module').then(m => m.SettingListModule)},
            {path: 'gst-list-by-pan', loadChildren: () => import('app/modules/admin/gst-list/gst-list.module').then(m => m.GstListModule)},
            {path: 'gst-individual', loadChildren: () => import('app/modules/admin/gst-individual-details/gst-individual-details.module').then(m => m.GstIndividualDetailsModule)},
            {path: 'user', loadChildren: () => import('app/modules/admin/user-management/user-management.module').then(m => m.UserManagementModule)},
            {path: 'gipi', loadChildren: () => import('app/modules/admin/gipi-api/gipi-api.module').then(m => m.GipiApiModule)},
            {path: 'litigation-bi', loadChildren: () => import('app/modules/admin/litigation-bi/litigation-bi.module').then(m => m.LitigationBiModule)},
            {path: 'litigation-directors', loadChildren: () => import('app/modules/admin/litigation-directors-list/litigation-directors-list.module').then(m => m.LitigationDirectorsListModule)},
            {path: 'ai-research', loadChildren: () => import('app/modules/admin/ai-research/ai-research.module').then(m => m.AiResearchModule)},
            {path: 'custom-report', loadChildren: () => import('app/modules/admin/custom-report/custom-report.module').then(m => m.CustomReportModule)},
            {path: 'sanctions', loadChildren: () => import('app/modules/admin/sanctions/sanctions.module').then(m => m.SanctionsModule)},
            {path: 'sanctions', loadChildren: () => import('app/modules/admin/sanction-uploader/sanction-uploader.module').then(m => m.SanctionUploaderModule)},
            {path: 'files', loadChildren: () => import('app/modules/admin/file-manager/file-manager.module').then(m => m.FileManagerModule)},
            {path: 'folders', loadChildren: () => import('app/modules/admin/folder-manager/folder-manager.module').then(m => m.FolderManagerModule)},
            {path: 'entity', loadChildren: () => import('app/modules/admin/entity-search/entity-search.module').then(m => m.EntitySearchModule)},
            {path: 'ubo', loadChildren: () => import('app/modules/admin/ubo/ubo.module').then(m => m.UBOModule)},
        ]
    }
];
