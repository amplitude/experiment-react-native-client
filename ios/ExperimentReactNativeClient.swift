import Foundation
import AmplitudeExperiment
import Amplitude

@objc(ExperimentReactNativeClient)
class ExperimentReactNativeClient: NSObject {

    var experimentClient: ExperimentClient?

    @objc static func requiresMainQueueSetup() -> Bool {
        return false
    }

    @objc
    func initialize(
        _ apiKey: String,
        config: [String:Any]?,
        resolver resolve: RCTPromiseResolveBlock,
        rejecter reject: RCTPromiseRejectBlock
    ) -> Void {
        let builder = ExperimentConfig.Builder()
        if let val = config?["debug"] as! Bool? {
            let _ = builder.debug(val)
        }
        if let val = config?["fallbackVariant"] as! [String: Any]? {
            let _ = builder.fallbackVariant(Variant.init(val["value"] as! String?, payload: val["payload"]))
        }
        if let val = config?["initialVariants"] as! [String: [String: Any]]? {
            let initialVariants = val.mapValues { value in
                return Variant.init(value["value"] as! String?, payload: value["payload"])
            }
            let _ = builder.initialVariants(initialVariants)
        }
        if let val = config?["serverUrl"] as! String? {
            let _ = builder.serverUrl(val)
        }
        if let val = config?["source"] as! String? {
            var source: Source? = nil
            if (val == "LOCAL_STORAGE") {
                source = Source.LocalStorage
            } else if (val == "INITIAL_VARIANTS") {
                source = Source.InitialVariants
            }

            if let source = source {
                let _ = builder.source(source)
            }
        }
        if let val = config?["fetchTimeoutMillis"] as! Int? {
            let _ = builder.fetchTimeoutMillis(val)
        }
        if let val = config?["retryFetchOnFailure"] as! Bool? {
            let _ = builder.fetchRetryOnFailure(val)
        }
        if let val = config?["amplitudeUserProviderInstanceName"] as! String? {
            let amplitudeInstance = Amplitude.instance(withName: val)
            let userProvider = AmplitudeUserProvider(amplitudeInstance)
            let _ = builder.userProvider(userProvider)
        }
        if let val = config?["amplitudeAnalyticsProviderInstanceName"] as! String? {
            let amplitudeInstance = Amplitude.instance(withName: val)
            let analyticsProvider = AmplitudeAnalyticsProvider(amplitudeInstance)
            let _ = builder.analyticsProvider(analyticsProvider)
        }
        experimentClient = Experiment.initialize(apiKey: apiKey, config: builder.build())
        resolve(true)
    }

    @objc
    func fetch(
        _ user: [String: Any],
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) -> Void {
        let u: ExperimentUser = convertUser(user)
        experimentClient?.fetch(user: u, completion:{ _, error in
            if (error != nil) {
                reject("Error in fetch", error.debugDescription, error)
            } else {
                resolve(true)
            }
        })
    }

    @objc
    func setUser(
        _ user: [String: Any],
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) -> Void {
        let u: ExperimentUser = convertUser(user)
        experimentClient?.setUser(u)
        resolve(true)
    }

    func convertUser(_ user: [String: Any]) -> ExperimentUser {
        let builder = ExperimentUser.Builder()
        if let val = user["device_id"] as! String? {
            let _ = builder.deviceId(val)
        }
        if let val = user["user_id"] as! String? {
            let _ = builder.userId(val)
        }
        if let val = user["version"] as! String? {
            let _ = builder.version(val)
        }
        if let val = user["country"] as! String? {
            let _ = builder.country(val)
        }
        if let val = user["region"] as! String? {
            let _ = builder.region(val)
        }
        if let val = user["dma"] as! String? {
            let _ = builder.dma(val)
        }
        if let val = user["city"] as! String? {
            let _ = builder.city(val)
        }
        if let val = user["language"] as! String? {
            let _ = builder.language(val)
        }
        if let val = user["platform"] as! String? {
            let _ = builder.platform(val)
        }
        if let val = user["os"] as! String? {
            let _ = builder.os(val)
        }
        if let val = user["device_manufacturer"] as! String? {
            let _ = builder.deviceManufacturer(val)
        }
        if let val = user["device_model"] as! String? {
            let _ = builder.deviceModel(val)
        }
        if let val = user["carrier"] as! String? {
            let _ = builder.carrier(val)
        }
        if let val = user["library"] as! String? {
            let _ = builder.library(val)
        }
        if let val = user["user_properties"] as! [String: String]? {
            let _ = builder.userProperties(val)
        }
        return builder.build()
    }

