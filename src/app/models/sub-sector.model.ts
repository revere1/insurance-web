class SubSectorModel {
    constructor(
        public sector_id: number,
        public name: string,
        public status: string,
        public createdBy: string,
        public updatedBy: string,
        public id?: number
    ) { }
}
class SubSectorsFormModel {
    constructor(
        public sector_id: number,
        public name: string,
        public status: string,
        public createdBy: string,
        public updatedBy: string
    ) { }
}

export { SubSectorModel, SubSectorsFormModel }