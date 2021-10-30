import {AfterViewInit, Component} from '@angular/core';
import * as L from 'leaflet';
import {Control, tileLayer} from 'leaflet';
import {BirminghamService} from './services/birmingham.service';
import {AtlantaService} from './services/atlanta-service';
import {combineLatest} from 'rxjs';
import {FeatureDialogComponent} from './feature-dialog/feature-dialog.component';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap/modal';
import {take} from 'rxjs/operators';
import Layers = Control.Layers;
import 'leaflet.pattern';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
    title = 'LeafletDemo';
    private map;
    constructor(private birminghamService: BirminghamService,
                private atlantaService: AtlantaService,
                private modalService: BsModalService) {
    }

    ngAfterViewInit(): void {
        this.initMap();
        const layerSwitcher = this.loadBaseMaps(this.map);
        const boundGroup = new L.FeatureGroup(); // hold features for fit bounds
        const birmingham$ = this.birminghamService.getAll();
        const atlanta$ = this.atlantaService.getAll();
        // using combineLatest. after everything is loaded i want to center the map
        combineLatest(birmingham$, atlanta$).subscribe(([birminghamResults, atlantaResults]: any) => {
                const birminghamLayer = new L.FeatureGroup();
                birminghamResults.features.forEach(result => {
                    const tmp = L.geoJSON(result, {
                        style: (() => {
                            return {weight: 1, fillColor: 'red', fillOpacity: 0.5};
                        })
                    });
                    tmp.on('click', (e => {
                        this.openDialog(e.sourceTarget);
                    }));
                    birminghamLayer.addLayer(tmp);
                    boundGroup.addLayer(tmp);
                });
                birminghamLayer.addTo(this.map);
                layerSwitcher.addOverlay(birminghamLayer, 'Birmingham');

                const atlantaLayer = new L.FeatureGroup();
                atlantaResults.features.forEach(result => {
                    const tmp = L.geoJSON(result, {
                        style: (() => {
                            return {weight: 1, fillColor: 'red', fillOpacity: 0.5};
                        })
                    });
                    tmp.on('click', (e => {
                        this.openDialog(e.sourceTarget);
                    }));
                    atlantaLayer.addLayer(tmp);
                    boundGroup.addLayer(tmp);
                });
                atlantaLayer.addTo(this.map);
                layerSwitcher.addOverlay(atlantaLayer, 'Atlanta');
                if (boundGroup.getBounds().isValid()) {
                    this.map.fitBounds(boundGroup.getBounds());
                }
                boundGroup.clearLayers().remove();
            }
        );
    }

    private initMap(): void {
        this.map = L.map('map', {
            center: [33.520912, -86.849564],
            zoom: 9
        });
    }

    loadBaseMaps(map: any): Layers {
        const openStreetMap = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            detectRetina: true,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        const mapboxStreet = tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
            tileSize: 512,
            maxZoom: 18,
            zoomOffset: -1,
            id: 'mapbox/streets-v11',
            accessToken: 'pk.eyJ1Ijoia2VtZXJ5YW1hciIsImEiOiJja3VlaWNkMmkwY3NhMnBudmNyMWQxZXNwIn0.uaRmmk3I8ijkdfzuKUJWLw'
        });
        const mapboxOutdoor = tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
            tileSize: 512,
            maxZoom: 18,
            zoomOffset: -1,
            id: 'mapbox/outdoors-v11',
            accessToken: 'pk.eyJ1Ijoia2VtZXJ5YW1hciIsImEiOiJja3VlaWNkMmkwY3NhMnBudmNyMWQxZXNwIn0.uaRmmk3I8ijkdfzuKUJWLw'
        });
        const mapboxLight = tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
            tileSize: 512,
            maxZoom: 18,
            zoomOffset: -1,
            id: 'mapbox/light-v10',
            accessToken: 'pk.eyJ1Ijoia2VtZXJ5YW1hciIsImEiOiJja3VlaWNkMmkwY3NhMnBudmNyMWQxZXNwIn0.uaRmmk3I8ijkdfzuKUJWLw'
        });
        const mapboxDark = tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
            tileSize: 512,
            maxZoom: 18,
            zoomOffset: -1,
            id: 'mapbox/dark-v10',
            accessToken: 'pk.eyJ1Ijoia2VtZXJ5YW1hciIsImEiOiJja3VlaWNkMmkwY3NhMnBudmNyMWQxZXNwIn0.uaRmmk3I8ijkdfzuKUJWLw'
        });
        const mapboxSatellite = tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
            tileSize: 512,
            maxZoom: 18,
            zoomOffset: -1,
            id: 'mapbox/satellite-v9',
            accessToken: 'pk.eyJ1Ijoia2VtZXJ5YW1hciIsImEiOiJja3VlaWNkMmkwY3NhMnBudmNyMWQxZXNwIn0.uaRmmk3I8ijkdfzuKUJWLw'
        });
        const mapboxSatelliteStreets = tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
            tileSize: 512,
            maxZoom: 18,
            zoomOffset: -1,
            id: 'mapbox/satellite-streets-v11',
            accessToken: 'pk.eyJ1Ijoia2VtZXJ5YW1hciIsImEiOiJja3VlaWNkMmkwY3NhMnBudmNyMWQxZXNwIn0.uaRmmk3I8ijkdfzuKUJWLw'
        });
        const baseMaps = {
            'OpenStreetMap': openStreetMap,
            'Mapbox Street': mapboxStreet,
            'Mapbox Outdoor': mapboxOutdoor,
            'Mapbox Light': mapboxLight,
            'Mapbox Dark': mapboxDark,
            'Mapbox Satellite': mapboxSatellite,
            'Mapbox Satellite Streets': mapboxSatelliteStreets
        };
        return L.control.layers(baseMaps).addTo(map);
    }

    openDialog(feature: any): void {
        const initialState: ModalOptions = {
            class: 'modal-lg',
            initialState: {
                options: feature.options,
                properties: feature.feature.properties
            }
        };
        const bsModalRef: BsModalRef = this.modalService.show(FeatureDialogComponent, initialState);
        this.modalService.onHide.pipe(take(1)).subscribe(reason => {
            if (reason.hasOwnProperty('stripeOptions')) {
                const stripes = new L.StripePattern(reason.stripeOptions);
                stripes.addTo(this.map);
                reason.fillPattern = stripes;
            }
            feature.setStyle(reason);
        });
        bsModalRef.content.closeBtnName = 'Close';
    }
}
