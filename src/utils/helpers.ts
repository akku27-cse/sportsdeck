export function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export function formatMatchTime(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function getStatusBadge(status: string) {
    switch (status) {
        case 'live': return '<span class="live-badge">LIVE</span>';
        case 'upcoming': return 'Upcoming';
        case 'completed': return 'Completed';
        default: return status;
    }
}