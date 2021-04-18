function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildCharts function.
function buildCharts(sample) {

  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // Create a variable that holds the samples array. 
    var samples = data.samples;
    
    // Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    
    // Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata.filter(sampleObj => sampleObj.id == sample);
    
    //  Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    // Create a variable that holds the first sample in the metadata array.
    var idMetadata = metadata[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels =result.otu_labels;
    var sample_values = result.sample_values;

    // Create a variable that holds the washing frequency.
    var wFreq = idMetadata.wfreq;

    // Create the yticks for the bar chart.
    var yticks = otu_ids.map(id => `OTU ${id} `)

    // Create the trace for the bar chart. 
    var barData = [{
      x: sample_values.slice(0,10).reverse(),
      y: yticks.slice(0,10).reverse(),
      hovertemplate: `%{text}` +  `<extra></extra>`,
      text: otu_labels.slice(0,10).reverse(),
      hoverlabel: {font: {size: 9}, align: "left"},
      type: "bar",
      orientation: "h"
    }];

    // Create the layout for the bar chart. 
    var barLayout = {
     title: {text:`<b>Top 10 Bacteria Cultures Found</b>`, font: {size:20}},
    };
    
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      hovertemplate: '(%{x}, %{y})'+'<br>%{text}'+`<extra></extra>`,
      text: otu_labels,
      hoverlabel: {font: {size: 12}},
      showlegend: true,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Portland"
      }
    }];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {text: `<b>Bacteria Cultures Per Sample</b>`, font: {size:24}},
      showlegend: false
    };

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Create the trace for the gauge chart.
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: wFreq,
      title: {text: `<b>Belly Button Washing Frequency</b>` + `<br>Scrubs per Week`, font: {size:18}},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { 
          range: [0, 10], 
          tickwidth: 1, 
          tickcolor: "gray" 
        },
        bar: {color: "black"},
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          {range: [0, 2], color: "indianred"},
          {range: [2, 4], color: "lightsalmon"},
          {range: [4, 6], color: "gold"},
          {range: [6, 8], color: "mediumaquamarine"},
          {range: [8, 10], color: "steelblue"}
        ]
      }
    }];
    
    // Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500,
      height: 500
    };

    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);

  });
}
