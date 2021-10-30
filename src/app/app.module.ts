import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BirminghamService} from './services/birmingham.service';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FeatureDialogComponent} from './feature-dialog/feature-dialog.component';
import {FormsModule} from '@angular/forms';
import {ColorSketchModule} from 'ngx-color/sketch';
import {ModalModule} from 'ngx-bootstrap/modal';

@NgModule({
    declarations: [
        AppComponent,
        FeatureDialogComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        FormsModule,
        ModalModule.forRoot(),
        ColorSketchModule
    ],
    providers: [BirminghamService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
