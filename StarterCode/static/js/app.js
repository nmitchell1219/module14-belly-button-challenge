// Define the URL where the data is located
const dataUrl = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Function to fetch data and handle errors
function fetchData(url) {
  return d3.json(url).catch(error => {
    console.error('Error fetching data: ', error);
    alert('Failed to fetch data. Please check the console for more details.');
  });
}

// Create a horizontal bar chart with a dropdown menu
function buildBarChart(sampleId) {
  fetchData(dataUrl).then(data => {
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

// Create a bubble chart
function buildBubbleChart(sampleId) {
  fetchData(dataUrl).then(data => {
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
  fetchData(dataUrl).then(data => {
    const metadata = data.metadata.find(m => m.id.toString() === sampleId);
    const panel = d3.select("#sample-metadata");
    panel.html(""); // Clear existing metadata
    Object.entries(metadata).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Initialize dashboard
function init() {
  const selector = d3.select("#selDataset");

  fetchData(dataUrl).then(data => {
    data.names.forEach((name) => {
      selector.append("option").text(name).property("value", name);
    });

    const firstSample = data.names[0];
    buildBarChart(firstSample);
    buildBubbleChart(firstSample);
    displayMetadata(firstSample);
  });
}

document.addEventListener('DOMContentLoaded', init);

// Handle new sample selection
function optionChanged(newSample) {
  buildBarChart(newSample);
  buildBubbleChart(newSample);
  displayMetadata(newSample);
}
