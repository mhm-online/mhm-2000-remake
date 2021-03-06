import { normalCountryIds, legacyCountryFromCountry } from "../country";
import { mapObjIndexed, filter } from "ramda";
import countryData from "./countries";
import { Country } from "../../types/country";

interface PlayerRandomGenerator {
  nationality: number[];
  positions: number[];
  age: number[];
  ego: number[];
  leadership: number[];
  charisma: number[];
  specialTeams: number[];
}

export const randoms: PlayerRandomGenerator = {
  positions: [
    1,
    1,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    1,
    1,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5
  ],
  nationality: [
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    2,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    4,
    4,
    4,
    4,
    5,
    5,
    5,
    5,
    5,
    6,
    6,
    6,
    6,
    7,
    7,
    7,
    7,
    8,
    8,
    8,
    8,
    9,
    9,
    9,
    9,
    10,
    10,
    10,
    10,
    10,
    11,
    11,
    11,
    11,
    11,
    12,
    12,
    12,
    12,
    12,
    13,
    13,
    13,
    13,
    14,
    14,
    14,
    14,
    15,
    15,
    15,
    15,
    16,
    16,
    16,
    16,
    17,
    17,
    17,
    17
  ],
  age: [
    18,
    19,
    19,
    20,
    20,
    21,
    21,
    21,
    21,
    22,
    22,
    22,
    22,
    23,
    23,
    23,
    23,
    23,
    23,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    30,
    30,
    30,
    30,
    30,
    30,
    31,
    31,
    31,
    31,
    31,
    32,
    32,
    32,
    33,
    33,
    33,
    34,
    35
  ],
  ego: [
    1,
    1,
    2,
    2,
    3,
    3,
    4,
    4,
    4,
    5,
    5,
    5,
    6,
    6,
    6,
    7,
    7,
    7,
    7,
    7,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    9,
    9,
    9,
    9,
    9,
    9,
    9,
    9,
    9,
    9,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    11,
    11,
    11,
    11,
    11,
    11,
    11,
    11,
    11,
    11,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    13,
    13,
    13,
    13,
    13,
    14,
    14,
    14,
    15,
    15,
    15,
    16,
    16,
    17,
    17,
    18,
    18,
    19,
    19,
    20
  ],
  leadership: [
    20,
    19,
    18,
    17,
    16,
    15,
    14,
    14,
    13,
    13,
    13,
    12,
    12,
    12,
    12,
    11,
    11,
    11,
    11,
    6,
    10,
    10,
    10,
    10,
    7,
    1,
    1,
    1,
    8,
    9,
    9,
    9,
    2,
    2,
    2,
    3,
    3,
    4,
    4,
    4,
    5,
    6,
    7,
    8,
    5,
    6,
    7,
    8,
    5,
    6,
    7,
    8,
    5,
    6,
    7,
    8,
    5,
    6,
    7,
    8,
    4,
    4,
    3,
    3,
    3,
    2,
    2,
    2,
    8,
    9,
    9,
    9,
    1,
    1,
    1,
    7,
    10,
    10,
    10,
    10,
    6,
    11,
    11,
    11,
    11,
    12,
    12,
    12,
    12,
    13,
    13,
    13,
    14,
    14,
    15,
    16,
    17,
    18,
    19,
    20
  ],
  charisma: [
    1,
    2,
    1,
    2,
    1,
    2,
    1,
    2,
    1,
    2,
    1,
    2,
    1,
    2,
    1,
    2,
    3,
    4,
    3,
    4,
    3,
    4,
    5,
    6,
    5,
    6,
    5,
    6,
    5,
    6,
    6,
    8,
    6,
    8,
    7,
    8,
    7,
    8,
    7,
    8,
    9,
    10,
    11,
    9,
    10,
    11,
    9,
    10,
    11,
    9,
    10,
    11,
    9,
    10,
    11,
    9,
    10,
    12,
    9,
    10,
    12,
    13,
    12,
    13,
    12,
    13,
    7,
    8,
    7,
    8,
    7,
    5,
    6,
    14,
    15,
    14,
    15,
    16,
    14,
    15,
    16,
    14,
    15,
    16,
    17,
    18,
    16,
    17,
    18,
    16,
    17,
    18,
    16,
    17,
    18,
    19,
    20,
    19,
    20,
    10
  ],
  specialTeams: [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    -1,
    1,
    -1,
    1,
    -1,
    1,
    -1,
    1,
    -1,
    1,
    -1,
    1,
    -1,
    1,
    -1,
    1,
    -1,
    1,
    -1,
    1,
    -1,
    1,
    -1,
    2,
    -2,
    2,
    -2,
    2,
    -2,
    2,
    -2,
    2,
    -2,
    2,
    -2,
    2,
    -2,
    2,
    -2,
    3,
    -3,
    3,
    -3,
    3,
    -3,
    3,
    -3,
    3,
    -3
  ]
};

