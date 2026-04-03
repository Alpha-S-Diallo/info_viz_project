d3.csv("../data/season_stats.csv",d=>{
    return {
        player: d.player,
        games_played: +d.count,
        PPG: +d.PPG,
        RPG: +d.RPG,
        APG: +d.APG,
        SPG: +d.SPG,
        BPG: +d.BPG,
        FG: +d.FG,
        TO: +d.TO,
        FTA: +d.FTA
      };}).then( data => { console.log(data);

      });
        
        
        
    