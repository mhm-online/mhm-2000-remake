import {
  pipe,
  append,
  curry,
  map,
  repeat,
  flatten,
  assoc,
  mergeLeft
} from "ramda";
import { mapIndexed } from "ramda-adjunct";
import {
  MHMTurnPhasesList,
  CompetitionNameList,
  MHMCompetitionSeedDefinition,
  MHMTurnExtraOptions,
  CalendarEntry,
  CompetitionNames,
  MHMCalendar
} from "../../types/base";

export const CRISIS_DEADLINE = 52;
export const TRANSFER_DEADLINE = 30;
export const EVENT_DEADLINE = 53;
export const PRANKS_DEADLINE = 53;

const defaultPhases: MHMTurnPhasesList = [
  "action",
  "prank",
  "gameday",
  "calculations",
  "eventCreation",
  "event",
  "news",
  "seed",
  "cleanup"
];

const ehlPhases: MHMTurnPhasesList = [
  "action",
  "gameday",
  "calculations",
  "event",
  "news",
  "cleanup"
];

const tournamentPhases: MHMTurnPhasesList = [
  "action",
  "gameday",
  "gameday",
  "gameday",
  "gameday",
  "gameday",
  "calculations",
  "cleanup"
];

const createTurnDefinition = (
  phases: MHMTurnPhasesList,
  gamedays: CompetitionNameList = [],
  seed: MHMCompetitionSeedDefinition[] = [],
  extra: Partial<MHMTurnExtraOptions> = {}
): CalendarEntry => {
  return {
    round: -1,
    phases,
    gamedays,
    seed,
    pranks: false,
    createRandomEvent: false,
    transferMarket: false,
    crisisMeeting: false,
    tags: [],
    ...extra
  };
};

const augment = (data: Partial<CalendarEntry>) => (
  turn: CalendarEntry
): CalendarEntry => {
  return mergeLeft(data, turn);
};

const createSeedDefinition = curry(
  (
    phase: number,
    competition: CompetitionNames
  ): MHMCompetitionSeedDefinition => ({
    competition,
    phase
  })
);

const regularGameday = createTurnDefinition(
  defaultPhases,
  ["phl", "division", "mutasarja"],
  [],
  {
    tags: ["incrementReadiness", "sponsorRoundlyPayment", "paySalaries"]
  }
);

const regularPlayoffGameday = createTurnDefinition(
  defaultPhases,
  ["phl", "division", "mutasarja"],
  [],
  {
    tags: []
  }
);

const ehlGameday = createTurnDefinition(ehlPhases, ["ehl"], [], {});

const ehlFinalsDay = createTurnDefinition(tournamentPhases, ["ehl"], [], {});

const preSeasonTurn = createTurnDefinition([
  "action",
  "calculations",
  "cleanup"
]);

const trainingGameday = createTurnDefinition(ehlPhases, ["training"]);

const cupGameday = createTurnDefinition(ehlPhases, ["cup"]);

const freeWeekend = createTurnDefinition(
  ["action", "calculations", "cleanup"],
  [],
  [],
  {
    title: "Vapaa viikonloppu"
  }
);

const nationalTeamBreak = createTurnDefinition(
  ["action", "calculations", "cleanup"],
  [],
  [],
  {
    title: "Vapaa viikonloppu"
  }
);

const cal: MHMCalendar = [
  createTurnDefinition(
    ["startOfSeason", "seed", "cleanup"],
    [],
    map(createSeedDefinition(0), [
      "phl",
      "division",
      "mutasarja",
      "ehl",
      "training",
      "cup"
    ]),
    {}
  ),
  augment({
    ai: { actions: ["selectStrategy"] }
  })(preSeasonTurn),
  preSeasonTurn,
  preSeasonTurn,
  preSeasonTurn,
  preSeasonTurn,
  preSeasonTurn,
  ...repeat(trainingGameday, 4),
  ...repeat(regularGameday, 2),
  cupGameday,
  regularGameday,
  cupGameday,
  createTurnDefinition(["seed"], [], [createSeedDefinition(1, "cup")]),
  ehlGameday,
  freeWeekend,
  ...repeat(regularGameday, 2),
  ehlGameday,
  ...repeat(regularGameday, 3),
  ehlGameday,
  regularGameday,
  nationalTeamBreak,
  /*
  createTurnDefinition(["seed"], [], [createSeedDefinition(0, "tournaments")]),
  */
  regularGameday,
  cupGameday,
  regularGameday,
  cupGameday,
  createTurnDefinition(["seed"], [], [createSeedDefinition(2, "cup")]),
  ehlGameday,
  ...repeat(regularGameday, 3),
  ehlGameday,
  regularGameday,
  freeWeekend,
  ...repeat(regularGameday, 2),
  ehlGameday,
  createTurnDefinition(["seed"], [], [createSeedDefinition(1, "ehl")]),
  ...repeat(regularGameday, 4),
  cupGameday,
  regularGameday,
  // Christmas break (22 games played)

  createTurnDefinition(defaultPhases, [], [], {
    title: "Joulutauko"
  }),

  nationalTeamBreak,
  regularGameday,
  cupGameday,
  createTurnDefinition(["seed"], [], [createSeedDefinition(3, "cup")]),
  ...repeat(regularGameday, 5),
  ehlFinalsDay, // EHL FINALS
  ...repeat(regularGameday, 2),
  cupGameday,
  regularGameday,
  cupGameday,
  createTurnDefinition(["seed"], [], [createSeedDefinition(4, "cup")]),
  ...repeat(regularGameday, 2),
  nationalTeamBreak,
  ...repeat(regularGameday, 6),
  cupGameday,
  regularGameday,
  cupGameday,
  createTurnDefinition(["seed"], [], [createSeedDefinition(5, "cup")]),
  ...repeat(regularGameday, 4),

  createTurnDefinition(
    ["action", "event", "seed", "cleanup"],
    [],
    map(createSeedDefinition(1), ["phl", "division", "mutasarja"]),
    {
      title: "Playoff-pläjäys"
    }
  ),
  ...repeat(regularPlayoffGameday, 5),
  createTurnDefinition(
    ["action", "event", "seed", "cleanup"],
    [],
    map(createSeedDefinition(2), ["phl", "division", "mutasarja"]),
    {
      title: "Semifinaalipläjäys"
    }
  ),
  ...repeat(regularPlayoffGameday, 5),
  createTurnDefinition(
    ["action", "event", "seed", "cleanup"],
    [],
    map(createSeedDefinition(3), ["phl", "division", "mutasarja"]),
    {
      title: "Finaalipläjäys"
    }
  ),
  ...repeat(regularPlayoffGameday, 5),
  ...repeat(cupGameday, 2),
  createTurnDefinition(["action", "endOfSeason", "cleanup"], [], [], {
    title: "Kauden loppu"
  })
];

const cal2 = pipe(
  mapIndexed(
    (calendar: CalendarEntry, index: number): CalendarEntry => {
      return {
        ...calendar,
        round: index,
        transferMarket: index <= TRANSFER_DEADLINE,
        crisisMeeting: index <= CRISIS_DEADLINE,
        createRandomEvent: index <= EVENT_DEADLINE,
        pranks: index <= PRANKS_DEADLINE
      };
    }
  )
)(cal);

export default cal2 as MHMCalendar;
