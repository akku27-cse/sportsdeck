
import { Team } from './Team';

export class Match {
    constructor(
        public readonly id: string,
        public readonly sportId: string,
        public readonly leagueId: string,
        public readonly league: string,
        public readonly homeTeam: Team,
        public readonly awayTeam: Team,
        public homeScore: number,
        public awayScore: number,
        public readonly startTime: string,
        public status: 'upcoming' | 'live' | 'completed',
        public readonly venue: string,
        public events: any[] = []
    ) {}

    static fromApi(data: any): Match {
        return new Match(
            data.id,
            data.sport_id,
            data.league_id,
            data.league,
            Team.fromApi(data.home_team),
            Team.fromApi(data.away_team),
            data.home_score || 0,
            data.away_score || 0,
            data.start_time,
            data.status,
            data.venue,
            data.events || []
        );
    }

    updateFromLive(update: any) {
        if (update.home_score !== undefined) {
            this.homeScore = update.home_score;
        }
        if (update.away_score !== undefined) {
            this.awayScore = update.away_score;
        }
        if (update.status) {
            this.status = update.status;
        }
        if (update.event) {
            this.events.push(update.event);
        }
    }
}