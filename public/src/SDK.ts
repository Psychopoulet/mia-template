// deps

    // locals
    import CommonSDK from "./CommonSDK";

// component

export class SDK extends CommonSDK {

    // inherit _onMessage

}

let _sdk: SDK | null = null;

export default function getSDK (): SDK {

    _sdk ??= new SDK();

    return _sdk;

}
