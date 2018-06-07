<template>
<div class="flex col">
    <div id="header" class="flex row">
      <img src="../assets/logo.png" height="40">  
      Веб iнтерфейс еколого-економiчноi системи
    </div>
    <div id="container" class="flex row">
      <div class=" flex col flex-1">
        <div class="cont">
          <h3 @click="acco.issues = !acco.issues">Проблемнi зони <span>{{acco.issues ? "-" : "+"}}</span></h3>
          <ol v-if="acco.issues">
            <li v-for="issue in data.issues" :key="issue.issue_id">
              <h4>
                {{issue.name }} <input type="radio" v-model="issueId" :value="issue.issue_id">
              </h4>
              <p>
                Опис: {{issue.description}}
              </p>
              <time>{{issue.creation_date}}</time>
            </li>
          </ol>
        </div>
        <div class="cont">
          <h3 @click="acco.expert = !acco.expert">Експерти <span>{{acco.expert ? "-" : "+"}}</span></h3>
          <ol v-if="acco.expert">
            <li v-for="expert in data.expert" :key="expert.id_of_expert" v-if="expert.id_of_expert > 0 && expert.id_of_expert < 5">
              <b >{{expert.expert_name }}</b> 
              <input type="checkbox" v-model="exps[expert.id_of_expert]">
            </li>
          </ol>
        </div>
        
        <div class="cont">
          <!-- <h3 @click="acco.formulas = !acco.formulas">Формули <span>{{acco.formulas ? "-" : "+"}}</span></h3>
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
          </ol> -->
          <!-- {{filltered_calculations_description}} -->
          
          <ul style="list-style: none; padding: 0;">
          <li v-for="l in filltered_calculations_description">
                  <em>Експерт {{getExpertById(l.id_of_expert)}}</em> <br>
            
              <b>Серия розрахункив:</b> <br> {{l.calculation_name}} (Опис : {{l.description_of_calculation}})
              <ul style="margin:0; padding: 0;">
                <li class="itemToClick" v-for="m in getCalculationResult(l.calculation_number, l.id_of_expert)" @click="showPoligon(get_poligon_calculations_description(l.calculation_number, m.id_of_formula,l.id_of_expert),getFormulaById(m.id_of_formula,l.id_of_expert ).description_of_formula, $event); ">
                  <p>{{getFormulaById(m.id_of_formula,l.id_of_expert ).name_of_formula}}<br>
                     {{getFormulaById(m.id_of_formula,l.id_of_expert ).description_of_formula}} - {{m.result}} {{getFormulaById(m.id_of_formula,l.id_of_expert ).measurement_of_formula}}
                  </p>
                  <!-- <b>Значение {{}}</b>
                   <tree-view :data="m"></tree-view> -->
                  <!-- <pre>
                     <tree-view :data=""></tree-view>
                  </pre> -->
                  <!-- <pre>
                    formula 
                    <tree-view :data=""></tree-view>
                    {{getFormulaById(1,l.id_of_expert )}}
                  </pre> -->
                  
                </li>
              </ul>
              <hr>
          </li>
          </ul>
        </div>
      </div>
       <div class="flex flex-2 col" >
          <div class="google-map" >
              <div class="google-map" :id="mapName">

              </div>
          </div>
          <!-- <div>
            <ol>
                <li v-for="c in markerCoordinates" @click="tooltip(c)" :key="c.tile" style="cursor:pointer">
                    <input type="text" v-model="c.tile">
                    <span><b>{{c.tile}}</b></span> |
                    <input type="number" v-model="c.latitude">

                    <input type="number" v-model="c.longitude">
                    <span><i>{{ c.latitude }} - {{ c.longitude }}</i></span>
                    
                </li>
            </ol>
        </div> -->
      </div> 
    </div>
    
    
    <!-- <div class="data">
        <tree-view :data="data"></tree-view>
    </div> -->
</div>

</template>
<script>
import d from "../assets/data.json";
import mem from "memlog"

