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

// 1. Create the buildCharts function.
function buildCharts(sample) {

  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // 3. Create a variable that holds the samples array. 
    let samples = data.samples;
    console.log(samples);

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    // filters the array down to just one object which matches the condition
    let filteredArray = samples.filter((sampleObj) => sampleObj.id === sample);
    console.log(filteredArray);

    //  5. Create a variable that holds the first sample in the array.
    // the array will only have one obj, so select 0th index
    let result = filteredArray[0];
    console.log(result);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    // 
    let otu_ids = result.otu_ids;
    // console.log(otu_ids);

    let otu_labels = result.otu_labels;
    // console.log(otu_labels);

    let sample_values = result.sample_values;
    // console.log(sample_values);


    // 7. Create the yticks for the bar chart.
    // Get the the top 10 otu_ids and map them in descending order so the otu_ids with the most bacteria are last. 
    // take our otu_ids and select the first 10, iterate thru each element in the array w map function

    let yticks = otu_ids.slice(0,10).map((otuID) => `OTU ${otuID}`).reverse();
    console.log(yticks);
    
    // now that we reversed otu_id we need to slice and reverse the sample_values
    let sample_vals = sample_values.slice(0,10).reverse();
    console.log(sample_vals);


    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_vals,
      y: yticks,
      text: otu_labels,
      type: "bar",
      orientation: "h",
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: `Top 10 Bacteria Cultures Found in Sample ${sample}`,
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('hbar', barData, barLayout);

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
  });
}
