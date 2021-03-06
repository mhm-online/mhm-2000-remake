import React, { FunctionComponent, ReactElement } from "react";
import styled from "@emotion/styled";
import Button from "./form/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toggleMenu } from "../ducks/ui";
import { Dispatch } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { advance } from "../ducks/game";
import { advanceEnabled } from "../services/selectors";
import Forward from "./fixed-bar/Forward";

const Container = styled.header`
  background-color: rgb(133, 133, 133);
  padding: 0.5em 0;
  color: rgb(255, 255, 255);
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  flex-basis: 100%;
  z-index: 1000;

  .secondary {
    flex-shrink: 10;
    padding: 0 0.5em;
  }

  .advance {
    align-self: flex-end;
    text-align: right;
    flex-grow: 3;
    padding: 0 0.5em;
  }
`;

interface Props {
  menu?: boolean;
  back?: boolean;
}

const Header: FunctionComponent<Props> = ({ menu = true, back = false }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  /*
  const manager = useSelector(activeManager);

  const turn = useSelector(currentTurn);
  const team = useSelector(requireHumanManagersTeamObj(manager.id));
  const teams = useSelector(allTeamsMap);
  const teamsMatch = useSelector(teamsMatchOfTurn(team.id, turn));
  */

  return (
    <Container>
      {menu && (
        <div className="secondary">
          <Button secondary onClick={() => dispatch(toggleMenu())}>
            <FontAwesomeIcon icon={["fas", "bars"]} />
          </Button>
        </div>
      )}

      {back && (
        <div className="advance">
          <Button block onClick={() => history.push("/")}>
            Päävalikkoon
          </Button>
        </div>
      )}

      {!back && (
        <>
          <div className="advance">
            <Forward />
          </div>
        </>
      )}
    </Container>
  );
};

Header.defaultProps = {
  back: false,
  menu: false,
  forward: "Eteenpäin!"
};

export default Header;
