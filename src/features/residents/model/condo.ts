export interface UnitsByFloor {
  /** Prefixo comum às unidades do grupo (ex.: "1" para 101–117) ou um rótulo genérico. */
  floor: string;
  units: string[];
}

const FLOOR_PATTERN = /^(\d+)\d{2}$/;
const OTHER_UNITS_LABEL = 'Outras unidades';

/** Unidades como "101" viram andar "1"; o que não seguir o padrão cai num grupo só. */
function floorKeyOf(unit: string): string {
  const match = FLOOR_PATTERN.exec(unit.trim());

  return match?.[1] ?? OTHER_UNITS_LABEL;
}

function sortUnits(units: readonly string[]): string[] {
  return units.toSorted((first, second) => first.localeCompare(second, 'pt-BR', { numeric: true }));
}

/** Quebra uma lista de unidades por andar, pulando andares sem nenhuma. */
export function groupUnitsByFloor(units: readonly string[]): UnitsByFloor[] {
  const groups = new Map<string, string[]>();

  for (const unit of units) {
    const key = floorKeyOf(unit);
    groups.set(key, [...(groups.get(key) ?? []), unit]);
  }

  return [...groups.entries()]
    .toSorted(([first], [second]) => first.localeCompare(second, 'pt-BR', { numeric: true }))
    .map(([floor, floorUnits]) => ({ floor, units: sortUnits(floorUnits) }));
}

/** Opções agrupadas do `Select` de unidades, prontas para qualquer catálogo do condomínio. */
export function buildUnitOptions(units: readonly string[]) {
  return groupUnitsByFloor(units).map(({ floor, units: floorUnits }) => ({
    label: /^\d+$/.test(floor) ? `${floor}º andar` : floor,
    options: floorUnits.map((unit) => ({ label: unit, value: unit })),
  }));
}