export default {
  name: 'google-map',
  props: ['name'],
  data: function () {
    return {
      acco : {
        expert : true,
        formulas : false,
        issues : true
      },
      bermudaTriangle  : {},
      poly : [],
      exps : {},
      mapName: this.name + "-map",
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
      markers: [],
      issueId : 0
    }
  },
  computed : {
    filltered_calculations_description : function() {
      return this.data.calculations_description.filter((d) => {
        return this.exps[d.id_of_expert] && d.issue_id == this.issueId
        // return true;
      })
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
      },

      poligonById : function(id) {
        return this.data.poligon.find((ex) => {
          return ex.Id_of_poligon == id
        });
      },

      poligonPointsById : function(id) {
        let a = this.data.point_poligon.filter((ex) => {
          return ex.Id_of_poligon == id
        });

        a.sort((s1,s2) => {
          return s1.order > s2.order ? -1 : 1;
        });

        return a;
      },

      getCalculationResult : function(id , ex ) {
        return this.data.calculations_result.filter(e => e.calculation_number == id && e.id_of_expert == ex)
      },

      getFormulaById : function(id, ex) {
        return this.data.formulas.find(f => f.id_of_formula == id && f.id_of_expert == ex);
      },
      get_poligon_calculations_description(id, f, ex) {

        let p = this.data.poligon_calculations_description.filter(r => r.calculations_description_number == id && f == r.id_of_formula)

        let a = p.filter((u) => {
          let va = this.poligonById(u.id_poligon)
          return va.id_of_expert == ex
        });
        
        return a;
      },
      showPoligon : function(obj,text) {

        if (!obj.length) {
          this.$notify({
            group: 'foo',
            type: 'warn',
            text: "Данний розразунок не мае зони!",
            position: "bottom right"
          });
          return;
        }
        
        this.poly.forEach(r => r.setMap(null))
        
        let id = obj[0].id_poligon;
        let poligon = this.poligonById(id);

       var triangleCoords = this.poligonPointsById(poligon.Id_of_poligon).map((cord) => {
          return {lat: Number(cord.longitude), lng : Number(cord.latitude)}
       });

          this.bermudaTriangle = new google.maps.Polygon({
            paths: triangleCoords,
            strokeColor: "#FFAA00",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.5
          });

           this.bermudaTriangle.setMap(this.map);
          this.poly.push(this.bermudaTriangle);

          google.maps.event.addListener(this.bermudaTriangle, 'click', function (event) {
              const infowindow = new google.maps.InfoWindow({
                  content: text
                  });

                  const position = new google.maps.LatLng(triangleCoords[0].lat, triangleCoords[0].lng);
                  const marker = new google.maps.Marker({ 
                    position,
                    map: this.map,
                    // title : coord.tile
                  });
                
                    this.poly.push(marker);

                infowindow.open(this.map, marker);
            }.bind(this));
    
      }

  },
  created(){
      this.data = d;
      console.log(d);

      this.issueId = d.issues[0].issue_id;
      // mem();

      // let arr = this.markerCoordinates;

      // this.data.issues = this.data.issues.map((iss) => {

      //   let a = {
      //     tile : iss.name,
      //     latitude: 50.4501,
      //     longitude: 30.523400000000038
      //   };

      //   arr.push(a);

      //   iss.tooltip = a;

      //   return iss;

      // });

      
  },
  mounted: function () {
    this.bounds = new google.maps.LatLngBounds();
    const element = document.getElementById(this.mapName)
    const mapCentre = this.data.point_poligon[0];
    const options = {
      center: new google.maps.LatLng(mapCentre.longitude, mapCentre.latitude),
      zoom: 6
    }
    this.map = new google.maps.Map(element, options);
    // this.markerCoordinates.forEach((coord) => {
    //     const infowindow = new google.maps.InfoWindow({
    //      content: coord.tile
    //     });
      // const position = new google.maps.LatLng(coord.latitude, coord.longitude);
    //   const marker = new google.maps.Marker({ 
    //     position,
    //     map: this.map,
    //     title : coord.tile
    //   });
    
    //     this.poly.push(marker);
    

    // this.markers.push({
    //     title : coord.tile,
    //     marker
    // })

    // marker.addListener('click', function() {
    //     infowindow.open(this.map, marker);
    // });

    //   this.markers.push(marker)
      // this.map.fitBounds(this.bounds.extend(position))
    // });

    // var triangleCoords = this.data.issues.map((i) => {
    //   return {
    //     lat : i.tooltip.latitude ,
    //     lng : i.tooltip.longitude
    //     }
    // })

    // this.data.issues.forEach((i) => {
       
    //   var triangleCoords = 
    //   [
    //       {lat: i.tooltip.latitude + 0.05, lng: i.tooltip.longitude - 0.05},
    //       {lat: i.tooltip.latitude + 0.05, lng: i.tooltip.longitude + 0.05},          
    //       {lat: i.tooltip.latitude - 0.05, lng: i.tooltip.longitude + 0.05},
    //       {lat: i.tooltip.latitude - 0.05, lng: i.tooltip.longitude - 0.05}
    //     ];

    //   var r=Math.floor(Math.random() * (256));

    //   var g=Math.floor(Math.random() * (256));

    //   var b=Math.floor(Math.random() * (256));

    //   var с ='#' + r.toString(16) + g.toString(16) + b.toString(16);


    //     this.bermudaTriangle = new google.maps.Polygon({
    //       paths: triangleCoords,
    //       strokeColor: '#eee',
    //       strokeOpacity: 0.8,
    //       strokeWeight: 2,
    //       fillColor: с,
    //       fillOpacity: 0.35
    //     });
    //      this.bermudaTriangle.setMap(this.map);

    //      this.poly.push(this.bermudaTriangle);
    // })

    this.data.poligon.forEach((poligon) => {

       var triangleCoords = this.poligonPointsById(poligon.Id_of_poligon).map((cord) => {
          return {lat: Number(cord.longitude), lng : Number(cord.latitude)}
       });
      // console.log("poligon",poligon);

        var r= String(poligon.brush_color_r);

        var g= String(poligon.bruch_color_g);

        var b= String(poligon.brush_color_b);

        var r1 = String(poligon.line_collor_r);
        var g1 = String(poligon.line_color_g);
        var b1 = String(poligon.line_color_b);
        
        function componentToHex(c) {
            var hex = (+c).toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }

        function rgbToHex(r, g, b) {
            return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
        }

        // alert( rgbToHex(0, 51, 255) );

        // var с ='#' + r + g + b;
        // var s = '#' + r1 + g1 + b1;

         this.bermudaTriangle = new google.maps.Polygon({
            paths: triangleCoords,
            strokeColor: rgbToHex(r1,g1,b1),
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: rgbToHex(r,g,b),
            fillOpacity: 0.35
          });

           this.bermudaTriangle.setMap(this.map);
         this.poly.push(this.bermudaTriangle);
           

    });

    // console.log(triangleCoords)
    //  [
    //       {lat: 25.774, lng: -80.190},
    //       {lat: 18.466, lng: -66.118},
    //       {lat: 32.321, lng: -64.757},
    //       // {lat: 25.774, lng: -80.190}
    //     ];

        // Construct the polygon.
        // var bermudaTriangle = new google.maps.Polygon({
        //   paths: triangleCoords,
        //   strokeColor: '#FF0000',
        //   strokeOpacity: 0.8,
        //   strokeWeight: 2,
        //   fillColor: '#FF0000',
        //   fillOpacity: 0.35
        // });
        // bermudaTriangle.setMap(this.map);
  }
};
</script>
<style scoped>

