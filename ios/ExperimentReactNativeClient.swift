import Foundation

@objc(ExperimentReactNativeClient)
class ExperimentReactNativeClient: NSObject {

    @objc
    static func requiresMainQueueSetup() -> Bool {
        return false
    }

    @objc
    func getApplicationContext(
        _ resolve: RCTPromiseResolveBlock,
        rejecter reject: RCTPromiseRejectBlock
    ) -> Void {
        var map = [String: String]()
        resolve(map)
    }
}
