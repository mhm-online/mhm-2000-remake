import { Map, List } from "immutable";
import { put, select } from "redux-saga/effects";
import { managersTeamId, teamCompetesIn } from "../selectors";
import { currency as c } from "../../services/format";
import { cinteger } from "../../services/random";

const eventId = "russianAgent";

const texts = data => {
  let t = List.of(
    `Venäjän agenttisi soittaa ja tarjoaa "huippupelaajaa" __Moskovan ZSKA__:sta. Et tiedä mitään hänen tasostaan, mutta toisaalta hintakin on vain ${c(
      data.get("amount")
    )}. Päätös täytyy joka tapauksessa tehdä _heti_.`
  );

  if (!data.get("resolved")) {
    return t;
  }

  if (data.get("agree")) {
    t = t.push("Pelaaja saapuu seuraavalla vuorokoneella!");
  } else {
    t = t.push("Pelaaja jää Moskovaan!");
  }
  return t;
};

const event = {
  type: "manager",

  create: function*(data) {
    const { manager } = data;

    const team = yield select(managersTeamId(manager));
    const playsInPHL = yield select(teamCompetesIn(team, "phl"));
    if (!playsInPHL) {
      return;
    }

    yield put({
      type: "EVENT_ADD",
      payload: {
        event: Map({
          eventId,
          manager,
          amount: 50000,
          resolved: false
        })
      }
    });

    return;
  },

  options: data => {
    return Map({
      agree: `Ostan mysteeripelaajan`,
      disagree: `En osta mysteeripelaajaa`
    });
  },

  resolve: function*(data, value) {
    data = data.set("resolved", true).set("agree", value === "agree");

    yield put({
      type: "EVENT_RESOLVE",
      payload: {
        id: data.get("id"),
        event: data
      }
    });
  },

  render: data => {
    return texts(data);
  },

  process: function*(data) {
    const manager = data.get("manager");
    const team = yield select(managersTeamId(manager));

    if (!data.get("agree")) {
      return;
    }

    const skillGained = cinteger(1, 11);
    yield put({
      type: "TEAM_INCREMENT_STRENGTH",
      payload: { team, amount: skillGained }
    });

    yield put({
      type: "MANAGER_DECREMENT_BALANCE",
      payload: {
        manager,
        amount: data.get("amount")
      }
    });
  }
};

export default event;
