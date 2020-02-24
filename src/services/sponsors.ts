import { sponsorNames } from "./data/sponsors";
import random from "./random";
import { SponsorshipClausule, SponsorshipProposal } from "../types/sponsor";
import { MapOf } from "../types/base";
import { sortWith, ascend, prop, values, curry } from "ramda";
import { Arena } from "../types/arena";
import { number } from "prop-types";

/*
seks: [
  1: phl => 4, div,mut => 0
  2: phl: 0, div,mut => 3
  3: 3
  4: ehl: 3, ei ehl => 0
]
*/

interface SponsorshipClausuleService {
  id: string;
  legacyId: number;
  title: string;
  weight: number;

  willSponsorOffer: (proposal: SponsorshipProposal) => boolean;

  getAmount: (proposal: SponsorshipProposal) => number;

  getTimes: () => number;
  // isRelevant: (proposal: SponsorshipProposal) => boolean;
}

export const getRequirementOptions = (proposal: SponsorshipProposal) => {
  return {
    basic: proposal.competitions.includes("phl") ? [0, 1, 2, 3] : [0, 1, 2],
    cup: [0, 1, 2],
    ehl: proposal.competitions.includes("phl") ? [0, 1, 2] : [0]
  };
};

const getAmountFromModifiers = curry(
  (requirementType, multiplierData, proposal: SponsorshipProposal): number => {
    const [multiplier, clausuleType] = multiplierData[
      proposal.requirements[requirementType]
    ];

    return (
      sponsorshipClausuleMap[clausuleType].getAmount(proposal) * multiplier
    );
  }
);

