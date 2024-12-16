
export class Logger {
    static logs = [];
    static maxLogs = 1000;

    static log(module, message, type = 'info') {
        const logEntry = {
            timestamp: new Date().toISOString(),
            module,
            type,
            message
        };

        this.logs.unshift(logEntry);
        if (this.logs.length > this.maxLogs) {
            this.logs.pop();
        }

        // Сохраняем в localStorage
        this.saveLogs();
        
        // Вывод в консоль
        switch(type) {
            case 'error':
                console.error(`[${module}]`, message);
                break;
            case 'warn':
                console.warn(`[${module}]`, message);
                break;
            default:
                console.log(`[${module}]`, message);
        }
    }

    static saveLogs() {
        try {
            localStorage.setItem('gameLogs', JSON.stringify(this.logs));
        } catch (e) {
            console.error('Error saving logs:', e);
        }
    }

    static getLogs() {
        return this.logs;
    }

    static clearLogs() {
        this.logs = [];
        localStorage.removeItem('gameLogs');
    }

    static exportLogs() {
        const blob = new Blob([JSON.stringify(this.logs, null, 2)], 
            { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `game-logs-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}
