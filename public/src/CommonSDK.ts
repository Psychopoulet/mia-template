// deps

    // natives
    import { EventEmitter } from "events";

// types & interfaces

    // natives
    type Timeout = ReturnType<typeof setTimeout>;

    // locals
    import type { components, paths, operations } from "./Descriptor";
    type tEvents = components["schemas"]["PushEventPluginInitialized"] | components["schemas"]["PushEventPluginReleased"] | components["schemas"]["PushEventPluginError"];

// component

export default class CommonSDK extends EventEmitter<{
    "connected": [];
    "disconnected": [ number, string ];
    "initialized": [];
    "released": [];
    "error": [ components["schemas"]["PushEventPluginError"]["data"] ];
}> {

    // protected

        protected _socket: WebSocket | null;
        protected _reconnectTimeout: Timeout | null;

    // constructor

    public constructor () {

        super();

        this._socket = null;
        this._reconnectTimeout = null;

    }

    // public methods

    public connect (): void {

        if (WebSocket.OPEN === this._socket?.readyState) {
            return;
        }

        if (this._reconnectTimeout) {
            return;
        }

        this._socket = new WebSocket(
            ("https:" === window.location.protocol ? "wss:" : "ws:")
            + "//" + window.location.host
        );

        this._socket.onopen = (): void => {
            this.emit("connected");
        };

        this._socket.onclose = (event: CloseEvent): void => {

            this.emit("disconnected", event.code, event.reason);

            // normal closure
            if (1000 === event.code) {
                return;
            }

            this._reconnectTimeout = setTimeout((): void => {
                this._reconnectTimeout = null;
                return this.connect();
            }, 1000);

        };

        this._socket.onerror = (evt: Event): void => {

            // avoid catching error on reconnection
            if (evt instanceof ErrorEvent) {

                this.emit("error", {
                    "code": "unknown",
                    "message": evt.message
                });

            }

        };

        this._socket.onmessage = this._onMessage;

    }

    public disconnect (): void {

        if (this._reconnectTimeout) {
            clearTimeout(this._reconnectTimeout);
            this._reconnectTimeout = null;
        }

        if (this._socket
            && (
                WebSocket.CONNECTING === this._socket.readyState
                || WebSocket.OPEN === this._socket.readyState
            )
        ) {
            this._socket.close(1000, "Normal closure");
        }

        this._socket = null;

    }

    // events

    protected readonly _onMessage = (event: MessageEvent<string>): void => {

        const parsedMessage: tEvents = JSON.parse(event.data) as tEvents;

        // must disable the rule because the plugin name can be sended by another plugin
        if ("{{plugin.name}}" === parsedMessage.plugin) { // eslint-disable-line @typescript-eslint/no-unnecessary-condition

            switch (parsedMessage.command) {

                case "initialized":
                    this.emit("initialized");
                break;
                case "released":
                    this.emit("released");
                break;
                case "error":
                    this.emit("error", parsedMessage.data);
                break;

                default:
                    // nothing to do here
                break;

            }

        }

    };

    // api

    public getPluginDescriptor (): Promise<operations["getPluginDescriptor"]["responses"]["200"]["content"]["application/json"]> {

        const url: keyof paths = "/mia-template/api/descriptor";
        const method: "GET" = "GET";

        return fetch(url, {
            "method": method,
            "headers": {
                "Content-Type": "application/json"
            }
        }).then((res: Response): Promise<operations["getPluginDescriptor"]["responses"]["200"]["content"]["application/json"]> => {

            if (res.ok) {
                return res.json();
            }

            return new Promise((resolve: unknown, reject: (error: Error) => void): void => {

                res.json().then((content: operations["getPluginDescriptor"]["responses"]["default"]["content"]["application/json"]): void => {
                    return reject(new Error(content.message));
                }).catch((): void => {
                    return reject(new Error("Problem with request getPluginDescriptor has status '" + res.status + "' (" + res.statusText + ")"));
                });

            });

        });

    }

    public getPluginStatus (): Promise<operations["getPluginStatus"]["responses"]["200"]["content"]["application/json"]> {

        const url: keyof paths = "/mia-template/api/status";
        const method: "GET" = "GET";

        return fetch(url, {
            "method": method,
            "headers": {
                "Content-Type": "application/json"
            }
        }).then((res: Response): Promise<operations["getPluginStatus"]["responses"]["200"]["content"]["application/json"]> => {

            if (res.ok) {
                return res.json();
            }
            else if (404 === res.status) {
                return Promise.resolve("RELEASED");
            }

            return new Promise((resolve: unknown, reject: (error: Error) => void): void => {

                res.json().then((content: operations["getPluginStatus"]["responses"]["default"]["content"]["application/json"]): void => {
                    return reject(new Error(content.message));
                }).catch((): void => {
                    return reject(new Error("Problem with request getPluginStatus has status '" + res.status + "' (" + res.statusText + ")"));
                });

            });

        });

    }

}