export const legacySkillGenerationMap = [
  [10, 26, 40, 43, 45, 20, 10, 5, 1],
  [10, 26, 40, 43, 45, 20, 10, 5, 1],
  [20, 32, 40, 50, 40, 10, 5, 2, 1],
  [20, 32, 40, 50, 40, 10, 5, 2, 1],
  [10, 26, 40, 43, 45, 20, 10, 5, 1],
  [10, 26, 40, 43, 45, 20, 10, 5, 1],
  [20, 32, 40, 50, 40, 10, 5, 2, 1],
  [20, 33, 46, 50, 25, 13, 8, 4, 1],
  [10, 30, 30, 35, 45, 20, 15, 10, 5],
  [10, 30, 30, 35, 45, 20, 15, 10, 5],
  [20, 33, 40, 46, 32, 16, 8, 4, 1],
  [20, 33, 40, 46, 32, 16, 8, 4, 1],
  [20, 32, 40, 50, 40, 10, 5, 2, 1],
  [20, 32, 40, 50, 40, 10, 5, 2, 1],
  [20, 32, 40, 50, 40, 10, 5, 2, 1],
  [20, 32, 40, 50, 40, 10, 5, 2, 1],
  [20, 32, 40, 50, 40, 10, 5, 2, 1]
];

/*
DIM pros(1 TO 200) AS INTEGER
c = 1
d = 1
FOR qwe = 1 TO 200
IF borssix(c, nats) > d THEN pros(qwe) = c: d = d + 1: GOTO purkka
IF borssix(c, nats) = d THEN pros(qwe) = c: d = 1: c = c + 1
purkka:
NEXT qwe
bel(xxx).psk = ((pros(INT(200 * RND) + 1)) * 2) + INT(3 * RND) - 1
ERASE pros
IF bel(xxx).psk > 6 THEN
temp% = INT(100 * RND) + 1
IF temp% < 11 THEN bel(xxx).spe = 8 ELSE IF temp% < 16 THEN bel(xxx).spe = 5 ELSE IF temp% < 19 THEN bel(xxx).spe = 2 ELSE IF temp% < 22 AND bel(xxx).age >= 30 THEN bel(xxx).spe = 1
END IF
}
*/

export const skillGenerationMap = mapObjIndexed(
  (country: Country) => {
    const row =
      legacySkillGenerationMap[legacyCountryFromCountry(country.iso) - 1];

    const pros: number[] = [];
    let c = 1;
    let d = 1;

    for (let x = 1; x <= 200; x = x + 1) {
      if (row[c - 1] > d) {
        pros.push(c);
        d = d + 1;
        continue;
      }
      if (row[c - 1] === d) {
        pros.push(c);
        d = 1;
        c = c + 1;
        continue;
      }
    }

    return pros;
  },
  filter(cd => normalCountryIds().includes(cd.iso), countryData)
);
