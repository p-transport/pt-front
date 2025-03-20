var mymap = L.map('mymap', {editable: true, zoomSnap: 0.1}).setView([45.64668833372338, 5.372314453125001], 2.4);

var poly = document.getElementById('geojson').querySelector('input').value;

/* var rect = L.rectangle(L.latLngBounds(L.latLng([71.86117557379778,-11.280389454775968],sw_lng), L.latLng(ne_lat,ne_lng)), {draggable:'true'}).addTo(mymap);
rect.enableEdit(); */

var polyjs = JSON.parse(poly);

var newpoly = L.geoJSON(polyjs,{draggable:'true'}).addTo(mymap);

var polygon = newpoly.getLayers()[0];
polygon.enableEdit();


/* var polygon = L.polygon(newpoly.getLayers()[0], {draggable:'true'}).addTo(mymap);
polygon.enableEdit(); */

/* 
var lng = document.getElementById('map_lng').querySelector('input').value; */

/* var anIcon = L.icon({
    iconUrl: '/wp-content/plugins/ptmarkers/img/crosshatch.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20]    

}); */

// var marker = L.marker([lat, lng], {draggable:'true',icon:anIcon}).addTo(mymap);  

polygon.on('editable:vertex:dragend editable:dragend editable:vertex:clicked', function(e){
  document.getElementById('geojson').querySelector('input').value = JSON.stringify(polygon.toGeoJSON());
});

/* rect.on('editable:vertex:dragend editable:dragend', function(e){
  document.getElementById('map_lat').querySelector('input').value = rect.getBounds().getSouthWest().lat;
  document.getElementById('map_lng').querySelector('input').value = rect.getBounds().getSouthWest().lng;
  document.getElementById('map_lat_ne').querySelector('input').value = rect.getBounds().getNorthEast().lat;
  document.getElementById('map_lng_ne').querySelector('input').value = rect.getBounds().getNorthEast().lng;
}); */

L.imageOverlay('/wp-content/plugins/ptmarkers/img/pt20240711_en.svg', [[83.287664, -159.522857], 
[-44.391598, 149.762878]]).addTo(mymap);