    @objc
    func variant(
        _ key: String,
        resolver resolve: RCTPromiseResolveBlock,
        rejecter reject: RCTPromiseRejectBlock
    ) -> Void {
        let variant = experimentClient?.variant(key, fallback: nil)
        var variantMap = [String: Any]()
        variantMap["value"] = variant?.value
        variantMap["payload"] = variant?.payload
        resolve(variantMap)
    }

    @objc
    func variantWithFallback(
        _ key: String,
        fallback: [String: Any],
        resolver resolve: RCTPromiseResolveBlock,
        rejecter reject: RCTPromiseRejectBlock
    ) -> Void {
        let fallbackVariant = Variant.init(fallback["value"] as! String, payload: fallback["payload"])
        let variant = experimentClient?.variant(key, fallback: fallbackVariant)
        var variantMap = [String: Any]()
        variantMap["value"] = variant?.value
        variantMap["payload"] = variant?.payload
        resolve(variantMap)
    }

    @objc
    func all(
        _ resolve: RCTPromiseResolveBlock,
        rejecter reject: RCTPromiseRejectBlock
    ) -> Void {
        let variants = experimentClient?.all()
        if let variantsList = variants {
            var map = [String: Any]()
            for (key,value) in variantsList {
                var variantMap = [String: Any]()
                variantMap["value"] = value.value
                variantMap["payload"] = value.payload
                map[key] = variantMap
            }
            resolve(map)
        } else {
            resolve(nil)
        }
    }

    @objc
    func setAmplitudeUserProvider(
        _ amplitudeInstanceName: String?,
        resolver resolve: RCTPromiseResolveBlock,
        rejecter reject: RCTPromiseRejectBlock
    ) -> Void {
        let amplitudeInstance = Amplitude.instance(withName: amplitudeInstanceName)
        let userProvider = AmplitudeUserProvider(amplitudeInstance)
        let _ = experimentClient?.setUserProvider(userProvider)
        resolve(true)
    }
}

public class AmplitudeAnalyticsProvider : ExperimentAnalyticsProvider {
    let amplitude: Amplitude
    init(_ amplitude: Amplitude) {
        self.amplitude = amplitude
    }

    public func track(_ event: ExperimentAnalyticsEvent) {
        self.amplitude.logEvent(event.name, withEventProperties: event.properties as [AnyHashable : Any])
    }

    public func setUserProperty(_ event: ExperimentAnalyticsEvent) {
        let identify = AMPIdentify()
        identify.set(event.userProperty, value: event.variant.value as NSObject?)
        self.amplitude.identify(identify)
    }

    public func unsetUserProperty(_ event: ExperimentAnalyticsEvent) {
        self.amplitude.identify(AMPIdentify().unset(event.userProperty))
    }
}

public class AmplitudeUserProvider : ExperimentUserProvider {
    let baseProvider = DefaultUserProvider()
    let amplitude: Amplitude
    var initialized: Bool = false
    init(_ amplitude: Amplitude) {
        self.amplitude = amplitude
    }
    public func getUser() -> ExperimentUser {
        waitForAmplitudeInitialized()
        let user = baseProvider.getUser()
            .copyToBuilder()
            .userId(self.amplitude.userId)
            .deviceId(self.amplitude.getDeviceId())
            .build()
        return user
    }
    func waitForAmplitudeInitialized() -> Void {
        if (initialized) {
            return
        }
        while (self.amplitude.getDeviceId() as String? == nil) {
            Thread.sleep(forTimeInterval: 0.02)
        }
        initialized = true
    }
}
