import React from "react";
import styled from "styled-components";
import TeamName from "../team/Name";
import { List } from "immutable";

const Results = props => {
  const { className, teams, context, round, managers } = props;

  const pairings = context.getIn(["schedule", round], List()).filter((p, i) => {
    return p.get("result");
  });

  return (
    <div className={className}>
      <table>
        <tbody>
          {pairings.map((pairing, i) => {
            return (
              <tr key={i}>
                <td>
                  <TeamName
                    managers={managers}
                    team={teams.get(
                      context.getIn(["teams", pairing.get("home")])
                    )}
                  />
                </td>
                <td>-</td>
                <td>
                  <TeamName
                    managers={managers}
                    team={teams.get(
                      context.getIn(["teams", pairing.get("away")])
                    )}
                  />
                </td>
                {pairing.get("result") && (
                  <>
                    <td>{pairing.getIn(["result", "home"])}</td>
                    <td>-</td>
                    <td>{pairing.getIn(["result", "away"])}</td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default styled(Results)`
  max-width: 30em;
`;