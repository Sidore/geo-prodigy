<template>
<div class="flex col">
    <div id="header" class="flex row">
      <img src="../assets/logo.png" height="40">  
      Geo Prodigy
    </div>
    <div id="container" class="flex row">
      <div class=" flex col flex-1">
        <div>
          <h3 @click="acco.expert = !acco.expert">Experts <span>{{acco.expert ? "-" : "+"}}</span></h3>
          <ol v-if="acco.expert">
            <li v-for="expert in data.expert" :key="expert.id_of_expert">
              <b>{{expert.expert_name }}</b> ( id : {{ expert.id_of_expert }})
            </li>
          </ol>
        </div>
        <div>
          <h3 @click="acco.issues = !acco.issues">Issues <span>{{acco.issues ? "-" : "+"}}</span></h3>
          <ol v-if="acco.issues">
            <li v-for="issue in data.issues" :key="issue.issue_id">
              <h4>
                {{issue.name }} ( id : {{ issue.issue_id }})
              </h4>
              <p>
                Опис: {{issue.description}}
              </p>
              <time>{{issue.creation_date}}</time>
            </li>
          </ol>
        </div>
        <div>
          <h3 @click="acco.formulas = !acco.formulas">Formulas <span>{{acco.formulas ? "-" : "+"}}</span></h3>
          <ol v-if="acco.formulas">
            <li v-for="formula in data.formulas" :key="formula.id_of_formula">
              <h4>
                {{formula.name_of_formula }} ( id : {{ formula.id_of_formula }})
              </h4>
              <p>
               Опис: {{formula.description_of_formula}}
              </p>
              <p>Експерт:  <b>{{getExpertById(formula.id_of_expert)}}</b></p>
              <p>Вимiр: {{formula.measurement_of_formula}}</p>
              
            </li>
          </ol>
        </div>
      </div>
      <div class="flex flex-2 col" >
          <div class="google-map" :id="mapName">
              
          </div>
          <div>
            <ol>
                <li v-for="c in markerCoordinates" @click="tooltip(c)" :key="c.tile" style="cursor:pointer">
                    <!-- <input type="text" v-model="c.tile"> -->
                    <span><b>{{c.tile}}</b></span> |
                    <!-- <input type="number" v-model="c.latitude">

                    <input type="number" v-model="c.longitude"> -->
                    <span><i>{{ c.latitude }} - {{ c.longitude }}</i></span>
                    
                </li>
            </ol>
        </div>
      </div>
    </div>
    
    
    <div class="data">
        <!-- <tree-view :data="data"></tree-view> -->
    </div>
</div>

</template>
<script>
import d from "../assets/data.json";
export default {
  name: 'google-map',
  props: ['name'],
  data: function () {
    return {
      acco : {
        expert : false,
        formulas : false,
        issues : false
      },
      mapName: this.name + "-map",
      markers: [],
      data : "",
      markerCoordinates: [], 
      // [{
      //   tile : "lol1 ",
      //   latitude: 51.501527,
      //   longitude: -0.1921837
      // }, {
      //   tile : "lol3 ",
          
      //   latitude: 51.505874,
      //   longitude: -0.1838486
      // }, {
      //   tile : "lol2 ",
          
      //   latitude: 51.4998973,
      //   longitude: -0.202432
      // }],
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
      },

      getExpertById : function(id) {
        return this.data.expert.find((ex) => {
          return ex.id_of_expert == id
        }).expert_name;
      }
  },
  created(){
      this.data = d;
      console.log(d)

      let arr = this.markerCoordinates;

      this.data.issues = this.data.issues.map((iss) => {

        let a = arr.push({
          tile : iss.name,
          latitude: 51.501527 + Math.random(),
          longitude: -0.1921837 + + Math.random()
        })

        iss.tooltip = a;

        return iss;

      });

      
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
  width: 100%;
  height: 600px;
  margin: 0 auto;
  background: gray;
}

.data {
    max-height: 500px;
}

.flex {
  display: flex;
}

.col {
  flex-direction: column;
}

.row {
  flex-direction: row;
}

#header {
  background: #eee;
  border-bottom: 1px solid #999;
  padding: 10px;
  align-items: center;
  
}

#container {
  margin: 10px;
}

h3 , h4, p {
  margin: 0;
  }

.flex-1 {
  flex: 1;
}

.flex-2 {
  flex: 2;
}

h3 {
  cursor: pointer;
}
</style>