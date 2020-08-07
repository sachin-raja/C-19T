import React from 'react'
import "./Map.css"
import {Map as LeafletMap, TileLayer} from "react-leaflet"
import { showDataOnMap } from './util';

// https://react-leaflet.js.org/
function Map({countries, casesType, center, zoom}) {
    return (
        <div className="map">
            <LeafletMap center={center} zoom={zoom}>
                <TileLayer 
                    url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreet</a> contributors'
                /> 
                {/* loop through the countries and draw circles */}
                {showDataOnMap(countries, casesType)}
            </LeafletMap>
        </div>
    );
}

export default Map;
