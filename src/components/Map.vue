<template>
<div>
    <div class="google-map" :id="mapName"></div>
    <div>
        <ul>
            <li v-for="c in markerCoordinates" @click="tooltip(c)">
                <input type="text" v-model="c.tile">
                <input type="number" v-model="c.latitude">

                <input type="number" v-model="c.longitude">
                
            </li>
        </ul>
    </div>
    <div class="data">
        <tree-view :data="data"></tree-view>
    </div>
</div>

</template>
<script>
import d from "../assets/data.json"
export default {
  name: 'google-map',
  props: ['name'],
  data: function () {
    return {
      mapName: this.name + "-map",
      markers: [],
      data : "",
      markerCoordinates: [{
        tile : "lol1 ",
        latitude: 51.501527,
        longitude: -0.1921837
      }, {
        tile : "lol3 ",
          
        latitude: 51.505874,
        longitude: -0.1838486
      }, {
        tile : "lol2 ",
          
        latitude: 51.4998973,
        longitude: -0.202432
      }],
      map: null,
      bounds: null,
      markers: []
    }
  },
  methods: {
      tooltip : function(c){

          let marker = this.markers.find(m => m.title == c.tile).marker

          const infowindow = new google.maps.InfoWindow({
            content: c.tile
            });

          infowindow.open(this.map, marker);
      }
  },
  created(){
      this.data = d;
  },
  mounted: function () {
    this.bounds = new google.maps.LatLngBounds();
    const element = document.getElementById(this.mapName)
    const mapCentre = this.markerCoordinates[0]
    const options = {
      center: new google.maps.LatLng(mapCentre.latitude, mapCentre.longitude)
    }
    this.map = new google.maps.Map(element, options);
    this.markerCoordinates.forEach((coord) => {
        const infowindow = new google.maps.InfoWindow({
         content: coord.tile
        });
      const position = new google.maps.LatLng(coord.latitude, coord.longitude);
      const marker = new google.maps.Marker({ 
        position,
        map: this.map,
        title : coord.tile
      });
    
    this.markers.push({
        title : coord.tile,
        marker
    })

    marker.addListener('click', function() {
        infowindow.open(this.map, marker);
    });

    this.markers.push(marker)
      this.map.fitBounds(this.bounds.extend(position))
    });
  }
};
</script>
<style scoped>
.google-map {
  width: 800px;
  height: 600px;
  margin: 0 auto;
  background: gray;
}

.data {
    max-height: 500px;
}
</style>