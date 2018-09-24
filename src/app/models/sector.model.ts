class SectorModel {
  constructor(
    public name: string,
    public status: string,
    public createdBy: number,
    public updatedBy: number,
    public id?: number
  ) { }
}

class FormSectorModel {
  constructor(
    public name: string,
    public status: string,
    public createdBy: number,
    public updatedBy: number
  ) { }
}

export { SectorModel, FormSectorModel };