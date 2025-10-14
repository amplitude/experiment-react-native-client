package com.amplitude.experiment.reactnative

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableNativeMap

class ExperimentReactNativeClientModule(reactContext: ReactApplicationContext) :
    NativeExperimentReactNativeClientSpec(reactContext) {

    private val androidContextProvider = AndroidContextProvider(reactContext.applicationContext, false)

    override fun getName(): String {
        return NAME
    }

    override fun getApplicationContext(promise: Promise) {
        promise.resolve(WritableNativeMap().apply {
            putString("version", androidContextProvider.versionName)
            putString("platform", androidContextProvider.osName)
            putString("language", androidContextProvider.language)
            putString("os", androidContextProvider.osName + " "  + androidContextProvider.osVersion)
            putString("device_brand", androidContextProvider.brand)
            putString("device_manufacturer", androidContextProvider.manufacturer)
            putString("device_model", androidContextProvider.model)
            putString("carrier", androidContextProvider.carrier)
        })
    }

    companion object {
        const val NAME = MODULE_NAME
    }
}
