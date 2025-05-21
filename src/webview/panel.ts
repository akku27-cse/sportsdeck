import * as vscode from 'vscode';
import * as path from 'path';
import { SportsFeedManager } from '../provider/SportsFeedManager';
import { getNonce } from '../utils/helpers';

export function getPanel(context: vscode.ExtensionContext, sportsFeedManager: SportsFeedManager) {
    const panel = vscode.window.createWebviewPanel(
        'sportsdeck',
        'SportsDeck',
        vscode.ViewColumn.Two,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'dist'))]
        }
    );

    const scriptPath = vscode.Uri.file(
        path.join(context.extensionPath, 'dist', 'webview.js')
    );
    const scriptUri = panel.webview.asWebviewUri(scriptPath);

    const nonce = getNonce();
    panel.webview.html = getWebviewContent(panel.webview, scriptUri, nonce);

    // Handle messages from the webview
    panel.webview.onDidReceiveMessage(
        message => {
            switch (message.command) {
                case 'refresh':
                    sportsFeedManager.refreshData();
                    break;
                case 'toggleLive':
                    sportsFeedManager.toggleUpdates();
                    break;
                case 'alert':
                    vscode.window.showErrorMessage(message.text);
                    break;
            }
        },
        undefined,
        context.subscriptions
    );

    // Update webview when data changes
    sportsFeedManager.onUpdate(data => {
        panel.webview.postMessage({
            command: 'update',
            data: {
                matches: data.matches,
                sports: data.sports
            }
        });
    });

    // No need to dispose since onUpdate does not return a disposable
    panel.onDidDispose(() => {
        // Cleanup if necessary
    });

    return panel;
}

function getWebviewContent(webview: vscode.Webview, scriptUri: vscode.Uri, nonce: string): string {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SportsDeck</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                padding: 0;
                margin: 0;
                background-color: var(--vscode-editor-background);
                color: var(--vscode-editor-foreground);
            }
            .container {
                padding: 10px 15px;
            }
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid var(--vscode-editorWidget-border);
            }
            .title {
                font-size: 18px;
                font-weight: 600;
            }
            .controls button {
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                padding: 5px 10px;
                margin-left: 5px;
                border-radius: 3px;
                cursor: pointer;
            }
            .controls button:hover {
                background-color: var(--vscode-button-hoverBackground);
            }
            .match-list {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 15px;
            }
            .match-card {
                background-color: var(--vscode-editorWidget-background);
                border: 1px solid var(--vscode-editorWidget-border);
                border-radius: 5px;
                padding: 10px;
                transition: all 0.2s;
            }
            .match-card:hover {
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            .match-card.live {
                border-left: 3px solid #e74c3c;
            }
            .match-card.upcoming {
                border-left: 3px solid #3498db;
            }
            .match-card.completed {
                border-left: 3px solid #2ecc71;
            }
            .match-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                font-size: 12px;
                color: var(--vscode-descriptionForeground);
            }
            .teams {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            .team {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 40%;
            }
            .team-logo {
                width: 30px;
                height: 30px;
                margin-bottom: 5px;
            }
            .team-name {
                text-align: center;
                font-size: 14px;
                font-weight: 500;
            }
            .score {
                font-size: 18px;
                font-weight: 600;
                width: 20%;
                text-align: center;
            }
            .match-status {
                font-size: 12px;
                color: var(--vscode-descriptionForeground);
                text-align: center;
                margin-top: 5px;
            }
            .live-badge {
                background-color: #e74c3c;
                color: white;
                padding: 2px 5px;
                border-radius: 3px;
                font-size: 10px;
                font-weight: bold;
            }
            .no-matches {
                text-align: center;
                padding: 20px;
                color: var(--vscode-descriptionForeground);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="title">SportsDeck</div>
                <div class="controls">
                    <button id="refresh">Refresh</button>
                    <button id="toggle-live">Pause Updates</button>
                </div>
            </div>
            <div id="content">
                <div class="no-matches">Loading sports data...</div>
            </div>
        </div>
        <script nonce="${nonce}" src="${scriptUri}"></script>
    </body>
    </html>`;
}