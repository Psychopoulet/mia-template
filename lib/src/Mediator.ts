// deps

    // natives
    import { readFile } from "node:fs/promises";
    import { join } from "node:path";

    // externals
    import { Mediator } from "node-pluginsmanager-plugin";

// types & interfaces

    // natives

    // externals
    import type ContainerPattern from "node-containerpattern";
    import type { iEventsMinimal } from "node-pluginsmanager-plugin";

    // locals
    import type { operations } from "./Descriptor";

// module

export default class MediatorTemplate extends Mediator<iEventsMinimal & {
        "initialized": [ ContainerPattern ];
        "released": [ ContainerPattern ];
    }> {

    // constructor

    protected _initWorkSpace (): Promise<void> {

        // <init work space>

        return Promise.resolve();

    }

    protected _releaseWorkSpace (): Promise<void> {

        // <release work space>

        return Promise.resolve();

    }

    // front files

    public getFrontIndex (): Promise<operations["getFrontIndex"]["responses"]["200"]["content"]["text/html"]> {

        return readFile(join(__dirname, "..", "..", "public", "index.html"), "utf-8").then((content: string): string => {

            return content

                .replace(/{{plugin.name}}/g, this.getPluginName())
                .replace(/{{plugin.version}}/g, this.getPluginVersion())
                .replace(/{{plugin.description}}/g, this.getPluginDescription());

        });

    }

    public getFrontApp (): Promise<operations["getFrontApp"]["responses"]["200"]["content"]["application/javascript"]> {
        return readFile(join(__dirname, "..", "..", "public", "dist", "bundle.min.js"), "utf-8");
    }

    public getFrontAppMap (): Promise<operations["getFrontApp"]["responses"]["200"]["content"]["application/javascript"]> {
        return readFile(join(__dirname, "..", "..", "public", "dist", "bundle.min.js.map"), "utf-8");
    }

    // <api>

}