.google-map {
  width: 65vw;
  height: 90vh;
  margin: 0 auto;
  background: gray;
  position: fixed;
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
  background: #fff;
  border-bottom: 1px solid #999;
  padding: 10px;
  align-items: center;
  position: fixed;
  width: 100%;
  z-index: 200;
}

#container {
  margin: 10px;
  margin-top: 65px;
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

.cont {
  background: #fff;
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 0 10px 10px;
  margin: 10px;
}

.itemToClick {
  cursor: pointer;
    position: relative;
    background-color: #efefef;
    border: none;
    /* font-size: 28px; */
    /* color: #FFFFFF; */
    padding: 20px;
    /* width: 200px; */
    /* text-align: center; */
    -webkit-transition-duration: 0.4s; /* Safari */
    transition-duration: 0.4s;
    text-decoration: none;
    overflow: hidden;
    cursor: pointer;
    margin-bottom: 5px
}

.itemToClick:after {
    content: "";
    background: #fefefe;
    display: block;
    position: absolute;
    padding-top: 300%;
    padding-left: 350%;
    margin-left: -20px!important;
    margin-top: -120%;
    opacity: 0;
    transition: all 0.8s
}

.itemToClick:active:after {
    padding: 0;
    margin: 0;
    opacity: 1;
    transition: 0s
}

</style>