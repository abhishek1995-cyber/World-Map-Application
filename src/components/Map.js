import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useDispatch, useSelector } from "react-redux";
import { getCountryDetails } from "../store/action";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWJoaS0yNjA1IiwiYSI6ImNsaW85ZzNnYjEyamgza3BjMHR5Nzc2YW0ifQ.-LNA0RcG8ZM_NTGgvNCgiA";

export default function Map() {
  const data = useSelector((state) => state.countryData);

  const dispatch = useDispatch();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.984);
  const [lat, setLat] = useState(42.233);
  const [zoom, setZoom] = useState(2);

  useEffect(() => {
    if (!map.current) {
      // initialize map only once
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [lng, lat],
        zoom: zoom,
      });

      map.current.on("move", () => {
        setLng(map.current.getCenter().lng.toFixed(4));
        setLat(map.current.getCenter().lat.toFixed(4));
        setZoom(map.current.getZoom().toFixed(2));
      });
      map.current.on("click", (e) => {
        var lngLat = e.lngLat;
        fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.lng},${lngLat.lat}.json?access_token=pk.eyJ1IjoiYWJoaS0yNjA1IiwiYSI6ImNsaW85ZzNnYjEyamgza3BjMHR5Nzc2YW0ifQ.-LNA0RcG8ZM_NTGgvNCgiA`
        )
          .then((res) => res.json())
          .then((data) => {
            let countryName = "";
            for (var i = 0; i < data.features.length; i++) {
              var feature = data.features[i];
              if (feature.place_type.includes("country")) {
                countryName = feature.text;
                break;
              }
            }

            dispatch(getCountryDetails(countryName));
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }
  }, []);

  const countryData = data[0];

  const flags = countryData?.flags;
  const name = countryData?.name;
  const currencies = countryData?.currencies;
  const population = countryData?.population;
  const languages = countryData?.languages;
  const area = countryData?.area;
  const region = countryData?.region;

  let currencyName = "";
  if (currencies) {
    const keys = Object.keys(currencies);
    currencyName = keys[0];
  }

  let langArr = [];
  if (languages) {
    const keys = Object.keys(languages);
    langArr = keys;
  }

  return (
    <div>
      <div ref={mapContainer} className="map-container" />

      {!!data.length && (
        <div className="country-card">
          <h2>{name?.official}</h2>
          <img
            className="img"
            src={flags?.png}
            alt={flags?.alt}
          />
          <p className="description">
            <span className="title">Capital:</span>
            {countryData?.capital[0]}
          </p>
          <h3 className="description">
            <span className="title">Currency :</span>
            {currencyName && <span>{currencies[currencyName]?.symbol}</span>}
            <span>{currencyName}</span>
          </h3>
          {currencyName && <span>{currencies[currencyName]?.name}</span>}
          <h4 className="description">
            <span className="title">population:</span> {population}
          </h4>
          <h5 className="description">
            <span className="title">Latlang:</span> {countryData?.latlng}
          </h5>
          {langArr.map((lang, i) => (
            <span key={i} className="title">
              Languages: {languages[lang]}
            </span>
          ))}
          <p className="description">
            <span className="title">Area:</span> {area}
          </p>
          <p className="description">
            <span className="title">Timezones:</span>
            {countryData?.timezones[0]}
          </p>
          <p className="description">
            <span className="title">Region:</span> {region}
          </p>
        </div>
      )}
    </div>
  );
}
