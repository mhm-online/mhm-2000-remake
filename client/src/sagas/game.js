import { Map } from "immutable";
import competitionData from "../data/competitions";
import gameService from "../services/game";

import { call, put, select, takeEvery } from "redux-saga/effects";

import actionPhase from "./phase/action";
import eventPhase from "./phase/event";
import gamedayPhase from "./phase/gameday";
import seedPhase from "./phase/seed";

import { afterGameday } from "./player";

export function* gameday(payload) {
  const teams = yield select(state => state.game.get("teams"));

  const competition = yield select(state =>
    state.game.getIn(["competitions", payload])
  );

  const phase = competition.getIn(["phases", competition.get("phase")]);

  const round = phase.get("round");

  console.log("gameday for", competition);

  const pairings = phase.getIn(["schedule", round]);

  console.log(pairings, "pairings");

  const gameParams = competitionData.getIn([
    competition.get("id"),
    "parameters",
    "gameday"
  ]);

  for (let x = 0; x < pairings.count(); x = x + 1) {
    const pairing = pairings.get(x);
    const home = teams.get(phase.getIn(["teams", pairing.get("home")]));
    const away = teams.get(phase.getIn(["teams", pairing.get("away")]));

    // console.log("game pairing", pairing);

    const game = Map({
      ...gameParams,
      home,
      away
    });

    const result = yield call(gameService.simulate, game);

    yield put({
      type: "GAME_RESULT",
      payload: {
        competition: competition.get("id"),
        phase: competition.get("phase"),
        round,
        result: result,
        pairing: x
      }
    });

    // console.log("reslut", result.toJS());
  }

  yield put({
    type: "GAME_GAMEDAY_COMPLETE",
    payload: {
      competition: competition.get("id"),
      phase: competition.get("phase"),
      round
    }
  });
}

export function* gameLoop() {
  const task = yield takeEvery("GAME_GAMEDAY_COMPLETE", afterGameday);

  do {
    console.log("ACTION PHASE");

    yield call(actionPhase);

    yield call(gamedayPhase);

    yield call(eventPhase);

    yield call(seedPhase);

    yield call(nextTurn);
  } while (true);
}

export function* seasonStart() {
  const competitions = yield select(state => state.game.get("competitions"));

  for (const [key, competitionObj] of competitionData) {
    yield put({
      type: "COMPETITION_START",
      payload: {
        competition: key
      }
    });

    yield put({
      type: "COMPETITION_SEED",
      payload: {
        competition: key,
        phase: 0,
        seed: competitionObj.getIn(["seed", 0])(competitions)
      }
    });
  }

  yield put({
    type: "SEASON_START"
  });
}

function* promote(action) {
  const {
    payload: { competition, team }
  } = action;

  const promoteTo = competitionData.getIn([competition, "promoteTo"]);

  yield put({
    type: "COMPETITION_REMOVE_TEAM",
    payload: {
      competition,
      team
    }
  });

  yield put({
    type: "COMPETITION_ADD_TEAM",
    payload: {
      competition: promoteTo,
      team
    }
  });
}

function* relegate(action) {
  const {
    payload: { competition, team }
  } = action;

  const relegateTo = competitionData.getIn([competition, "relegateTo"]);

  yield put({
    type: "COMPETITION_REMOVE_TEAM",
    payload: {
      competition,
      team
    }
  });

  yield put({
    type: "COMPETITION_ADD_TEAM",
    payload: {
      competition: relegateTo,
      team
    }
  });
}

function* nextTurn() {
  yield put({ type: "GAME_NEXT_TURN" });
}
