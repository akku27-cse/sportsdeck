import * as vscode from 'vscode';
import axios from 'axios';
import WebSocket from 'ws';
import { Match, Sport, Team } from './models';
import { getConfig } from '../utils/config';
import { SPORTS_API_ENDPOINTS } from '../utils/constants';

interface SportsDeckConfig {
    favoriteSports: string[];
    favoriteLeagues: string[];
    favoriteTeams: string[];
    updateInterval: number;
    displayMode: string;
    notifications: boolean;
    apiKey: string;
    autoOpenPanel: boolean;
}

export class SportsFeedManager {
    private matches: Match[] = [];
    private sports: Sport[] = [];
    private updateIntervalId?: NodeJS.Timeout;
    private wsConnection?: WebSocket;
    private eventEmitter = new vscode.EventEmitter<{ matches: Match[]; sports: Sport[] }>();

    constructor(private context: vscode.ExtensionContext, private config: SportsDeckConfig) {
        this.initialize();
    }

    onUpdate(listener: (data: { matches: Match[]; sports: Sport[] }) => void) {
        this.eventEmitter.event(listener);
    }

    async initialize() {
        await this.refreshData();
        this.setupWebSocket();
        this.setupPolling();
    }

    async refreshData() {
        try {
            const [matchesResponse, sportsResponse] = await Promise.all([
                axios.get(SPORTS_API_ENDPOINTS.matches, {
                    params: {
                        sports: this.config.favoriteSports.join(','),
                        leagues: this.config.favoriteLeagues.join(','),
                        teams: this.config.favoriteTeams.join(','),
                        api_key: this.config.apiKey
                    }
                }),
                axios.get(SPORTS_API_ENDPOINTS.sports, {
                    params: {
                        api_key: this.config.apiKey
                    }
                })
            ]);

            this.matches = matchesResponse.data.matches.map((m: any) => Match.fromApi(m));
            this.sports = sportsResponse.data.sports.map((s: any) => Sport.fromApi(s));

            this.eventEmitter.fire({ matches: this.matches, sports: this.sports });
            this.showNotifications();
        } catch (error) {
            vscode.window.showErrorMessage('Failed to fetch sports data: ' + (error as Error).message);
        }
    }

    setupWebSocket() {
        if (this.wsConnection) {
            this.wsConnection.close();
        }

        const wsUrl = `${SPORTS_API_ENDPOINTS.ws}?api_key=${this.config.apiKey}`;
        this.wsConnection = new WebSocket(wsUrl);

        this.wsConnection.on('open', () => {
            console.log('WebSocket connection established');
        });

        this.wsConnection.on('message', (data) => {
            const message = JSON.parse(data.toString());
            this.handleLiveUpdate(message);
        });

        this.wsConnection.on('close', () => {
            console.log('WebSocket connection closed');
            setTimeout(() => this.setupWebSocket(), 5000); // Reconnect after 5 seconds
        });

        this.wsConnection.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    }

    handleLiveUpdate(update: any) {
        const matchIndex = this.matches.findIndex(m => m.id === update.matchId);
        if (matchIndex !== -1) {
            this.matches[matchIndex].updateFromLive(update);
            this.eventEmitter.fire({ matches: this.matches, sports: this.sports });
            this.showNotifications(update);
        }
    }

    setupPolling() {
        if (this.updateIntervalId) {
            clearInterval(this.updateIntervalId);
        }
        this.updateIntervalId = setInterval(
            () => this.refreshData(),
            this.config.updateInterval * 1000
        );
    }

    showNotifications(update?: any) {
        if (!this.config.notifications) return;

        if (update) {
            // Notification for specific live event
            if (update.eventType === 'goal' || update.eventType === 'wicket' || update.eventType === 'score') {
                const match = this.matches.find(m => m.id === update.matchId);
                if (match) {
                    vscode.window.showInformationMessage(
                        `${match.homeTeam.name} ${match.homeScore}-${match.awayScore} ${match.awayTeam.name}\n` +
                        `${update.eventType.toUpperCase()}: ${update.description}`
                    );
                }
            }
        } else {
            // General notification for matches starting
            const startingSoon = this.matches.filter(m => 
                m.status === 'upcoming' && 
                new Date(m.startTime).getTime() - Date.now() < 30 * 60 * 1000
            );

            startingSoon.forEach(match => {
                vscode.window.showInformationMessage(
                    `Match starting soon: ${match.homeTeam.name} vs ${match.awayTeam.name} at ${new Date(match.startTime).toLocaleTimeString()}`
                );
            });
        }
    }

    toggleUpdates() {
        if (this.updateIntervalId) {
            clearInterval(this.updateIntervalId);
            this.updateIntervalId = undefined;
            vscode.window.showInformationMessage('SportsDeck: Live updates paused');
        } else {
            this.setupPolling();
            vscode.window.showInformationMessage('SportsDeck: Live updates resumed');
        }
    }

    async getSports(): Promise<Sport[]> {
        return this.sports.filter(sport => 
            this.config.favoriteSports.length === 0 || 
            this.config.favoriteSports.includes(sport.id)
        );
    }

    async getMatchesBySport(sportId: string): Promise<Match[]> {
        return this.matches.filter(match => 
            match.sportId === sportId &&
            (this.config.favoriteLeagues.length === 0 || 
             this.config.favoriteLeagues.includes(match.leagueId))
        );
    }

    async getLiveMatches(): Promise<Match[]> {
        return this.matches.filter(match => match.status === 'live');
    }

    async getUpcomingMatches(): Promise<Match[]> {
        return this.matches.filter(match => match.status === 'upcoming');
    }

    dispose() {
        if (this.updateIntervalId) {
            clearInterval(this.updateIntervalId);
        }
        if (this.wsConnection) {
            this.wsConnection.close();
        }
        this.eventEmitter.dispose();
    }
}