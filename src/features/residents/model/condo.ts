import dayjs from 'dayjs';

const FLOORS = [1, 2, 3, 4] as const;
const APARTMENTS_PER_FLOOR = 17;

/** The condo has 68 apartments: 101–117, 201–217, 301–317 and 401–417. */
const CONDO_UNITS = FLOORS.flatMap((floor) =>
  Array.from(
    { length: APARTMENTS_PER_FLOOR },
    (_value, index) => `${floor}${String(index + 1).padStart(2, '0')}`,
  ),
);

/** Grouped by floor so a list of 68 options stays easy to scan. */
export const UNIT_OPTIONS = FLOORS.map((floor) => ({
  label: `${floor}º andar`,
  options: CONDO_UNITS.filter((unit) => unit.startsWith(String(floor))).map((unit) => ({
    label: unit,
    value: unit,
  })),
}));

export interface UnitsByFloor {
  floor: number;
  units: string[];
}

/** Quebra uma lista de unidades por andar, pulando andares sem nenhuma. */
export function groupUnitsByFloor(units: readonly string[]): UnitsByFloor[] {
  return FLOORS.map((floor) => ({
    floor,
    units: units.filter((unit) => unit.startsWith(String(floor))),
  })).filter((group) => group.units.length > 0);
}

/** When the building was handed over: the move-in date of the first residents. */
export const BUILDING_HANDOVER_DATE = dayjs('2018-04-01');
