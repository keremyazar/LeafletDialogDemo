import {Component, OnInit} from '@angular/core';
import {ColorEvent} from 'ngx-color';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {StripeOptions} from './stripeOptions';

@Component({
    selector: 'app-feature-dialog',
    templateUrl: './feature-dialog.component.html',
    styleUrls: ['./feature-dialog.component.scss']
})
export class FeatureDialogComponent implements OnInit {
    options: any;
    properties: any;
    isStripe = false;
    public borderColorDialog = false;
    public fillColorDialog: any;
    public stripeColorDialog = false;
    public spaceColorDialog = false;

    constructor(public bsModalRef: BsModalRef, private modalService: BsModalService) {
    }

    ngOnInit(): void {
        if (!this.options.hasOwnProperty('stripeOptions')) {
            this.options.stripeOptions = new StripeOptions();
        }
    }

    save(): void {
        if (!this.isStripe) {
            delete this.options.stripeOptions;
        }
        this.modalService.setDismissReason(this.options);
        this.bsModalRef.hide();
    }

    borderColorDialogToggle(): void {
        this.borderColorDialog = !this.borderColorDialog;
    }

    changeBorderColor($event: ColorEvent): void {
        this.options.color = $event.color.hex;
    }

    fillColorDialogToggle(): void {
        this.fillColorDialog = !this.fillColorDialog;
    }

    changeFillColor($event: ColorEvent): void {
        this.options.fillColor = $event.color.hex;
    }

    stripeColorDialogToggle(): void {
        this.stripeColorDialog = !this.stripeColorDialog;
    }

    changeStripeColor($event: ColorEvent): void {
        this.options.stripeOptions.color = $event.color.hex;
    }

    spaceColorDialogToggle(): void {
        this.spaceColorDialog = !this.spaceColorDialog;
    }

    changeSpaceColor($event: ColorEvent): void {
        this.options.stripeOptions.spaceColor = $event.color.hex;
    }
}
