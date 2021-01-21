mapboxgl.accessToken = maptoken;
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
center: campground.geometry.coordinates,
zoom: 8
});
 
map.addControl(new mapboxgl.NavigationControl());
 
var marker = new mapboxgl.Marker()
// .setLngLat([12.550343, 55.665957]) 
// .setLngLat(campground.geometry.coordinates) 
.setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
.addTo(map); 


