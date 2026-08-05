export interface DataInventorySection {
  title: string;
  text: string;
}

export interface DataInventory {
  version: string;
  title: string;
  intro: string;
  sections: DataInventorySection[];
}
