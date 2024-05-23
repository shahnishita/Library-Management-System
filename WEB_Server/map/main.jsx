import Feature from 'ol/Feature.js';
import Geolocation from 'ol/Geolocation.js';
import Map from 'ol/Map.js';
import { transform } from 'ol/proj.js';
import Point from 'ol/geom/Point.js';
import View from 'ol/View.js';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';


const companyLocation = transform([-77.0047, 38.8887], 'EPSG:4326', 'EPSG:3857'); // Transform the company location coordinates

const map = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  target: 'map',
  view: new View({
    center: companyLocation,
    zoom: 16,
  }),
});


const companyMarker = new Feature({
  geometry: new Point(companyLocation),
});

const companyMarkerStyle = new Style({
  image: new CircleStyle({
    radius: 6,
    fill: new Fill({
      color: '#FF0000',
    }),
    stroke: new Stroke({
      color: '#fff',
      width: 2,
    }),
  }),
});

companyMarker.setStyle(companyMarkerStyle);

const vectorLayer = new VectorLayer({
  source: new VectorSource({
    features: [companyMarker],
  }),
});

map.addLayer(vectorLayer);
