
<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <meta name="viewport" content="width=device-width,height=device-height, user-scalable=no" />
  <title>Leaflet.Editable demo</title>
  <link rel="stylesheet" href="https://npmcdn.com/leaflet@1.3.4/dist/leaflet.css" />
  <script src="https://npmcdn.com/leaflet@1.3.4/dist/leaflet.js"></script>
  <script src="https://npmcdn.com/leaflet.path.drag/src/Path.Drag.js"></script>
  <script src="../src/Leaflet.Editable.js"></script>

  <style type='text/css'>
      body { margin:0; padding:0; }
      #map { position:absolute; top:0; bottom:0; right: 0; left: 0; width:100%; }
</style>
</head>
<body>
  <div id='map'></div>

<script type="text/javascript">
var startPoint = [43.1249, 1.254];
var map = L.map('map', {editable: true}).setView(startPoint, 16),
    tilelayer = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {maxZoom: 20, attribution: 'Data \u00a9 <a href="http://www.openstreetmap.org/copyright"> OpenStreetMap Contributors </a> Tiles \u00a9 HOT'}).addTo(map);

    L.EditControl = L.Control.extend({

        options: {
            position: 'topleft',
            callback: null,
            kind: '',
            html: ''
        },

        onAdd: function (map) {
            var container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
                link = L.DomUtil.create('a', '', container);

            link.href = '#';
            link.title = 'Create a new ' + this.options.kind;
            link.innerHTML = this.options.html;
            L.DomEvent.on(link, 'click', L.DomEvent.stop)
                      .on(link, 'click', function () {
                        window.LAYER = this.options.callback.call(map.editTools);
                      }, this);

            return container;
        }

    });

    L.NewLineControl = L.EditControl.extend({

        options: {
            position: 'topleft',
            callback: map.editTools.startPolyline,
            kind: 'line',
            html: '\\/\\'
        }

    });

    L.NewPolygonControl = L.EditControl.extend({

        options: {
            position: 'topleft',
            callback: map.editTools.startPolygon,
            kind: 'polygon',
            html: '▰'
        }

    });

    L.NewMarkerControl = L.EditControl.extend({

        options: {
            position: 'topleft',
            callback: map.editTools.startMarker,
            kind: 'marker',
            html: '🖈'
        }

    });

    L.NewRectangleControl = L.EditControl.extend({

        options: {
            position: 'topleft',
            callback: map.editTools.startRectangle,
            kind: 'rectangle',
            html: '⬛'
        }

    });

    L.NewCircleControl = L.EditControl.extend({

        options: {
            position: 'topleft',
            callback: map.editTools.startCircle,
            kind: 'circle',
            html: '⬤'
        }

    });

    map.addControl(new L.NewMarkerControl());
    map.addControl(new L.NewLineControl());
    map.addControl(new L.NewPolygonControl());
    map.addControl(new L.NewRectangleControl());
    map.addControl(new L.NewCircleControl());

    var line = L.polyline([
        [43.1292, 1.256],
        [43.1295, 1.259],
        [43.1291, 1.261]
    ]).addTo(map);
    line.enableEdit();
    line.on('dblclick', L.DomEvent.stop).on('dblclick', line.toggleEdit);


    var multi = L.polygon([
      [
        [
          [43.1239, 1.244],
          [43.123, 1.253],
          [43.1252, 1.255],
          [43.1250, 1.251],
          [43.1239, 1.244]
        ],
        [
          [43.124, 1.246],
          [43.1236, 1.248],
          [43.12475, 1.250]
        ],
        [
          [43.124, 1.251],
          [43.1236, 1.253],
          [43.12475, 1.254]
        ]
      ],
      [
        [
          [43.1269, 1.246],
          [43.126, 1.252],
          [43.1282, 1.255],
          [43.1280, 1.245]
        ]
      ]
    ]).addTo(map);
    multi.enableEdit();
    multi.on('dblclick', L.DomEvent.stop).on('dblclick', multi.toggleEdit);
    multi.bindPopup('hi!');

    var poly = L.polygon([
      [
        [43.1239, 1.259],
        [43.123, 1.263],
        [43.1252, 1.265],
        [43.1250, 1.261]
      ],
      [
        [43.124, 1.263],
        [43.1236, 1.261],
        [43.12475, 1.262]
      ]
    ]).addTo(map);
    poly.enableEdit();
    poly.on('dblclick', L.DomEvent.stop).on('dblclick', poly.toggleEdit);

    var rec = L.rectangle([
        [43.1235, 1.255],
        [43.1215, 1.259]
    ]).addTo(map);
    rec.enableEdit();
    rec.on('dblclick', L.DomEvent.stop).on('dblclick', rec.toggleEdit);

    var circle = L.circle([43.1220, 1.250], {radius: 100}).addTo(map);
    circle.enableEdit();
    circle.on('dblclick', L.DomEvent.stop).on('dblclick', circle.toggleEdit);

</script>
</body>
</html>
