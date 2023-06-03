function onChange() {
    const e = document.getElementById("cuisine-selector");

    fetch(`/data/cuisine_reviews/aggregated/${e.value}_reviews.json`)
    .then((response) =>  response.json())
    .then((json) => {
      //console.log(json)
        var filtered = [];
        const dateBound = new Date('2014-01-01');
        for (let i = 0; i < json.length; i++) {
            const dateToCheck = new Date(json[i].review_date);
            if (dateToCheck > dateBound){
                filtered.push(json[i]);
            }
        } 
        setTimeData(filtered);
    });

    fetch(`/data/cuisine_users/age/${e.value}_ages.json`)
    .then((response) => response.json())
    .then((json) => {
      setPieChart1Data(json)
    });

    fetch(`/data/cuisine_users/comments/${e.value}_comments.json`)
    .then((response) => response.json())
    .then((json) => {
      setPieChart2Data(json)
    });



}

function setTimeChart(){
        
        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element
        var root = am5.Root.new("timechart");
        
        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([
          am5themes_Animated.new(root)
        ]);
        
        
        // Create chart
        // https://www.amcharts.com/docs/v5/charts/xy-chart/
        this.chart = root.container.children.push(am5xy.XYChart.new(root, {
          panX: false,
          panY: false,
          wheelY: "none"
        }));
        
        this.chart.zoomOutButton.set("forceHidden", true);
        
        this.chart.get("colors").set("step", 2);
        
        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/

        var xAxisRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 10 });

        xAxisRenderer.labels.template.setAll({
            rotation: -90,
          });

        this.xAxis = this.chart.xAxes.push(am5xy.DateAxis.new(root, {
          baseInterval: { timeUnit: "month", count: 1 },
          renderer: xAxisRenderer,
          tooltip: am5.Tooltip.new(root, {})

        }));        
        
        var ratingAxisRenderer = am5xy.AxisRendererY.new(root, {});
        ratingAxisRenderer.grid.template.set("forceHidden", true);
        var ratingAxis = this.chart.yAxes.push(am5xy.ValueAxis.new(root, {
          renderer: ratingAxisRenderer,
          tooltip: am5.Tooltip.new(root, {})
        }));
        
        var averageAxisRenderer = am5xy.AxisRendererY.new(root, {
            opposite: true
        });
        averageAxisRenderer.grid.template.set("forceHidden", true);
        var averageAxis = this.chart.yAxes.push(am5xy.ValueAxis.new(root, {
          renderer: averageAxisRenderer
        }));
        
        
        
        // Create series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        this.ratingSeries = this.chart.series.push(am5xy.ColumnSeries.new(root, {
          xAxis: this.xAxis,
          yAxis: ratingAxis,
          valueYField: "count",
          valueXField: "review_date",
          tooltip:am5.Tooltip.new(root, {
            labelText:"{valueY} ratings"
          })
        }));
        
        this.ratingSeries.data.processor = am5.DataProcessor.new(root, {
          dateFields: ["review_date"],
          dateFormat: "yyyy-MM-dd"
        });
        
        this.averageSeries = this.chart.series.push(am5xy.LineSeries.new(root, {
          xAxis: this.xAxis,
          yAxis: averageAxis,
          valueYField: "avg",
          valueXField: "review_date",
          tooltip:am5.Tooltip.new(root, {
            labelText:"Average: {valueY.formatNumber('#.00')}/5"
          })  
        }));
        
        this.averageSeries.strokes.template.setAll({ strokeWidth: 2 });
        
        // Add circle bullet
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets
        this.averageSeries.bullets.push(function() {
          var graphics = am5.Circle.new(root, {
            strokeWidth: 2,
            radius: 3,
            stroke: this.averageSeries.get("stroke"),
            fill: root.interfaceColors.get("background"),
          });
        
          return am5.Bullet.new(root, {
            sprite: graphics
          });
        });
        
        
        // Add cursor
        // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
        this.chart.set("cursor", am5xy.XYCursor.new(root, {
          xAxis: this.xAxis,
          yAxis: ratingAxis
        }));
        this.chart.appear(1000, 100);
}

function setTimeData(data){
    this.ratingSeries.data.setAll(data);
    this.averageSeries.data.setAll(data);
    this.xAxis.data.setAll(data);
    
    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    this.ratingSeries.appear(500);
}

document.addEventListener("DOMContentLoaded", function() {
  
  var e = document.getElementById("cuisine-selector");
  e.onchange = onChange;
  e.selectedIndex = 1;
  onChange();
  e.selectedIndex = 0;

  // CLosing action
  let close = document.getElementById("close_general_stats");
  close.addEventListener("click", function(){
    document.getElementById("general_stats_container").style.display = "none";
    document.getElementById("header").style.display = "block";
  });
});



am5.ready(function() {
    setTimeChart();
    setPieChart1();
    setPieChart2();

}); // end am5.ready()


function setPieChart1(){
  var root = am5.Root.new("piechart1");
  root.setThemes([
    am5themes_Animated.new(root)
  ]);

  var chart = root.container.children.push(
    am5percent.PieChart.new(root, {
      endAngle: 270,
      radius: 100
    })
  );

  this.pieSeries1 = chart.series.push(
    am5percent.PieSeries.new(root, {
      valueField: "age",
      categoryField: "index",
      endAngle: 270,
      alignLabels : true
    })
  );

  this.pieSeries1.states.create("hidden", {
    endAngle: -90
  });

  this.pieSeries1.labels.template.setAll({
    text: "{category}",
    textType: "circular"
  });
}

function setPieChart1Data(data){
  //console.log(data)
  this.pieSeries1.data.setAll(data);
  this.pieSeries1.appear(1000, 100);
}

function setPieChart2(){
  var root = am5.Root.new("piechart2");
  root.setThemes([
    am5themes_Animated.new(root)
  ]);
  var chart = root.container.children.push(
    am5percent.PieChart.new(root, {
      endAngle: 270,
      radius: 100,
      inside: true
    })
  );
  this.pieSeries2 = chart.series.push(
    am5percent.PieSeries.new(root, {
      valueField: "count",
      categoryField: "label",
    })
  );
  this.pieSeries2.labels.template.setAll({
    text: "{category}",
    textType: "circular"
  });
}

function setPieChart2Data(data){
  this.pieSeries2.data.setAll(data);
  this.pieSeries2.appear(1000, 100);
}