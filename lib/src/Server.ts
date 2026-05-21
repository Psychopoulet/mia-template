// deps

    // externals
    import { Server } from "node-pluginsmanager-plugin";

// module

export default class ServerTemplate extends Server {

    public _initWorkSpace (): Promise<void> {

        // (this._Mediator as MediatorTemplate).on(<event>, this._on<method>);

        return Promise.resolve();

    }

    public _releaseWorkSpace (): Promise<void> {

        // (this._Mediator as MediatorTemplate).off(<event>, this._on<method>);

        return Promise.resolve();

    }

    // <events>

}
