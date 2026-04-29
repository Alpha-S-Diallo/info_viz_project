const margin = {top: 50, right: 0, bottom: 50, left: 70};
const width = 900;
const height = 350;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;


d3.select("#network").append("svg")
    .attr('viewBox', `0 0 ${innerWidth} ${innerHeight}`)