export const sponsorshipClausuleMap: MapOf<SponsorshipClausuleService> = {
  firstPlace: {
    weight: 1000,
    id: "firstPlace",
    legacyId: 1,
    title: "Mestaruus",
    getTimes: () => 1,
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return proposal.competitions.includes("phl");
    },
    getAmount: getAmountFromModifiers("basic", [
      [0, "roundlyPayment"],
      [0, "roundlyPayment"],
      [5, "roundlyPayment"],
      [8, "roundlyPayment"]
    ])
  },
  secondPlace: {
    weight: 1000,
    id: "secondPlace",
    legacyId: 2,
    title: "Hopea",
    getTimes: () => 1,
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return proposal.competitions.includes("phl");
    },
    getAmount: getAmountFromModifiers("basic", [
      [0, "roundlyPayment"],
      [0, "roundlyPayment"],
      [4.5, "roundlyPayment"],
      [7, "roundlyPayment"]
    ])
  },
  bronzeMedal: {
    weight: 1000,
    id: "thirdPlace",
    legacyId: 3,
    title: "Pronssi",
    getTimes: () => 1,
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return proposal.competitions.includes("phl");
    },
    getAmount: getAmountFromModifiers("basic", [
      [0, "roundlyPayment"],
      [0, "roundlyPayment"],
      [4, "roundlyPayment"],
      [6, "roundlyPayment"]
    ])
  },
  fourthPlace: {
    weight: 1000,
    id: "fourthPlace",
    legacyId: 4,
    title: "Neljäs sija",
    getTimes: () => 1,
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return proposal.competitions.includes("phl");
    },
    getAmount: getAmountFromModifiers("basic", [
      [0, "roundlyPayment"],
      [0, "roundlyPayment"],
      [3.5, "roundlyPayment"],
      [0, "roundlyPayment"]
    ])
  },
  playoffs: {
    weight: 1000,
    id: "playoffs",
    legacyId: 5,
    title: "Pääsy Play-Offeihin",
    getTimes: () => 1,
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return true;
    },
    getAmount: (proposal: SponsorshipProposal) => {
      if (proposal.competitions.includes("phl")) {
        return getAmountFromModifiers(
          "basic",
          [
            [0, "roundlyPayment"],
            [3, "roundlyPayment"],
            [0, "roundlyPayment"],
            [0, "roundlyPayment"]
          ],
          proposal
        );
      }

      return getAmountFromModifiers(
        "basic",
        [
          [0, "roundlyPayment"],
          [3, "roundlyPayment"],
          [0, "roundlyPayment"]
        ],
        proposal
      );
    }
  },
  cupWin: {
    weight: 1000,
    id: "cupWin",
    legacyId: 6,
    title: "Cupin voitto",
    getTimes: () => 1,
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return true;
    },
    getAmount: getAmountFromModifiers("cup", [
      [0, "roundlyPayment"],
      [0, "roundlyPayment"],
      [2.5, "roundlyPayment"]
    ])
  },
  cupAdvancement: {
    weight: 1000,
    id: "cupAdvancement",
    legacyId: 7,
    title: "Eteneminen cupissa",
    getTimes: () => 1,
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return true;
    },
    getAmount: getAmountFromModifiers("cup", [
      [0, "roundlyPayment"],
      [1.25, "roundlyPayment"],
      [1.5, "roundlyPayment"]
    ])
  },
  ehlWin: {
    weight: 1000,
    id: "ehlWin",
    legacyId: 8,
    title: "Euroopan mestaruus",
    getTimes: () => 1,
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return proposal.competitions.includes("ehl");
    },
    getAmount: getAmountFromModifiers("ehl", [
      [0, "roundlyPayment"],
      [0, "roundlyPayment"],
      [8, "roundlyPayment"]
    ])
  },
  ehlPhaseTwo: {
    weight: 1000,
    id: "ehlPhaseTwo",
    legacyId: 9,
    title: "Pääsy EHL:n lopputurnaukseen",
    getTimes: () => 1,
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return proposal.competitions.includes("ehl");
    },
    getAmount: getAmountFromModifiers("ehl", [
      [0, "roundlyPayment"],
      [3.5, "roundlyPayment"],
      [0, "roundlyPayment"]
    ])
  },
  promotion: {
    weight: 1000,
    id: "promotion",
    legacyId: 10,
    title: "Sarjanousu",
    getTimes: () => 1,
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return (
        proposal.competitions.includes("division") ||
        proposal.competitions.includes("mutasarja")
      );
    },
    getAmount: getAmountFromModifiers("basic", [
      [0, "roundlyPayment"],
      [1.5, "roundlyPayment"],
      [8, "roundlyPayment"]
    ])
  },
  missMedal: {
    weight: 1000,
    id: "missMedal",
    legacyId: 11,
    title: "Mitalitta jääminen",
    getTimes: () => 1,
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return proposal.competitions.includes("phl");
    },
    getAmount: getAmountFromModifiers("basic", [
      [0, "roundlyPayment"],
      [0, "roundlyPayment"],
      [0, "roundlyPayment"],
      [-1, "roundlyPayment"]
    ])
  },
  missSemiFinals: {
    weight: 1000,
    id: "missSemiFinals",
    legacyId: 12,
    title: "Semifinaaleista karsiutuminen",
    getTimes: () => 1,
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return proposal.competitions.includes("phl");
    },
    getAmount: getAmountFromModifiers("basic", [
      [0, "roundlyPayment"],
      [0, "roundlyPayment"],
      [-0.8, "roundlyPayment"],
      [0.2, "missMedal"]
    ])
  },
  missPlayoffs: {
    weight: 1000,
    id: "missPlayoffs",
    legacyId: 13,
    title: "Play-offeista ulos jääminen",
    getTimes: () => 1,
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return proposal.competitions.includes("phl");
    },
    getAmount: proposal => {
      if (proposal.competitions.includes("phl")) {
        return getAmountFromModifiers(
          "basic",
          [
            [0, "roundlyPayment"],
            [-1.2, "playoffs"],
            [0.3, "missSemifinals"],
            [0.18, "missMedal"]
          ],
          proposal
        );
      }

      return getAmountFromModifiers(
        "basic",
        [
          [0, "roundlyPayment"],
          [-1.2, "playoffs"],
          [-1, "promotion"]
        ],
        proposal
      );
    }
  },
  missSafetyFromRelegation: {
    weight: 1000,
    id: "missSafetyFromRelegation",
    legacyId: 14,
    title: "Karsintaan joutuminen",
    getTimes: () => 1,
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return (
        proposal.competitions.includes("phl") ||
        proposal.competitions.includes("division")
      );
    },
    getAmount: getAmountFromModifiers("basic", [
      [0, "roundlyPayment"],
      [0.3, "missPlayoffs"],
      [0.2, "missSemifinals"],
      [0.16, "missMedal"]
    ])
  },
  relegation: {
    weight: 1000,
    id: "relegation",
    legacyId: 15,
    title: "Putoaminen",
    getTimes: () => 1,
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return (
        proposal.competitions.includes("phl") ||
        proposal.competitions.includes("division")
      );
    },
    getAmount: getAmountFromModifiers("basic", [
      [0, "roundlyPayment"],
      [0.4, "missPlayoffs"],
      [0.1, "missSemifinals"],
      [0.14, "missMedal"]
    ])
  },
  missCupSemiFinals: {
    weight: 1000,
    id: "missCupSemiFinals",
    legacyId: 16,
    getTimes: () => 1,
    title: "Putoaminen cupista ennen semifinaaleja",
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return true;
    },
    getAmount: getAmountFromModifiers("cup", [
      [0, "roundlyPayment"],
      [0, "roundlyPayment"],
      [-6, "cupWin"]
    ])
  },
  missCup2ndRound: {
    weight: 1000,
    id: "missCup2ndRound",
    legacyId: 17,
    getTimes: () => 1,
    title: "Putoaminen cupista 1. kierroksella",
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return true;
    },
    getAmount: getAmountFromModifiers("cup", [
      [0, "roundlyPayment"],
      [-1.5, "cupAdvancement"],
      [-2, "cupAdvancement"]
    ])
  },
  missEhlPhaseTwo: {
    weight: 1000,
    id: "missEhlPhaseTwo",
    legacyId: 18,
    getTimes: () => 1,
    title: "EHL:n lopputurnauksesta karsiutuminen",
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return proposal.competitions.includes("ehl");
    },
    getAmount: getAmountFromModifiers("ehl", [
      [0, "roundlyPayment"],
      [-0.9, "ehlPhaseTwo"],
      [-0.9, "ehlWin"]
    ])
  },
  missPromotion: {
    weight: 1000,
    id: "missPromotion",
    legacyId: 18,
    getTimes: () => 1,
    title: "Ei sarjanousua",
    willSponsorOffer: (proposal: SponsorshipProposal) => {
      return (
        proposal.competitions.includes("division") ||
        proposal.competitions.includes("mutasarja")
      );
    },
    getAmount: getAmountFromModifiers("basic", [
      [0, "roundlyPayment"],
      [0, "roundlyPayment"],
      [0.75, "promotion"]
    ])
  },
  roundlyPayment: {
    weight: 1000,
    id: "roundlyPayment",
    legacyId: 18,
    getTimes: () => 44,
    title: "Ottelumaksu",
    willSponsorOffer: () => true,
    getAmount: (proposal: SponsorshipProposal) => {
      return proposal.baseAmount;
    }
  }
};

