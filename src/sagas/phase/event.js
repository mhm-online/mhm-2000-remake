import { select, call, put, take, takeEvery, cancel } from "redux-saga/effects";
import events from "../../data/events";
import { cinteger } from "../../services/random";
import { resolveEvent, processEvents } from "../event";
import { OrderedMap, List } from "immutable";

const eventsMap = OrderedMap(
  List.of(
    [1, "jaralahti"],
    [2, "jaralahti"],
    [300, "mauto"],
    [294, "pirka"],
    [58, "pirka"],
    [122, "kasino"],
    [178, "kasino"],
    [56, "kuralahti"],
    [57, "kuralahti"],
    [174, "kuralahti"],
    [79, "russianAgent"],
    [144, "russianAgent"],
    [5, "taxEvasion"],
    [38, "taxEvasion"],
    [66, "suddenDeath"],
    [44, "suddenDeath"],
    [14, "ralliala"],
    [25, "ralliala"],
    [83, "concert"],
    [84, "concert"],
    [105, "swedenTransfer"],
    [298, "swedenTransfer"],
    [274, "jarko"],
    [218, "jarko"],
    [4, "moreTaxes"],
    [233, "moreTaxes"],
    [17, "cleandrug"],
    [156, "cleandrug"],
    [123, "fortuneTeller"],
    [213, "fortuneTeller"],
    [81, "voodoo"],
    [293, "voodoo"],
    [47, "stalking"],
    [77, "stalking"],
    [166, "fanMerchandise"],
    [299, "fanMerchandise"],
    [96, "embezzlement"],
    [69, "embezzlement"],
    [100, "masotv"],
    [200, "masotv"],
    [301, "jobofferPHL"],
    [138, "jobofferPHL"],
    [146, "undqvist"],
    [111, "jobofferDivision"],
    [43, "jobofferDivision"],
    [306, "fever"],
    [307, "fever"],
    [303, "haanperaMarries"],
    [320, "haanperaMarries"],
    [249, "haanperaDivorce"],
    [182, "haanperaDivorce"],
    [6, "pempers"],
    [65, "pempers"],
    [172, "limpenius"],
    [239, "limpenius"],
    [319, "hasselgren"],
    [280, "hasselgren"],
    [150, "arilander"],
    [240, "arilander"],
    [30, "karijurri"],
    [70, "karijurri"],
    [90, "metterer"],
    [190, "metterer"],
    [39, "arenaBurns"],
    [115, "valiveto"],
    [183, "bankMistake"],
    [24, "pekkiini"],
    [61, "enemyProtest"],
    [310, "urheiluruuttu"],
    [311, "pstudio"],
    [312, "ekkanen"],
    [314, "makrosoft"],
    [208, "makrosoft"],
    [313, "jarasvuo"],
    [53, "laskisalonen"],
    [252, "laskisalonen"],
    [74, "kecklin"],
    [107, "kecklin"],
    [147, "pakibetteri"],
    [318, "pakibetteri"],
    [203, "juznetsov"],
    [204, "juznetsov"],
    [185, "workPermits"],
    [245, "workPermits"],
    [45, "ogilny"],
    [55, "ogilny"],
    [127, "abcd"],
    [272, "abcd"],
    [54, "hirmukunto"],
    [285, "divisionRally"],
    [263, "phlRally"],
    [317, "otsohalli"],
    [126, "sopupeli"],
    [219, "yhteispeli"],
    [277, "habadobo"],
    [267, "jatovrel"],
    [106, "pertinPselit"],
    [268, "youStalk"],
    [321, "paajanen"],
    [328, "saunailta"],
    [322, "bestManagerEver"],
    [323, "worstManagerEver"],
    [324, "florist"],
    [325, "moneyTroubles"],
    [326, "pauligkahvi"],
    [327, "randomDude"],
    [279, "onecky"],
    [334, "mcHabadobo"],
    [335, "mcHabadobo"],
    [331, "ultimateCruelty"],
    [206, "ultimateCruelty"],
    [332, "etelalaAscends"],
    [102, "etelalaAscends"],
    [333, "etelalaDescends"],
    [175, "etelalaDescends"],
    [209, "etelalaBonusFrenzy"],
    [177, "etelalaGlitch"],
    [224, "attitudeCanada"],
    [136, "attitudeUSA"],
    [305, "scoreboard"],
    [221, "ramirez"],
    [244, "boxing"],
    [241, "psychoAttack"],
    [222, "psychoMail"],
    [235, "psychoRelease"],
    [210, "grossman"],
    [179, "bloodbath"],
    [114, "book"],
    [137, "allgoSuccess"],
    [168, "simonovSuccess"],
    [110, "strategyFailure"],
    [262, "strategySuccess"],
    [124, "foreignLegion"],
    [234, "incredibleFeeling"]
  )
);

const getEventId = () => {
  const eventNumber = cinteger(1, 335);
  const eventId = eventsMap.get(eventNumber);
  return eventId;
};

export default function* eventPhase() {
  yield put({
    type: "GAME_SET_PHASE",
    payload: "event"
  });

  yield put({
    type: "UI_DISABLE_ADVANCE"
  });

  const manager = 0;

  const eventId = getEventId();

  if (eventId) {
    yield call(events.get(eventId).create, { manager });
  }

  const autoresolveEvents = yield select(state =>
    state.event
      .get("events")
      .filterNot(e => e.get("resolved"))
      .filter(e => e.get("autoResolve"))
  );

  for (const [, event] of autoresolveEvents) {
    const eventObj = events.get(event.get("eventId"));
    yield eventObj.resolve(event);
  }

  const resolver = yield takeEvery("EVENT_RESOLVE_REQUEST", resolveEvent);

  let unresolved;
  do {
    unresolved = yield select(state =>
      state.event
        .get("events")
        .filterNot(e => e.get("resolved"))
        .count()
    );

    if (unresolved) {
      yield take("EVENT_RESOLVE");
    }
  } while (unresolved);

  yield cancel(resolver);

  yield call(processEvents);

  yield put({
    type: "UI_ENABLE_ADVANCE"
  });

  yield take("GAME_ADVANCE_REQUEST");
}
