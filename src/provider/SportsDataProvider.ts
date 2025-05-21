import * as vscode from 'vscode';
import { SportsFeedManager } from './SportsFeedManager';
import { Match, Sport, Team } from './models';

export class SportsDataProvider implements vscode.TreeDataProvider<Match | Sport | Team> {
    private _onDidChangeTreeData = new vscode.EventEmitter<Match | Sport | Team | undefined>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    constructor(private sportsFeedManager: SportsFeedManager) {
        sportsFeedManager.onUpdate(() => this.refresh());
    }

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: Match | Sport | Team): vscode.TreeItem {
        if (element instanceof Match) {
            const item = new vscode.TreeItem(
                `${element.homeTeam.name} vs ${element.awayTeam.name} - ${element.homeScore}-${element.awayScore}`
            );
            item.contextValue = 'match';
            item.iconPath = new vscode.ThemeIcon(element.status === 'live' ? 'pulse' : 'calendar');
            item.tooltip = `${element.league}\n${element.venue}\nStatus: ${element.status}`;
            return item;
        } else if (element instanceof Sport) {
            const item = new vscode.TreeItem(element.name, vscode.TreeItemCollapsibleState.Collapsed);
            item.contextValue = 'sport';
            item.iconPath = new vscode.ThemeIcon(this.getSportIcon(element.name));
            return item;
        } else {
            const item = new vscode.TreeItem(element.name);
            item.contextValue = 'team';
            item.iconPath = vscode.Uri.parse(element.logo || '');
            return item;
        }
    }

    async getChildren(element?: Match | Sport | Team): Promise<(Match | Sport | Team)[]> {
        if (!element) {
            // Root level - show sports
            const sports = await this.sportsFeedManager.getSports();
            return sports;
        } else if (element instanceof Sport) {
            // Sport level - show matches for this sport
            const matches = await this.sportsFeedManager.getMatchesBySport(element.id);
            return matches;
        } else if (element instanceof Match) {
            // Match level - show teams
            return [element.homeTeam, element.awayTeam];
        }
        return [];
    }

    private getSportIcon(sportName: string): string {
        switch (sportName.toLowerCase()) {
            case 'football': return 'sports-soccer';
            case 'cricket': return 'sports-cricket';
            case 'basketball': return 'sports-basketball';
            case 'tennis': return 'sports-tennis';
            default: return 'symbol-event';
        }
    }
}