import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { ToastrModule } from 'ngx-toastr';

import { NgbActiveModal, NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { SanctionDetailsComponent } from './modules/admin/sanction-details/sanction-details.component';
import { ProgressBarModule } from 'angular-progress-bar';
// import { LitigationBiComponent } from './modules/admin/litigation-bi/litigation-bi.component';

const routerConfig: ExtraOptions = {
    preloadingStrategy       : PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};

@NgModule({
    declarations: [
        AppComponent,
        SanctionDetailsComponent,
        // LitigationBiComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),
        NgbPopoverModule,
        NgbModule,
        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),
        ProgressBarModule,
        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,
        ToastrModule.forRoot({
            timeOut: 3000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
            progressBar: true,
            tapToDismiss: true,
            closeButton: true,
          }),
        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({})
    ],
    bootstrap   : [
        AppComponent
    ],
    providers: [
        NgbActiveModal
    ]
})
export class AppModule
{
}
