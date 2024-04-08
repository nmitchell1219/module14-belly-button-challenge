// Define the URL where the data is located
const dataUrl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Use D3 to fetch the data from the URL
d3.json(dataUrl).then(data => {
  // Log the data to the console to verify it's been read successfully
  console.log(data);
});

// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
function buildBarChart(sampleId) {
    d3.json(url).then(data => {
      const sample = data.samples.find(s => s.id === sampleId);
      const [otu_ids, sample_values, otu_labels] = [sample.otu_ids, sample.sample_values, sample.otu_labels];
  
      var trace = {
        x: sample_values.slice(0, 10).reverse(),
        y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
      };
  
      var data = [trace];
  
      Plotly.newPlot('bar', data);
    });
  }

// Create a bubble chart that displays each sample.
function buildBubbleChart(sampleId) {
    d3.json(url).then(data => {
      const sample = data.samples.find(s => s.id === sampleId);
      const [otu_ids, sample_values, otu_labels] = [sample.otu_ids, sample.sample_values, sample.otu_labels];
  
      var trace = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids
        }
      };
  
      var data = [trace];
  
      Plotly.newPlot('bubble', data);
    });
  }
  

// Display the sample metadata
function displayMetadata(sampleId) {
    d3.json(url).then(data => {
      const metadata = data.metadata.find(m => m.id.toString() === sampleId);
      const panel = d3.select("#sample-metadata");
      panel.html(""); // Clear existing metadata
      Object.entries(metadata).forEach(([key, value]) => {
        panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    });
  }

// Initiale dashboard and handle new sample selection
function init() {
    const selector = d3.select("#selDataset");
  
    d3.json(url).then(data => {
      data.names.forEach((name) => {
        selector.append("option").text(name).property("value", name);
      });
  
      const firstSample = data.names[0];
      buildBarChart(firstSample);
      buildBubbleChart(firstSample);
      displayMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    buildBarChart(newSample);
    buildBubbleChart(newSample);
    displayMetadata(newSample);
  }
  
  init();

