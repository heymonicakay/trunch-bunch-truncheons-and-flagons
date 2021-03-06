import { getPlayers, usePlayers } from "../player/PlayerProvider.js";
import { getTeams, useTeams } from "../teams/TeamProvider.js";
import { getScores, useScores } from "../score/ScoreProvider.js";
import { LeaderboardHTML } from "./Leaderboard.js"

const leaderboardTarget =  document.querySelector(".leaderboard--container")
const eventHub = document.querySelector(".container")

eventHub.addEventListener("playerStateChanged", () => {
    listLeaderboard()
})

eventHub.addEventListener("teamStateChanged", () => {
    listLeaderboard()
})

eventHub.addEventListener("scoreStateChanged", () => {
    listLeaderboard()
})


export const listLeaderboard = () => {  
    let leaderboardData = []
    let teams = []
    let players = []
    let scores = []
  
    getTeams()
        .then( () => {
            teams = useTeams()
        })
        .then(getPlayers)
        .then(() => {
            players = usePlayers()
        })
        .then(getScores)
        .then(() => {
            scores = useScores()
        })

        .then(() => {
            for(const team of teams) {
            leaderboardData.push( 
                {teamName: team.name,
                teamId: team.id,
                playerCount: 0,
                teamScore: 0}
                )
            }   

            for(const player of players) {
                for (const team of leaderboardData) {
                    if(player.teamId === team.teamId) {
                        team.playerCount++
                    }   
                }
            }

            for(const score of scores) {
                for (const team of leaderboardData) {
                    if(score.teamId === team.teamId) {
                        team.teamScore += score.gameScore
                    }   
                }

            }
            
            leaderboardData.sort( ( a, b) => {
                return a.teamScore - b.teamScore
            })

            render(leaderboardData.reverse())  
                   
        })  
      
}

const render = (leaderboardData) => {

      let digitalLeaderboard = ""
      
      leaderboardData.forEach((thisData) => {
            digitalLeaderboard += LeaderboardHTML(thisData)
      })
     
      leaderboardTarget.innerHTML = `
        <div class="scoreboard-row">
            <div class="scoreboard-team-name">
                Team Name
            </div>
            <div class="scoreboard-player-count">
                Player Count
            </div>
            <div class="scoreboard-score">
                Team Score
            </div>
        </div>
            ${digitalLeaderboard}
      `
}


