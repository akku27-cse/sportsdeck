export class Sport {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly iconUrl?: string
    ) {}

    static fromApi(data: any): Sport {
        return new Sport(
            data.id,
            data.name,
            data.icon_url
        );
    }
}