const sorter = sortWith<SponsorshipClausuleService>([ascend(prop("weight"))]);

export const weightedSponsorshipClausuleList = () => {
  return sorter(values(sponsorshipClausuleMap));
};

/*
  "MESTARUUS",
  "HOPEA",
  "PRONSSI",
  "NELJÄS SIJA",
  "PÄÄSY PLAY-OFFEIHIN",
  "CUPIN VOITTO",
  "KIERROS/CUP",
  "EUROOPAN MESTARUUS",
  "PÄÄSY EHL-LOPPUTURNAUKSEEN",
  "SARJANOUSU",
  "MITALITTA JÄÄMINEN",
  "SEMIFINAALEISTA KARSIUTUMINEN",
  "PLAY-OFFEISTA ULOS JÄÄMINEN",
  "KARSINTAAN JOUTUMINEN",
  "PUTOAMINEN",
  "PUTOAMINEN CUPISTA ENNEN SEMIFINAALEJA",
  "PUTOAMINEN CUPISTA 1. KIERROKSELLA",
  "EHL:N LOPPUTURNAUKSESTA KARSIUTUMINEN",
  "EI SARJANOUSUA",
*/

export const getRandomAttitude = (proposal: SponsorshipProposal): number => {
  return 0.9 + random.real(0, 0.05) + proposal.attitudeBonus;
};

export const getRandomSponsorName = (): string => {
  return random.pick(sponsorNames);
};

export const getArenaModifier = (arena: Arena): number => {
  if (!arena.boxes) {
    return 0;
  }

  return 0.05;
};
