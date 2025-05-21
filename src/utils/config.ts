import * as vscode from 'vscode';

export interface SportsDeckConfig {
    favoriteSports: string[];
    favoriteLeagues: string[];
    favoriteTeams: string[];
    updateInterval: number;
    displayMode: 'statusbar' | 'panel' | 'both';
    notifications: boolean;
    apiKey: string;
    autoOpenPanel: boolean;
}

export function getConfig(): SportsDeckConfig {
    const config = vscode.workspace.getConfiguration('sportsdeck');
    return {
        favoriteSports: config.get<string[]>('favoriteSports', ['football', 'cricket']),
        favoriteLeagues: config.get<string[]>('favoriteLeagues', ['premier-league', 'ipl']),
        favoriteTeams: config.get<string[]>('favoriteTeams', []),
        updateInterval: config.get<number>('updateInterval', 60),
        displayMode: config.get<'statusbar' | 'panel' | 'both'>('displayMode', 'both'),
        notifications: config.get<boolean>('notifications', true),
        apiKey: config.get<string>('apiKey', ''),
        autoOpenPanel: config.get<boolean>('autoOpenPanel', false)
    };
}