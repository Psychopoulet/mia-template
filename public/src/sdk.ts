"use strict";

// deps

    // natives
    import { EventEmitter } from "events";

// types & interfaces

    // locals
    // import type { components, operations, paths } from "./descriptor";

// component

export class SDK extends EventEmitter<{
    "connected": [];
    "disconnected": [ number, string ];
    "error": [ Error ];
}> {

    public constructor () {

        super();

        const socket = new WebSocket("ws://" + window.location.host);

        socket.addEventListener("error", (err: Event): void => {
            console.error("socket error", err);
        });

        socket.addEventListener("open", (): void => {
            this.emit("connected");
        });

        socket.addEventListener("close", (data: CloseEvent): void => {
            this.emit("disconnected", data.code, data.reason);
        });

        socket.addEventListener("error", (data: Event): void => {
            this.emit("error", new Error(String(data)));
        });

        socket.addEventListener("message", (message: MessageEvent): void => {

            /*
            const parsedMessage: <types> = JSON.parse(message.data);

            if (<plugin name> === parsedMessage.plugin) {

                switch (parsedMessage.command) {
                    <cases>
                }

            }
            */

        });

    }

}

let _sdk: SDK | null = null;

export default function getSDK (): SDK {

    if (null === _sdk) {
        _sdk = new SDK();
    }

    return _sdk;

}
