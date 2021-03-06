import { map, prop, sortBy, take } from "ramda";
import {
  CompetitionService,
  Matchups,
  PlayoffsCompetitionGroup,
  PlayoffsCompetitionPhase,
  RoundRobinCompetitionGroup,
  RoundRobinCompetitionPhase
} from "../../../types/base";
import { defaultMoraleBoost } from "../../morale";
import playoffScheduler, { eliminated, victors } from "../../playoffs";
import r from "../../random";
import rr from "../../round-robin";

const phl: CompetitionService = {
  canChooseIntensity: () => true,
  homeAdvantage: (phase, group) => {
    return 1;
  },

  awayAdvantage: (phase, group) => {
    return 0.85;
  },

  gameBalance: (phase, facts, manager) => {
    const arenaLevel = manager.arena.level + 1;
    if (facts.isLoss) {
      return manager.extra;
    }

    if (facts.isDraw) {
      return 5000 + 3000 * arenaLevel + manager.extra;
    }

    return 10000 + 3000 * arenaLevel + manager.extra;
  },

  moraleBoost: (phase, facts, manager) => {
    return defaultMoraleBoost(facts);
  },

  relegateTo: "division",
  promoteTo: false,

  parameters: {
    gameday: phase => ({
      advantage: {
        home: team => 10,
        away: team => -10
      },
      base: () => 20,
      moraleEffect: team => {
        return team.morale * 2;
      }
    })
  },

  seed: [
    competitions => {
      const competition = competitions.phl;
      const teams = sortBy(() => r.real(1, 1000), competition.teams);
      const times = 2;

      const phase: RoundRobinCompetitionPhase = {
        id: 0,
        name: "runkosarja",
        type: "round-robin",
        teams,
        groups: [
          {
            id: 0,
            penalties: [],
            type: "round-robin",
            round: 0,
            name: "runkosarja",
            teams,
            times,
            schedule: rr(teams.length, times),
            colors: [
              "d",
              "d",
              "d",
              "d",
              "d",
              "d",
              "d",
              "d",
              "l",
              "l",
              "l",
              "d"
            ],
            stats: []
          }
        ]
      };
      return phase;
    },
    competitions => {
      const teams = take(
        8,
        map(
          prop("id"),
          (competitions.phl.phases[0].groups[0] as RoundRobinCompetitionGroup)
            .stats
        )
      );

      const winsToAdvance = 3;
      const matchups: Matchups = [
        [0, 7],
        [1, 6],
        [2, 5],
        [3, 4]
      ];

      const phase: PlayoffsCompetitionPhase = {
        id: 1,
        name: "quarterfinals",
        type: "playoffs",
        teams,
        groups: [
          {
            id: 0,
            type: "playoffs",
            name: "playoffs",
            round: 0,
            teams,
            winsToAdvance,
            matchups,
            schedule: playoffScheduler(matchups, 3),
            stats: []
          } as PlayoffsCompetitionGroup
        ]
      };
      return phase;
    },
    competitions => {
      const teams = map(
        prop("id"),
        victors(
          competitions.phl.phases[1].groups[0] as PlayoffsCompetitionGroup
        )
      );

      const matchups: Matchups = [
        [0, 3],
        [1, 2]
      ];

      const winsToAdvance = 3;

      const phase: PlayoffsCompetitionPhase = {
        id: 2,
        name: "semifinals",
        type: "playoffs",
        teams,
        groups: [
          {
            id: 0,
            name: "Semifinaalit",
            type: "playoffs",
            round: 0,
            teams,
            matchups,
            winsToAdvance,
            schedule: playoffScheduler(matchups, winsToAdvance),
            stats: []
          }
        ]
      };
      return phase;
    },
    competitions => {
      const teams = map(prop("id"), [
        ...victors(
          competitions.phl.phases[2].groups[0] as PlayoffsCompetitionGroup
        ),
        ...eliminated(
          competitions.phl.phases[2].groups[0] as PlayoffsCompetitionGroup
        )
      ]);

      const matchups: Matchups = [
        [0, 1],
        [2, 3]
      ];

      const winsToAdvance = 3;

      const phase: PlayoffsCompetitionPhase = {
        id: 3,
        name: "finals",
        type: "playoffs",
        teams,
        groups: [
          {
            id: 3,
            name: "Finaalit",
            type: "playoffs",
            teams,
            round: 0,
            matchups,
            winsToAdvance,
            schedule: playoffScheduler(matchups, winsToAdvance),
            stats: []
          }
        ]
      };
      return phase;
    }
  ]
};

export default phl;
