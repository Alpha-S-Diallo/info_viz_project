function loadData() {
  return Promise.all([
    d3.csv("data/season_stats.csv"),
    d3.csv("data/assist_network.csv")
  ]).then(([statsRaw, assistRaw]) => {

    const stats = statsRaw.map(d => ({
      player:    d["Player"],
      games_played:+d["Games Played"],
      PPG:+d["PPG"],
      RPG:+d["RPG"],
      APG: +d["APG"],
      SPG:+d["SPG"],
      BPG: +d["BPG"],
      FG_pct: parseFloat(d["FG%"]),
      TO:+d["TO"],
      FT_attempts:+d["FT Attempts"]
    }));

    const links = assistRaw.map(d => ({
      source: d["Passer"],
      target: d["Receiver"],
      value:  +d["Total Assists"]
    }));

    const playerNames = new Set();
    assistRaw.forEach(d => {
      playerNames.add(d["Passer"]);
      playerNames.add(d["Receiver"]);
    });
    const nodes = Array.from(playerNames).map(name => ({ id: name }));

    return { stats, nodes, links };
  });
}

loadData().then(({ nodes, links, stats}) => drawNetwork(nodes, links,stats));
