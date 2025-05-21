export class Team {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly shortName: string,
        public readonly logo?: string
    ) {}

    static fromApi(data: any): Team {
        return new Team(
            data.id,
            data.name,
            data.short_name,
            data.logo
        );
    }
}