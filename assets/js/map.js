import Modal from 'js/bootstrap/src/modal.js'

  document.addEventListener('DOMContentLoaded', function () {
    const map = L.map('leafletmap').setView([35.6735, 139.7565], 16);

    L.tileLayer('https://tileproxy.nils.moe/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const markers = {};
    const features = {};
    let geoJSONLayer;

    function loadLocations() {
      fetch('locations.geojson')
        .then(response => response.json())
        .then(data => {
          data.features.forEach(feature => {
            if (!feature.id) {
              feature.id = feature.properties.name.replace(/\s+/g, '-').toLowerCase();
            }
            features[feature.id] = feature;
          });

          geoJSONLayer = L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {

              const iconOptions = {
                black: L.icon({
                  iconUrl: '/img/map-icons/black.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34]
                }),
                blue: L.icon({
                  iconUrl: '/img/map-icons/blue.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34]
                }),
                green: L.icon({
                  iconUrl: '/img/map-icons/green.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34]
                }),
                orange: L.icon({
                  iconUrl: '/img/map-icons/orange.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34]
                }),
                purple: L.icon({
                  iconUrl: '/img/map-icons/purple.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34]
                }),
                red: L.icon({
                  iconUrl: '/img/map-icons/red.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34]
                }),
              };

              if (feature.properties.hidden === "true") {
                return null;
              }

              const marker = L.marker(latlng, { icon: iconOptions[feature.properties.icon] || iconOptions.blue });
              markers[feature.id] = marker;
              return marker;
            },
            onEachFeature: function (feature, layer) {
              const popupContent = document.createElement('div');
              popupContent.className = 'text-center';
              popupContent.style.width = '200px';

              const nameElement = document.createElement('div');
              nameElement.className = 'fw-bold';
              nameElement.textContent = feature.properties.name;
              popupContent.appendChild(nameElement);

              const images = getImagesArray(feature.properties);

              if (images.length > 0) {
                const imagesContainer = document.createElement('div');

                images.forEach((imageSrc, index) => {
                  const imgContainer = document.createElement('div');
                  imgContainer.style.cursor = 'pointer';

                  const img = document.createElement('img');
                  img.src = imageSrc;
                  img.alt = `${feature.properties.name} Image ${index + 1}`;
                  img.className = 'img-fluid';
                  img.onclick = function () {
                    openFullScreenImage(imageSrc, feature.properties.name);
                  };
                  imgContainer.appendChild(img);
                  imagesContainer.appendChild(imgContainer);
                });

                popupContent.appendChild(imagesContainer);
              }

              if (feature.properties.description) {
                const descElement = document.createElement('div');
                descElement.className = 'text-start mb-2';
                descElement.innerHTML = feature.properties.description;
                popupContent.appendChild(descElement);
              }

              layer.bindPopup(popupContent);
            }
          }).addTo(map);

          const bounds = geoJSONLayer.getBounds();
          if (bounds.isValid()) {
            map.fitBounds(bounds, {
              padding: [40, 40],
              maxZoom: 16
            });
          }
        })
        .catch(error => {
          console.error('Error loading GeoJSON:', error);
          document.getElementById('error').innerHTML = '<div class="alert alert-danger mb-0 mt-3">Error loading locations data.</div>';
        });
    }

    function getImagesArray(properties) {
      if (properties.images && Array.isArray(properties.images)) {
        return properties.images;
      }
      if (properties.image) {
        return [properties.image];
      }
      return [];
    }

    function openFullScreenImage(imageSrc, title) {
      const modal = new Modal(document.getElementById('imageModal'));
      document.getElementById('imageModalLabel').textContent = title || 'Location Image';
      document.getElementById('fullscreen-image').src = imageSrc;
      modal.show();
    }

    loadLocations();
  });