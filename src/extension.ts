import * as vscode from 'vscode';
import { SportsDataProvider } from './provider/SportsDataProvider';
import { SportsFeedManager } from './provider/SportsFeedManager';
import { getPanel } from './webview/panel';
import { getConfig } from './utils/config';

export function activate(context: vscode.ExtensionContext) {
    console.log('SportsDeck extension is now active!');

    const config = getConfig();
    const sportsFeedManager = new SportsFeedManager(context, config);
    const sportsDataProvider = new SportsDataProvider(sportsFeedManager);

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('sportsdeck.showPanel', () => {
            getPanel(context, sportsFeedManager);
        }),
        vscode.commands.registerCommand('sportsdeck.toggleLiveUpdates', () => {
            sportsFeedManager.toggleUpdates();
        }),
        vscode.commands.registerCommand('sportsdeck.refresh', () => {
            sportsFeedManager.refreshData();
        })
    );

    // Status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'sportsdeck.showPanel';
    statusBarItem.tooltip = 'Click to show SportsDeck panel';
    statusBarItem.show();

    // Update status bar with live data
    sportsFeedManager.onUpdate((data) => {
        if (config.displayMode === 'statusbar' || config.displayMode === 'both') {
            const liveMatches = data.matches.filter(match => match.status === 'live');
            if (liveMatches.length > 0) {
                const topMatch = liveMatches[0];
                statusBarItem.text = `$(sports-soccer) ${topMatch.homeTeam.name} ${topMatch.homeScore}-${topMatch.awayScore} ${topMatch.awayTeam.name}`;
            } else {
                statusBarItem.text = '$(sports-soccer) No live matches';
            }
        }
    });

    // Show panel automatically if configured
    if (config.autoOpenPanel) {
        vscode.commands.executeCommand('sportsdeck.showPanel');
    }
}

export function deactivate() {
    console.log('SportsDeck extension is now deactivated!');
}