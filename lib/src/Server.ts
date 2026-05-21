// deps

    // externals
    import { Server } from "node-pluginsmanager-plugin";

// types & interfaces

    // locals
    import type MediatorTemplate from "./Mediator";

// module

export default class ServerTemplate extends Server {

    public _initWorkSpace (): Promise<void> {

        (this._Mediator as MediatorTemplate)

            .on("initialized", this._onInitialized)
            .on("released", this._onReleased)
            .on("error", this._onError);

        return Promise.resolve();

    }

    public _releaseWorkSpace (): Promise<void> {

        (this._Mediator as MediatorTemplate)

            .removeListener("initialized", this._onInitialized)
            .removeListener("released", this._onReleased)
            .removeListener("error", this._onError);

        return Promise.resolve();

    }

    // <events>

    private readonly _onInitialized = (): void => {

        this.push("initialized");

    };

    private readonly _onReleased = (): void => {

        this.push("released");

    };

    private readonly _onError = (err: Error): void => {

        this.push("error", err);

    };

}
