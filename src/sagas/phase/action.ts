import { nth } from "ramda";
import {
  call,
  fork,
  all,
  take,
  takeEvery,
  cancel,
  put,
  select,
  takeLeading
} from "redux-saga/effects";
import { gameSave, setPhase } from "../game";
import {
  watchTransferMarket,
  crisisMeeting,
  improveArena,
  toggleService,
  setActiveManager,
  managerSelectStrategy,
  budgetOrganization
} from "../manager";
import { orderPrank } from "../prank";
import { acceptInvitation } from "../invitation";

import { INVITATION_ACCEPT_REQUEST } from "../../ducks/invitation";
import { BETTING_BET_REQUEST } from "../../ducks/betting";
import { bet } from "../betting";
import {
  humanManagers,
  allComputerControlledTeams,
  allHumanControlledTeams,
  allManagersMap
} from "../../services/selectors";
import { HumanManager, ComputerManager, Manager } from "../../types/manager";
import {
  GameSetPhaseAction,
  GAME_SET_PHASE,
  GameAdvanceAction,
  GAME_ADVANCE_REQUEST,
  GameAdvanceRequestAction
} from "../../ducks/game";
import { ComputerControlledTeam, HumanControlledTeam } from "../../types/team";
import { MapOf } from "../../types/base";
import { isComputerControlledTeam } from "../../services/team";
import aiActionPhase from "../ai/phase/action";
import {
  MANAGER_SELECT_STRATEGY,
  ManagerSelectStrategyAction,
  ManagerBudgetOrganizationAction,
  MANAGER_BUDGET_ORGANIZATION
} from "../../ducks/manager";

export default function* actionPhase() {
  const managers: HumanManager[] = yield select(humanManagers);

  const manager = nth(0, managers);
  if (!manager) {
    throw new Error("There is no manager");
  }
  yield call(setActiveManager, manager.id);
  yield call(setPhase, "action");

  const tasks = yield all([
    takeLeading<ManagerSelectStrategyAction>(MANAGER_SELECT_STRATEGY, function*(
      a
    ) {
      yield call(managerSelectStrategy, a.payload.manager, a.payload.strategy);
    }),

    takeLeading<ManagerBudgetOrganizationAction>(
      MANAGER_BUDGET_ORGANIZATION,
      function*(a) {
        yield call(budgetOrganization, a.payload.manager, a.payload.budget);
      }
    ),

    takeLeading("GAME_SAVE_REQUEST", gameSave)
    /*
    takeEvery("MANAGER_TOGGLE_SERVICE", toggleService)
    fork(watchTransferMarket),
    takeEvery("MANAGER_CRISIS_MEETING", crisisMeeting),
    takeEvery("MANAGER_IMPROVE_ARENA", improveArena),


    takeEvery("PRANK_ORDER", orderPrank),
    takeEvery(INVITATION_ACCEPT_REQUEST, function*(action) {
      yield call(acceptInvitation, action.payload.manager, action.payload.id);
    }),
    takeEvery(BETTING_BET_REQUEST, function*(action) {
      const {
        payload: { manager, coupon, amount }
      } = action;
      yield call(bet, manager, coupon, amount);
    })
    */
  ]);

  yield take<GameAdvanceRequestAction>(GAME_ADVANCE_REQUEST);
  yield call(aiActionPhase);

  yield cancel(tasks);
}
