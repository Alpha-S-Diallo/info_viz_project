const drawNetwork = (nodes, links,stats) => {

  const width = 850;
  const height = 600;

  // cpy so sim dont mess with original data
  const networkNodes = JSON.parse(JSON.stringify(nodes));
  const networkLinks = JSON.parse(JSON.stringify(links));


  // turing stat in js object so we look though and use it

    const statsByPlayer = {};
    stats.forEach(d => {
      statsByPlayer[d.player] = d;
    });



  /// making a scle for node size based on assists per game
  const apgScale = d3.scaleLinear()
    .domain(d3.extent(stats, d => d.APG))
    .range([8, 20]);
  // svg containe
  const svg = d3.select("#network")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`);

  // arrowhead def
  svg.append("defs").append("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 22)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#e8710a");

  // color based on strength of connections
  const colorScale = d3.scaleLinear()
    .domain([1, 5])
    .range(["#f4c48a", "#e8710a"]);

  // edges — color and thickness based on total assists
  const link = svg
    .selectAll(".network-link")
    .data(networkLinks)
    .join("line")
    .attr("class", "network-link")
    .attr("stroke", d => colorScale(d.value))
    .attr("stroke-opacity", 0.6)
    .attr("stroke-width", d => d.value)
    .attr("marker-end", "url(#arrow)");

  // nodes
  const node = svg
    .selectAll(".network-node")
    .data(networkNodes)
    .join("circle")
    .attr("class", "network-node")
    .attr("r", d => apgScale(statsByPlayer[d.id] ? statsByPlayer[d.id].APG : 0))
    .attr("fill", "#e8710a")
    .attr("stroke", "#FAFBFF")
    .attr("stroke-width", 2)
    .style("cursor", "pointer");

  // first name labels
  const label = svg
    .selectAll(".network-label")
    .data(networkNodes)
    .join("text")
    .attr("class", "network-label")
    .text(d => d.id.split(" ")[0])
    .attr("font-size", 11)
    .attr("text-anchor", "middle")
    .attr("dy", 25)
    .style("pointer-events", "none");


  // physics engine
  const simulation = d3.forceSimulation(networkNodes)
    .force("link", d3.forceLink(networkLinks)
      .id(d => d.id)
      .strength(d => d.value / 10)
      .distance(120)
    )
    .force("charge", d3.forceManyBody().strength(-400))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide(28));

  // update positions each frame
  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("cx", d => d.x = Math.max(20, Math.min(width - 20, d.x)))
      .attr("cy", d => d.y = Math.max(20, Math.min(height - 20, d.y)));

    label
      .attr("x", d => d.x)
      .attr("y", d => d.y);
  });

  // drag nodes
  const dragBehavior = d3.drag()
    .on("start", (event, d) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    })
    .on("drag", (event, d) => {
      d.fx = event.x;
      d.fy = event.y;
    })
    .on("end", (event, d) => {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    });

  node.call(dragBehavior);

  // hover 
  node
    .on("mouseenter", (_e, d) => {
      const t = d3.transition().duration(150);

      const isLinked = (player) =>
        networkLinks.find(edge =>
          (edge.source.id === d.id && edge.target.id === player.id) ||
          (edge.source.id === player.id && edge.target.id === d.id)
        ) ? true : false;

      d3.selectAll(".network-node")
        .transition(t)
        .attr("fill-opacity", player => player.id === d.id || isLinked(player) ? 1 : 0.15)
        .attr("stroke-opacity", player => player.id === d.id || isLinked(player) ? 1 : 0.15);

      d3.selectAll(".network-link")
        .transition(t)
        .attr("stroke-opacity", link =>
          link.source.id === d.id || link.target.id === d.id ? 0.6 : 0.05
        );
    })
    .on("mouseleave", () => {
      d3.selectAll(".network-node")
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

      d3.selectAll(".network-link")
        .attr("stroke-opacity", 0.6);
    });

  // filter edge by chemi strength
  document.getElementById("sort-select").addEventListener("change", (e) => {
    const val = e.target.value;
    d3.selectAll(".network-link")
      .attr("stroke-opacity", d => {
        if (val === "best")  return d.value >= 3 ? 0.8 : 0.05;
        if (val === "worst") return d.value <= 1 ? 0.8 : 0.05;
        return 0.6;
      });
  });

  node.on("click", (_e, d) => {
    const playerStats = statsByPlayer[d.id];
    if (playerStats) {
      document.getElementById("profile-name").textContent  = d.id;
      document.getElementById("profile-ppg").textContent   = "PPG: " + playerStats.PPG;
      document.getElementById("profile-rpg").textContent   = "RPG: " + playerStats.RPG;
      document.getElementById("profile-apg").textContent   = "APG: " + playerStats.APG;
      document.getElementById("profile-games").textContent = "Games: " + playerStats.games_played;

      document.querySelector(".placeholder").classList.add("hidden");
      document.getElementById("profile-content").classList.remove("hidden");
    }
  });

};
