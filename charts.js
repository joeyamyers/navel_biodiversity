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

    // variables that holds the samples and metadata arrays. 
    let samples = data.samples;
    let metadata = data.metadata;
    console.log(samples);
    console.log(metadata);

    // variable that filters the samples for the object with the desired sample number.
    // filters the array down to just one object which matches the condition
    let filteredSample = samples.filter((sampleObj) => sampleObj.id == sample);
    console.log(filteredSample);

    // variable that filters the metadata array for the object with the desired sample number.
    let filteredMeta = metadata.filter((metaObj) => metaObj.id == sample);
    console.log(filteredMeta);


    // variable that holds the first sample in the array (the array will only have one obj)
    let sampleResult = filteredSample[0];
    console.log(sampleResult);

    // variable that holds the first sample in the metadata array.
    let metaResult = filteredMeta[0];
    console.log(metaResult);

    ////////////////////////////////////////////////////////////////////////////////////////////



    // VARIABLES TO HOLD KEYS/PROPERTIES IN OBJECTS
    // otu_ids, otu_labels, sample_values &  washing frequency.

    let otu_ids = sampleResult.otu_ids;
    // console.log(otu_ids);

    let otu_labels = sampleResult.otu_labels;
    // console.log(otu_labels);

    let sample_values = sampleResult.sample_values;
    // console.log(sample_values);

    let wFreq = metaResult.wfreq;
    console.log(wFreq);


    ////////////////////////////////////////////////////////////////////////////////////////////  


    // Create the yticks for the bar chart.
    // Get the the top 10 otu_ids and map them in descending order so the otu_ids with the most bacteria are last. 
    // take our otu_ids and select the first 10, iterate thru each element in the array w map function

    let yticks = otu_ids.slice(0,10).map((otuID) => `OTU ${otuID}`).reverse();
    // console.log(yticks);
    
    // now that we reversed otu_id we need to slice and reverse the sample_values
    let sample_vals = sample_values.slice(0,10).reverse();
    // console.log(sample_vals);


    // 1. Create the trace for the bar chart. 
    var barData = [{
      x: sample_vals,
      y: yticks,
      text: otu_labels,
      type: "bar",
      orientation: "h",
    }];

    // 2. Create the layout for the bar chart. 
    var barLayout = {
      title: `Top 10 Bacteria Cultures Found in Sample ${sample}`,
    };
    // 3. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('hbar', barData, barLayout);

    ////////////////////////////////////////////////////////////////////////////////////////////



    // BUBBLE CHART
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'YlOrRd'
      }

    }];
    
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: `Bacteria Cultures Per Sample ${sample}`,
      xaxis: {title: 'OTU ID'},
      yaxis: {title: 'Bacteria Count'},
      showlegend: false
    };
    
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);



    ////////////////////////////////////////////////////////////////////////////////////////////
    
    // GAUGE CHART - displays weekly washing frequency value as a measure from 0-10 on the progress bar in the gauge chart when an individual ID is selected from the dropdown menu

 
    // 1. Create the trace for the gauge chart.
    var gaugeData = [{
      value: wFreq,
      type: 'indicator',
      mode: 'gauge+number',
      title: {
        text: "<b> Belly Button Wash Frequency</b> <br> Scrubs per Week",
        font: {size: 18}
      },
      gauge: {
        axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
        bar: { color: "black" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "yellowgreen" },
          { range: [8, 10], color: "green" }]
      }
    }];
    
    // 2. Create the layout for the gauge chart.
    var gaugeLayout = {
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "white",
      font: { color: "black", family: "Arial" }
     
    };

    // 3. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}
